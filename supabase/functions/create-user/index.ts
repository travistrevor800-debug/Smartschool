import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

const ROLES = ["teacher", "class_teacher", "parent", "student"];
function studentEmail(admissionNo: string) {
  const normalized = admissionNo.trim().toLowerCase();
  const bytes = new TextEncoder().encode(normalized);
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  return `student.${hex}@login.smartschool.invalid`;
}
function parentEmail(admissionNo: string) {
  const normalized = admissionNo.trim().toLowerCase();
  const bytes = new TextEncoder().encode(normalized);
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  return `parent.${hex}@login.smartschool.invalid`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Not signed in" }, 401);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  try {
    const { data: authData, error: authError } = await admin.auth.getUser(token);
    const caller = authData?.user;
    if (authError || !caller) return json({ error: "Not signed in" }, 401);

    const { data: me, error: meError } = await admin
      .from("profiles").select("role").eq("id", caller.id).single();
    if (meError || me?.role !== "admin") return json({ error: "Admins only" }, 403);

    const body = await req.json();
    const role = String(body.role || "");
    const fullNameInput = String(body.full_name || "").trim();
    const studentId = body.student_id ? String(body.student_id) : null;
    if (!ROLES.includes(role)) return json({ error: "Invalid account role" }, 400);
    if (role !== "student" && !fullNameInput) return json({ error: "Full name is required" }, 400);
    if ((role === "student" || role === "parent") && !studentId)
      return json({ error: "Choose the student to link", }, 400);

    let email = String(body.email || "").trim().toLowerCase();
    let password = String(body.password || "");
    let fullName = fullNameInput;
    let linkedStudent: { id: string; admission_no: string; full_name: string; profile_id: string | null } | null = null;

    if (role === "student" || role === "parent") {
      const { data: student, error: studentError } = await admin
        .from("students")
        .select("id, admission_no, full_name, profile_id")
        .eq("id", studentId)
        .single();
      if (studentError || !student) return json({ error: "Student record not found" }, 404);
      if (student.profile_id) return json({ error: "This student already has a login account" }, 409);

      const admissionNo = String(student.admission_no || "").trim();
      if (admissionNo.length < 6)
        return json({ error: "Admission number must be at least 6 characters to be used as the initial password." }, 400);

      linkedStudent = student;
      if (role === "student") {
        email = studentEmail(admissionNo);
        password = admissionNo;
        fullName = student.full_name;
      } else {
        email = parentEmail(admissionNo);
        password = admissionNo;
        if (!fullName) return json({ error: "Parent or guardian full name is required" }, 400);
      }
    } else {
      if (!email || !password) return json({ error: "Email and password are required for staff accounts" }, 400);
      if (password.length < 8) return json({ error: "Password must be at least 8 characters" }, 400);
    }

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: (role === "student" || role === "parent")
        ? { must_change_password: true, account_type: role }
        : { account_type: role },
      user_metadata: { full_name: fullName },
    });
    if (createError || !created.user)
      return json({ error: createError?.message || "Could not create account" }, 400);

    const uid = created.user.id;
    // The auth.users trigger creates a default profile. Upsert it to assign the requested role.
    const { error: profileError } = await admin.from("profiles").upsert({
      id: uid, role, full_name: fullName, email,
    }, { onConflict: "id" });
    if (profileError) {
      await admin.auth.admin.deleteUser(uid);
      return json({ error: "Could not create the account profile: " + profileError.message }, 500);
    }

    if (role === "student" && linkedStudent) {
      const { data: linked, error: linkError } = await admin
        .from("students").update({ profile_id: uid })
        .eq("id", linkedStudent.id).is("profile_id", null)
        .select("id").maybeSingle();
      if (linkError || !linked) {
        await admin.from("profiles").delete().eq("id", uid);
        await admin.auth.admin.deleteUser(uid);
        return json({ error: "Could not link the student record. Refresh and try again." }, 409);
      }
    }

    if (role === "parent" && studentId) {
      const { error: parentLinkError } = await admin.from("parent_students").insert({
        parent_id: uid, student_id: studentId,
      });
      if (parentLinkError) {
        await admin.from("profiles").delete().eq("id", uid);
        await admin.auth.admin.deleteUser(uid);
        return json({ error: "Could not link parent to student: " + parentLinkError.message }, 500);
      }
    }

    return json({
      ok: true,
      id: uid,
      role,
      login: (role === "student" || role === "parent") ? "Use the child's admission number" : email,
      initial_password: (role === "student" || role === "parent") ? "The child's admission number" : undefined,
      must_change_password: role === "student" || role === "parent",
    });
  } catch (error) {
    return json({ error: String(error) }, 500);
  }
});
