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

  const [stu, cls, res, asg, ann, bal, pay, att, tch] = await Promise.all([
    sb.from("students").select("id, admission_no, full_name, class_id, classes(name)"),
    sb.from("classes").select("name").order("name"),
    sb.from("results").select("score, students(admission_no, full_name), subjects(name)"),
    sb.from("assignments").select("title, due_at, classes(name), subjects(name)"),
    sb.from("announcements").select("title, body, created_at").order("created_at", { ascending: false }),
    sb.from("fee_balances").select("student_id, total_due, total_paid"),
    sb.from("fee_payments").select("amount, method, reference, paid_at, students(admission_no, full_name)").order("paid_at", { ascending: false }),
    sb.from("student_attendance").select("status, attendance_date, students(admission_no, full_name)").order("attendance_date", { ascending: false }),
    staff
      ? sb.from("profiles").select("id, full_name, role").in("role", ["teacher", "class_teacher"])
      : Promise.resolve({ data: [] })
  ]);

  const failed = [stu, cls, res, asg, ann, bal, pay, att, tch].find(r => r.error);
  if (failed) {
    throw new Error(failed.error.message);
  }

  students = stu.data.map(s => ({
    id: s.id,
    classId: s.class_id,
    admission: s.admission_no,
    name: s.full_name,
    className: s.classes ? s.classes.name : "Unassigned",
    gender: "-"
  }));

  classes = cls.data.map(c => c.name);

  results = res.data.map(r => ({
    admission: r.students.admission_no,
    student: r.students.full_name,
    subject: r.subjects.name,
    marks: Number(r.score),
    grade: letterGrade(Number(r.score))
  }));

  assignments = asg.data.map(x => ({
    title: x.title,
    subject: x.subjects ? x.subjects.name : "",
    className: x.classes ? x.classes.name : "",
    dueDate: x.due_at ? x.due_at.split("T")[0] : ""
  }));

  announcements = ann.data.map(x => ({
    title: x.title,
    message: x.body,
    author: "School Administration",
    date: x.created_at.split("T")[0]
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

  feePayments = pay.data.map((p, i) => ({
    id: "P" + String(i + 1).padStart(3, "0"),
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
    description: "Academic results."
  },

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


let attendanceRecords = [];


let results = [];


let assignments = [];


let announcements = [];


let fees = [];


let feePayments = [];


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

  if (!hasPermission("results")) {

    showAccessDenied();

    return;

  }


  contentPage.innerHTML = `

    <div class="page-header">

      <div>
        <h2>Results</h2>
        <p>Academic performance records.</p>
      </div>

    </div>

    <div class="panel">

      <div class="table-wrapper">

        <table>

          <thead>

            <tr>
              <th>Admission</th>
              <th>Student</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
            </tr>

          </thead>

          <tbody>

            ${results.map(result => `

              <tr>

                <td>${escapeHTML(result.admission)}</td>

                <td>${escapeHTML(result.student)}</td>

                <td>${escapeHTML(result.subject)}</td>

                <td>${result.marks}</td>

                <td>${escapeHTML(result.grade)}</td>

              </tr>

            `).join("")}

          </tbody>

        </table>

      </div>

    </div>
  `;
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

function renderAnnouncementsPage() {

  if (!hasPermission("announcements")) {

    showAccessDenied();

    return;

  }


  contentPage.innerHTML = `

    <div class="page-header">

      <div>
        <h2>Announcements</h2>
        <p>Important school announcements.</p>
      </div>

    </div>

    ${announcements.map(announcement => `

      <div class="panel">

        <h3>
          📢 ${escapeHTML(announcement.title)}
        </h3>

        <p>
          ${escapeHTML(announcement.message)}
        </p>

        <small>
          ${escapeHTML(announcement.author)}
          ·
          ${escapeHTML(announcement.date)}
        </small>

      </div>

    `).join("")}
  `;
}


/* =========================================================
   FEES
   ========================================================= */

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
