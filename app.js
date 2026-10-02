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

let students = [
  {
    admission: "KS001",
    name: "Brian Mwangi",
    className: "Form 4A",
    gender: "Male"
  },
  {
    admission: "KS002",
    name: "Faith Wanjiku",
    className: "Form 3B",
    gender: "Female"
  },
  {
    admission: "KS003",
    name: "Kevin Kamau",
    className: "Form 2A",
    gender: "Male"
  },
  {
    admission: "KS004",
    name: "Sharon Njeri",
    className: "Form 1A",
    gender: "Female"
  },
  {
    admission: "KS005",
    name: "Daniel Kariuki",
    className: "Form 4A",
    gender: "Male"
  }
];


let teachers = [
  {
    id: "T001",
    name: "Peter Kamau",
    subject: "Mathematics"
  },
  {
    id: "T002",
    name: "Mary Wanjiku",
    subject: "English"
  },
  {
    id: "T003",
    name: "James Kariuki",
    subject: "Biology"
  },
  {
    id: "T004",
    name: "Jane Njeri",
    subject: "Chemistry"
  }
];


let classes = [
  "Form 1A",
  "Form 1B",
  "Form 2A",
  "Form 3B",
  "Form 4A"
];


let attendanceRecords = [];


let results = [
  {
    admission: "KS001",
    student: "Brian Mwangi",
    subject: "Mathematics",
    marks: 82,
    grade: "A"
  },
  {
    admission: "KS002",
    student: "Faith Wanjiku",
    subject: "English",
    marks: 74,
    grade: "B+"
  },
  {
    admission: "KS003",
    student: "Kevin Kamau",
    subject: "Biology",
    marks: 68,
    grade: "B"
  }
];


let assignments = [
  {
    title: "Algebra Exercise",
    subject: "Mathematics",
    className: "Form 4A",
    dueDate: "2026-10-10"
  },
  {
    title: "Essay Writing",
    subject: "English",
    className: "Form 3B",
    dueDate: "2026-10-12"
  }
];


let announcements = [
  {
    title: "Welcome Back",
    message: "Welcome to the new school term.",
    author: "School Administration",
    date: "2026-10-01"
  },
  {
    title: "Examination Schedule",
    message: "The examination timetable will be released soon.",
    author: "Academic Department",
    date: "2026-10-02"
  }
];


let fees = [
  {
    admission: "KS001",
    student: "Brian Mwangi",
    className: "Form 4A",
    total: 45000,
    paid: 30000
  },
  {
    admission: "KS002",
    student: "Faith Wanjiku",
    className: "Form 3B",
    total: 45000,
    paid: 45000
  },
  {
    admission: "KS003",
    student: "Kevin Kamau",
    className: "Form 2A",
    total: 42000,
    paid: 25000
  },
  {
    admission: "KS004",
    student: "Sharon Njeri",
    className: "Form 1A",
    total: 40000,
    paid: 18000
  },
  {
    admission: "KS005",
    student: "Daniel Kariuki",
    className: "Form 4A",
    total: 45000,
    paid: 40000
  }
];


let feePayments = [
  {
    id: "P001",
    admission: "KS001",
    student: "Brian Mwangi",
    amount: 30000,
    method: "M-Pesa",
    reference: "MPESA001",
    date: "2026-10-01"
  },
  {
    id: "P002",
    admission: "KS002",
    student: "Faith Wanjiku",
    amount: 45000,
    method: "Bank",
    reference: "BANK001",
    date: "2026-09-20"
  },
  {
    id: "P003",
    admission: "KS003",
    student: "Kevin Kamau",
    amount: 25000,
    method: "M-Pesa",
    reference: "MPESA002",
    date: "2026-09-28"
  }
];


let notifications = [
  {
    id: "N001",
    title: "Welcome to Kirimunge Senior School",
    message: "Your school management account is ready.",
    audience: "All",
    date: "2026-10-01",
    read: false
  },
  {
    id: "N002",
    title: "Examination Information",
    message: "Please check the examination announcements.",
    audience: "Students",
    date: "2026-10-02",
    read: false
  }
];


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

loginForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();

    const role = userRole.value;

    const username =
      usernameInput.value.trim();

    const password =
      passwordInput.value.trim();


    if (!role) {

      alert("Please select your role.");

      return;
    }


    if (!username || !password) {

      alert(
        "Please enter your username and password."
      );

      return;
    }


    currentUser = {
      username: username,
      role: role
    };


    profileName.textContent =
      username;

    profileRole.textContent =
      roleName(role);

    profileAvatar.textContent =
      username.charAt(0).toUpperCase();


    welcomeMessage.textContent =
      `Welcome, ${username}. You are logged in as a ${roleName(role)}.`;


    loginPage.classList.add("hidden");

    appPage.classList.remove("hidden");


    /*
       THIS MUST RUN AFTER LOGIN
    */

    applyRoleAccess();

    updateDashboard();

    showPage("dashboard");

  }
);


/* =========================================================
   LOGOUT
   ========================================================= */

logoutButton.addEventListener(
  "click",
  function() {

    currentUser = null;

    appPage.classList.add("hidden");

    loginPage.classList.remove("hidden");

    loginForm.reset();

    /*
       Restore sidebar for the next login.
    */

    navigationItems.forEach(item => {
      item.style.display = "";
      item.removeAttribute("aria-hidden");
    });


    quickActions.forEach(action => {
      action.style.display = "";
    });


    dashboardPage.classList.remove("hidden");

    contentPage.classList.add("hidden");

  }
);


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


function setAttendance(admission, status) {

  if (!hasPermission("attendance")) {

    alert("Access denied.");

    return;

  }


  if (!status) {
    return;
  }


  const student =
    students.find(
      item =>
        item.admission === admission
    );


  if (!student) {
    return;
  }


  attendanceRecords.push({

    admission: admission,

    student: student.name,

    status: status,

    date:
      new Date()
        .toISOString()
        .split("T")[0]

  });


  alert(
    `Attendance marked as ${status}.`
  );

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
