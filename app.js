/* =========================================================
   KIRIMUNGE SENIOR SCHOOL MANAGEMENT SYSTEM
   Frontend Application
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
const contentTitle = document.getElementById("contentTitle");
const contentDescription = document.getElementById("contentDescription");
const emptyTitle = document.getElementById("emptyTitle");
const emptyDescription = document.getElementById("emptyDescription");
const actionButton = document.getElementById("actionButton");
const navigationItems = document.querySelectorAll(".nav-item");
const quickActions = document.querySelectorAll(".quick-action");
const viewAllButton = document.querySelector(".text-button");
/* =========================================================
   SCHOOL DATA
   ========================================================= */
let students = [
  {
    admission: "KS001",
    name: "Brian Mwangi",
    gender: "Male",
    className: "Form 4A",
    parent: "John Mwangi",
    status: "Active"
  },
  {
    admission: "KS002",
    name: "Faith Wanjiku",
    gender: "Female",
    className: "Form 3B",
    parent: "Mary Wanjiku",
    status: "Active"
  },
  {
    admission: "KS003",
    name: "Kevin Kamau",
    gender: "Male",
    className: "Form 2A",
    parent: "Peter Kamau",
    status: "Active"
  },
  {
    admission: "KS004",
    name: "Sharon Njeri",
    gender: "Female",
    className: "Form 1C",
    parent: "Jane Njeri",
    status: "Active"
  },
  {
    admission: "KS005",
    name: "Daniel Kariuki",
    gender: "Male",
    className: "Form 4B",
    parent: "James Kariuki",
    status: "Active"
  }
];
/* =========================================================
   PAGE INFORMATION
   ========================================================= */
const pageData = {
  dashboard: {
    title: "Dashboard",
    description: "Overview of school activities and information."
  },
  students: {
    title: "Students",
    description: "Manage student records and academic information."
  },
  teachers: {
    title: "Teachers",
    description: "Manage teachers and teaching information."
  },
  classes: {
    title: "Classes",
    description: "Manage school classes and class information."
  },
  attendance: {
    title: "Attendance",
    description: "Monitor and record student attendance."
  },
  results: {
    title: "Results",
    description: "Manage student academic performance and examination results."
  },
  assignments: {
    title: "Assignments",
    description: "Create and manage student assignments."
  },
  announcements: {
    title: "Announcements",
    description: "Publish important school announcements and notices."
  }
};
/* =========================================================
   ROLES
   ========================================================= */
const roleNames = {
  student: "Student",
  teacher: "Teacher",
  parent: "Parent",
  admin: "Administrator"
};
/* =========================================================
   LOGIN
   ========================================================= */
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const role = userRole.value;
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!role) {
    alert("Please select your login role.");
    return;
  }
  if (!username) {
    alert("Please enter your username.");
    usernameInput.focus();
    return;
  }
  if (!password) {
    alert("Please enter your password.");
    passwordInput.focus();
    return;
  }
  const selectedRole = roleNames[role] || "User";
  const displayName =
    username.charAt(0).toUpperCase() +
    username.slice(1);
  profileName.textContent = displayName;
  profileRole.textContent = selectedRole;
  profileAvatar.textContent =
    displayName.charAt(0).toUpperCase();
  welcomeMessage.textContent =
    `Welcome, ${displayName}. You are logged in as ${selectedRole}.`;
  loginPage.classList.add("hidden");
  appPage.classList.remove("hidden");
  showPage("dashboard");
});
/* =========================================================
   NAVIGATION
   ========================================================= */
navigationItems.forEach(function (item) {
  item.addEventListener("click", function () {
    showPage(item.dataset.page);
  });
});
/* =========================================================
   SHOW PAGE
   ========================================================= */
function showPage(page) {
  const data = pageData[page];
  if (!data) {
    return;
  }
  navigationItems.forEach(function (item) {
    item.classList.remove("active");
    if (item.dataset.page === page) {
      item.classList.add("active");
    }
  });
  /* Dashboard */
  if (page === "dashboard") {
    dashboardPage.classList.remove("hidden");
    contentPage.classList.add("hidden");
    pageTitle.textContent = "Dashboard";
    return;
  }
  /* Other pages */
  dashboardPage.classList.add("hidden");
  contentPage.classList.remove("hidden");
  pageTitle.textContent = data.title;
  contentTitle.textContent = data.title;
  contentDescription.textContent =
    data.description;
  /* Students */
  if (page === "students") {
    renderStudentsPage();
    return;
  }
  /* Other modules */
  renderComingSoonPage(page);
}
/* =========================================================
   STUDENTS PAGE
   ========================================================= */
function renderStudentsPage() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Students</h1>
        <p>Manage student records and academic information.</p>
      </div>
      <button class="primary-button" id="addStudentButton">
        + Add Student
      </button>
    </div>
    <div class="panel">
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:15px;
        margin-bottom:20px;
        flex-wrap:wrap;
      ">
        <div>
          <h3>Student Directory</h3>
          <p style="
            color:#6b7280;
            font-size:13px;
            margin-top:4px;
          ">
            ${students.length} registered students
          </p>
        </div>
        <input
          type="search"
          id="studentSearch"
          placeholder="Search students..."
          style="
            width:260px;
            max-width:100%;
            padding:11px 13px;
            border:1px solid #e5e7eb;
            border-radius:9px;
            outline:none;
          "
        >
      </div>
      <div id="studentTableContainer"></div>
    </div>
  `;
  renderStudentTable();
  document
    .getElementById("studentSearch")
    .addEventListener("input", function () {
      renderStudentTable(this.value);
    });
  document
    .getElementById("addStudentButton")
    .addEventListener("click", function () {
      showAddStudentForm();
    });
}
/* =========================================================
   STUDENT TABLE
   ========================================================= */
function renderStudentTable(searchTerm = "") {
  const container =
    document.getElementById("studentTableContainer");
  if (!container) {
    return;
  }
  const search = searchTerm.toLowerCase().trim();
  const filteredStudents = students.filter(function (student) {
    return (
      student.name.toLowerCase().includes(search) ||
      student.admission.toLowerCase().includes(search) ||
      student.className.toLowerCase().includes(search) ||
      student.parent.toLowerCase().includes(search)
    );
  });
  if (filteredStudents.length === 0) {
    container.innerHTML = `
      <div style="
        text-align:center;
        padding:45px 20px;
        color:#6b7280;
      ">
        <div style="font-size:35px;">🔎</div>
        <h3 style="
          color:#172033;
          margin:10px 0;
        ">
          No students found
        </h3>
        <p>
          Try searching using another name, admission number
          or class.
        </p>
      </div>
    `;
    return;
  }
  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table style="
        width:100%;
        border-collapse:collapse;
        min-width:750px;
      ">
        <thead>
          <tr style="
            text-align:left;
            border-bottom:1px solid #e5e7eb;
          ">
            <th style="padding:13px 10px;">Admission No.</th>
            <th style="padding:13px 10px;">Student</th>
            <th style="padding:13px 10px;">Gender</th>
            <th style="padding:13px 10px;">Class</th>
            <th style="padding:13px 10px;">Parent/Guardian</th>
            <th style="padding:13px 10px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${filteredStudents.map(function (student) {
            return `
              <tr style="
                border-bottom:1px solid #f1f5f9;
              ">
                <td style="padding:15px 10px;">
                  <strong>${student.admission}</strong>
                </td>
                <td style="padding:15px 10px;">
                  ${student.name}
                </td>
                <td style="padding:15px 10px;">
                  ${student.gender}
                </td>
                <td style="padding:15px 10px;">
                  ${student.className}
                </td>
                <td style="padding:15px 10px;">
                  ${student.parent}
                </td>
                <td style="padding:15px 10px;">
                  <span style="
                    background:#dcfce7;
                    color:#166534;
                    padding:5px 9px;
                    border-radius:20px;
                    font-size:12px;
                    font-weight:600;
                  ">
                    ${student.status}
                  </span>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}
/* =========================================================
   ADD STUDENT FORM
   ========================================================= */
function showAddStudentForm() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Add Student</h1>
        <p>Register a new student in the school system.</p>
      </div>
      <button
        class="primary-button"
        id="backToStudents"
      >
        ← Back to Students
      </button>
    </div>
    <div class="panel">
      <form id="studentForm">
        <div style="
          display:grid;
          grid-template-columns:repeat(2, minmax(0, 1fr));
          gap:18px;
        ">
          <div>
            <label style="
              display:block;
              font-size:13px;
              font-weight:600;
              margin-bottom:7px;
            ">
              Admission Number
            </label>
            <input
              type="text"
              id="studentAdmission"
              placeholder="e.g. KS006"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
          </div>
          <div>
            <label style="
              display:block;
              font-size:13px;
              font-weight:600;
              margin-bottom:7px;
            ">
              Full Name
            </label>
            <input
              type="text"
              id="studentName"
              placeholder="Enter full name"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
          </div>
          <div>
            <label style="
              display:block;
              font-size:13px;
              font-weight:600;
              margin-bottom:7px;
            ">
              Gender
            </label>
            <select
              id="studentGender"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label style="
              display:block;
              font-size:13px;
              font-weight:600;
              margin-bottom:7px;
            ">
              Class
            </label>
            <select
              id="studentClass"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              <option value="">Select class</option>
              <option value="Form 1A">Form 1A</option>
              <option value="Form 1B">Form 1B</option>
              <option value="Form 1C">Form 1C</option>
              <option value="Form 2A">Form 2A</option>
              <option value="Form 2B">Form 2B</option>
              <option value="Form 3A">Form 3A</option>
              <option value="Form 3B">Form 3B</option>
              <option value="Form 4A">Form 4A</option>
              <option value="Form 4B">Form 4B</option>
            </select>
          </div>
          <div style="grid-column:1/-1;">
            <label style="
              display:block;
              font-size:13px;
              font-weight:600;
              margin-bottom:7px;
            ">
              Parent / Guardian Name
            </label>
            <input
              type="text"
              id="studentParent"
              placeholder="Enter parent or guardian name"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
          </div>
        </div>
        <div style="
          display:flex;
          justify-content:flex-end;
          gap:10px;
          margin-top:25px;
          flex-wrap:wrap;
        ">
          <button
            type="button"
            id="cancelStudent"
            style="
              padding:11px 18px;
              border:1px solid #e5e7eb;
              background:white;
              border-radius:9px;
            "
          >
            Cancel
          </button>
          <button
            type="submit"
            class="primary-button"
          >
            Save Student
          </button>
        </div>
      </form>
    </div>
  `;
  document
    .getElementById("backToStudents")
    .addEventListener("click", function () {
      showPage("students");
    });
  document
    .getElementById("cancelStudent")
    .addEventListener("click", function () {
      showPage("students");
    });
  document
    .getElementById("studentForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const newStudent = {
        admission:
          document.getElementById("studentAdmission").value.trim(),
        name:
          document.getElementById("studentName").value.trim(),
        gender:
          document.getElementById("studentGender").value,
        className:
          document.getElementById("studentClass").value,
        parent:
          document.getElementById("studentParent").value.trim(),
        status: "Active"
      };
      /* Prevent duplicate admission numbers */
      const duplicate = students.some(function (student) {
        return student.admission.toLowerCase() ===
          newStudent.admission.toLowerCase();
      });
      if (duplicate) {
        alert(
          "That admission number already exists. Please use another one."
        );
        return;
      }
      students.push(newStudent);
      alert(
        `${newStudent.name} has been added successfully.`
      );
      showPage("students");
    });
}
/* =========================================================
   OTHER MODULES
   ========================================================= */
function renderComingSoonPage(page) {
  const data = pageData[page];
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>${data.title}</h1>
        <p>${data.description}</p>
      </div>
      <button class="primary-button">
        + Add New
      </button>
    </div>
    <div class="panel">
      <div class="empty-state">
        <div class="empty-icon">
          🏫
        </div>
        <h2>
          ${data.title} Management
        </h2>
        <p>
          This module is ready for development.
          The next stage will connect it to real school
          records and database services.
        </p>
      </div>
    </div>
  `;
}
/* =========================================================
   QUICK ACTIONS
   ========================================================= */
quickActions.forEach(function (button, index) {
  button.addEventListener("click", function () {
    const pages = [
      "students",
      "results",
      "announcements",
      "attendance"
    ];
    if (pages[index]) {
      showPage(pages[index]);
    }
  });
});
/* =========================================================
   VIEW ALL ANNOUNCEMENTS
   ========================================================= */
if (viewAllButton) {
  viewAllButton.addEventListener("click", function () {
    showPage("announcements");
  });
}
/* =========================================================
   LOGOUT
   ========================================================= */
logoutButton.addEventListener("click", function () {
  const confirmed =
    confirm("Are you sure you want to logout?");
  if (!confirmed) {
    return;
  }
  appPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
  loginForm.reset();
  profileName.textContent = "Administrator";
  profileRole.textContent = "Administrator";
  profileAvatar.textContent = "A";
  welcomeMessage.textContent =
    "Welcome to Kirimunge Senior School.";
  showPage("dashboard");
});
/* =========================================================
   INITIALIZE
   ========================================================= */
function initializeApp() {
  loginPage.classList.remove("hidden");
  appPage.classList.add("hidden");
  showPage("dashboard");
}
initializeApp();
