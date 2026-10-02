/* =========================================================
   KIRIMUNGE SENIOR SCHOOL MANAGEMENT SYSTEM
   COMPLETE FRONTEND VERSION
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
let teachers = [
  {
    id: "T001",
    name: "Peter Kamau",
    gender: "Male",
    subject: "Mathematics",
    department: "Sciences",
    phone: "0712 345 678",
    status: "Active"
  },
  {
    id: "T002",
    name: "Mary Wanjiku",
    gender: "Female",
    subject: "English",
    department: "Languages",
    phone: "0723 456 789",
    status: "Active"
  },
  {
    id: "T003",
    name: "James Kariuki",
    gender: "Male",
    subject: "Physics",
    department: "Sciences",
    phone: "0734 567 890",
    status: "Active"
  },
  {
    id: "T004",
    name: "Jane Njeri",
    gender: "Female",
    subject: "History",
    department: "Humanities",
    phone: "0745 678 901",
    status: "Active"
  }
];
const subjects = [
  "Mathematics",
  "English",
  "Kiswahili",
  "Biology",
  "Chemistry",
  "Physics",
  "History",
  "Geography",
  "Computer Studies",
  "Business Studies",
  "Agriculture",
  "CRE",
  "Art & Design"
];
let classes = [
  {
    id: "C001",
    name: "Form 1A",
    stream: "A",
    teacher: "Jane Njeri",
    capacity: 50,
    subjects: [
      "Mathematics",
      "English",
      "Kiswahili",
      "Biology",
      "History",
      "Geography"
    ]
  },
  {
    id: "C002",
    name: "Form 1B",
    stream: "B",
    teacher: "Peter Kamau",
    capacity: 50,
    subjects: [
      "Mathematics",
      "English",
      "Kiswahili",
      "Chemistry",
      "History",
      "Geography"
    ]
  },
  {
    id: "C003",
    name: "Form 2A",
    stream: "A",
    teacher: "Mary Wanjiku",
    capacity: 50,
    subjects: [
      "Mathematics",
      "English",
      "Kiswahili",
      "Biology",
      "Physics",
      "History"
    ]
  },
  {
    id: "C004",
    name: "Form 3B",
    stream: "B",
    teacher: "James Kariuki",
    capacity: 50,
    subjects: [
      "Mathematics",
      "English",
      "Kiswahili",
      "Chemistry",
      "Physics",
      "Geography"
    ]
  },
  {
    id: "C005",
    name: "Form 4A",
    stream: "A",
    teacher: "Peter Kamau",
    capacity: 50,
    subjects: [
      "Mathematics",
      "English",
      "Kiswahili",
      "Biology",
      "Chemistry",
      "Physics"
    ]
  }
];
/* =========================================================
   ATTENDANCE
   ========================================================= */
let attendanceRecords = [];
/* =========================================================
   RESULTS
   ========================================================= */
let results = [
  {
    admission: "KS001",
    student: "Brian Mwangi",
    className: "Form 4A",
    subject: "Mathematics",
    marks: 82,
    grade: "A"
  },
  {
    admission: "KS002",
    student: "Faith Wanjiku",
    className: "Form 3B",
    subject: "English",
    marks: 76,
    grade: "A"
  },
  {
    admission: "KS003",
    student: "Kevin Kamau",
    className: "Form 2A",
    subject: "Biology",
    marks: 68,
    grade: "B"
  }
];
/* =========================================================
   ASSIGNMENTS
   ========================================================= */
let assignments = [
  {
    id: "A001",
    title: "Algebra Revision",
    subject: "Mathematics",
    className: "Form 4A",
    dueDate: "2026-10-10",
    teacher: "Peter Kamau",
    status: "Active"
  },
  {
    id: "A002",
    title: "Essay Writing",
    subject: "English",
    className: "Form 3B",
    dueDate: "2026-10-12",
    teacher: "Mary Wanjiku",
    status: "Active"
  }
];
/* =========================================================
   ANNOUNCEMENTS
   ========================================================= */
let announcements = [
  {
    id: "N001",
    title: "Welcome to the new school portal",
    message: "School administration has launched the new digital portal.",
    audience: "Everyone",
    date: "Today"
  },
  {
    id: "N002",
    title: "Academic calendar",
    message: "The new academic calendar is now available.",
    audience: "Students & Teachers",
    date: "Yesterday"
  },
  {
    id: "N003",
    title: "School activities",
    message: "Students are reminded to participate in upcoming activities.",
    audience: "Students",
    date: "2 days ago"
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
    description: "Manage school classes and subjects."
  },
  attendance: {
    title: "Attendance",
    description: "Record and monitor student attendance."
  },
  results: {
    title: "Results",
    description: "Manage student academic performance."
  },
  assignments: {
    title: "Assignments",
    description: "Create and manage student assignments."
  },
  announcements: {
    title: "Announcements",
    description: "Publish important school announcements."
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
loginForm.addEventListener("submit", function(event) {
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
    return;
  }
  if (!password) {
    alert("Please enter your password.");
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
navigationItems.forEach(function(item) {
  item.addEventListener("click", function() {
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
  navigationItems.forEach(function(item) {
    item.classList.remove("active");
    if (item.dataset.page === page) {
      item.classList.add("active");
    }
  });
  if (page === "dashboard") {
    dashboardPage.classList.remove("hidden");
    contentPage.classList.add("hidden");
    pageTitle.textContent = "Dashboard";
    updateDashboard();
    return;
  }
  dashboardPage.classList.add("hidden");
  contentPage.classList.remove("hidden");
  pageTitle.textContent = data.title;
  if (page === "students") {
    renderStudentsPage();
    return;
  }
  if (page === "teachers") {
    renderTeachersPage();
    return;
  }
  if (page === "classes") {
    renderClassesPage();
    return;
  }
  if (page === "attendance") {
    renderAttendancePage();
    return;
  }
  if (page === "results") {
    renderResultsPage();
    return;
  }
  if (page === "assignments") {
    renderAssignmentsPage();
    return;
  }
  if (page === "announcements") {
    renderAnnouncementsPage();
    return;
  }
}
/* =========================================================
   DASHBOARD
   ========================================================= */
function updateDashboard() {
  const statCards =
    document.querySelectorAll(".stat-card");
  if (statCards.length >= 3) {
    statCards[0]
      .querySelector("strong")
      .textContent = students.length;
    statCards[1]
      .querySelector("strong")
      .textContent = teachers.length;
    statCards[2]
      .querySelector("strong")
      .textContent = classes.length;
    const present =
      attendanceRecords.filter(
        item => item.status === "Present"
      ).length;
    const total =
      attendanceRecords.length;
    const percentage =
      total === 0
        ? 94
        : Math.round((present / total) * 100);
    statCards[3]
      .querySelector("strong")
      .textContent = percentage + "%";
  }
}
/* =========================================================
   STUDENTS PAGE
   ========================================================= */
function renderStudentsPage(searchTerm = "") {
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
            ${students.length} students registered
          </p>
        </div>
        <input
          type="search"
          id="studentSearch"
          placeholder="Search students..."
          value="${searchTerm}"
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
      <div id="studentTable"></div>
    </div>
  `;
  renderStudentTable(searchTerm);
  document
    .getElementById("studentSearch")
    .addEventListener("input", function() {
      renderStudentTable(this.value);
    });
  document
    .getElementById("addStudentButton")
    .addEventListener("click", showAddStudentForm);
}
function renderStudentTable(searchTerm = "") {
  const container =
    document.getElementById("studentTable");
  if (!container) return;
  const search =
    searchTerm.toLowerCase().trim();
  const filtered =
    students.filter(function(student) {
      return (
        student.name.toLowerCase().includes(search) ||
        student.admission.toLowerCase().includes(search) ||
        student.className.toLowerCase().includes(search)
      );
    });
  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table style="
        width:100%;
        border-collapse:collapse;
        min-width:850px;
      ">
        <thead>
          <tr style="
            border-bottom:1px solid #e5e7eb;
            text-align:left;
          ">
            <th style="padding:13px 10px;">Admission</th>
            <th style="padding:13px 10px;">Student</th>
            <th style="padding:13px 10px;">Gender</th>
            <th style="padding:13px 10px;">Class</th>
            <th style="padding:13px 10px;">Parent</th>
            <th style="padding:13px 10px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${
            filtered.length === 0
              ? `
                <tr>
                  <td colspan="6"
                    style="
                      text-align:center;
                      padding:40px;
                      color:#6b7280;
                    ">
                    No students found.
                  </td>
                </tr>
              `
              :
              filtered.map(function(student) {
                return `
                  <tr style="
                    border-bottom:1px solid #f1f5f9;
                  ">
                    <td style="padding:14px 10px;">
                      <strong>${student.admission}</strong>
                    </td>
                    <td style="padding:14px 10px;">
                      ${student.name}
                    </td>
                    <td style="padding:14px 10px;">
                      ${student.gender}
                    </td>
                    <td style="padding:14px 10px;">
                      ${student.className}
                    </td>
                    <td style="padding:14px 10px;">
                      ${student.parent}
                    </td>
                    <td style="padding:14px 10px;">
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
              }).join("")
          }
        </tbody>
      </table>
    </div>
  `;
}
function showAddStudentForm() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Add Student</h1>
        <p>Register a new student.</p>
      </div>
      <button
        class="primary-button"
        id="backStudents"
      >
        ← Back
      </button>
    </div>
    <div class="panel">
      <form id="studentForm">
        <div style="
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:18px;
        ">
          <div>
            <label>Admission Number</label>
            <input
              id="studentAdmission"
              required
              placeholder="KS006"
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
          </div>
          <div>
            <label>Full Name</label>
            <input
              id="studentName"
              required
              placeholder="Student name"
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
          </div>
          <div>
            <label>Gender</label>
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
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label>Class</label>
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
              ${classes.map(c => `
                <option>${c.name}</option>
              `).join("")}
            </select>
          </div>
          <div>
            <label>Parent / Guardian</label>
            <input
              id="studentParent"
              required
              placeholder="Parent name"
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
        ">
          <button
            type="button"
            id="cancelStudent"
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
    .getElementById("backStudents")
    .onclick = () => showPage("students");
  document
    .getElementById("cancelStudent")
    .onclick = () => showPage("students");
  document
    .getElementById("studentForm")
    .addEventListener("submit", function(event) {
      event.preventDefault();
      const admission =
        document.getElementById("studentAdmission").value.trim();
      const duplicate =
        students.some(
          s => s.admission.toLowerCase() === admission.toLowerCase()
        );
      if (duplicate) {
        alert("That admission number already exists.");
        return;
      }
      students.push({
        admission,
        name:
          document
            .getElementById("studentName")
            .value.trim(),
        gender:
          document
            .getElementById("studentGender")
            .value,
        className:
          document
            .getElementById("studentClass")
            .value,
        parent:
          document
            .getElementById("studentParent")
            .value.trim(),
        status: "Active"
      });
      alert("Student added successfully.");
      showPage("students");
    });
}
/* =========================================================
   TEACHERS PAGE
   ========================================================= */
function renderTeachersPage(searchTerm = "") {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Teachers</h1>
        <p>Manage teaching staff and departments.</p>
      </div>
      <button
        class="primary-button"
        id="addTeacherButton"
      >
        + Add Teacher
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
          <h3>Teacher Directory</h3>
          <p style="
            color:#6b7280;
            font-size:13px;
            margin-top:4px;
          ">
            ${teachers.length} teachers registered
          </p>
        </div>
        <input
          type="search"
          id="teacherSearch"
          placeholder="Search teachers..."
          value="${searchTerm}"
          style="
            width:260px;
            max-width:100%;
            padding:11px 13px;
            border:1px solid #e5e7eb;
            border-radius:9px;
          "
        >
      </div>
      <div id="teacherTable"></div>
    </div>
  `;
  renderTeacherTable(searchTerm);
  document
    .getElementById("teacherSearch")
    .addEventListener("input", function() {
      renderTeacherTable(this.value);
    });
  document
    .getElementById("addTeacherButton")
    .onclick = showAddTeacherForm;
}
function renderTeacherTable(searchTerm = "") {
  const container =
    document.getElementById("teacherTable");
  if (!container) return;
  const search =
    searchTerm.toLowerCase().trim();
  const filtered =
    teachers.filter(function(teacher) {
      return (
        teacher.name.toLowerCase().includes(search) ||
        teacher.subject.toLowerCase().includes(search) ||
        teacher.department.toLowerCase().includes(search)
      );
    });
  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table style="
        width:100%;
        border-collapse:collapse;
        min-width:800px;
      ">
        <thead>
          <tr style="
            text-align:left;
            border-bottom:1px solid #e5e7eb;
          ">
            <th style="padding:13px 10px;">ID</th>
            <th style="padding:13px 10px;">Teacher</th>
            <th style="padding:13px 10px;">Gender</th>
            <th style="padding:13px 10px;">Subject</th>
            <th style="padding:13px 10px;">Department</th>
            <th style="padding:13px 10px;">Phone</th>
          </tr>
        </thead>
        <tbody>
          ${
            filtered.map(function(teacher) {
              return `
                <tr style="
                  border-bottom:1px solid #f1f5f9;
                ">
                  <td style="padding:14px 10px;">
                    <strong>${teacher.id}</strong>
                  </td>
                  <td style="padding:14px 10px;">
                    ${teacher.name}
                  </td>
                  <td style="padding:14px 10px;">
                    ${teacher.gender}
                  </td>
                  <td style="padding:14px 10px;">
                    ${teacher.subject}
                  </td>
                  <td style="padding:14px 10px;">
                    ${teacher.department}
                  </td>
                  <td style="padding:14px 10px;">
                    ${teacher.phone}
                  </td>
                </tr>
              `;
            }).join("")
          }
        </tbody>
      </table>
    </div>
  `;
}
function showAddTeacherForm() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Add Teacher</h1>
        <p>Register a new teacher.</p>
      </div>
      <button
        class="primary-button"
        id="backTeachers"
      >
        ← Back
      </button>
    </div>
    <div class="panel">
      <form id="teacherForm">
        <div style="
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:18px;
        ">
          <div>
            <label>Teacher ID</label>
            <input
              id="teacherId"
              placeholder="T005"
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
            <label>Full Name</label>
            <input
              id="teacherName"
              required
              placeholder="Teacher name"
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
          </div>
          <div>
            <label>Gender</label>
            <select
              id="teacherGender"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label>Subject</label>
            <select
              id="teacherSubject"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              <option value="">Select subject</option>
              ${subjects.map(s => `<option>${s}</option>`).join("")}
            </select>
          </div>
          <div>
            <label>Department</label>
            <select
              id="teacherDepartment"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              <option value="">Select department</option>
              <option>Sciences</option>
              <option>Languages</option>
              <option>Humanities</option>
              <option>Technical</option>
              <option>Business</option>
              <option>Creative Arts</option>
            </select>
          </div>
          <div>
            <label>Phone</label>
            <input
              id="teacherPhone"
              placeholder="0712 345 678"
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
        ">
          <button
            type="button"
            id="cancelTeacher"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="primary-button"
          >
            Save Teacher
          </button>
        </div>
      </form>
    </div>
  `;
  document
    .getElementById("backTeachers")
    .onclick = () => showPage("teachers");
  document
    .getElementById("cancelTeacher")
    .onclick = () => showPage("teachers");
  document
    .getElementById("teacherForm")
    .addEventListener("submit", function(event) {
      event.preventDefault();
      const id =
        document.getElementById("teacherId").value.trim();
      if (
        teachers.some(
          teacher =>
            teacher.id.toLowerCase() === id.toLowerCase()
        )
      ) {
        alert("That teacher ID already exists.");
        return;
      }
      teachers.push({
        id,
        name:
          document
            .getElementById("teacherName")
            .value.trim(),
        gender:
          document
            .getElementById("teacherGender")
            .value,
        subject:
          document
            .getElementById("teacherSubject")
            .value,
        department:
          document
            .getElementById("teacherDepartment")
            .value,
        phone:
          document
            .getElementById("teacherPhone")
            .value.trim(),
        status: "Active"
      });
      alert("Teacher added successfully.");
      showPage("teachers");
    });
}
/* =========================================================
   CLASSES
   ========================================================= */
function renderClassesPage(searchTerm = "") {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Classes & Subjects</h1>
        <p>
          Manage classes, streams, class teachers and subjects.
        </p>
      </div>
      <button
        class="primary-button"
        id="addClassButton"
      >
        + Add Class
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
          <h3>Class Directory</h3>
          <p style="
            color:#6b7280;
            font-size:13px;
            margin-top:4px;
          ">
            ${classes.length} classes configured
          </p>
        </div>
        <input
          type="search"
          id="classSearch"
          placeholder="Search classes..."
          value="${searchTerm}"
          style="
            width:260px;
            max-width:100%;
            padding:11px 13px;
            border:1px solid #e5e7eb;
            border-radius:9px;
          "
        >
      </div>
      <div id="classTableContainer"></div>
    </div>
  `;
  renderClassTable(searchTerm);
  document
    .getElementById("classSearch")
    .addEventListener("input", function() {
      renderClassTable(this.value);
    });
  document
    .getElementById("addClassButton")
    .onclick = showAddClassForm;
}
function renderClassTable(searchTerm = "") {
  const container =
    document.getElementById("classTableContainer");
  if (!container) return;
  const search =
    searchTerm.toLowerCase().trim();
  const filtered =
    classes.filter(function(item) {
      return (
        item.name.toLowerCase().includes(search) ||
        item.stream.toLowerCase().includes(search) ||
        item.teacher.toLowerCase().includes(search)
      );
    });
  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table style="
        width:100%;
        border-collapse:collapse;
        min-width:850px;
      ">
        <thead>
          <tr style="
            text-align:left;
            border-bottom:1px solid #e5e7eb;
          ">
            <th style="padding:13px 10px;">Class ID</th>
            <th style="padding:13px 10px;">Class</th>
            <th style="padding:13px 10px;">Stream</th>
            <th style="padding:13px 10px;">Class Teacher</th>
            <th style="padding:13px 10px;">Students</th>
            <th style="padding:13px 10px;">Capacity</th>
            <th style="padding:13px 10px;">Subjects</th>
          </tr>
        </thead>
        <tbody>
          ${
            filtered.map(function(item) {
              const studentCount =
                students.filter(
                  student =>
                    student.className === item.name
                ).length;
              return `
                <tr style="
                  border-bottom:1px solid #f1f5f9;
                ">
                  <td style="padding:15px 10px;">
                    <strong>${item.id}</strong>
                  </td>
                  <td style="padding:15px 10px;">
                    <strong>${item.name}</strong>
                  </td>
                  <td style="padding:15px 10px;">
                    ${item.stream}
                  </td>
                  <td style="padding:15px 10px;">
                    ${item.teacher}
                  </td>
                  <td style="padding:15px 10px;">
                    ${studentCount}
                  </td>
                  <td style="padding:15px 10px;">
                    ${item.capacity}
                  </td>
                  <td style="padding:15px 10px;">
                    <span style="
                      background:#eff6ff;
                      color:#1d4ed8;
                      padding:5px 9px;
                      border-radius:20px;
                      font-size:12px;
                      font-weight:600;
                    ">
                      ${item.subjects.length} subjects
                    </span>
                  </td>
                </tr>
              `;
            }).join("")
          }
        </tbody>
      </table>
    </div>
  `;
}
function showAddClassForm() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Add Class</h1>
        <p>Create a new school class.</p>
      </div>
      <button
        class="primary-button"
        id="backClasses"
      >
        ← Back
      </button>
    </div>
    <div class="panel">
      <form id="classForm">
        <div style="
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:18px;
        ">
          <div>
            <label>Class ID</label>
            <input
              id="classId"
              placeholder="C006"
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
            <label>Class Name</label>
            <select
              id="className"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              <option value="">Select class</option>
              <option>Form 1A</option>
              <option>Form 1B</option>
              <option>Form 1C</option>
              <option>Form 2A</option>
              <option>Form 2B</option>
              <option>Form 2C</option>
              <option>Form 3A</option>
              <option>Form 3B</option>
              <option>Form 3C</option>
              <option>Form 4A</option>
              <option>Form 4B</option>
              <option>Form 4C</option>
            </select>
          </div>
          <div>
            <label>Stream</label>
            <select
              id="classStream"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              <option value="">Select stream</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </div>
          <div>
            <label>Class Teacher</label>
            <select
              id="classTeacher"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              <option value="">Select teacher</option>
              ${
                teachers.map(
                  teacher =>
                    `<option>${teacher.name}</option>`
                ).join("")
              }
            </select>
          </div>
          <div>
            <label>Class Capacity</label>
            <input
              type="number"
              id="classCapacity"
              value="50"
              min="1"
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
            <label>Subjects</label>
            <select
              id="classSubjects"
              multiple
              required
              style="
                width:100%;
                min-height:140px;
                padding:10px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              ${
                subjects.map(
                  subject =>
                    `<option value="${subject}">
                      ${subject}
                    </option>`
                ).join("")
              }
            </select>
            <small style="
              display:block;
              color:#6b7280;
              margin-top:6px;
            ">
              Hold Ctrl/Cmd to select multiple subjects.
            </small>
          </div>
        </div>
        <div style="
          display:flex;
          justify-content:flex-end;
          gap:10px;
          margin-top:25px;
        ">
          <button
            type="button"
            id="cancelClass"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="primary-button"
          >
            Save Class
          </button>
        </div>
      </form>
    </div>
  `;
  document
    .getElementById("backClasses")
    .onclick = () => showPage("classes");
  document
    .getElementById("cancelClass")
    .onclick = () => showPage("classes");
  document
    .getElementById("classForm")
    .addEventListener("submit", function(event) {
      event.preventDefault();
      const selectedSubjects =
        Array.from(
          document.getElementById("classSubjects").selectedOptions
        ).map(option => option.value);
      if (selectedSubjects.length === 0) {
        alert("Please select at least one subject.");
        return;
      }
      const newClass = {
        id:
          document
            .getElementById("classId")
            .value.trim(),
        name:
          document
            .getElementById("className")
            .value,
        stream:
          document
            .getElementById("classStream")
            .value,
        teacher:
          document
            .getElementById("classTeacher")
            .value,
        capacity:
          Number(
            document
              .getElementById("classCapacity")
              .value
          ),
        subjects: selectedSubjects
      };
      if (
        classes.some(
          item =>
            item.id.toLowerCase() ===
            newClass.id.toLowerCase()
        )
      ) {
        alert("That class ID already exists.");
        return;
      }
      if (
        classes.some(
          item =>
            item.name.toLowerCase() ===
            newClass.name.toLowerCase()
        )
      ) {
        alert("That class already exists.");
        return;
      }
      classes.push(newClass);
      alert("Class created successfully.");
      showPage("classes");
    });
}
/* =========================================================
   ATTENDANCE
   ========================================================= */
function renderAttendancePage() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Attendance</h1>
        <p>Record daily student attendance.</p>
      </div>
    </div>
    <div class="panel">
      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:15px;
        margin-bottom:20px;
      ">
        <div>
          <label>Date</label>
          <input
            type="date"
            id="attendanceDate"
            value="${new Date().toISOString().split("T")[0]}"
            style="
              width:100%;
              padding:12px;
              border:1px solid #e5e7eb;
              border-radius:9px;
            "
          >
        </div>
        <div>
          <label>Class</label>
          <select
            id="attendanceClass"
            style="
              width:100%;
              padding:12px;
              border:1px solid #e5e7eb;
              border-radius:9px;
            "
          >
            <option value="">Select class</option>
            ${
              classes.map(
                c => `<option>${c.name}</option>`
              ).join("")
            }
          </select>
        </div>
      </div>
      <div id="attendanceList">
        <div style="
          text-align:center;
          padding:45px;
          color:#6b7280;
        ">
          Select a class to record attendance.
        </div>
      </div>
    </div>
  `;
  document
    .getElementById("attendanceClass")
    .addEventListener("change", renderAttendanceStudents);
}
function renderAttendanceStudents() {
  const className =
    document.getElementById("attendanceClass").value;
  const date =
    document.getElementById("attendanceDate").value;
  const container =
    document.getElementById("attendanceList");
  if (!className) {
    container.innerHTML = `
      <div style="
        text-align:center;
        padding:45px;
        color:#6b7280;
      ">
        Select a class to record attendance.
      </div>
    `;
    return;
  }
  const classStudents =
    students.filter(
      student =>
        student.className === className
    );
  if (classStudents.length === 0) {
    container.innerHTML = `
      <div style="
        text-align:center;
        padding:45px;
        color:#6b7280;
      ">
        No students are registered in this class.
      </div>
    `;
    return;
  }
  container.innerHTML = `
    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:15px;
      flex-wrap:wrap;
      gap:10px;
    ">
      <div>
        <h3>${className} Attendance</h3>
        <p style="
          color:#6b7280;
          font-size:13px;
        ">
          ${date}
        </p>
      </div>
      <button
        class="primary-button"
        id="saveAttendance"
      >
        Save Attendance
      </button>
    </div>
    <div style="overflow-x:auto;">
      <table style="
        width:100%;
        border-collapse:collapse;
        min-width:650px;
      ">
        <thead>
          <tr style="
            text-align:left;
            border-bottom:1px solid #e5e7eb;
          ">
            <th style="padding:13px 10px;">Admission</th>
            <th style="padding:13px 10px;">Student</th>
            <th style="padding:13px 10px;">Attendance</th>
          </tr>
        </thead>
        <tbody>
          ${
            classStudents.map(function(student) {
              return `
                <tr style="
                  border-bottom:1px solid #f1f5f9;
                ">
                  <td style="padding:14px 10px;">
                    <strong>${student.admission}</strong>
                  </td>
                  <td style="padding:14px 10px;">
                    ${student.name}
                  </td>
                  <td style="padding:14px 10px;">
                    <select
                      class="attendance-status"
                      data-admission="${student.admission}"
                      style="
                        padding:9px;
                        border:1px solid #e5e7eb;
                        border-radius:8px;
                      "
                    >
                      <option>Present</option>
                      <option>Absent</option>
                      <option>Late</option>
                    </select>
                  </td>
                </tr>
              `;
            }).join("")
          }
        </tbody>
      </table>
    </div>
  `;
  document
    .getElementById("saveAttendance")
    .addEventListener("click", function() {
      const statuses =
        document.querySelectorAll(".attendance-status");
      statuses.forEach(function(select) {
        const admission =
          select.dataset.admission;
        const student =
          students.find(
            s => s.admission === admission
          );
        attendanceRecords =
          attendanceRecords.filter(
            record =>
              !(
                record.admission === admission &&
                record.date === date
              )
          );
        attendanceRecords.push({
          admission,
          student: student.name,
          className,
          date,
          status: select.value
        });
      });
      alert("Attendance saved successfully.");
      updateDashboard();
    });
}
/* =========================================================
   RESULTS
   ========================================================= */
function renderResultsPage() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Results</h1>
        <p>Manage student examination results.</p>
      </div>
      <button
        class="primary-button"
        id="addResultButton"
      >
        + Enter Result
      </button>
    </div>
    <div class="panel">
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:20px;
        flex-wrap:wrap;
        gap:10px;
      ">
        <h3>Academic Results</h3>
        <input
          type="search"
          id="resultSearch"
          placeholder="Search results..."
          style="
            width:260px;
            padding:11px 13px;
            border:1px solid #e5e7eb;
            border-radius:9px;
          "
        >
      </div>
      <div id="resultsTable"></div>
    </div>
  `;
  renderResultsTable();
  document
    .getElementById("resultSearch")
    .addEventListener("input", function() {
      renderResultsTable(this.value);
    });
  document
    .getElementById("addResultButton")
    .onclick = showAddResultForm;
}
function getGrade(marks) {
  if (marks >= 80) return "A";
  if (marks >= 70) return "B";
  if (marks >= 60) return "C";
  if (marks >= 50) return "D";
  return "E";
}
function renderResultsTable(searchTerm = "") {
  const container =
    document.getElementById("resultsTable");
  if (!container) return;
  const search =
    searchTerm.toLowerCase().trim();
  const filtered =
    results.filter(function(result) {
      return (
        result.student.toLowerCase().includes(search) ||
        result.subject.toLowerCase().includes(search) ||
        result.className.toLowerCase().includes(search)
      );
    });
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
            <th style="padding:13px 10px;">Admission</th>
            <th style="padding:13px 10px;">Student</th>
            <th style="padding:13px 10px;">Class</th>
            <th style="padding:13px 10px;">Subject</th>
            <th style="padding:13px 10px;">Marks</th>
            <th style="padding:13px 10px;">Grade</th>
          </tr>
        </thead>
        <tbody>
          ${
            filtered.map(function(result) {
              return `
                <tr style="
                  border-bottom:1px solid #f1f5f9;
                ">
                  <td style="padding:14px 10px;">
                    ${result.admission}
                  </td>
                  <td style="padding:14px 10px;">
                    <strong>${result.student}</strong>
                  </td>
                  <td style="padding:14px 10px;">
                    ${result.className}
                  </td>
                  <td style="padding:14px 10px;">
                    ${result.subject}
                  </td>
                  <td style="padding:14px 10px;">
                    ${result.marks}
                  </td>
                  <td style="padding:14px 10px;">
                    <span style="
                      background:#eff6ff;
                      color:#1d4ed8;
                      padding:5px 10px;
                      border-radius:20px;
                      font-weight:700;
                    ">
                      ${result.grade}
                    </span>
                  </td>
                </tr>
              `;
            }).join("")
          }
        </tbody>
      </table>
    </div>
  `;
}
function showAddResultForm() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Enter Result</h1>
        <p>Add an academic result for a student.</p>
      </div>
      <button
        class="primary-button"
        id="backResults"
      >
        ← Back
      </button>
    </div>
    <div class="panel">
      <form id="resultForm">
        <div style="
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:18px;
        ">
          <div>
            <label>Student</label>
            <select
              id="resultStudent"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              <option value="">Select student</option>
              ${
                students.map(
                  student => `
                    <option value="${student.admission}">
                      ${student.name} — ${student.className}
                    </option>
                  `
                ).join("")
              }
            </select>
          </div>
          <div>
            <label>Subject</label>
            <select
              id="resultSubject"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              <option value="">Select subject</option>
              ${
                subjects.map(
                  subject => `<option>${subject}</option>`
                ).join("")
              }
            </select>
          </div>
          <div>
            <label>Marks</label>
            <input
              type="number"
              id="resultMarks"
              min="0"
              max="100"
              required
              placeholder="0 - 100"
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
        ">
          <button
            type="button"
            id="cancelResult"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="primary-button"
          >
            Save Result
          </button>
        </div>
      </form>
    </div>
  `;
  document
    .getElementById("backResults")
    .onclick = () => showPage("results");
  document
    .getElementById("cancelResult")
    .onclick = () => showPage("results");
  document
    .getElementById("resultForm")
    .addEventListener("submit", function(event) {
      event.preventDefault();
      const admission =
        document.getElementById("resultStudent").value;
      const student =
        students.find(
          s => s.admission === admission
        );
      const marks =
        Number(
          document.getElementById("resultMarks").value
        );
      if (marks < 0 || marks > 100) {
        alert("Marks must be between 0 and 100.");
        return;
      }
      results.push({
        admission,
        student: student.name,
        className: student.className,
        subject:
          document.getElementById("resultSubject").value,
        marks,
        grade: getGrade(marks)
      });
      alert("Result saved successfully.");
      showPage("results");
    });
}
/* =========================================================
   ASSIGNMENTS
   ========================================================= */
function renderAssignmentsPage() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Assignments</h1>
        <p>Create and manage student assignments.</p>
      </div>
      <button
        class="primary-button"
        id="addAssignmentButton"
      >
        + Add Assignment
      </button>
    </div>
    <div class="panel">
      <h3 style="margin-bottom:18px;">
        Assignment Directory
      </h3>
      <div id="assignmentList"></div>
    </div>
  `;
  renderAssignmentList();
  document
    .getElementById("addAssignmentButton")
    .onclick = showAddAssignmentForm;
}
function renderAssignmentList() {
  const container =
    document.getElementById("assignmentList");
  if (!container) return;
  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table style="
        width:100%;
        border-collapse:collapse;
        min-width:800px;
      ">
        <thead>
          <tr style="
            text-align:left;
            border-bottom:1px solid #e5e7eb;
          ">
            <th style="padding:13px 10px;">ID</th>
            <th style="padding:13px 10px;">Assignment</th>
            <th style="padding:13px 10px;">Subject</th>
            <th style="padding:13px 10px;">Class</th>
            <th style="padding:13px 10px;">Due Date</th>
            <th style="padding:13px 10px;">Teacher</th>
            <th style="padding:13px 10px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${
            assignments.map(function(item) {
              return `
                <tr style="
                  border-bottom:1px solid #f1f5f9;
                ">
                  <td style="padding:14px 10px;">
                    ${item.id}
                  </td>
                  <td style="padding:14px 10px;">
                    <strong>${item.title}</strong>
                  </td>
                  <td style="padding:14px 10px;">
                    ${item.subject}
                  </td>
                  <td style="padding:14px 10px;">
                    ${item.className}
                  </td>
                  <td style="padding:14px 10px;">
                    ${item.dueDate}
                  </td>
                  <td style="padding:14px 10px;">
                    ${item.teacher}
                  </td>
                  <td style="padding:14px 10px;">
                    <span style="
                      background:#dcfce7;
                      color:#166534;
                      padding:5px 9px;
                      border-radius:20px;
                      font-size:12px;
                      font-weight:600;
                    ">
                      ${item.status}
                    </span>
                  </td>
                </tr>
              `;
            }).join("")
          }
        </tbody>
      </table>
    </div>
  `;
}
function showAddAssignmentForm() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Add Assignment</h1>
        <p>Create a new student assignment.</p>
      </div>
      <button
        class="primary-button"
        id="backAssignments"
      >
        ← Back
      </button>
    </div>
    <div class="panel">
      <form id="assignmentForm">
        <div style="
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:18px;
        ">
          <div>
            <label>Assignment Title</label>
            <input
              id="assignmentTitle"
              required
              placeholder="e.g. Algebra Revision"
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
          </div>
          <div>
            <label>Subject</label>
            <select
              id="assignmentSubject"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              <option value="">Select subject</option>
              ${
                subjects.map(
                  s => `<option>${s}</option>`
                ).join("")
              }
            </select>
          </div>
          <div>
            <label>Class</label>
            <select
              id="assignmentClass"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              <option value="">Select class</option>
              ${
                classes.map(
                  c => `<option>${c.name}</option>`
                ).join("")
              }
            </select>
          </div>
          <div>
            <label>Due Date</label>
            <input
              type="date"
              id="assignmentDueDate"
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
            <label>Teacher</label>
            <select
              id="assignmentTeacher"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              <option value="">Select teacher</option>
              ${
                teachers.map(
                  teacher =>
                    `<option>${teacher.name}</option>`
                ).join("")
              }
            </select>
          </div>
        </div>
        <div style="
          display:flex;
          justify-content:flex-end;
          gap:10px;
          margin-top:25px;
        ">
          <button
            type="button"
            id="cancelAssignment"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="primary-button"
          >
            Save Assignment
          </button>
        </div>
      </form>
    </div>
  `;
  document
    .getElementById("backAssignments")
    .onclick = () => showPage("assignments");
  document
    .getElementById("cancelAssignment")
    .onclick = () => showPage("assignments");
  document
    .getElementById("assignmentForm")
    .addEventListener("submit", function(event) {
      event.preventDefault();
      const nextId =
        "A" +
        String(assignments.length + 1).padStart(3, "0");
      assignments.push({
        id: nextId,
        title:
          document
            .getElementById("assignmentTitle")
            .value.trim(),
        subject:
          document
            .getElementById("assignmentSubject")
            .value,
        className:
          document
            .getElementById("assignmentClass")
            .value,
        dueDate:
          document
            .getElementById("assignmentDueDate")
            .value,
        teacher:
          document
            .getElementById("assignmentTeacher")
            .value,
        status: "Active"
      });
      alert("Assignment created successfully.");
      showPage("assignments");
    });
}
/* =========================================================
   ANNOUNCEMENTS
   ========================================================= */
function renderAnnouncementsPage() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Announcements</h1>
        <p>Publish important school announcements.</p>
      </div>
      <button
        class="primary-button"
        id="addAnnouncementButton"
      >
        + New Announcement
      </button>
    </div>
    <div class="panel">
      <h3 style="margin-bottom:18px;">
        School Notices
      </h3>
      <div id="announcementList"></div>
    </div>
  `;
  renderAnnouncementList();
  document
    .getElementById("addAnnouncementButton")
    .onclick = showAddAnnouncementForm;
}
function renderAnnouncementList() {
  const container =
    document.getElementById("announcementList");
  if (!container) return;
  container.innerHTML = announcements.map(function(item) {
    return `
      <div style="
        display:flex;
        gap:15px;
        padding:18px 0;
        border-bottom:1px solid #e5e7eb;
      ">
        <div style="
          width:45px;
          height:45px;
          border-radius:12px;
          background:#eff6ff;
          display:flex;
          justify-content:center;
          align-items:center;
          font-size:22px;
          flex-shrink:0;
        ">
          📢
        </div>
        <div>
          <h3 style="
            margin-bottom:5px;
          ">
            ${item.title}
          </h3>
          <p style="
            color:#6b7280;
            line-height:1.5;
            margin-bottom:7px;
          ">
            ${item.message}
          </p>
          <small style="color:#9ca3af;">
            ${item.audience} • ${item.date}
          </small>
        </div>
      </div>
    `;
  }).join("");
}
function showAddAnnouncementForm() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>New Announcement</h1>
        <p>Create a school-wide notice.</p>
      </div>
      <button
        class="primary-button"
        id="backAnnouncements"
      >
        ← Back
      </button>
    </div>
    <div class="panel">
      <form id="announcementForm">
        <div style="
          display:flex;
          flex-direction:column;
          gap:18px;
        ">
          <div>
            <label>Announcement Title</label>
            <input
              id="announcementTitle"
              required
              placeholder="Announcement title"
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
          </div>
          <div>
            <label>Message</label>
            <textarea
              id="announcementMessage"
              required
              rows="6"
              placeholder="Write announcement..."
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
                resize:vertical;
              "
            ></textarea>
          </div>
          <div>
            <label>Audience</label>
            <select
              id="announcementAudience"
              required
              style="
                width:100%;
                padding:12px;
                border:1px solid #e5e7eb;
                border-radius:9px;
              "
            >
              <option>Everyone</option>
              <option>Students</option>
              <option>Teachers</option>
              <option>Parents</option>
              <option>Students & Teachers</option>
              <option>Parents & Students</option>
            </select>
          </div>
        </div>
        <div style="
          display:flex;
          justify-content:flex-end;
          gap:10px;
          margin-top:25px;
        ">
          <button
            type="button"
            id="cancelAnnouncement"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="primary-button"
          >
            Publish Announcement
          </button>
        </div>
      </form>
    </div>
  `;
  document
    .getElementById("backAnnouncements")
    .onclick = () => showPage("announcements");
  document
    .getElementById("cancelAnnouncement")
    .onclick = () => showPage("announcements");
  document
    .getElementById("announcementForm")
    .addEventListener("submit", function(event) {
      event.preventDefault();
      announcements.unshift({
        id:
          "N" +
          String(announcements.length + 1)
            .padStart(3, "0"),
        title:
          document
            .getElementById("announcementTitle")
            .value.trim(),
        message:
          document
            .getElementById("announcementMessage")
            .value.trim(),
        audience:
          document
            .getElementById("announcementAudience")
            .value,
        date: "Today"
      });
      alert("Announcement published successfully.");
      showPage("announcements");
    });
}
/* =========================================================
   QUICK ACTIONS
   ========================================================= */
quickActions.forEach(function(button, index) {
  button.addEventListener("click", function() {
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
  viewAllButton.addEventListener("click", function() {
    showPage("announcements");
  });
}
/* =========================================================
   LOGOUT
   ========================================================= */
logoutButton.addEventListener("click", function() {
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
