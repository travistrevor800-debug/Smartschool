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
    .student-search-label{display:block;font-weight:700;margin-bottom:7px}
    .student-list-search{width:100%;max-width:560px;padding:12px 14px;border:1px solid var(--line);border-radius:9px;font-size:16px;margin:0 0 14px;box-sizing:border-box}
    .student-open-docs{padding:8px 12px;border:0;border-radius:7px;background:var(--navy);color:#fff;font-weight:600;cursor:pointer}
    .student-document-viewer{margin-top:18px;scroll-margin-top:18px}
    .student-document-viewer-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}
    .student-document-categories{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin:16px 0}
    .student-document-category{border:1px solid var(--line);border-radius:10px;padding:14px;min-width:0}
    .student-document-category>div:first-child small,.student-document-file small{display:block;color:var(--muted);margin-top:4px;overflow-wrap:anywhere}
    .student-document-file{border-top:1px solid var(--line);padding-top:10px;margin-top:10px;display:grid;gap:8px}
    .student-document-file>div{display:flex;gap:8px;flex-wrap:wrap}
    .student-document-file button,.student-document-viewer-head button{padding:8px 11px;border:0;border-radius:7px;background:var(--navy);color:#fff;cursor:pointer}
    .student-document-preview{border:1px solid var(--line);border-radius:10px;padding:10px;min-height:100px;overflow:hidden}
    .student-document-frame{width:100%;height:75vh;min-height:480px;border:0}
    .student-document-image{display:block;max-width:100%;max-height:75vh;margin:0 auto;object-fit:contain}
    .student-document-viewer[hidden]{display:none}
    .parent-child-document-row{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:14px 0;border-bottom:1px solid var(--line)}
    .parent-child-document-row small{display:block;color:var(--muted);margin-top:4px}
    .parent-child-document-row button{padding:10px 14px;border:0;border-radius:8px;background:var(--navy);color:#fff;font-weight:600;cursor:pointer}

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
      if (result && (result.studentAdmission || result.parentAdmission)) {
        alert((result.parentAdmission ? "Parent login created." : "Student login created.") + "\nLogin ID: " + (result.parentAdmission || result.studentAdmission) +
          "\nInitial password: the same admission number.\nThe user must change it at first login.");
      } else {
        alert(result && result.message ? result.message : "Saved.");
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
    if (!isStaff()) return "";
    const { classRows } = await lookups();
    const studentList = studentOptions();
    setTimeout(() => {
      if (isAdmin()) {
        attach("addStudentForm", async d => check(await sb.from("students").insert({
          admission_no: d.admission.trim(), full_name: d.name.trim(), class_id: d.class_id || null
        })));
        attach("studentLoginForm", async d => {
          const student = students.find(s => s.id === d.student_id);
          if (!student) throw new Error("Select a valid student record first.");
          const result = await createAccount({ role: "student", student_id: d.student_id });
          return { ...result, studentAdmission: student.admission };
        });
        attach("parentLoginForm", async d => {
          const child = students.find(s => s.id === d.student_id);
          if (!child) throw new Error("Select the child first.");
          const result = await createAccount({ role: "parent", student_id: d.student_id, full_name: d.name.trim() });
          return { ...result, parentAdmission: child.admission };
        });
      }

      const docForm=document.getElementById("studentDocumentForm");
      if(docForm) docForm.addEventListener("submit", async event => {
        event.preventDefault();
        const button=docForm.querySelector("button[type='submit']");
        const data=new FormData(docForm), studentId=String(data.get("student_id")||"");
        const type=String(data.get("document_type")||""), file=data.get("document_file");
        if(!file || !file.size) return alert("Choose a document file first.");
        if(file.size>10*1024*1024) return alert("The file must be 10 MB or smaller.");
        if(!["image/jpeg","image/png","image/webp","application/pdf"].includes(file.type)) return alert("Use a JPG, PNG, WEBP or PDF file.");
        button.disabled=true;
        const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"_").slice(-100);
        const path=studentId+"/"+type+"/"+crypto.randomUUID()+"-"+safeName;
        try {
          const uploaded=await sb.storage.from("student-documents").upload(path,file,{contentType:file.type,upsert:false});
          if(uploaded.error) throw uploaded.error;
          const saved=await sb.from("student_documents").insert({
            student_id:studentId,document_type:type,object_path:path,file_name:file.name,
            mime_type:file.type,file_size:file.size,uploaded_by:currentUser.id
          });
          if(saved.error){await sb.storage.from("student-documents").remove([path]);throw saved.error;}
          await loadSchoolData(currentUser.role);
          showPage("students");
          alert("Student document uploaded successfully.");
        } catch(err){alert("Could not upload document: "+(err.message||err));button.disabled=false;}
      });

      document.querySelectorAll("[data-download-student-doc]").forEach(button=>button.addEventListener("click",async()=>{
        button.disabled=true;
        try {
          const doc=studentDocuments.find(x=>x.id===button.dataset.downloadStudentDoc);
          if(!doc) throw new Error("Document record not found. Refresh and try again.");
          const signed=await sb.storage.from("student-documents").createSignedUrl(doc.object_path,60,{download:doc.file_name});
          if(signed.error) throw signed.error;
          const link=document.createElement("a");link.href=signed.data.signedUrl;link.download=doc.file_name;link.rel="noopener";document.body.appendChild(link);link.click();link.remove();
        } catch(err){alert("Could not download document: "+(err.message||err));}
        finally{button.disabled=false;}
      }));

      const filter=document.getElementById("studentDocumentStudent");
      const list=document.getElementById("studentDocumentList");
      const drawDocs=()=>{
        if(!filter||!list)return;
        const selected=filter.value;
        const docs=studentDocuments.filter(d=>d.student_id===selected);
        const labels={passport_photo:"Student passport photograph",kcpe_kjsea_certificate:"KJSEA / KCPE result slip or certificate",birth_certificate:"Student birth certificate",parent_id:"Parent / guardian ID"};
        list.innerHTML=docs.length?docs.map(d=>'<div class="student-document-row"><div><b>'+esc(labels[d.document_type]||d.document_type)+'</b><small>'+esc(d.file_name)+' · '+(d.file_size/1024).toFixed(0)+' KB</small></div><button type="button" data-download-student-doc="'+esc(d.id)+'">Download</button></div>').join(""):'<p>No documents uploaded for this student yet.</p>';
        list.querySelectorAll("[data-download-student-doc]").forEach(button=>button.addEventListener("click",async()=>{
          const doc=studentDocuments.find(x=>x.id===button.dataset.downloadStudentDoc);
          if(!doc)return;
          const signed=await sb.storage.from("student-documents").createSignedUrl(doc.object_path,60,{download:doc.file_name});
          if(signed.error)return alert("Could not download: "+signed.error.message);
          window.open(signed.data.signedUrl,"_blank","noopener");
        }));
      };
      if(filter&&studentList.length)filter.value=studentList[0].id;
      filter?.addEventListener("change",()=>{const hidden=docForm?.querySelector('input[name="student_id"]');if(hidden)hidden.value=filter.value;drawDocs();});drawDocs();
    });

    const adminForms=isAdmin()?(
      '<form id="addStudentForm" class="entry-form"><h3>Register student</h3><input name="admission" placeholder="Admission number" required><input name="name" placeholder="Full name" required><select name="class_id" required>'+opts(classRows,"id","name","Select class")+'</select><button type="submit">Add student</button></form>'+
      '<form id="studentLoginForm" class="entry-form"><h3>Create student login</h3><p>The student uses their admission number as the login ID and temporary password, then changes it at first login.</p><select name="student_id" required>'+opts(studentList,"id","name","Select student")+'</select><button type="submit">Create student login</button></form>'+
      '<form id="parentLoginForm" class="entry-form"><h3>Create parent login</h3><p>Parent login ID and temporary password will both be the selected child\'s admission number. The parent must set a new password at first login.</p><select name="student_id" required>'+opts(studentList,"id","name","Select linked child")+'</select><input name="name" placeholder="Parent or guardian full name" required><button type="submit">Create parent login</button></form>'
    ):"";
    const selected=students[0]?.id||"";
    return adminForms+
      '<section class="student-documents-admin"><h3>Student documents</h3><p>Upload and download each student’s passport photo, KJSEA/KCPE result slip or certificate, birth certificate and parent/guardian ID.</p>'+
      '<label>Choose student<select id="studentDocumentStudent">'+opts(studentList,"id","name","Select student")+'</select></label>'+
      '<div id="studentDocumentList" class="student-document-list"></div>'+
      '<form id="studentDocumentForm" class="entry-form"><h3>Upload a student document</h3>'+
      '<input type="hidden" name="student_id" value="'+esc(selected)+'">'+
      '<label>Document type<select name="document_type" required><option value="passport_photo">Student passport photograph</option><option value="kcpe_kjsea_certificate">KJSEA / KCPE result slip or certificate</option><option value="birth_certificate">Student birth certificate</option><option value="parent_id">Parent / guardian ID</option></select></label>'+
      '<input name="document_file" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" required><small>JPG, PNG, WEBP or PDF · Maximum 10 MB.</small><button type="submit">Upload document</button></form></section>';
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
    const { classRows } = await lookups();
    const invoiceOptions = feeInvoices.map(inv => {
      const student = students.find(s => s.id === inv.student_id);
      return { id: inv.id, name: inv.invoice_no + " - " + (student ? student.admission + " " + student.name : "Student") + " - " + inv.term + " " + inv.academic_year + " (" + money(inv.amount) + ")" };
    });
    setTimeout(() => {
      attach("feeScheduleForm", async d => {
        const {data: plan, error} = await sb.from("fee_schedules").insert({
          class_id:d.class_id, term:d.term.trim(), academic_year:Number(d.academic_year),
          title:d.title.trim()||"School fees", amount:Number(d.amount),
          due_date:d.due_date, created_by:currentUser.id
        }).select("id").single();
        if(error)throw error;
        const generated=await sb.rpc("generate_class_fee_invoices",{p_schedule_id:plan.id});
        if(generated.error)throw generated.error;
        return {message:"Fee plan saved. "+generated.data+" student invoice(s) generated. You can safely retry invoice generation if needed."};
      });
      attach("feePaymentForm", async d => {
        const invoice=feeInvoices.find(x=>x.id===d.invoice_id);
        if(!invoice)throw new Error("Select a valid student invoice.");
        const alreadyPaid=feePayments.filter(p=>p.invoiceId===invoice.id).reduce((n,p)=>n+p.amount,0);
        const remaining=Math.max(0,invoice.amount-alreadyPaid);
        const amount=Number(d.amount);
        if(!Number.isFinite(amount)||amount<=0)throw new Error("Enter a valid payment amount.");
        if(amount>remaining)throw new Error("This payment is greater than the remaining invoice balance of "+money(remaining)+".");
        const result=await sb.from("fee_payments").insert({
          invoice_id:invoice.id, student_id:invoice.student_id, term:invoice.term,
          academic_year:invoice.academic_year, amount, method:d.method,
          reference:d.reference.trim()||null, recorded_by:currentUser.id
        });
        check(result);
        return {message:"Payment recorded. A unique receipt number has been generated. Open Payment receipts to print it."};
      });
    });
    return `
      <form id="feeScheduleForm" class="entry-form">
        <h3>Automate class fee billing</h3>
        <p>Create one fee plan and automatically generate an invoice for every student in the selected class. Re-running generation will not create duplicate invoices.</p>
        <input name="title" placeholder="Fee description (e.g. Term 1 school fees)">
        <select name="class_id" required>${opts(classRows,"id","name","Select class")}</select>
        <input name="term" placeholder="Term (e.g. Term 1)" required>
        <input name="academic_year" type="number" min="2020" max="2100" placeholder="Academic year" required>
        <input name="amount" type="number" min="1" step="0.01" placeholder="Amount per student (KES)" required>
        <label>Payment due date<input name="due_date" type="date" required></label>
        <button type="submit">Create plan & generate invoices</button>
      </form>
      <form id="feePaymentForm" class="entry-form">
        <h3>Record payment & issue receipt</h3>
        <select name="invoice_id" required>${opts(invoiceOptions,"id","name","Select student invoice")}</select>
        <input name="amount" type="number" min="1" step="0.01" placeholder="Amount received (KES)" required>
        <select name="method" required><option value="">Payment method</option><option value="M-Pesa">M-Pesa</option><option value="Bank">Bank</option><option value="Cash">Cash</option><option value="Cheque">Cheque</option><option value="Other">Other</option></select>
        <input name="reference" placeholder="M-Pesa / bank transaction reference (optional)">
        <button type="submit">Record payment & create receipt</button>
      </form>
      <div class="entry-form"><h3>Existing fee plans</h3>${feeSchedules.map(x=>`<p><strong>${esc(x.title)}</strong> - ${esc(x.classes?.name||"Class")} - ${esc(x.term)} ${esc(x.academic_year)} - ${money(x.amount)} per student - Due ${esc(x.due_date)}</p>`).join("")||"<p>No fee plans created yet.</p>"}</div>`;
  });

  wrap("renderResultsPage", async () => {
    if (!isStaff()) return "";
    const { subjectRows } = await lookups();
    setTimeout(() => {
      attach("resultForm", async d => check(await sb.from("results").upsert({
        student_id: d.student_id, subject_id: d.subject_id, term: d.term.trim(),
        academic_year: Number(d.academic_year), assessment_type: d.assessment_type,
        teacher_comment: d.teacher_comment.trim()||null, score: Number(d.score), recorded_by: currentUser.id
      }, { onConflict: "student_id,subject_id,term,academic_year,assessment_type" })));
      attach("reportCommentsForm", async d => check(await sb.from("report_card_comments").upsert({
        student_id:d.student_id,term:d.term.trim(),academic_year:Number(d.academic_year),
        class_teacher_comment:d.class_teacher_comment.trim()||null,
        principal_comment:d.principal_comment.trim()||null,
        class_teacher_name:d.class_teacher_name.trim()||null,
        principal_name:d.principal_name.trim()||null,
        closing_date:d.closing_date||null,reopening_date:d.reopening_date||null,
        updated_by:currentUser.id
      },{onConflict:"student_id,term,academic_year"})));
    });
    return `
      <form id="resultForm" class="entry-form">
        <h3>Enter result</h3>
        <select name="student_id" required>${opts(studentOptions(), "id", "name", "Select student")}</select>
        <select name="subject_id" required>${opts(subjectRows, "id", "name", "Select subject")}</select>
        <input name="term" placeholder="Term (e.g. Term 1)" required>
        <input name="academic_year" type="number" min="2020" max="2100" placeholder="Academic year (e.g. 2026)" required>
        <select name="assessment_type" required><option value="exam">Exam</option><option value="cat">CAT</option><option value="assessment">Assessment</option></select>
        <input name="score" type="number" min="0" max="100" step="0.01" placeholder="Score (0-100)" required>
        <textarea name="teacher_comment" rows="2" maxlength="500" placeholder="Teacher comment for this subject (optional)"></textarea>
        <button type="submit">Save result</button>
      </form>
      <form id="reportCommentsForm" class="entry-form">
        <h3>Report card remarks and school dates</h3>
        <select name="student_id" required>${opts(studentOptions(),"id","name","Select student")}</select>
        <input name="term" placeholder="Term (e.g. Term 1)" required>
        <input name="academic_year" type="number" min="2020" max="2100" placeholder="Academic year" required>
        <input name="class_teacher_name" placeholder="Class teacher name">
        <textarea name="class_teacher_comment" rows="3" placeholder="Class teacher remark"></textarea>
        <input name="principal_name" placeholder="Principal name">
        <textarea name="principal_comment" rows="3" placeholder="Principal remark"></textarea>
        <label>Closing date<input name="closing_date" type="date"></label>
        <label>Reopening date<input name="reopening_date" type="date"></label>
        <button type="submit">Save report card remarks</button>
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
    if (!isStaff()) return "";
    setTimeout(() => attach("announcementForm", async d => {
      const audiences = {
        everyone:["admin","teacher","class_teacher","parent","student"],
        students_parents:["student","parent"], students:["student"], parents:["parent"],
        teachers:["teacher","class_teacher"], staff:["admin","teacher","class_teacher"]
      };
      const audience=audiences[d.audience]; if(!audience)throw new Error("Choose a valid audience.");
      const {error}=await sb.from("announcements").insert({
        title:d.title.trim(),body:d.body.trim(),audience,created_by:currentUser.id
      }); if(error)throw error;
    }));
    return `
      <form id="announcementForm" class="entry-form">
        <h3>Write and publish an announcement</h3>
        <input name="title" maxlength="160" placeholder="Announcement title" required>
        <textarea name="body" rows="5" maxlength="10000" placeholder="Write the full announcement..." required></textarea>
        <label for="announcementAudience">Share with</label>
        <select id="announcementAudience" name="audience" required>
          <option value="everyone">Everyone in the school</option>
          <option value="students_parents">Students and parents</option>
          <option value="students">Students only</option>
          <option value="parents">Parents only</option>
          <option value="teachers">Teachers only</option>
          <option value="staff">All staff</option>
        </select>
        <button type="submit">Publish announcement</button>
      </form>`;
  });

})();
