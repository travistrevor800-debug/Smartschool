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
    sb.from("student_attendance").select("status, attendance_date, students(admission_no, full_name)").order("attendance_date", { ascending: false }),
    staff ? sb.from("profiles").select("id, full_name, role").in("role", ["teacher", "class_teacher"]) : Promise.resolve({ data: [] }),
    sb.from("lessons").select("id, title, video_url, scheduled_at, classes(name), subjects(name)").order("scheduled_at"),
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
  lessons = (les.data || []).map(r => ({id:r.id,title:r.title,videoUrl:r.video_url||"",scheduledAt:r.scheduled_at||"",className:r.classes?.name||"Class",subject:r.subjects?.name||"Subject"}));
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
    date: r.attendance_date
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

["student", "teacher", "admin"].forEach(role => rolePermissions[role].push("lessons", "contests"));

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

function updateLoginIdentityField() {
  const isStudent = userRole.value === "student";
  usernameInput.type = isStudent ? "text" : "email";
  usernameInput.placeholder = isStudent
    ? "Enter your admission number"
    : "Enter your email address";
  const label = document.querySelector('label[for="username"]');
  if (label) label.textContent = isStudent ? "Admission number" : "Email address";
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
    <h2>Secure your student account</h2>
    <p>Your admission number was used as your temporary password. Create a new password before entering Smartschool.</p>
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

    case "assignments":
      renderAssignmentsPage();
      break;

    case "announcements":
      renderAnnouncementsPage();
      break;

    case "fees":
      renderFeesPage();
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

function renderStudentsPage() {

  if (!hasPermission("students")) {

    showAccessDenied();

    return;

  }


  contentPage.innerHTML = `

    <div class="page-header">

      <div>
        <h2>Students</h2>
        <p>Manage student records.</p>
      </div>

    </div>

    <div class="panel">

      <div class="table-wrapper">

        <table>

          <thead>

            <tr>
              <th>Admission</th>
              <th>Name</th>
              <th>Class</th>
              <th>Gender</th>
            </tr>

          </thead>

          <tbody>

            ${students.map(student => `

              <tr>

                <td>${escapeHTML(student.admission)}</td>

                <td>${escapeHTML(student.name)}</td>

                <td>${escapeHTML(student.className)}</td>

                <td>${escapeHTML(student.gender)}</td>

              </tr>

            `).join("")}

          </tbody>

        </table>

      </div>

    </div>
  `;
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

  if (!hasPermission("attendance")) {

    showAccessDenied();

    return;

  }


  contentPage.innerHTML = `

    <div class="page-header">

      <div>
        <h2>Attendance</h2>
        <p>Track student attendance.</p>
      </div>

    </div>

    <div class="panel">

      <div class="table-wrapper">

        <table>

          <thead>

            <tr>
              <th>Admission</th>
              <th>Student</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            ${students.map(student => `

              <tr>

                <td>
                  ${escapeHTML(student.admission)}
                </td>

                <td>
                  ${escapeHTML(student.name)}
                </td>

                <td>

                  <select
                    onchange="setAttendance('${student.admission}', this.value)"
                  >

                    <option value="">
                      Select
                    </option>

                    <option value="Present">
                      Present
                    </option>

                    <option value="Absent">
                      Absent
                    </option>

                    <option value="Late">
                      Late
                    </option>

                  </select>

                </td>

              </tr>

            `).join("")}

          </tbody>

        </table>

      </div>

    </div>
  `;
}


async function setAttendance(admission, status) {

  if (!hasPermission("attendance")) {
    alert("Access denied.");
    return;
  }

  if (!status) {
    return;
  }

  const student = students.find(item => item.admission === admission);

  if (!student) {
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const { error } = await sb.from("student_attendance").upsert(
    {
      student_id: student.id,
      class_id: student.classId,
      attendance_date: today,
      status: status.toLowerCase(),
      marked_by: currentUser.id
    },
    { onConflict: "student_id,attendance_date" }
  );

  if (error) {
    alert("Could not save attendance: " + error.message);
    return;
  }

  attendanceRecords = attendanceRecords.filter(
    r => !(r.admission === admission && r.date === today)
  );

  attendanceRecords.push({
    admission: admission,
    student: student.name,
    status: status,
    date: today
  });

  alert(`Attendance marked as ${status}.`);

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

function renderLessonsPage() {
  if(!hasPermission("lessons")) return showAccessDenied();
  contentPage.innerHTML=`<div class="page-header"><div><h2>Lessons & Learning Centre</h2><p>Class lessons, notes and revision resources.</p></div></div>
  <div class="panel"><h3>My class lessons</h3><div class="learning-grid">${lessons.map(l=>`<article class="learning-card"><span class="learning-tag">${escapeHTML(l.subject)}</span><h3>${escapeHTML(l.title)}</h3><p><b>Class:</b> ${escapeHTML(l.className)}</p><p><b>Schedule:</b> ${l.scheduledAt?escapeHTML(new Date(l.scheduledAt).toLocaleString()):"Not scheduled"}</p>${l.videoUrl?`<a href="${escapeHTML(l.videoUrl)}" target="_blank" rel="noopener noreferrer">Open lesson video</a>`:"No video attached"}</article>`).join("")||"<p>No lessons available yet.</p>"}</div></div>
  <div class="panel"><h3>Notes & revision materials</h3><div class="learning-grid">${revisionMaterials.map(m=>`<article class="learning-card"><span class="learning-tag">${escapeHTML(m.subject)}</span><h3>${escapeHTML(m.title)}</h3><p><b>Class:</b> ${escapeHTML(m.className)}</p>${m.content?`<p>${escapeHTML(m.content)}</p>`:""}${m.fileUrl?`<a href="${escapeHTML(m.fileUrl)}" target="_blank" rel="noopener noreferrer">Open / download resource</a>`:""}</article>`).join("")||"<p>No revision materials available yet.</p>"}</div></div>`;
}
function renderContestsPage() {
  if(!hasPermission("contests")) return showAccessDenied();
  contentPage.innerHTML=`<div class="page-header"><div><h2>Academic Competitions & Challenges</h2><p>Subject challenges and school-wide academic competitions.</p></div></div><div class="learning-grid">${competitions.map(c=>`<article class="learning-card"><span class="learning-tag">${escapeHTML(c.subject)}</span><h3>🏆 ${escapeHTML(c.title)}</h3><p><b>Class:</b> ${escapeHTML(c.className)}</p><p><b>Starts:</b> ${c.startsAt?escapeHTML(new Date(c.startsAt).toLocaleString()):"To be announced"}</p><p><b>Duration:</b> ${c.duration} minutes</p><span class="status-pill ${c.published?"status-live":"status-draft"}">${c.published?"Published":"Coming soon"}</span></article>`).join("")||'<div class="panel"><h3>No competitions yet</h3><p>New challenges will appear here when published.</p></div>'}</div>`;
}

/* =========================================================
   ASSIGNMENTS
   ========================================================= */

function renderAssignmentsPage() {

  if (!hasPermission("assignments")) {

    showAccessDenied();

    return;

  }


  contentPage.innerHTML = `

    <div class="page-header">

      <div>
        <h2>Assignments</h2>
        <p>School assignments and due dates.</p>
      </div>

    </div>

    <div class="dashboard-grid">

      ${assignments.map(assignment => `

        <div class="panel">

          <h3>
            📚 ${escapeHTML(assignment.title)}
          </h3>

          <p>
            <strong>Subject:</strong>
            ${escapeHTML(assignment.subject)}
          </p>

          <p>
            <strong>Class:</strong>
            ${escapeHTML(assignment.className)}
          </p>

          <p>
            <strong>Due:</strong>
            ${escapeHTML(assignment.dueDate)}
          </p>

        </div>

      `).join("")}

    </div>
  `;
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
