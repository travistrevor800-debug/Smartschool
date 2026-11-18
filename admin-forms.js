/* Admin and teacher data-entry forms. Loaded after app.js.
   Every save goes to Supabase; Row Level Security enforces who may write. */

(function () {

  const style = document.createElement("style");
  style.textContent = `
    .entry-form{display:grid;gap:8px;padding:12px 0;border-top:1px solid #ddd;margin-top:12px}
    .entry-form h3{margin:0 0 4px}
    .entry-form input,.entry-form select{padding:10px;font-size:16px;border:1px solid #ccc;border-radius:6px;width:100%;box-sizing:border-box}
    .entry-form button{padding:11px;font-size:16px;border:0;border-radius:6px;background:#1f5fbf;color:#fff;cursor:pointer}
    .entry-form button:disabled{opacity:.6}\n    .class-admin-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #ddd}\n    .class-admin-row small{display:block;color:#667085;margin-top:3px}\n    .class-admin-row .danger-button{background:#b42318;padding:8px 12px}
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
      const result = await work(Object.fromEntries(new FormData(form)));
      await loadSchoolData(currentUser.role);
      showPage(document.querySelector("[data-page].active").dataset.page);
      if (result && result.studentAdmission) {
        alert("Student login created.\nLogin ID: " + result.studentAdmission +
          "\nInitial password: the same admission number.\nThe student must change it at first login.");
      } else {
        alert("Saved.");
      }
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
    return data;
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
        admission_no: d.admission.trim(),
        full_name: d.name.trim(),
        class_id: d.class_id || null
      })));

      attach("studentLoginForm", async d => {
        const student = students.find(s => s.id === d.student_id);
        if (!student) throw new Error("Select a valid student record first.");
        const result = await createAccount({ role: "student", student_id: d.student_id });
        return { ...result, studentAdmission: student.admission };
      });

      attach("parentLoginForm", async d => createAccount(toBody(d, "parent")));
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
        <h3>Create student login</h3>
        <p>The student's admission number will be the login ID and temporary password. The student must create a new password at first login.</p>
        <select name="student_id" required>${opts(studentOptions(), "id", "name", "Select student")}</select>
        <button type="submit">Create student login</button>
      </form>

      <form id="parentLoginForm" class="entry-form">
        <h3>Create parent login</h3>
        <select name="student_id" required>${opts(studentOptions(), "id", "name", "Select linked child")}</select>
        <input name="name" placeholder="Parent or guardian full name" required>
        <input name="email" type="email" placeholder="Parent email address" required>
        <input name="password" type="password" minlength="8" placeholder="Temporary password (8+ characters)" required>
        <button type="submit">Create parent login</button>
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

  wrap("renderClassesPage", async () => {
    if (!isAdmin()) return "";

    setTimeout(() => {
      attach("addClassForm", async d => {
        const grade = Number(d.grade);
        const name = d.name.trim();
        const stream = d.stream.trim();
        if (![10, 11, 12].includes(grade)) throw new Error("Choose a valid grade.");
        if (!name || !stream) throw new Error("Class name and stream are required.");

        const duplicate = await sb.from("classes")
          .select("id").eq("grade", grade).ilike("name", name).maybeSingle();
        if (duplicate.error) throw duplicate.error;
        if (duplicate.data) throw new Error("A class with this name already exists in that grade.");

        check(await sb.from("classes").insert({ name, grade, stream }));
      });

      document.querySelectorAll("[data-delete-class]").forEach(button => {
        button.addEventListener("click", async () => {
          if (!isAdmin()) {
            alert("Only an administrator can delete classes.");
            return;
          }
          const classId = button.dataset.deleteClass;
          const record = classRecords.find(c => c.id === classId);
          if (!record) return alert("Class record not found. Refresh and try again.");
          if (!confirm(`Delete ${record.name}? This is allowed only when no students, lessons, assignments, exams, learning materials or teacher allocations depend on it.`)) return;

          button.disabled = true;
          try {
            const dependencies = [
              ["students", "Students"],
              ["student_attendance", "Attendance history"],
              ["teacher_assignments", "Teacher assignments"],
              ["revision_materials", "Revision materials"],
              ["assignments", "Assignments"],
              ["lessons", "Lessons"],
              ["assessments", "Assessments"]
            ];
            const used = [];
            for (const [table, label] of dependencies) {
              const { count, error } = await sb.from(table)
                .select("*", { count: "exact", head: true })
                .eq("class_id", classId);
              if (error) throw error;
              if (count > 0) used.push(`${label}: ${count}`);
            }
            if (used.length) {
              throw new Error("This class still has linked records and cannot be deleted safely: " + used.join(", ") + ". Move or remove those records first.");
            }

            const { error: deleteError } = await sb.from("classes").delete().eq("id", classId);
            if (deleteError) throw deleteError;
            await loadSchoolData(currentUser.role);
            showPage("classes");
            alert("Class deleted.");
          } catch (err) {
            alert("Could not delete class: " + (err.message || err));
            button.disabled = false;
          }
        });
      });
    });

    return `
      <form id="addClassForm" class="entry-form">
        <h3>Add a class or stream</h3>
        <label for="newClassGrade">Grade / Form</label>
        <select id="newClassGrade" name="grade" required>
          <option value="">Select grade</option>
          <option value="10">Grade 10 / Form 2</option>
          <option value="11">Grade 11 / Form 3</option>
          <option value="12">Grade 12 / Form 4</option>
        </select>
        <label for="newClassName">Class name</label>
        <input id="newClassName" name="name" placeholder="e.g. Form 4 South" required>
        <label for="newClassStream">Stream</label>
        <input id="newClassStream" name="stream" placeholder="e.g. South" required>
        <button type="submit">Add class</button>
      </form>

      <div class="entry-form">
        <h3>Manage classes</h3>
        <p>Only administrators can delete classes. Deletion is blocked while linked school records exist.</p>
        ${classRecords.map(c => `
          <div class="class-admin-row">
            <div><strong>${esc(c.name)}</strong><small>Grade ${esc(c.grade)} · ${esc(c.stream || "No stream")}</small></div>
            <button type="button" class="danger-button" data-delete-class="${esc(c.id)}">Delete</button>
          </div>
        `).join("")}
      </div>`;
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

  wrap("renderLessonsPage", async () => {
    if(!isStaff()) return "";
    const {classRows,subjectRows}=await lookups();
    setTimeout(()=>{
      attach("lessonForm",async d=>check(await sb.from("lessons").insert({class_id:d.class_id,subject_id:d.subject_id,teacher_id:currentUser.id,title:d.title.trim(),video_url:d.video_url.trim()||null,scheduled_at:d.scheduled_at?new Date(d.scheduled_at).toISOString():null})));
      attach("revisionMaterialForm",async d=>check(await sb.from("revision_materials").insert({class_id:d.class_id,subject_id:d.subject_id,title:d.title.trim(),file_url:d.file_url.trim()||null,content:d.content.trim()||null,created_by:currentUser.id})));
    });
    return `<form id="lessonForm" class="entry-form"><h3>Publish a lesson</h3><input name="title" placeholder="Lesson title / topic" required><select name="class_id" required>${opts(classRows,"id","name","Select class")}</select><select name="subject_id" required>${opts(subjectRows,"id","name","Select subject")}</select><input name="scheduled_at" type="datetime-local"><input name="video_url" type="url" placeholder="Lesson video URL (optional)"><button type="submit">Publish lesson</button></form>
    <form id="revisionMaterialForm" class="entry-form"><h3>Add revision material</h3><input name="title" placeholder="Resource title" required><select name="class_id" required>${opts(classRows,"id","name","Select class")}</select><select name="subject_id" required>${opts(subjectRows,"id","name","Select subject")}</select><input name="file_url" type="url" placeholder="PDF / document link (optional)"><textarea name="content" rows="3" placeholder="Notes or description"></textarea><button type="submit">Save learning material</button></form>`;
  });
  wrap("renderContestsPage", async () => {
    if(!isStaff()) return "";
    const {classRows,subjectRows}=await lookups();
    setTimeout(()=>attach("contestForm",async d=>check(await sb.from("assessments").insert({class_id:d.class_id,subject_id:d.subject_id,kind:"contest",title:d.title.trim(),starts_at:new Date(d.starts_at).toISOString(),duration_minutes:Number(d.duration_minutes),is_published:d.is_published==="true",created_by:currentUser.id}))));
    return `<form id="contestForm" class="entry-form"><h3>Create an academic competition</h3><input name="title" placeholder="Competition / challenge title" required><select name="class_id" required>${opts(classRows,"id","name","Select class")}</select><select name="subject_id" required>${opts(subjectRows,"id","name","Select subject")}</select><input name="starts_at" type="datetime-local" required><input name="duration_minutes" type="number" min="1" max="600" value="30" required><select name="is_published"><option value="false">Save as draft</option><option value="true">Publish to students</option></select><button type="submit">Save competition</button></form>`;
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
