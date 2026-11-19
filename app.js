/* =========================================================
   KIRIMUNGE SENIOR SCHOOL MANAGEMENT SYSTEM
   ROLE BASED ACCESS CONTROL
   ========================================================= */

const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");

const loginForm = document.getElementById("loginForm");
const userRole = document.getElementById("userRole");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const logoutButton = document.getElementById("logoutButton");

const pageTitle = document.getElementById("pageTitle");
const welcomeMessage = document.getElementById("welcomeMessage");

const profileName = document.getElementById("profileName");
const profileRole = document.getElementById("profileRole");
const profileAvatar = document.getElementById("profileAvatar");

const dashboardPage = document.getElementById("dashboardPage");
const contentPage = document.getElementById("contentPage");

const navigationItems =
  document.querySelectorAll(".nav-item");

const quickActions =
  document.querySelectorAll(".quick-action");


/* =========================================================
   CURRENT USER
   ========================================================= */

let currentUser = null;



/* =========================================================
   SUPABASE CONNECTION AND DATA LOADING
   Row Level Security in the database decides what each role sees.
   ========================================================= */

const sb = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_PUBLISHABLE_KEY
);

function toUiRole(dbRole) {
  return dbRole === "class_teacher" ? "teacher" : dbRole;
}

function letterGrade(marks) {
  if (marks >= 80) return "A";
  if (marks >= 70) return "B";
  if (marks >= 60) return "C";
  if (marks >= 50) return "D";
  return "E";
}

function cap(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

async function loadSchoolData(role) {

  const staff = role === "admin" || role === "teacher";

  const [stu, cls, res, asg, ann, bal, pay, invoices, schedules, att, tch, les, materials, contests, docs, comments] = await Promise.all([
    sb.from("students").select("id, admission_no, full_name, class_id, classes(name, grade, stream)"),
    sb.from("classes").select("id, name, grade, stream").order("grade").order("name"),
    sb.from("results").select("score, term, academic_year, assessment_type, teacher_comment, student_id, students(id, admission_no, full_name, class_id, classes(name, grade, stream)), subjects(name)"),
    sb.from("assignments").select("title, due_at, classes(name), subjects(name)"),
    sb.from("announcements").select("id, title, body, audience, created_by, created_at").order("created_at", { ascending: false }),
    sb.from("fee_balances").select("student_id, total_due, total_paid"),
    sb.from("fee_payments").select("id, amount, method, reference, receipt_no, invoice_id, term, academic_year, paid_at, students(admission_no, full_name)").order("paid_at", { ascending: false }),
    sb.from("fee_invoices").select("id, student_id, term, academic_year, amount_due, due_date, invoice_no, created_at, students(admission_no, full_name)").order("created_at", { ascending: false }),
    sb.from("fee_schedules").select("id, class_id, term, academic_year, title, amount, due_date, is_active, classes(name)").order("created_at", { ascending: false }),
    sb.from("student_attendance").select("status, attendance_date, class_id, students(id, admission_no, full_name, class_id, classes(name))").order("attendance_date", { ascending: false }),
    staff ? sb.from("profiles").select("id, full_name, role").in("role", ["teacher", "class_teacher"]) : Promise.resolve({ data: [] }),
    sb.from("lessons").select("id, title, video_url, scheduled_at, duration_minutes, classes(name), subjects(name)").order("scheduled_at"),
    sb.from("revision_materials").select("id, title, file_url, content, classes(name), subjects(name)").order("created_at", { ascending: false }),
    sb.from("assessments").select("id, title, kind, starts_at, duration_minutes, is_published, classes(name), subjects(name)").eq("kind", "contest").order("starts_at"),
    sb.from("student_documents").select("id, student_id, document_type, object_path, file_name, mime_type, file_size, created_at").order("created_at", { ascending: false }),
    sb.from("report_card_comments").select("id, student_id, term, academic_year, class_teacher_comment, principal_comment, closing_date, reopening_date, class_teacher_name, principal_name")
  ]);
  const failed = [stu, cls, res, asg, ann, bal, pay, invoices, schedules, att, tch, les, materials, contests, docs, comments].find(r => r.error);
  if (failed) {
    throw new Error(failed.error.message);
  }

  students = stu.data.map(s => ({
    id: s.id,
    classId: s.class_id,
    admission: s.admission_no,
    name: s.full_name,
    className: s.classes ? s.classes.name : "Unassigned",
    grade: s.classes?.grade || null,
    stream: s.classes?.stream || "",
    gender: "-"
  }));

  classRecords = cls.data || [];
  classes = classRecords.map(c => c.name);

  results = (res.data || []).map(r => ({
    studentId: r.student_id, classId: r.students?.class_id || null,
    admission: r.students?.admission_no || "", student: r.students?.full_name || "Student",
    className: r.students?.classes?.name || "Class", classGrade: r.students?.classes?.grade || null, stream: r.students?.classes?.stream || "",
    subject: r.subjects?.name || "Subject", term: r.term || "", year: r.academic_year || "",
    assessmentType: r.assessment_type || "exam", teacherComment: r.teacher_comment || "", marks: Number(r.score), grade: letterGrade(Number(r.score))
  }));
  studentDocuments = docs.data || [];
  reportCardComments = comments.data || [];
  lessons = (les.data || []).map(r => ({id:r.id,title:r.title,videoUrl:r.video_url||"",scheduledAt:r.scheduled_at||"",durationMinutes:r.duration_minutes||30,className:r.classes?.name||"Class",subject:r.subjects?.name||"Subject"}));
  revisionMaterials = (materials.data || []).map(r => ({id:r.id,title:r.title,fileUrl:r.file_url||"",content:r.content||"",className:r.classes?.name||"Class",subject:r.subjects?.name||"Subject"}));
  competitions = (contests.data || []).map(r => ({id:r.id,title:r.title,startsAt:r.starts_at,duration:r.duration_minutes,published:!!r.is_published,className:r.classes?.name||"Class",subject:r.subjects?.name||"Subject"}));

  assignments = asg.data.map(x => ({
    title: x.title,
    subject: x.subjects ? x.subjects.name : "",
    className: x.classes ? x.classes.name : "",
    dueDate: x.due_at ? x.due_at.split("T")[0] : ""
  }));

  announcements = (ann.data || []).map(x => ({
    id: x.id, title: x.title, message: x.body, audience: x.audience || [],
    createdBy: x.created_by || "", author: x.created_by === currentUser?.id ? "You" : "School staff",
    date: x.created_at ? x.created_at.split("T")[0] : ""
  }));

  const balances = new Map(bal.data.map(b => [b.student_id, b]));
  fees = students
    .filter(s => balances.has(s.id))
    .map(s => ({
      admission: s.admission,
      student: s.name,
      className: s.className,
      total: Number(balances.get(s.id).total_due),
      paid: Number(balances.get(s.id).total_paid)
    }));

  feeInvoices = (invoices.data || []).map(i => ({...i, amount: Number(i.amount_due)}));
  feeSchedules = schedules.data || [];
  feePayments = pay.data.map((p, i) => ({
    id: p.id, receiptNo: p.receipt_no || "Receipt", invoiceId: p.invoice_id || "", term: p.term || "", year: p.academic_year || "",
    admission: p.students.admission_no,
    student: p.students.full_name,
    amount: Number(p.amount),
    method: p.method || "",
    reference: p.reference || "",
    date: p.paid_at.split("T")[0]
  }));

  attendanceRecords = att.data.map(r => ({
    admission: r.students.admission_no,
    student: r.students.full_name,
    status: cap(r.status),
    date: r.attendance_date,
    studentId: r.students?.id || "",
    classId: r.class_id || r.students?.class_id || "",
    className: r.students?.classes?.name || "Unassigned"
  }));

  teachers = tch.data.map(t => ({
    id: t.id,
    name: t.full_name,
    subject: ""
  }));
}

/* =========================================================
   ROLE PERMISSIONS
   ========================================================= */

const rolePermissions = {

  student: [
    "dashboard",
    "classes",
    "attendance",
    "results",
    "assignments",
    "announcements",
    "fees",
    "notifications"
  ],

  teacher: [
    "dashboard",
    "students",
    "classes",
    "attendance",
    "results",
    "assignments",
    "announcements",
    "notifications"
  ],

  parent: [
    "dashboard",
    "attendance",
    "results",
    "assignments",
    "announcements",
    "fees",
    "documents",
    "notifications"
  ],

  admin: [
    "dashboard",
    "students",
    "teachers",
    "classes",
    "attendance",
    "results",
    "assignments",
    "announcements",
    "fees",
    "notifications"
  ]

};

["student", "teacher", "admin"].forEach(role => rolePermissions[role].push("lessons", "contests", "examinations"));

/* =========================================================
   PAGE INFORMATION
   ========================================================= */

const pageInfo = {

  dashboard: {
    title: "Dashboard",
    description: "Welcome to Kirimunge Senior School."
  },

  students: {
    title: "Students",
    description: "Manage student records."
  },

  teachers: {
    title: "Teachers",
    description: "Manage teacher records."
  },

  classes: {
    title: "Classes",
    description: "View school classes."
  },

  attendance: {
    title: "Attendance",
    description: "Student attendance."
  },

  results: {
    title: "Results",
    description: "Term reports and academic performance."
  },

  lessons: { title: "Lessons", description: "Class lessons and learning materials." },
  contests: { title: "Competitions & Challenges", description: "Academic competitions and student challenges." },
  examinations: { title: "Examinations", description: "Secure, timed school examinations and assessments." },

  assignments: {
    title: "Assignments",
    description: "School assignments."
  },

  announcements: {
    title: "Announcements",
    description: "School announcements."
  },

  fees: {
    title: "Fees",
    description: "Student fees and payments."
  },

  notifications: {
    title: "Notifications",
    description: "School notifications."
  }

};


/* =========================================================
   SAMPLE DATA
   ========================================================= */

let students = [];


let teachers = [];


let classes = [];
let classRecords = [];


let attendanceRecords = [];


let results = [];
let studentDocuments = [];
let reportCardComments = [];
let lessons = [];
let revisionMaterials = [];
let competitions = [];

let assignments = [];


let announcements = [];


let fees = [];


let feePayments = [];
let feeInvoices = [];
let feeSchedules = [];


let notifications = [];


/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

function money(amount) {
  return "KSh " +
    Number(amount || 0).toLocaleString("en-KE");
}


function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function getFeeBalance(record) {
  return Math.max(
    0,
    Number(record.total) - Number(record.paid)
  );
}


function getFeeStatus(record) {

  const balance = getFeeBalance(record);

  if (balance === 0) {
    return "Paid";
  }

  if (record.paid > 0) {
    return "Partially Paid";
  }

  return "Not Paid";
}


/* =========================================================
   ROLE NAME
   ========================================================= */

function roleName(role) {

  const names = {
    student: "Student",
    teacher: "Teacher",
    parent: "Parent",
    admin: "Administrator"
  };

  return names[role] || role;
}


/* =========================================================
   CHECK PERMISSION
   ========================================================= */

function hasPermission(page) {

  if (!currentUser) {
    return false;
  }

  const allowed =
    rolePermissions[currentUser.role] || [];

  return allowed.includes(page);
}


/* =========================================================
   IMPORTANT:
   APPLY ROLE ACCESS
   ========================================================= */

function applyRoleAccess() {

  if (!currentUser) {
    return;
  }

  const allowed =
    rolePermissions[currentUser.role] || [];


  /* -------------------------------
     SIDEBAR
     ------------------------------- */

  navigationItems.forEach(item => {

    const page = item.dataset.page;

    if (allowed.includes(page)) {

      item.style.display = "";

      item.removeAttribute("aria-hidden");

    } else {

      item.style.display = "none";

      item.setAttribute("aria-hidden", "true");

    }

  });


  /* -------------------------------
     QUICK ACTIONS
     ------------------------------- */

  quickActions.forEach(action => {

    const page = action.dataset.action;

    if (allowed.includes(page)) {

      action.style.display = "";

    } else {

      action.style.display = "none";

    }

  });


  /*
     Extra protection:
     If a student logs in, make absolutely
     sure restricted pages cannot be opened.
  */

  if (currentUser.role === "student") {

    const restricted = [
      "students",
      "teachers"
    ];

    restricted.forEach(page => {

      const button =
        document.querySelector(
          `.nav-item[data-page="${page}"]`
        );

      if (button) {
        button.style.display = "none";
      }

    });

  }

}


/* =========================================================
   LOGIN
   ========================================================= */

function admissionNumberToEmail(admissionNo) {
  const normalized = String(admissionNo || "").trim().toLowerCase();
  const bytes = new TextEncoder().encode(normalized);
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  return `student.${hex}@login.smartschool.invalid`;
}

function parentAdmissionToEmail(admissionNo) {
  const normalized = String(admissionNo || "").trim().toLowerCase();
  const bytes = new TextEncoder().encode(normalized);
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  return `parent.${hex}@login.smartschool.invalid`;
}

function updateLoginIdentityField() {
  const admissionLogin = userRole.value === "student" || userRole.value === "parent";
  usernameInput.type = admissionLogin ? "text" : "email";
  usernameInput.placeholder = admissionLogin ? "Enter your child's admission number" : "Enter your email address";
  const label = document.querySelector('label[for="username"]');
  if (label) label.textContent = admissionLogin ? "Child's admission number" : "Email address";
}
userRole.addEventListener("change", updateLoginIdentityField);
updateLoginIdentityField();

async function completeAuthenticatedLogin(user, loginIdentity, chosenRole) {
  const { data: profile, error: profileError } = await sb
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    await sb.auth.signOut();
    throw new Error("Your account has no profile. Contact the administrator.");
  }

  const role = toUiRole(profile.role);
  if (role !== chosenRole) {
    await sb.auth.signOut();
    throw new Error("This account is not registered as " + roleName(chosenRole) + ".");
  }

  await loadSchoolData(role);
  const displayName = profile.full_name || loginIdentity;
  currentUser = { username: displayName, role, id: user.id };

  profileName.textContent = displayName;
  profileRole.textContent = roleName(role);
  profileAvatar.textContent = displayName.charAt(0).toUpperCase();
  welcomeMessage.textContent =
    `Welcome, ${displayName}. You are logged in as a ${roleName(role)}.`;

  const firstLoginForm = document.getElementById("firstLoginPasswordForm");
  if (firstLoginForm) firstLoginForm.remove();
  loginForm.classList.add("hidden");
  loginPage.classList.add("hidden");
  appPage.classList.remove("hidden");

  applyRoleAccess();
  updateDashboard();
  showPage("dashboard");
  window.SmartschoolAssistant?.show();
}

function showFirstLoginPasswordChange(loginIdentity, chosenRole) {
  loginForm.classList.add("hidden");
  passwordInput.value = "";

  const previous = document.getElementById("firstLoginPasswordForm");
  if (previous) previous.remove();

  const form = document.createElement("form");
  form.id = "firstLoginPasswordForm";
  form.className = "entry-form";
  form.innerHTML = `
    <h2>Secure your account</h2>
    <p>Your child's admission number was used as your temporary password. Create a new password before entering Smartschool.</p>
    <label for="firstNewPassword">New password (at least 10 characters)</label>
    <input id="firstNewPassword" name="new_password" type="password" minlength="10" autocomplete="new-password" required>
    <label for="firstConfirmPassword">Confirm new password</label>
    <input id="firstConfirmPassword" name="confirm_password" type="password" minlength="10" autocomplete="new-password" required>
    <button type="submit" class="primary-button">Save new password</button>
    <button type="button" id="cancelFirstLogin" class="secondary-button">Back to login</button>
  `;
  loginForm.insertAdjacentElement("afterend", form);

  form.querySelector("#cancelFirstLogin").addEventListener("click", async () => {
    await sb.auth.signOut();
    form.remove();
    loginForm.classList.remove("hidden");
    loginForm.reset();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newPassword = form.elements.new_password.value;
    const confirmPassword = form.elements.confirm_password.value;
    const button = form.querySelector("button[type='submit']");
    if (newPassword.length < 10) {
      alert("Choose a password with at least 10 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("The two passwords do not match.");
      return;
    }
    button.disabled = true;
    try {
      const { data, error } = await sb.functions.invoke("complete-first-login", {
        body: { password: newPassword }
      });
      if (error) {
        let message = error.message || "Could not update password.";
        try {
          const detail = await error.context.json();
          if (detail && detail.error) message = detail.error;
        } catch (_) {}
        throw new Error(message);
      }
      if (data && data.error) throw new Error(data.error);

      const { data: refreshed, error: refreshError } = await sb.auth.refreshSession();
      if (refreshError || !refreshed.session) {
        throw new Error("Password changed, but your session could not be refreshed. Please sign in again with your new password.");
      }
      await completeAuthenticatedLogin(refreshed.session.user, loginIdentity, chosenRole);
    } catch (err) {
      alert(err.message || String(err));
      button.disabled = false;
    }
  });
}

loginForm.addEventListener("submit", async function(event) {
  event.preventDefault();

  const chosenRole = userRole.value;
  const loginIdentity = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!chosenRole) {
    alert("Please select your role.");
    return;
  }
  if (!loginIdentity || !password) {
    alert(chosenRole === "student"
      ? "Please enter your admission number and password."
      : "Please enter your email and password.");
    return;
  }

  const submitButton = loginForm.querySelector("button[type='submit']");
  if (submitButton) submitButton.disabled = true;

  try {
    const email = chosenRole === "student"
      ? admissionNumberToEmail(loginIdentity)
      : chosenRole === "parent"
        ? parentAdmissionToEmail(loginIdentity)
        : loginIdentity.toLowerCase();

    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      alert("Invalid login ID or password.");
      return;
    }

    if (data.user.app_metadata?.must_change_password === true) {
      showFirstLoginPasswordChange(loginIdentity, chosenRole);
      return;
    }

    await completeAuthenticatedLogin(data.user, loginIdentity, chosenRole);
  } catch (err) {
    await sb.auth.signOut();
    alert("Could not load school data: " + (err.message || err));
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});


/* =========================================================
   LOGOUT
   ========================================================= */

logoutButton.addEventListener("click", async function() {
  await sb.auth.signOut();
  window.SmartschoolAssistant?.hide();
  currentUser = null;
  appPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
  loginForm.classList.remove("hidden");
  loginForm.reset();

  const firstLoginForm = document.getElementById("firstLoginPasswordForm");
  if (firstLoginForm) firstLoginForm.remove();

  navigationItems.forEach(item => {
    item.style.display = "";
    item.removeAttribute("aria-hidden");
  });
  quickActions.forEach(action => { action.style.display = ""; });
  dashboardPage.classList.remove("hidden");
  contentPage.classList.add("hidden");
  updateLoginIdentityField();
});


/* =========================================================
   NAVIGATION
   ========================================================= */

navigationItems.forEach(item => {

  item.addEventListener(
    "click",
    function() {

      const page =
        item.dataset.page;

      showPage(page);

    }
  );

});


function showPage(page) {
  if (activeExamAttempt && page !== "examinations") {
    void submitActiveExam("page_exit").finally(() => showPage(page));
    return;
  }

  /*
     HARD PERMISSION CHECK
  */

  if (page !== "dashboard") {

    if (!currentUser) {

      alert("Please login first.");

      return;

    }


    if (!hasPermission(page)) {

      alert(
        `Access denied. ${roleName(currentUser.role)} accounts cannot access ${page}.`
      );

      return;

    }

  }


  navigationItems.forEach(item => {

    item.classList.toggle(
      "active",
      item.dataset.page === page
    );

  });


  const info =
    pageInfo[page] ||
    pageInfo.dashboard;


  pageTitle.textContent =
    info.title;

  welcomeMessage.textContent =
    info.description;


  if (page === "dashboard") {

    dashboardPage.classList.remove("hidden");

    contentPage.classList.add("hidden");

    updateDashboard();

    return;

  }


  dashboardPage.classList.add("hidden");

  contentPage.classList.remove("hidden");


  switch (page) {

    case "students":
      renderStudentsPage();
      break;

    case "teachers":
      renderTeachersPage();
      break;

    case "classes":
      renderClassesPage();
      break;

    case "attendance":
      renderAttendancePage();
      break;

    case "results":
      renderResultsPage();
      break;
    case "lessons": renderLessonsPage(); break;
    case "contests": renderContestsPage(); break;
    case "examinations": renderExaminationsPage(); break;

    case "assignments":
      renderAssignmentsPage();
      break;

    case "announcements":
      renderAnnouncementsPage();
      break;

    case "fees":
      renderFeesPage();
      break;

    case "documents":
      renderParentDocumentsPage();
      break;

    case "notifications":
      renderNotificationsPage();
      break;

  }

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {

  const statValues =
    document.querySelectorAll(".stat-value");


  const totalOutstanding =
    fees.reduce(
      (sum, record) =>
        sum + getFeeBalance(record),
      0
    );


  if (statValues[0]) {
    statValues[0].textContent =
      students.length;
  }


  if (statValues[1]) {
    statValues[1].textContent =
      teachers.length;
  }


  if (statValues[2]) {
    statValues[2].textContent =
      classes.length;
  }


  if (statValues[3]) {
    statValues[3].textContent =
      money(totalOutstanding);
  }

}


/* =========================================================
   STUDENTS
   ========================================================= */

function renderParentDocumentsPage() {
  if (!currentUser || currentUser.role !== "parent" || !hasPermission("documents")) return showAccessDenied();
  const linkedChildren = students;
  contentPage.innerHTML = '<div class="page-header"><div><h2>My Child Documents</h2><p>Securely view and download documents for children linked to your parent account.</p></div></div><div class="panel">' +
    (linkedChildren.length ? linkedChildren.map(child => '<div class="parent-child-document-row"><div><strong>' + escapeHTML(child.name) + '</strong><small>Admission: ' + escapeHTML(child.admission) + ' · ' + escapeHTML(child.className) + '</small></div><button type="button" data-parent-view-child="' + escapeHTML(child.id) + '">View documents</button></div>').join("") : '<p>No child is linked to this parent account yet. Please contact the school administrator.</p>') +
    '</div><div id="studentDocumentViewer" class="student-document-viewer panel" hidden></div>';
  contentPage.querySelectorAll("[data-parent-view-child]").forEach(button => button.addEventListener("click", () => openStudentDocuments(button.dataset.parentViewChild)));
}

function renderStudentsPage() {
  if (!hasPermission("students")) { showAccessDenied(); return; }
  contentPage.innerHTML = `
    <div class="page-header"><div><h2>Students</h2><p>Search by admission number or student name, then open the student's complete document file.</p></div></div>
    <div class="panel">
      <label class="student-search-label" for="studentListSearch">Search students</label>
      <input id="studentListSearch" class="student-list-search" type="search" placeholder="Enter student name or admission number..." autocomplete="off">
      <div class="table-wrapper"><table><thead><tr><th>Admission</th><th>Name</th><th>Class</th><th>Gender</th><th>Documents</th></tr></thead>
      <tbody id="studentListRows"></tbody></table></div>
      <p id="studentSearchCount" class="muted"></p>
    </div>
    <div id="studentDocumentViewer" class="student-document-viewer panel" hidden></div>`;
  const search=document.getElementById("studentListSearch");
  const rows=document.getElementById("studentListRows");
  const count=document.getElementById("studentSearchCount");
  const draw=()=>{
    const term=(search.value||"").trim().toLowerCase();
    const found=students.filter(st=>String(st.admission).toLowerCase().includes(term)||String(st.name).toLowerCase().includes(term)||String(st.className).toLowerCase().includes(term));
    rows.innerHTML=found.map(st=>`<tr><td>${escapeHTML(st.admission)}</td><td>${escapeHTML(st.name)}</td><td>${escapeHTML(st.className)}</td><td>${escapeHTML(st.gender)}</td><td><button type="button" class="student-open-docs" data-open-student-docs="${escapeHTML(st.id)}">View documents (${studentDocuments.filter(d=>d.student_id===st.id).length})</button></td></tr>`).join("")||'<tr><td colspan="5">No matching students found.</td></tr>';
    count.textContent=found.length+" of "+students.length+" students";
    rows.querySelectorAll("[data-open-student-docs]").forEach(button=>button.addEventListener("click",()=>openStudentDocuments(button.dataset.openStudentDocs)));
  };
  search.addEventListener("input",draw);
  draw();
}

async function openStudentDocuments(studentId) {
  const parentOwnsLinkedChild = currentUser && currentUser.role === "parent" && students.some(st=>st.id===studentId);
  if (!hasPermission("students") && !parentOwnsLinkedChild) { alert("You do not have permission to view these student records."); return; }
  const student=students.find(st=>st.id===studentId);
  if(!student)return;
  const filter=document.getElementById("studentDocumentStudent");
  if(filter){filter.value=studentId;filter.dispatchEvent(new Event("change"));}
  const viewer=document.getElementById("studentDocumentViewer");
  if(!viewer)return;
  const labels={
    passport_photo:"Student passport photograph",
    kcpe_kjsea_certificate:"KCPE / KJSEA result slip or certificate",
    birth_certificate:"Student birth certificate",
    parent_id:"Parent / guardian ID"
  };
  const docs=studentDocuments.filter(d=>d.student_id===studentId);
  const byType=Object.fromEntries(Object.keys(labels).map(type=>[type,docs.filter(d=>d.document_type===type)]));
  viewer.hidden=false;
  viewer.innerHTML=`<div class="student-document-viewer-head"><div><h3>Student documents</h3><p><strong>${escapeHTML(student.name)}</strong> · Admission: ${escapeHTML(student.admission)} · ${escapeHTML(student.className)}</p></div><button type="button" class="secondary-button" id="closeStudentDocumentViewer">Close</button></div>
    <div class="student-document-categories">${Object.entries(labels).map(([type,label])=>`<section class="student-document-category"><div><strong>${label}</strong><small>${byType[type].length?byType[type].length+" file(s) uploaded":"Not uploaded yet"}</small></div>${byType[type].map(doc=>`<div class="student-document-file"><span>${escapeHTML(doc.file_name)} <small>${(Number(doc.file_size)/1024).toFixed(0)} KB · ${escapeHTML((doc.created_at||"").slice(0,10))}</small></span><div><button type="button" data-preview-student-doc="${escapeHTML(doc.id)}">View full document</button><button type="button" data-download-student-doc="${escapeHTML(doc.id)}">Download</button>${currentUser?.role==="admin"?'<button type="button" data-replace-student-doc="'+escapeHTML(doc.id)+'">Replace</button><button type="button" data-delete-student-doc="'+escapeHTML(doc.id)+'">Delete</button>':""}</div></div>`).join("")||'<p class="muted">No file has been uploaded for this document type.</p>'}</section>`).join("")}</div>
    <div id="studentDocumentPreview" class="student-document-preview"><p>Select “View full document” to open a full-size preview here.</p></div>`;
  viewer.scrollIntoView({behavior:"smooth",block:"start"});
  document.getElementById("closeStudentDocumentViewer")?.addEventListener("click",()=>{viewer.hidden=true;viewer.innerHTML="";});
  viewer.querySelectorAll("[data-preview-student-doc]").forEach(button=>button.addEventListener("click",async()=>{
    const doc=studentDocuments.find(d=>d.id===button.dataset.previewStudentDoc);
    const preview=document.getElementById("studentDocumentPreview");
    if(!doc||!preview)return;
    button.disabled=true;preview.innerHTML="<p>Opening document securely…</p>";
    try{
      const result=await sb.storage.from("student-documents").createSignedUrl(doc.object_path,300);
      if(result.error)throw result.error;
      const url=result.data.signedUrl;
      preview.innerHTML=doc.mime_type==="application/pdf"
        ?'<iframe title="Student document preview" src="'+escapeHTML(url)+'" class="student-document-frame"></iframe>'
        :doc.mime_type.startsWith("image/")
          ?'<img alt="'+escapeHTML(doc.file_name)+'" src="'+escapeHTML(url)+'" class="student-document-image">'
          :'<p>Preview is unavailable for this file type. Use Download instead.</p>';
    }catch(err){preview.innerHTML="<p>Could not open document: "+escapeHTML(err.message||err)+"</p>";}
    finally{button.disabled=false;}
  }));
  if(currentUser?.role==="admin"){
    viewer.querySelectorAll("[data-delete-student-doc]").forEach(button=>button.addEventListener("click",async()=>{
      const doc=studentDocuments.find(d=>d.id===button.dataset.deleteStudentDoc);if(!doc)return;
      if(!confirm("Permanently delete "+doc.file_name+"? This removes the file and its record."))return;
      button.disabled=true;
      try{
        const removed=await sb.storage.from("student-documents").remove([doc.object_path]);if(removed.error)throw removed.error;
        const deleted=await sb.from("student_documents").delete().eq("id",doc.id);if(deleted.error)throw deleted.error;
        await loadSchoolData(currentUser.role);openStudentDocuments(studentId);
      }catch(err){alert("Could not delete document: "+(err.message||err));button.disabled=false;}
    }));
    viewer.querySelectorAll("[data-replace-student-doc]").forEach(button=>button.addEventListener("click",()=>{
      const doc=studentDocuments.find(d=>d.id===button.dataset.replaceStudentDoc);if(!doc)return;
      const picker=document.createElement("input");picker.type="file";picker.accept=".jpg,.jpeg,.png,.webp,.pdf";
      picker.onchange=async()=>{
        const file=picker.files?.[0];if(!file)return;
        if(file.size>10*1024*1024||!["image/jpeg","image/png","image/webp","application/pdf"].includes(file.type)){alert("Choose a JPG, PNG, WEBP or PDF file up to 10 MB.");return;}
        button.disabled=true;
        const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"_").slice(-100),newPath=studentId+"/"+doc.document_type+"/"+crypto.randomUUID()+"-"+safeName;
        try{
          const uploaded=await sb.storage.from("student-documents").upload(newPath,file,{contentType:file.type,upsert:false});if(uploaded.error)throw uploaded.error;
          const updated=await sb.from("student_documents").update({object_path:newPath,file_name:file.name,mime_type:file.type,file_size:file.size,uploaded_by:currentUser.id}).eq("id",doc.id);
          if(updated.error){await sb.storage.from("student-documents").remove([newPath]);throw updated.error;}
          const oldRemoved=await sb.storage.from("student-documents").remove([doc.object_path]);
          if(oldRemoved.error)alert("The new file is saved, but the old storage copy could not be removed. Contact the system administrator.");
          await loadSchoolData(currentUser.role);openStudentDocuments(studentId);
        }catch(err){alert("Could not replace document: "+(err.message||err));button.disabled=false;}
      };picker.click();
    }));
  }
  viewer.querySelectorAll("[data-download-student-doc]").forEach(button=>button.addEventListener("click",async()=>{
    const doc=studentDocuments.find(d=>d.id===button.dataset.downloadStudentDoc);
    if(!doc)return;
    button.disabled=true;
    try{
      const result=await sb.storage.from("student-documents").createSignedUrl(doc.object_path,60,{download:doc.file_name});
      if(result.error)throw result.error;
      const link=document.createElement("a");link.href=result.data.signedUrl;link.download=doc.file_name;link.rel="noopener";document.body.appendChild(link);link.click();link.remove();
    }catch(err){alert("Could not download document: "+(err.message||err));}
    finally{button.disabled=false;}
  }));
}

/* =========================================================
   TEACHERS
   ========================================================= */

function renderTeachersPage() {

  if (!hasPermission("teachers")) {

    showAccessDenied();

    return;

  }


  contentPage.innerHTML = `

    <div class="page-header">

      <div>
        <h2>Teachers</h2>
        <p>Manage teacher records.</p>
      </div>

    </div>

    <div class="panel">

      <div class="table-wrapper">

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Subject</th>
            </tr>

          </thead>

          <tbody>

            ${teachers.map(teacher => `

              <tr>

                <td>${escapeHTML(teacher.id)}</td>

                <td>${escapeHTML(teacher.name)}</td>

                <td>${escapeHTML(teacher.subject)}</td>

              </tr>

            `).join("")}

          </tbody>

        </table>

      </div>

    </div>
  `;
}


/* =========================================================
   CLASSES
   ========================================================= */

function renderClassesPage() {

  if (!hasPermission("classes")) {

    showAccessDenied();

    return;

  }


  contentPage.innerHTML = `

    <div class="page-header">

      <div>
        <h2>Classes</h2>
        <p>School classes and streams.</p>
      </div>

    </div>

    <div class="dashboard-grid">

      ${classes.map(className => `

        <div class="panel">

          <h3>
            🏫 ${escapeHTML(className)}
          </h3>

          <p>
            Students:
            ${
              students.filter(
                student =>
                  student.className === className
              ).length
            }
          </p>

        </div>

      `).join("")}

    </div>
  `;
}


/* =========================================================
   ATTENDANCE
   ========================================================= */

function renderAttendancePage() {
  if (!hasPermission("attendance")) return showAccessDenied();
  const canMark = currentUser.role === "admin" || currentUser.role === "teacher";
  const today = new Date().toLocaleDateString("en-CA");
  const present = students.filter(st => attendanceRecords.some(r => r.studentId === st.id && r.date === today && r.status.toLowerCase() === "present")).length;
  const absent = students.filter(st => attendanceRecords.some(r => r.studentId === st.id && r.date === today && r.status.toLowerCase() === "absent")).length;
  const late = students.filter(st => attendanceRecords.some(r => r.studentId === st.id && r.date === today && r.status.toLowerCase() === "late")).length;
  contentPage.innerHTML = `
    <div class="page-header"><div><h2>Attendance Register</h2><p>${canMark ? "Mark and review daily attendance." : "Review attendance records for your linked child."}</p></div>${canMark ? '<button type="button" class="primary-button" id="exportAttendance">Download CSV</button>' : ""}</div>
    <div class="attendance-summary-grid"><div class="panel"><small>Present today</small><strong>${present}</strong></div><div class="panel"><small>Absent today</small><strong>${absent}</strong></div><div class="panel"><small>Late today</small><strong>${late}</strong></div><div class="panel"><small>Students in view</small><strong>${students.length}</strong></div></div>
    <div class="panel"><div class="attendance-filters">
      <label>Search student<input id="attendanceSearch" type="search" placeholder="Name or admission number"></label>
      <label>Date<input id="attendanceDate" type="date" value="${today}"></label>
      <label>Status<select id="attendanceStatusFilter"><option value="">All statuses</option><option>Present</option><option>Absent</option><option>Late</option><option>Not marked</option></select></label>
    </div><div class="table-wrapper"><table><thead><tr><th>Admission</th><th>Student</th><th>Class</th><th>Date</th><th>Status ${canMark ? "/ Mark" : ""}</th></tr></thead><tbody id="attendanceRows"></tbody></table></div><p id="attendanceCount" class="muted"></p></div>`;
  const search=document.getElementById("attendanceSearch"),date=document.getElementById("attendanceDate"),status=document.getElementById("attendanceStatusFilter"),tbody=document.getElementById("attendanceRows");
  const draw=()=>{
    const day=date.value||today,term=search.value.trim().toLowerCase(),wanted=status.value;
    const visible=students.map(st=>{const record=attendanceRecords.find(r=>r.studentId===st.id&&r.date===day);return {...st,status:record?.status||"Not marked",date:day};})
      .filter(r=>(!term||r.name.toLowerCase().includes(term)||r.admission.toLowerCase().includes(term))&&(!wanted||r.status===wanted));
    tbody.innerHTML=visible.map(r=>`<tr><td>${escapeHTML(r.admission)}</td><td>${escapeHTML(r.name)}</td><td>${escapeHTML(r.className)}</td><td>${escapeHTML(r.date)}</td><td>${canMark?`<select aria-label="Attendance for ${escapeHTML(r.name)}" data-attendance-admission="${escapeHTML(r.admission)}"><option value="">Not marked</option><option value="Present" ${r.status==="Present"?"selected":""}>Present</option><option value="Absent" ${r.status==="Absent"?"selected":""}>Absent</option><option value="Late" ${r.status==="Late"?"selected":""}>Late</option></select>`:escapeHTML(r.status)}</td></tr>`).join("")||'<tr><td colspan="5">No attendance records match these filters.</td></tr>';
    document.getElementById("attendanceCount").textContent=visible.length+" students shown";
    if(canMark)tbody.querySelectorAll("[data-attendance-admission]").forEach(el=>el.addEventListener("change",async()=>{if(el.value)await setAttendance(el.dataset.attendanceAdmission,el.value,day);}));
  };
  [search,date,status].forEach(el=>el.addEventListener("input",draw));draw();
  if(canMark)document.getElementById("exportAttendance").addEventListener("click",()=>{
    const day=date.value||today,header=["Admission","Student","Class","Date","Status"];
    const data=students.map(st=>{const r=attendanceRecords.find(x=>x.studentId===st.id&&x.date===day);return [st.admission,st.name,st.className,day,r?.status||"Not marked"];});
    const csv=[header,...data].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(",")).join("\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));const link=document.createElement("a");link.href=url;link.download="Kirimunge-attendance-"+day+".csv";link.click();URL.revokeObjectURL(url);
  });
}
async function setAttendance(admission,status,dateOverride) {
  if(!hasPermission("attendance")||!["admin","teacher"].includes(currentUser.role)){alert("Only authorised school staff can mark attendance.");return;}
  if(!status)return;
  const student=students.find(item=>item.admission===admission);if(!student)return;
  const date=dateOverride||new Date().toLocaleDateString("en-CA");
  const {error}=await sb.from("student_attendance").upsert({student_id:student.id,class_id:student.classId,attendance_date:date,status:status.toLowerCase(),marked_by:currentUser.id},{onConflict:"student_id,attendance_date"});
  if(error){alert("Could not save attendance: "+error.message);return;}
  attendanceRecords=attendanceRecords.filter(r=>!(r.admission===admission&&r.date===date));
  attendanceRecords.push({admission,student:student.name,studentId:student.id,classId:student.classId,className:student.className,status,date});
  renderAttendancePage();
}

/* =========================================================
   RESULTS
   ========================================================= */

function renderResultsPage() {
  if (!hasPermission("results")) return showAccessDenied();
  const terms = [...new Set(results.map(r => r.term).filter(Boolean))];
  const years = [...new Set(results.map(r => String(r.year)).filter(Boolean))];
  const visibleStudents = students.filter(s => results.some(r => r.studentId === s.id));
  const initialStudentId = visibleStudents[0]?.id || "";
  contentPage.innerHTML = '<div class="page-header results-heading"><div><h2>Academic Report Cards</h2><p>Individual student performance reports, ready to print or save as PDF.</p></div><button class="primary-button" onclick="window.print()">Print / Save PDF</button></div>' +
    '<div class="panel report-controls">' +
    ((currentUser.role !== "student") ? '<label>Student<select id="reportStudent">' + visibleStudents.map(s=>'<option value="' + escapeHTML(s.id) + '">' + escapeHTML(s.admission + " - " + s.name) + '</option>').join("") + '</select></label>' : '') +
    '<label>Term<select id="reportTerm">' + terms.map(t=>'<option value="' + escapeHTML(t) + '">' + escapeHTML(t) + '</option>').join("") + '</select></label>' +
    '<label>Academic year<select id="reportYear">' + years.map(y=>'<option value="' + escapeHTML(y) + '">' + escapeHTML(y) + '</option>').join("") + '</select></label></div><div id="reportCardOutput"></div>';
  const value = id => document.getElementById(id)?.value || "";
  const draw = async () => {
    const studentId = currentUser.role === "student" ? initialStudentId : value("reportStudent");
    const term=value("reportTerm"), year=value("reportYear"), student=students.find(s=>s.id===studentId);
    const rows=results.filter(r=>r.studentId===studentId && r.term===term && String(r.year)===year);
    const classRows=results.filter(r=>r.classId===student?.classId && r.term===term && String(r.year)===year);
    const gradeRows=results.filter(r=>r.classGrade===student?.grade && r.term===term && String(r.year)===year);
    const average=rows.length?rows.reduce((n,r)=>n+r.marks,0)/rows.length:0;
    const grouped=new Map();
    classRows.forEach(r=>{const list=grouped.get(r.studentId)||[];list.push(r.marks);grouped.set(r.studentId,list);});
    const positions=[...grouped.entries()].map(([id,marks])=>({id,average:marks.reduce((a,b)=>a+b,0)/marks.length})).sort((a,b)=>b.average-a.average);
    const canRank=currentUser.role==="admin"||currentUser.role==="teacher";
    const position=canRank?positions.findIndex(x=>x.id===studentId)+1:0;
    const gradeGroups=new Map();
    gradeRows.forEach(r=>{const list=gradeGroups.get(r.studentId)||[];list.push(r.marks);gradeGroups.set(r.studentId,list);});
    const gradePositions=[...gradeGroups.entries()].map(([id,marks])=>({id,average:marks.reduce((a,b)=>a+b,0)/marks.length})).sort((a,b)=>b.average-a.average);
    const overallPosition=currentUser.role==="admin"?gradePositions.findIndex(x=>x.id===studentId)+1:0;
    const points=rows.reduce((sum,r)=>sum+({A:12,B:10,C:8,D:6,E:4}[r.grade]||0),0);
    const note=reportCardComments.find(c=>c.student_id===studentId && c.term===term && String(c.academic_year)===year);
    const photo=studentDocuments.find(d=>d.student_id===studentId && d.document_type==="passport_photo");
    let photoUrl="";
    if(photo){const signed=await sb.storage.from("student-documents").createSignedUrl(photo.object_path,300);photoUrl=signed.data?.signedUrl||"";}
    const out=document.getElementById("reportCardOutput");
    if(!student||!rows.length){out.innerHTML='<div class="panel"><p>No marks have been entered for this student, term and academic year yet.</p></div>';return;}
    const subjectRows=rows.map(r=>({row:r,rank:(canRank?1+classRows.filter(x=>x.subject===r.subject&&x.marks>r.marks).length:"—")}));
    out.innerHTML='<article class="report-card">' +
      '<header class="report-school-header"><div class="report-school-crest">🏫</div><div><h2>KIRIMUNGE SENIOR SCHOOL</h2><p>ACADEMIC PERFORMANCE REPORT</p><strong>'+escapeHTML(term.toUpperCase())+' · '+escapeHTML(year)+'</strong></div></header>' +
      '<section class="report-student"><div class="report-photo">'+(photoUrl?'<img src="'+escapeHTML(photoUrl)+'" alt="Student passport photograph">':'<span>Student<br>Photo</span>')+'</div>' +
      '<div class="report-student-details"><h3>'+escapeHTML(student.name)+'</h3><p><b>Admission No:</b> '+escapeHTML(student.admission)+'</p><p><b>Class:</b> '+escapeHTML(student.className)+'</p><p><b>Academic year:</b> '+escapeHTML(year)+'</p></div>' +
      '<div class="report-summary"><div><small>Mean score</small><strong>'+average.toFixed(1)+'%</strong></div><div><small>Total marks</small><strong>'+rows.reduce((n,r)=>n+r.marks,0).toFixed(1)+'</strong></div><div><small>Total points</small><strong>'+points+'</strong></div><div><small>Stream position</small><strong>'+(position||"—")+' / '+(positions.length||"—")+'</strong></div><div><small>Overall position</small><strong>'+(overallPosition||"—")+' / '+(gradePositions.length||"—")+'</strong></div></div></section>' +
      '<h3 class="report-section-title">SUBJECT PERFORMANCE</h3><div class="table-wrapper report-table-wrap"><table class="report-table"><thead><tr><th>Subject</th><th>Marks</th><th>Grade</th><th>Class rank</th><th>Teacher comment</th></tr></thead><tbody>' +
      subjectRows.map(x=>'<tr><td>'+escapeHTML(x.row.subject)+'</td><td>'+x.row.marks.toFixed(1)+'%</td><td><b>'+escapeHTML(x.row.grade)+'</b></td><td>'+x.rank+'</td><td>'+escapeHTML(x.row.teacherComment||'—')+'</td></tr>').join("") +
      '</tbody></table></div><section class="report-lower-grid"><div><h3 class="report-section-title">PERFORMANCE BY SUBJECT</h3><div class="report-chart">' +
      rows.map(r=>'<div class="report-bar-row"><span>'+escapeHTML(r.subject)+'</span><div><i style="width:'+Math.max(0,Math.min(100,r.marks))+'%"></i></div><b>'+r.marks.toFixed(0)+'%</b></div>').join("") +
      '</div></div><div class="report-remarks"><h3 class="report-section-title">TEACHER & PRINCIPAL REMARKS</h3><p><b>'+escapeHTML(note?.class_teacher_name||"Class Teacher")+'</b><br>'+escapeHTML(note?.class_teacher_comment||"No class teacher remark recorded.")+'</p><p><b>'+escapeHTML(note?.principal_name||"Principal")+'</b><br>'+escapeHTML(note?.principal_comment||"No principal remark recorded.")+'</p></div></section>' +
      '<footer class="report-footer"><div><b>Closing date:</b> '+escapeHTML(note?.closing_date||"Not set")+'<br><b>Reopening date:</b> '+escapeHTML(note?.reopening_date||"Not set")+'</div><div class="report-signature">Class teacher signature: ____________________<br>Principal signature: ____________________</div></footer></article>';
  };
  document.getElementById("reportTerm").addEventListener("change",draw);
  document.getElementById("reportYear").addEventListener("change",draw);
  document.getElementById("reportStudent")?.addEventListener("change",draw);
  draw();
}

let activeLessonSession = null;
let lessonCountdownInterval = null;
let lessonBeforeUnloadHandler = null;

async function finishLessonSession() {
  if (!activeLessonSession) return;
  const { data, error } = await sb.rpc("complete_lesson_session", { p_session: activeLessonSession.id });
  if (error) {
    if (String(error.message||"").includes("duration has not expired")) return;
    console.error("Lesson completion:", error);
    return;
  }
  activeLessonSession = null;
  clearInterval(lessonCountdownInterval);
  lessonCountdownInterval = null;
  if (lessonBeforeUnloadHandler) window.removeEventListener("beforeunload", lessonBeforeUnloadHandler);
  lessonBeforeUnloadHandler = null;
  const overlay = document.getElementById("lessonSessionOverlay");
  if (overlay) overlay.remove();
  alert("Lesson completed. Your completion has been recorded.");
}

async function openTimedLesson(lesson) {
  if (currentUser.role !== "student") return;
  const { data: session, error } = await sb.rpc("start_lesson_session", { p_lesson: lesson.id });
  if (error) { alert("Could not start lesson: " + error.message); return; }
  activeLessonSession = { id: session.id, joinedAt: session.joined_at, durationMinutes: lesson.durationMinutes };
  const overlay = document.createElement("div");
  overlay.id = "lessonSessionOverlay";
  overlay.className = "lesson-session-overlay";
  overlay.innerHTML = `
    <section class="lesson-session-panel" role="dialog" aria-modal="true" aria-labelledby="lessonSessionTitle">
      <span class="learning-tag">Timed learning session</span>
      <h2 id="lessonSessionTitle">${escapeHTML(lesson.title)}</h2>
      <p>This lesson remains active until the teacher-set duration expires. Leaving or refreshing will not reset the timer.</p>
      <div class="lesson-session-clock" id="lessonSessionClock" aria-live="polite">Loading timer…</div>
      ${lesson.videoUrl ? `<a class="lesson-session-video" href="${escapeHTML(lesson.videoUrl)}" target="_blank" rel="noopener noreferrer">Open lesson video in a new tab</a>` : "<p>Follow the lesson material provided by your teacher.</p>"}
      <p class="lesson-session-note">Keep this lesson open. Completion is confirmed by the school server when the full duration has elapsed.</p>
    </section>`;
  document.body.appendChild(overlay);
  lessonBeforeUnloadHandler = event => { event.preventDefault(); event.returnValue = ""; };
  window.addEventListener("beforeunload", lessonBeforeUnloadHandler);
  const tick = async () => {
    const endsAt = new Date(session.joined_at).getTime() + lesson.durationMinutes * 60000;
    const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
    const clock = document.getElementById("lessonSessionClock");
    if (clock) clock.textContent = remaining > 0
      ? Math.floor(remaining/60).toString().padStart(2,"0") + ":" + (remaining%60).toString().padStart(2,"0")
      : "00:00";
    if (remaining <= 0) await finishLessonSession();
  };
  await tick();
  lessonCountdownInterval = setInterval(tick, 1000);
}

function renderLessonsPage() {
  if(!hasPermission("lessons")) return showAccessDenied();
  contentPage.innerHTML=`<div class="page-header"><div><h2>Lessons & Learning Centre</h2><p>Class lessons, notes and revision resources.</p></div></div>
  <div class="panel"><h3>My class lessons</h3><div class="learning-grid">${lessons.map(l=>`<article class="learning-card"><span class="learning-tag">${escapeHTML(l.subject)}</span><h3>${escapeHTML(l.title)}</h3><p><b>Class:</b> ${escapeHTML(l.className)}</p><p><b>Schedule:</b> ${l.scheduledAt?escapeHTML(new Date(l.scheduledAt).toLocaleString()):"Not scheduled"}</p><p><b>Required duration:</b> ${escapeHTML(l.durationMinutes)} minutes</p>${currentUser.role==="student"?`<button type="button" class="primary-button" data-start-lesson="${escapeHTML(l.id)}">Start lesson</button>`:l.videoUrl?`<a href="${escapeHTML(l.videoUrl)}" target="_blank" rel="noopener noreferrer">Open lesson video</a>`:"No video attached"}</article>`).join("")||"<p>No lessons available yet.</p>"}</div></div>
  <div class="panel"><h3>Notes & revision materials</h3><div class="learning-grid">${revisionMaterials.map(m=>`<article class="learning-card"><span class="learning-tag">${escapeHTML(m.subject)}</span><h3>${escapeHTML(m.title)}</h3><p><b>Class:</b> ${escapeHTML(m.className)}</p>${m.content?`<p>${escapeHTML(m.content)}</p>`:""}${m.fileUrl?`<a href="${escapeHTML(m.fileUrl)}" target="_blank" rel="noopener noreferrer">Open / download resource</a>`:""}</article>`).join("")||"<p>No revision materials available yet.</p>"}</div></div>`;
  contentPage.querySelectorAll("[data-start-lesson]").forEach(button=>button.addEventListener("click",()=>{
    const lesson=lessons.find(item=>item.id===button.dataset.startLesson);
    if(lesson) openTimedLesson(lesson);
  }));
}
function renderContestsPage() {
  if(!hasPermission("contests")) return showAccessDenied();
  contentPage.innerHTML=`<div class="page-header"><div><h2>Academic Competitions & Challenges</h2><p>Subject challenges and school-wide academic competitions.</p></div></div><div class="learning-grid">${competitions.map(c=>`<article class="learning-card"><span class="learning-tag">${escapeHTML(c.subject)}</span><h3>🏆 ${escapeHTML(c.title)}</h3><p><b>Class:</b> ${escapeHTML(c.className)}</p><p><b>Starts:</b> ${c.startsAt?escapeHTML(new Date(c.startsAt).toLocaleString()):"To be announced"}</p><p><b>Duration:</b> ${c.duration} minutes</p><span class="status-pill ${c.published?"status-live":"status-draft"}">${c.published?"Published":"Coming soon"}</span></article>`).join("")||'<div class="panel"><h3>No competitions yet</h3><p>New challenges will appear here when published.</p></div>'}</div>`;
}


/* =========================================================
   SECURE EXAMINATIONS
   ========================================================= */
let activeExamAttempt=null, activeExamAnswers={}, examTimerInterval=null, examSaveTimer=null, examSubmitting=false;
let examVisibilityHandler=null, examPagehideHandler=null, examBeforeUnloadHandler=null;
function examTimeLabel(v){return v?new Date(v).toLocaleString("en-KE",{dateStyle:"medium",timeStyle:"short"}):"Not scheduled";}
function stopExamGuards(){
 if(examTimerInterval)clearInterval(examTimerInterval);
 if(examSaveTimer)clearTimeout(examSaveTimer);
 examTimerInterval=examSaveTimer=null;
 if(examVisibilityHandler)document.removeEventListener("visibilitychange",examVisibilityHandler);
 if(examPagehideHandler)window.removeEventListener("pagehide",examPagehideHandler);
 if(examBeforeUnloadHandler)window.removeEventListener("beforeunload",examBeforeUnloadHandler);
 examVisibilityHandler=examPagehideHandler=examBeforeUnloadHandler=null;
}
function closeExamWorkspace(message){
 stopExamGuards(); activeExamAttempt=null; examSubmitting=false;
 document.getElementById("secureExamOverlay")?.remove();
 window.SmartschoolAssistant?.show();
 if(message)alert(message);
}
async function submitActiveExam(reason){
 if(!activeExamAttempt||examSubmitting)return;
 examSubmitting=true;
 const status=document.getElementById("secureExamStatus");
 if(status)status.textContent="Submitting your answers securely…";
 const {data,error}=await sb.rpc("submit_attempt",{p_attempt:activeExamAttempt.id,p_answers:activeExamAnswers,p_reason:reason||"manual"});
 if(error){
  examSubmitting=false;
  if(status)status.textContent="Submission is not yet confirmed. Keep this page open while Smartschool retries.";
  console.error("Exam submission failed:",error); return;
 }
 closeExamWorkspace(reason==="manual"?"Your examination has been submitted.":reason==="time_expired"?"Time is up. Your examination was submitted automatically.":"Leaving the examination tab or page submitted your answers automatically.");
 if(document.querySelector(".nav-item.active")?.dataset.page==="examinations")void renderExaminationsPage();
}
async function saveExamAnswers(){
 if(!activeExamAttempt||examSubmitting)return;
 const {error}=await sb.rpc("save_attempt_answers",{p_attempt:activeExamAttempt.id,p_answers:activeExamAnswers});
 const status=document.getElementById("secureExamStatus");
 if(status)status.textContent=error?"Connection issue: your latest answer has not yet been confirmed saved.":"All answers saved securely.";
 if(error)console.error("Exam autosave failed:",error);
}
function queueExamSave(){
 if(examSaveTimer)clearTimeout(examSaveTimer);
 const status=document.getElementById("secureExamStatus");if(status)status.textContent="Saving answer…";
 examSaveTimer=setTimeout(()=>void saveExamAnswers(),350);
}
async function openSecureExam(assessment,existingAttempt){
 if(currentUser?.role!=="student")return;
 let attempt=existingAttempt;
 if(!attempt){const result=await sb.rpc("start_attempt",{p_assessment:assessment.id});if(result.error){alert("This examination cannot be started: "+result.error.message);return;}attempt=result.data;}
 if(attempt.submitted_at){alert("This examination has already been submitted.");return;}
 activeExamAttempt={id:attempt.id,deadlineAt:attempt.deadline_at};activeExamAnswers={...(attempt.answers||{})};
 const loaded=await sb.rpc("get_attempt_questions",{p_attempt:attempt.id});
 if(loaded.error){activeExamAttempt=null;alert("Could not load examination questions: "+loaded.error.message);return;}
 if(!loaded.data?.length){await submitActiveExam("time_expired");return;}
 window.SmartschoolAssistant?.hide();
 const overlay=document.createElement("div");overlay.id="secureExamOverlay";overlay.className="secure-exam-overlay";
 overlay.innerHTML='<section class="secure-exam-panel" role="dialog" aria-modal="true"><header class="secure-exam-header"><div><span>OFFICIAL ASSESSMENT</span><h2>'+escapeHTML(assessment.title)+'</h2><small>'+escapeHTML(assessment.subjects?.name||"School examination")+' · '+escapeHTML(assessment.classes?.name||"")+'</small></div><div class="secure-exam-clock" id="secureExamClock">--:--</div></header><p class="secure-exam-rules">Your answers save automatically. Leaving this tab, switching apps, or navigating away submits the examination immediately. The school assistant is disabled during this attempt.</p><div id="secureExamQuestions" class="secure-exam-questions"></div><footer class="secure-exam-footer"><span id="secureExamStatus" aria-live="polite">Preparing secure examination…</span><button type="button" id="secureExamSubmit" class="primary-button">Submit examination</button></footer></section>';
 document.body.appendChild(overlay);
 const questionHost=overlay.querySelector("#secureExamQuestions");
 questionHost.innerHTML=loaded.data.map((q,index)=>{
  const options=Array.isArray(q.options)?q.options:[];
  const optionHtml=options.map((o,i)=>{
   const value=typeof o==="string"?o:String(o.value??o.label??o.text??(i+1));
   const label=typeof o==="string"?o:String(o.label??o.text??o.value??(i+1));
   return '<label class="secure-exam-option"><input type="radio" name="exam-'+q.id+'" value="'+escapeHTML(value)+'" '+(activeExamAnswers[q.id]===value?"checked":"")+'><span>'+escapeHTML(label)+'</span></label>';
  }).join("");
  return '<article class="secure-exam-question"><div><b>Question '+(index+1)+'</b><span>'+escapeHTML(q.marks)+' mark(s)</span></div><p>'+escapeHTML(q.prompt)+'</p><div class="secure-exam-options">'+(optionHtml||'<label>Answer<input type="text" data-exam-answer="'+q.id+'" value="'+escapeHTML(activeExamAnswers[q.id]||"")+'"></label>')+'</div></article>';
 }).join("");
 questionHost.querySelectorAll('input[type="radio"]').forEach(input=>input.addEventListener("change",()=>{
  const id=input.name.slice(5);activeExamAnswers[id]=input.value;queueExamSave();
 }));
 questionHost.querySelectorAll("[data-exam-answer]").forEach(input=>input.addEventListener("input",()=>{
  activeExamAnswers[input.dataset.examAnswer]=input.value;queueExamSave();
 }));
 overlay.querySelector("#secureExamSubmit").addEventListener("click",()=>{
  if(confirm("Submit your examination now? You will not be able to change your answers afterwards."))void submitActiveExam("manual");
 });
 const tick=()=>{
  if(!activeExamAttempt)return;
  const remaining=Math.max(0,Math.ceil((new Date(activeExamAttempt.deadlineAt).getTime()-Date.now())/1000));
  const clock=document.getElementById("secureExamClock");
  if(clock)clock.textContent=Math.floor(remaining/60).toString().padStart(2,"0")+":"+String(remaining%60).padStart(2,"0");
  if(remaining<=0)void submitActiveExam("time_expired");
 };
 examVisibilityHandler=()=>{if(document.visibilityState==="hidden"&&activeExamAttempt)void submitActiveExam("tab_hidden");};
 examPagehideHandler=()=>{if(activeExamAttempt&&!examSubmitting)void submitActiveExam("page_exit");};
 examBeforeUnloadHandler=event=>{if(!activeExamAttempt)return;void submitActiveExam("page_exit");event.preventDefault();event.returnValue="";};
 document.addEventListener("visibilitychange",examVisibilityHandler);
 window.addEventListener("pagehide",examPagehideHandler);
 window.addEventListener("beforeunload",examBeforeUnloadHandler);
 tick();examTimerInterval=setInterval(tick,1000);
 try{await document.documentElement.requestFullscreen?.();}catch(_){}
}
async function renderExaminationsPage(){
 if(!hasPermission("examinations"))return showAccessDenied();
 const isStaff=["admin","teacher","class_teacher"].includes(currentUser.role);
 contentPage.innerHTML='<div class="page-header"><div><h2>Examinations & Tests</h2><p>Timed assessments with automatic saving and submission.</p></div></div><div id="examWorkspace"><div class="panel">Loading examinations…</div></div>';
 const host=document.getElementById("examWorkspace");
 try{
  const result=await sb.from("assessments").select("id,title,kind,starts_at,duration_minutes,is_published,class_id,subject_id,classes(name),subjects(name)").in("kind",["exam","test","cat"]).order("starts_at",{ascending:true});
  if(result.error)throw result.error;
  const rows=result.data||[];let attempts=[];
  if(!isStaff&&rows.length){
   const ar=await sb.from("attempts").select("id,assessment_id,started_at,deadline_at,submitted_at,auto_submitted,answers,score").in("assessment_id",rows.map(r=>r.id));
   if(ar.error)throw ar.error;attempts=ar.data||[];
  }
  const cards=rows.filter(r=>isStaff||r.is_published).map(row=>{
   const attempt=attempts.find(a=>a.assessment_id===row.id),now=Date.now(),start=new Date(row.starts_at).getTime(),end=start+Number(row.duration_minutes)*60000;
   const state=attempt?.submitted_at?"Submitted":attempt?"In progress":now<start?"Scheduled":now>end?"Closed":"Available";
   return '<article class="learning-card"><span class="learning-tag">'+escapeHTML(row.subjects?.name||"Subject")+'</span><h3>'+escapeHTML(row.title)+'</h3><p><b>Class:</b> '+escapeHTML(row.classes?.name||"Class")+'</p><p><b>Starts:</b> '+escapeHTML(examTimeLabel(row.starts_at))+'</p><p><b>Duration:</b> '+escapeHTML(row.duration_minutes)+' minutes</p><span class="status-pill '+(["Available","In progress"].includes(state)?"status-live":"status-draft")+'">'+state+'</span>'+
    (!isStaff&&row.is_published&&!attempt&&state==="Available"?'<button type="button" class="primary-button" data-begin-exam="'+row.id+'">Start examination</button>':"")+
    (!isStaff&&attempt&&!attempt.submitted_at?'<button type="button" class="primary-button" data-resume-exam="'+row.id+'">Resume examination</button>':"")+
    (attempt?.submitted_at?'<p><b>Score:</b> '+escapeHTML(attempt.score??"Pending")+(attempt.auto_submitted?" · Automatically submitted":"")+'</p>':"")+'</article>';
  }).join("");
  let staffForm="";
  if(isStaff){
   const [classRows,subjectRows]=await Promise.all([sb.from("classes").select("id,name").order("name"),sb.from("subjects").select("id,name").order("name")]);
   if(classRows.error||subjectRows.error)throw classRows.error||subjectRows.error;
   staffForm='<form id="createSecureExam" class="panel entry-form exam-create-form"><h3>➕ Create an examination</h3><input name="title" maxlength="140" placeholder="Examination title" required><div class="smart-assignment-fields"><select name="class_id" required><option value="">Choose class</option>'+classRows.data.map(c=>'<option value="'+c.id+'">'+escapeHTML(c.name)+'</option>').join("")+'</select><select name="subject_id" required><option value="">Choose subject</option>'+subjectRows.data.map(s=>'<option value="'+s.id+'">'+escapeHTML(s.name)+'</option>').join("")+'</select><label>Start date and time<input type="datetime-local" name="starts_at" required></label><label>Duration in minutes<input type="number" name="duration_minutes" min="1" max="600" value="60" required></label></div><label>Questions (JSON array)<textarea name="questions" rows="8" required placeholder=\'[{"prompt":"What is 2 + 2?","options":["3","4","5"],"correct_answer":"4","marks":1}]\'></textarea></label><label class="exam-publish-choice"><input type="checkbox" name="is_published" checked> Publish when saved</label><button type="submit" class="primary-button">Create examination</button></form>';
  }
  host.innerHTML=staffForm+'<div class="learning-grid">'+(cards||'<div class="panel"><h3>No examinations available</h3><p>Published examinations will appear here.</p></div>')+'</div>';
  host.querySelectorAll("[data-begin-exam]").forEach(b=>b.addEventListener("click",()=>void openSecureExam(rows.find(r=>r.id===b.dataset.beginExam),null)));
  host.querySelectorAll("[data-resume-exam]").forEach(b=>b.addEventListener("click",()=>void openSecureExam(rows.find(r=>r.id===b.dataset.resumeExam),attempts.find(a=>a.assessment_id===b.dataset.resumeExam))));
  const form=host.querySelector("#createSecureExam");
  if(form)form.addEventListener("submit",async event=>{
   event.preventDefault();const button=form.querySelector("button[type=submit]");button.disabled=true;
   try{
    const v=Object.fromEntries(new FormData(form).entries()),questions=JSON.parse(v.questions);
    if(!Array.isArray(questions)||!questions.length)throw new Error("Add at least one question.");
    questions.forEach((q,i)=>{
     if(!q.prompt||!Array.isArray(q.options)||!q.options.length||!q.correct_answer)throw new Error("Question "+(i+1)+" needs a prompt, options and correct_answer.");
     const opts=q.options.map(o=>typeof o==="string"?o:String(o.value??o.label??o.text??""));
     if(!opts.includes(String(q.correct_answer)))throw new Error("Question "+(i+1)+" correct_answer must exactly match an option.");
    });
    const created=await sb.from("assessments").insert({class_id:v.class_id,subject_id:v.subject_id,kind:"exam",title:v.title.trim(),starts_at:new Date(v.starts_at).toISOString(),duration_minutes:Number(v.duration_minutes),is_published:form.elements.is_published.checked,created_by:currentUser.id}).select("id").single();
    if(created.error)throw created.error;
    const inserted=await sb.from("questions").insert(questions.map((q,i)=>({assessment_id:created.data.id,position:i+1,prompt:q.prompt,options:q.options,correct_answer:String(q.correct_answer),marks:Number(q.marks||1)})));
    if(inserted.error){await sb.from("assessments").delete().eq("id",created.data.id);throw inserted.error;}
    alert("Examination created successfully.");await renderExaminationsPage();
   }catch(error){alert(error.message||String(error));button.disabled=false;}
  });
 }catch(error){host.innerHTML='<div class="panel"><h3>Examinations could not load</h3><p>'+escapeHTML(error.message||String(error))+'</p></div>';}
}

/* =========================================================
   ASSIGNMENTS
   ========================================================= */

async function renderAssignmentsPage() {
  if (!hasPermission("assignments")) { showAccessDenied(); return; }

  const role = currentUser.role;
  const isStaff = role === "admin" || role === "teacher" || role === "class_teacher";
  contentPage.innerHTML = `
    <div class="page-header"><div><h2>Assignments & Homework</h2><p>Publish work, submit answers and track progress.</p></div></div>
    <div id="assignmentWorkspace"><div class="panel">Loading your assignments…</div></div>`;

  const workspace = document.getElementById("assignmentWorkspace");
  try {
    const [{ data: rows, error }, { data: classRows }, { data: subjectRows }] = await Promise.all([
      sb.from("assignments").select("id,title,instructions,due_at,class_id,subject_id,created_by,classes(name),subjects(name)").order("due_at",{ascending:true}),
      isStaff ? sb.from("classes").select("id,name").order("name") : Promise.resolve({data:[]}),
      isStaff ? sb.from("subjects").select("id,name").order("name") : Promise.resolve({data:[]})
    ]);
    if (error) throw error;

    let myStudentId = null;
    if (role === "student") {
      const {data: student, error: studentError} = await sb.from("students").select("id").eq("profile_id",currentUser.id).maybeSingle();
      if (studentError) throw studentError;
      myStudentId = student?.id || null;
    }

    const ids = (rows || []).map(x=>x.id);
    let submissions = [];
    if (ids.length) {
      const {data, error: subError} = await sb.from("assignment_submissions")
        .select("id,assignment_id,student_id,content,file_url,score,submitted_at,students(full_name,admission_no)")
        .in("assignment_id",ids);
      if (subError) throw subError;
      submissions = data || [];
    }

    const escape = value => escapeHTML(String(value ?? ""));
    const localDate = value => value ? new Date(value).toLocaleString("en-KE",{dateStyle:"medium",timeStyle:"short"}) : "No deadline";
    const cards = (rows || []).map(item => {
      const mine = submissions.find(s=>s.assignment_id===item.id && s.student_id===myStudentId);
      const related = submissions.filter(s=>s.assignment_id===item.id);
      const due = item.due_at ? new Date(item.due_at) : null;
      const overdue = due && due < new Date() && !mine?.submitted_at;
      return `
        <article class="panel smart-assignment-card">
          <div class="smart-assignment-top"><div><h3>📘 ${escape(item.title)}</h3><p>${escape(item.subjects?.name || "Subject")} · ${escape(item.classes?.name || "Class")}</p></div>
          <span class="smart-assignment-status ${overdue?"is-overdue":mine?.submitted_at?"is-submitted":"is-pending"}">${overdue?"Overdue":mine?.submitted_at?"Submitted":"Assigned"}</span></div>
          <p class="smart-assignment-instructions">${escape(item.instructions || "No extra instructions provided.")}</p>
          <p><strong>Due:</strong> ${escape(localDate(item.due_at))}</p>
          ${role==="student" ? `
            <div class="smart-assignment-submit">
              <label for="answer-${item.id}">Your answer</label>
              <textarea id="answer-${item.id}" rows="3" placeholder="Write your answer here…">${escape(mine?.content || "")}</textarea>
              <button type="button" data-submit-assignment="${item.id}" ${!myStudentId?"disabled":""}>${mine?.submitted_at?"Update submission":"Submit assignment"}</button>
              ${mine?.submitted_at?`<small>Submitted ${escape(localDate(mine.submitted_at))} · ${mine.score===null?"Awaiting marking":"Score: "+escape(mine.score)}</small>`:""}
            </div>` : ""}
          ${isStaff ? `
            <div class="smart-assignment-submissions"><strong>Submissions (${related.length})</strong>
              ${related.length ? related.map(s=>`
                <div class="smart-assignment-submission">
                  <span><b>${escape(s.students?.full_name || "Student")}</b><small>${escape(s.students?.admission_no || "")} · ${escape(localDate(s.submitted_at))}</small></span>
                  <span>${s.score===null?"Not marked":"Score: "+escape(s.score)}</span>
                  <button type="button" class="secondary-button" data-view-submission="${s.id}">Review</button>
                </div>`).join("") : "<p>No submissions yet.</p>"}
            </div>` : ""}
        </article>`;
    }).join("");

    workspace.innerHTML = `
      ${isStaff ? `
      <form id="createAssignmentForm" class="panel entry-form smart-assignment-create">
        <h3>➕ Publish a new assignment</h3>
        <input name="title" maxlength="140" placeholder="Assignment title" required>
        <textarea name="instructions" rows="3" maxlength="6000" placeholder="Instructions, questions and resources"></textarea>
        <div class="smart-assignment-fields">
          <select name="class_id" required><option value="">Choose class</option>${(classRows||[]).map(c=>`<option value="${c.id}">${escape(c.name)}</option>`).join("")}</select>
          <select name="subject_id" required><option value="">Choose subject</option>${(subjectRows||[]).map(s=>`<option value="${s.id}">${escape(s.name)}</option>`).join("")}</select>
          <label>Due date and time<input type="datetime-local" name="due_at" required></label>
        </div>
        <button type="submit">Publish assignment</button>
      </form>` : ""}
      <div class="smart-assignment-list">${cards || '<div class="panel">No assignments have been published for your account yet.</div>'}</div>`;

    const createForm = document.getElementById("createAssignmentForm");
    createForm?.addEventListener("submit", async event => {
      event.preventDefault();
      const button=createForm.querySelector('button[type="submit"]'); button.disabled=true;
      const data=Object.fromEntries(new FormData(createForm).entries());
      const {error:insertError}=await sb.from("assignments").insert({
        title:data.title.trim(), instructions:data.instructions.trim(), class_id:data.class_id,
        subject_id:data.subject_id, due_at:new Date(data.due_at).toISOString(), created_by:currentUser.id
      });
      if(insertError){alert("Could not publish assignment: "+insertError.message);button.disabled=false;return;}
      alert("Assignment published for the selected class."); await renderAssignmentsPage();
    });

    workspace.querySelectorAll("[data-submit-assignment]").forEach(button=>button.addEventListener("click",async()=>{
      const assignmentId=button.dataset.submitAssignment;
      const content=document.getElementById("answer-"+assignmentId)?.value.trim() || "";
      if(!content){alert("Write your answer before submitting.");return;}
      if(!myStudentId){alert("Your student profile is not linked. Ask the school administrator to check your account.");return;}
      button.disabled=true;
      const existing=submissions.find(s=>s.assignment_id===assignmentId && s.student_id===myStudentId);
      const payload={assignment_id:assignmentId,student_id:myStudentId,content,submitted_at:new Date().toISOString()};
      const result=existing
        ? await sb.from("assignment_submissions").update(payload).eq("id",existing.id)
        : await sb.from("assignment_submissions").insert(payload);
      if(result.error){alert("Submission failed: "+result.error.message);button.disabled=false;return;}
      alert("Your assignment has been submitted."); await renderAssignmentsPage();
    }));

    workspace.querySelectorAll("[data-view-submission]").forEach(button=>button.addEventListener("click",async()=>{
      const submission=submissions.find(s=>s.id===button.dataset.viewSubmission); if(!submission)return;
      const answer=prompt("Student answer:\n\n"+(submission.content||"No written answer."),submission.content||"");
      if(answer===null)return;
      const raw=prompt("Enter the mark/score for this submission (leave blank to save without changing the mark):",submission.score??"");
      if(raw===null)return;
      const update={content:answer};
      if(raw.trim()!==""){const score=Number(raw);if(!Number.isFinite(score)||score<0){alert("Enter a valid non-negative mark.");return;}update.score=score;}
      const {error:updateError}=await sb.from("assignment_submissions").update(update).eq("id",submission.id);
      if(updateError){alert("Could not save review: "+updateError.message);return;}
      alert("Submission review saved."); await renderAssignmentsPage();
    }));
  } catch (error) {
    console.error("Assignment centre:",error);
    workspace.innerHTML='<div class="panel"><h3>Assignments could not be loaded</h3><p>Please refresh and try again. If the problem continues, contact the school administrator.</p></div>';
  }
}


/* =========================================================
   ANNOUNCEMENTS
   ========================================================= */

function announcementAudienceLabel(audience) {
  const roles=audience||[];
  if(["admin","teacher","class_teacher","parent","student"].every(r=>roles.includes(r))) return "Everyone";
  if(roles.includes("student")&&roles.includes("parent")&&roles.length===2)return "Students & parents";
  if(roles.length===1&&roles[0]==="student")return "Students";
  if(roles.length===1&&roles[0]==="parent")return "Parents";
  if(roles.includes("teacher")||roles.includes("class_teacher"))return "Teachers / staff";
  return roles.map(r=>r.replace("_"," ")).join(", ")||"School community";
}
async function shareAnnouncement(id) {
  const item=announcements.find(a=>a.id===id); if(!item)return alert("Announcement not found. Refresh and try again.");
  const text=item.title+"\\n\\n"+item.message+"\\n\\nKirimunge Senior School";
  try {
    if(navigator.share) await navigator.share({title:item.title,text,url:window.location.href});
    else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text+"\\n"+window.location.href);alert("Announcement copied. Paste it into WhatsApp or another app to share.");}
    else window.prompt("Copy this announcement to share:",text+"\\n"+window.location.href);
  } catch(err){if(err.name!=="AbortError")alert("Sharing was not completed. Please copy the announcement text manually.");}
}
window.shareAnnouncement=shareAnnouncement;
function renderAnnouncementsPage() {
  if(!hasPermission("announcements"))return showAccessDenied();
  const staff=currentUser&&["admin","teacher"].includes(currentUser.role);
  contentPage.innerHTML=`
    <div class="page-header"><div><h2>School Announcements</h2><p>Official notices and updates from Kirimunge Senior School.</p></div></div>
    <div class="announcement-feed">
    ${announcements.map(a=>`<article class="panel announcement-card"><div class="announcement-card-heading"><div><h3>📢 ${escapeHTML(a.title)}</h3><small>${escapeHTML(a.author)} · ${escapeHTML(a.date)} · For: ${escapeHTML(announcementAudienceLabel(a.audience))}</small></div></div><p class="announcement-message">${escapeHTML(a.message)}</p><div class="announcement-actions"><button type="button" onclick="shareAnnouncement('${escapeHTML(a.id)}')">↗ Share</button>${staff&&(currentUser.role==="admin"||a.createdBy===currentUser.id)?`<button type="button" data-edit-announcement="${escapeHTML(a.id)}">Edit</button><button type="button" class="danger-button" data-delete-announcement="${escapeHTML(a.id)}">Delete</button>`:""}</div></article>`).join("")||'<div class="panel"><h3>No announcements yet</h3><p>New school announcements will appear here.</p></div>'}
    </div>`;
  contentPage.querySelectorAll("[data-edit-announcement]").forEach(button=>button.addEventListener("click",async()=>{
    const item=announcements.find(a=>a.id===button.dataset.editAnnouncement);if(!item)return;
    const title=prompt("Edit announcement title:",item.title);if(title===null)return;
    const message=prompt("Edit announcement message:",item.message);if(message===null)return;
    if(!title.trim()||!message.trim())return alert("Title and message cannot be empty.");
    button.disabled=true;const {error}=await sb.from("announcements").update({title:title.trim(),body:message.trim()}).eq("id",item.id);
    if(error){alert("Could not update announcement: "+error.message);button.disabled=false;return;}
    await loadSchoolData(currentUser.role);showPage("announcements");alert("Announcement updated.");
  }));
  contentPage.querySelectorAll("[data-delete-announcement]").forEach(button=>button.addEventListener("click",async()=>{
    const item=announcements.find(a=>a.id===button.dataset.deleteAnnouncement);if(!item)return;
    if(!confirm("Delete this announcement? This cannot be undone."))return;
    button.disabled=true;const {error}=await sb.from("announcements").delete().eq("id",item.id);
    if(error){alert("Could not delete announcement: "+error.message);button.disabled=false;return;}
    await loadSchoolData(currentUser.role);showPage("announcements");alert("Announcement deleted.");
  }));
}

function renderFeesPage(searchTerm = "") {

  if (!hasPermission("fees")) {

    showAccessDenied();

    return;

  }


  const search =
    searchTerm.toLowerCase().trim();


  const filteredFees =
    fees.filter(record =>

      record.student
        .toLowerCase()
        .includes(search) ||

      record.admission
        .toLowerCase()
        .includes(search) ||

      record.className
        .toLowerCase()
        .includes(search)

    );


  const totalExpected =
    fees.reduce(
      (sum, record) =>
        sum + record.total,
      0
    );


  const totalCollected =
    fees.reduce(
      (sum, record) =>
        sum + record.paid,
      0
    );


  const outstanding =
    totalExpected - totalCollected;


  contentPage.innerHTML = `

    <div class="page-header">

      <div>
        <h2>Fees Management</h2>
        <p>Manage school fees and payments.</p>
      </div>

    </div>


    <div class="stats-grid">

      <div class="stat-card">
        <div class="stat-icon">💵</div>

        <div>
          <span>Total Expected</span>
          <strong>${money(totalExpected)}</strong>
        </div>
      </div>


      <div class="stat-card">
        <div class="stat-icon">💳</div>

        <div>
          <span>Total Collected</span>
          <strong>${money(totalCollected)}</strong>
        </div>
      </div>


      <div class="stat-card">
        <div class="stat-icon">⚠️</div>

        <div>
          <span>Outstanding</span>
          <strong>${money(outstanding)}</strong>
        </div>
      </div>

    </div>


    <div class="panel">

      <h3>Student Fees</h3>

      <input
        type="search"
        placeholder="Search student..."
        value="${escapeHTML(searchTerm)}"
        oninput="renderFeesPage(this.value)"
        style="
          width:100%;
          padding:12px;
          margin:20px 0;
          border:1px solid #e5e7eb;
          border-radius:8px;
        "
      >


      <div class="table-wrapper">

        <table>

          <thead>

            <tr>
              <th>Admission</th>
              <th>Student</th>
              <th>Class</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>

          </thead>


          <tbody>

            ${filteredFees.map(record => `

              <tr>

                <td>
                  ${escapeHTML(record.admission)}
                </td>

                <td>
                  ${escapeHTML(record.student)}
                </td>

                <td>
                  ${escapeHTML(record.className)}
                </td>

                <td>
                  ${money(record.total)}
                </td>

                <td>
                  ${money(record.paid)}
                </td>

                <td>
                  ${money(getFeeBalance(record))}
                </td>

                <td>
                  ${escapeHTML(getFeeStatus(record))}
                </td>

              </tr>

            `).join("")}

          </tbody>

        </table>

      </div>

    </div>
  `;

  const invoicePanel = document.createElement("div");
  invoicePanel.className = "panel";
  invoicePanel.innerHTML = "<h3>Fee invoices</h3>" + (feeInvoices.length ? feeInvoices.map(inv => {
    const paid = feePayments.filter(p => p.invoiceId === inv.id).reduce((n,p)=>n+p.amount,0);
    const balance = Math.max(0, Number(inv.amount)-paid);
    const overdue = balance>0 && inv.due_date && inv.due_date < new Date().toISOString().slice(0,10);
    return "<p><strong>"+escapeHTML(inv.invoice_no)+"</strong> · "+escapeHTML(inv.term)+" "+escapeHTML(inv.academic_year)+" · "+money(inv.amount)+" · Balance "+money(balance)+" · Due "+escapeHTML(inv.due_date||"-")+" · "+(overdue?"OVERDUE":balance===0?"PAID":"PENDING")+(currentUser.role==="admin"&&balance>0?" <button data-reminder=\""+escapeHTML(inv.id)+"\">Share reminder</button>":"")+"</p>";
  }).join("") : "<p>No invoices issued yet.</p>");
  contentPage.appendChild(invoicePanel);
  invoicePanel.querySelectorAll("[data-reminder]").forEach(button => button.addEventListener("click", () => shareFeeReminder(button.dataset.reminder)));

  const paymentPanel = document.createElement("div");
  paymentPanel.className = "panel";
  paymentPanel.innerHTML = "<h3>Payment receipts</h3>" + (feePayments.length ? feePayments.map(p => "<p>"+escapeHTML(p.receiptNo)+" · "+escapeHTML(p.date)+" · "+money(p.amount)+" · "+escapeHTML(p.method||"-")+" <button type='button' onclick=\"printFeeReceipt('"+escapeHTML(p.id)+"')\">Print receipt</button></p>").join("") : "<p>No payments recorded yet.</p>");
  contentPage.appendChild(paymentPanel);

}



function shareFeeReminder(invoiceId) {
  const invoice=feeInvoices.find(x=>x.id===invoiceId); if(!invoice)return;
  const student=invoice.students||{};
  const paid=feePayments.filter(p=>p.invoiceId===invoice.id).reduce((n,p)=>n+p.amount,0);
  const balance=Math.max(0,invoice.amount-paid);
  const message=["Kirimunge Senior School fee reminder","Student: "+(student.full_name||"Student"),"Admission: "+(student.admission_no||""),"Invoice: "+invoice.invoice_no,"Term: "+invoice.term+" "+invoice.academic_year,"Outstanding: "+money(balance),"Due date: "+(invoice.due_date||"Please contact the school office"),"Please contact the school office if you have already paid. Thank you."].join("\n");
  window.open("https://wa.me/?text="+encodeURIComponent(message),"_blank");
}

function printFeeReceipt(paymentId) {
  const p = feePayments.find(x => x.id === paymentId);
  if (!p) { alert("Receipt not found."); return; }
  const w = window.open("", "_blank", "width=700,height=800");
  if (!w) { alert("Allow pop-ups to print the receipt."); return; }
  w.document.write("<html><head><title>"+escapeHTML(p.receiptNo)+"</title><style>body{font-family:Arial;padding:30px}h1{text-align:center}table{width:100%;border-collapse:collapse}td{padding:12px;border-bottom:1px solid #ddd}</style></head><body><h1>Kirimunge Senior School</h1><h2>OFFICIAL FEE RECEIPT</h2><p>Receipt: "+escapeHTML(p.receiptNo)+"</p><table><tr><td>Student</td><td>"+escapeHTML(p.student)+"</td></tr><tr><td>Admission</td><td>"+escapeHTML(p.admission)+"</td></tr><tr><td>Date</td><td>"+escapeHTML(p.date)+"</td></tr><tr><td>Amount</td><td>"+money(p.amount)+"</td></tr><tr><td>Method</td><td>"+escapeHTML(p.method||"-")+"</td></tr><tr><td>Reference</td><td>"+escapeHTML(p.reference||"-")+"</td></tr></table><script>window.onload=()=>window.print()<\\/script></body></html>");
  w.document.close();
}

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function renderNotificationsPage() {

  if (!hasPermission("notifications")) {

    showAccessDenied();

    return;

  }


  let visibleNotifications =
    notifications;


  if (currentUser.role !== "admin") {

    visibleNotifications =
      notifications.filter(
        notification => {

          return (
            notification.audience === "All" ||
            notification.audience.toLowerCase() ===
            roleName(currentUser.role).toLowerCase() + "s"
          );

        }
      );

  }


  contentPage.innerHTML = `

    <div class="page-header">

      <div>
        <h2>Notifications</h2>
        <p>Your school notifications.</p>
      </div>

    </div>


    ${
      visibleNotifications.length === 0

      ? `

        <div class="panel">

          <h3>No notifications</h3>

          <p>
            You currently have no notifications.
          </p>

        </div>

      `

      :

      visibleNotifications.map(notification => `

        <div
          class="panel"
          style="
            margin-bottom:15px;
            border-left:4px solid
            ${notification.read ? "#d1d5db" : "#2563eb"};
          "
        >

          <h3>
            🔔 ${escapeHTML(notification.title)}
          </h3>

          <p>
            ${escapeHTML(notification.message)}
          </p>

          <small>
            ${escapeHTML(notification.date)}
          </small>

        </div>

      `).join("")

    }

  `;
}


/* =========================================================
   ACCESS DENIED PAGE
   ========================================================= */

function showAccessDenied() {

  contentPage.innerHTML = `

    <div class="panel">

      <div style="
        text-align:center;
        padding:50px 20px;
      ">

        <div style="font-size:60px;">
          🔒
        </div>

        <h2>
          Access Restricted
        </h2>

        <p>
          Your account does not have permission
          to access this section.
        </p>

        <button
          class="primary-button"
          onclick="showPage('dashboard')"
        >
          Return to Dashboard
        </button>

      </div>

    </div>

  `;

}


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

quickActions.forEach(action => {

  action.addEventListener(
    "click",
    function() {

      const page =
        action.dataset.action;

      if (!hasPermission(page)) {

        alert("Access denied.");

        return;

      }

      showPage(page);

    }
  );

});


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeApp() {

  loginPage.classList.remove("hidden");

  appPage.classList.add("hidden");

  dashboardPage.classList.remove("hidden");

  contentPage.classList.add("hidden");


  /*
    Make sure all navigation starts visible
    before a user logs in.
  */

  navigationItems.forEach(item => {
    item.style.display = "";
  });


  quickActions.forEach(action => {
    action.style.display = "";
  });

}


initializeApp();
