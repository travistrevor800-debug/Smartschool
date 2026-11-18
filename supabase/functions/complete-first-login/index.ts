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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Not signed in" }, 401);

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
    const { data: authData, error: authError } = await admin.auth.getUser(token);
    const user = authData?.user;
    if (authError || !user) return json({ error: "Not signed in" }, 401);
    if (user.app_metadata?.must_change_password !== true || !["student", "parent"].includes(String(user.app_metadata?.account_type || "")))
      return json({ error: "This account is not awaiting its first password change" }, 403);

    const { password } = await req.json();
    if (typeof password !== "string" || password.length < 10)
      return json({ error: "New password must contain at least 10 characters" }, 400);

    const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
      password,
      app_metadata: { ...user.app_metadata, must_change_password: false },
    });
    if (updateError) return json({ error: updateError.message }, 400);

    return json({ ok: true, must_change_password: false });
  } catch (error) {
    return json({ error: String(error) }, 500);
  }
});
