/* Admin and teacher data-entry forms. Loaded after app.js.
   Every save goes to Supabase; Row Level Security enforces who may write. */

(function () {

  const style = document.createElement("style");
  style.textContent = `
    .entry-form{display:grid;gap:8px;padding:12px 0;border-top:1px solid #ddd;margin-top:12px}
    .entry-form h3{margin:0 0 4px}
    .entry-form input,.entry-form select{padding:10px;font-size:16px;border:1px solid #ccc;border-radius:6px;width:100%;box-sizing:border-box}
    .entry-form button{padding:11px;font-size:16px;border:0;border-radius:6px;background:#1f5fbf;color:#fff;cursor:pointer}
    .entry-form button:disabled{opacity:.6}
  `;
  document.head.appendChild(style);

  const esc = escapeHTML;

  const opts = (rows, value, label, placeholder) =>
    `<option value="">${placeholder}</option>` +
    rows.map(r => `<option value="${esc(String(r[value]))}">${esc(String(r[label]))}</option>`).join("");

  const isAdmin = () => currentUser && currentUser.role === "admin";
  const isStaff = () => currentUser && (currentUser.role === "admin" || currentUser.role === "teacher");

  async function lookups() {
    const [c, s] = await Promise.all([
      sb.from("classes").select("id, name").order("name"),
      sb.from("subjects").select("id, name").order("name")
    ]);
    return { classRows: c.data || [], subjectRows: s.data || [] };
  }

  async function submitForm(form, work) {
    const btn = form.querySelector("button");
    btn.disabled = true;
    try {
      await work(Object.fromEntries(new FormData(form)));
      await loadSchoolData(currentUser.role);
      showPage(document.querySelector("[data-page].active").dataset.page);
      alert("Saved.");
    } catch (err) {
      alert("Could not save: " + (err.message || err));
      btn.disabled = false;
    }
  }

  function attach(id, work) {
    const form = document.getElementById(id);
    if (form) form.addEventListener("submit", e => { e.preventDefault(); submitForm(form, work); });
  }

  const check = ({ error }) => { if (error) throw error; };
  const studentOptions = () => students.map(s => ({ id: s.id, name: `${s.admission} - ${s.name}` }));


  async function createAccount(body) {
    const { data, error } = await sb.functions.invoke("create-user", { body });
    if (error) {
      let msg = error.message;
      try { const r = await error.context.json(); if (r && r.error) msg = r.error; } catch (e) {}
      throw new Error(msg);
    }
    if (data && data.error) throw new Error(data.error);
  }

  const toBody = (d, role) => ({
    email: d.email.trim(), password: d.password, full_name: d.name.trim(),
    role: role || d.role, student_id: d.student_id || undefined
  });

  /* ---------- wrap each page renderer ---------- */

  function wrap(name, build) {
    const original = window[name];
    window[name] = async function () {
      original.apply(this, arguments);
      if (!currentUser) return;
      const html = await build();
      if (html) contentPage.insertAdjacentHTML("beforeend", `<div class="panel">${html}</div>`);
    };
  }

  wrap("renderStudentsPage", async () => {
    if (!isAdmin()) return "";
    const { classRows } = await lookups();
    setTimeout(() => {
      attach("addStudentForm", async d => check(await sb.from("students").insert({
        admission_no: d.admission.trim(), full_name: d.name.trim(), class_id: d.class_id || null
      })));
      attach("studentLoginForm", async d => createAccount(toBody(d)));
    });
    return `
      <form id="addStudentForm" class="entry-form">
        <h3>Register student</h3>
        <input name="admission" placeholder="Admission number" required>
        <input name="name" placeholder="Full name" required>
        <select name="class_id" required>${opts(classRows, "id", "name", "Select class")}</select>
        <button type="submit">Add student</button>
      </form>
      <form id="studentLoginForm" class="entry-form">
        <h3>Create login for a student or parent</h3>
        <select name="role" required>
          <option value="">Account type</option>
          <option value="student">Student</option>
          <option value="parent">Parent (linked to a child)</option>
        </select>
        <select name="student_id" required>${opts(studentOptions(), "id", "name", "Student (or the parent's child)")}</select>
        <input name="name" placeholder="Full name of account holder" required>
        <input name="email" type="email" placeholder="Email address" required>
        <input name="password" type="password" minlength="8" placeholder="Temporary password (8+ characters)" required>
        <button type="submit">Create login</button>
      </form>`;
  });

  wrap("renderTeachersPage", async () => {
    if (!isAdmin()) return "";
    const { classRows, subjectRows } = await lookups();
    setTimeout(() => {
      attach("teacherLoginForm", async d => createAccount(toBody(d)));
      attach("assignTeacherForm", async d => check(await sb.from("teacher_assignments").insert({
        teacher_id: d.teacher_id, class_id: d.class_id, subject_id: d.subject_id
      })));
    });
    return `
      <form id="teacherLoginForm" class="entry-form">
        <h3>Create teacher account</h3>
        <input name="name" placeholder="Full name" required>
        <input name="email" type="email" placeholder="Email address" required>
        <input name="password" type="password" minlength="8" placeholder="Temporary password (8+ characters)" required>
        <select name="role" required>
          <option value="teacher">Teacher</option>
          <option value="class_teacher">Class teacher</option>
        </select>
        <button type="submit">Create teacher</button>
      </form>
      <form id="assignTeacherForm" class="entry-form">
        <h3>Assign teacher to a class and subject</h3>
        <select name="teacher_id" required>${opts(teachers, "id", "name", "Select teacher")}</select>
        <select name="class_id" required>${opts(classRows, "id", "name", "Select class")}</select>
        <select name="subject_id" required>${opts(subjectRows, "id", "name", "Select subject")}</select>
        <button type="submit">Assign</button>
      </form>`;
  });

  wrap("renderFeesPage", async () => {
    if (!isAdmin()) return "";
    setTimeout(() => {
      attach("feeInvoiceForm", async d => check(await sb.from("fee_invoices").insert({
        student_id: d.student_id, term: d.term.trim(), amount_due: Number(d.amount)
      })));
      attach("feePaymentForm", async d => check(await sb.from("fee_payments").insert({
        student_id: d.student_id, amount: Number(d.amount), method: d.method.trim() || null,
        reference: d.reference.trim() || null, recorded_by: currentUser.id
      })));
    });
    const list = studentOptions();
    return `
      <form id="feeInvoiceForm" class="entry-form">
        <h3>Set fees due</h3>
        <select name="student_id" required>${opts(list, "id", "name", "Select student")}</select>
        <input name="term" placeholder="Term (e.g. Term 1)" required>
        <input name="amount" type="number" min="0" step="0.01" placeholder="Amount due (KES)" required>
        <button type="submit">Save fees due</button>
      </form>
      <form id="feePaymentForm" class="entry-form">
        <h3>Record payment</h3>
        <select name="student_id" required>${opts(list, "id", "name", "Select student")}</select>
        <input name="amount" type="number" min="1" step="0.01" placeholder="Amount paid (KES)" required>
        <input name="method" placeholder="Method (M-Pesa, bank, cash)">
        <input name="reference" placeholder="Reference code (optional)">
        <button type="submit">Record payment</button>
      </form>`;
  });

  wrap("renderResultsPage", async () => {
    if (!isStaff()) return "";
    const { subjectRows } = await lookups();
    setTimeout(() => {
      attach("resultForm", async d => check(await sb.from("results").upsert({
        student_id: d.student_id, subject_id: d.subject_id, term: d.term.trim(),
        score: Number(d.score), recorded_by: currentUser.id
      }, { onConflict: "student_id,subject_id,term,academic_year,assessment_type" })));
    });
    return `
      <form id="resultForm" class="entry-form">
        <h3>Enter result</h3>
        <select name="student_id" required>${opts(studentOptions(), "id", "name", "Select student")}</select>
        <select name="subject_id" required>${opts(subjectRows, "id", "name", "Select subject")}</select>
        <input name="term" placeholder="Term (e.g. Term 1)" required>
        <input name="score" type="number" min="0" max="100" step="0.01" placeholder="Score (0-100)" required>
        <button type="submit">Save result</button>
      </form>`;
  });

  wrap("renderAnnouncementsPage", async () => {
    if (!isAdmin()) return "";
    setTimeout(() => {
      attach("announcementForm", async d => check(await sb.from("announcements").insert({
        title: d.title.trim(), body: d.body.trim(), created_by: currentUser.id
      })));
    });
    return `
      <form id="announcementForm" class="entry-form">
        <h3>Post announcement</h3>
        <input name="title" placeholder="Title" required>
        <input name="body" placeholder="Message" required>
        <button type="submit">Post</button>
      </form>`;
  });

})();
