/* =========================================================
   KIRIMUNGE SENIOR SCHOOL MANAGEMENT SYSTEM
   Classes & Subjects Module
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
   STUDENTS
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
   TEACHERS
   ========================================================= */
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
/* =========================================================
   SUBJECTS
   ========================================================= */
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
/* =========================================================
   CLASSES
   ========================================================= */
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
    return;
  }
  if (!password) {
    alert("Please enter your password.");
    return;
  }
  const selectedRole =
    roleNames[role] || "User";
  const displayName =
    username.charAt(0).toUpperCase() +
    username.slice(1);
  profileName.textContent =
    displayName;
  profileRole.textContent =
    selectedRole;
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
  if (page === "dashboard") {
    dashboardPage.classList.remove("hidden");
    contentPage.classList.add("hidden");
    pageTitle.textContent =
      "Dashboard";
    return;
  }
  dashboardPage.classList.add("hidden");
  contentPage.classList.remove("hidden");
  pageTitle.textContent =
    data.title;
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
  const search =
    searchTerm.toLowerCase().trim();
  const filteredStudents =
    students.filter(function (student) {
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
        <div style="font-size:35px;">
          🔎
        </div>
        <h3 style="
          color:#172033;
          margin:10px 0;
        ">
          No students found
        </h3>
        <p>
          Try searching using another name,
          admission number or class.
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
            <th style="padding:13px 10px;">
              Admission No.
            </th>
            <th style="padding:13px 10px;">
              Student
            </th>
            <th style="padding:13px 10px;">
              Gender
            </th>
            <th style="padding:13px 10px;">
              Class
            </th>
            <th style="padding:13px 10px;">
              Parent/Guardian
            </th>
            <th style="padding:13px 10px;">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          ${filteredStudents.map(function (student) {
            return `
              <tr style="
                border-bottom:1px solid #f1f5f9;
              ">
                <td style="padding:15px 10px;">
                  <strong>
                    ${student.admission}
                  </strong>
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
   ADD STUDENT
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
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:18px;
        ">
          <div>
            <label>Admission Number</label>
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
            <label>Full Name</label>
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
              <option value="">
                Select gender
              </option>
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
              <option value="">
                Select class
              </option>
              ${classes.map(c =>
                `<option>${c.name}</option>`
              ).join("")}
            </select>
          </div>
          <div style="grid-column:1/-1;">
            <label>Parent / Guardian Name</label>
            <input
              type="text"
              id="studentParent"
              placeholder="Enter parent or guardian"
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
          document
            .getElementById("studentAdmission")
            .value.trim(),
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
      };
      const duplicate =
        students.some(function (student) {
          return student.admission.toLowerCase() ===
            newStudent.admission.toLowerCase();
        });
      if (duplicate) {
        alert(
          "That admission number already exists."
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
   TEACHERS PAGE
   ========================================================= */
function renderTeachersPage() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Teachers</h1>
        <p>
          Manage teachers and teaching information.
        </p>
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
            ${teachers.length} registered teachers
          </p>
        </div>
        <input
          type="search"
          id="teacherSearch"
          placeholder="Search teachers..."
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
      <div id="teacherTableContainer"></div>
    </div>
  `;
  renderTeacherTable();
  document
    .getElementById("teacherSearch")
    .addEventListener("input", function () {
      renderTeacherTable(this.value);
    });
  document
    .getElementById("addTeacherButton")
    .addEventListener("click", function () {
      showAddTeacherForm();
    });
}
/* =========================================================
   TEACHER TABLE
   ========================================================= */
function renderTeacherTable(searchTerm = "") {
  const container =
    document.getElementById("teacherTableContainer");
  if (!container) {
    return;
  }
  const search =
    searchTerm.toLowerCase().trim();
  const filteredTeachers =
    teachers.filter(function (teacher) {
      return (
        teacher.name.toLowerCase().includes(search) ||
        teacher.id.toLowerCase().includes(search) ||
        teacher.subject.toLowerCase().includes(search) ||
        teacher.department.toLowerCase().includes(search)
      );
    });
  if (filteredTeachers.length === 0) {
    container.innerHTML = `
      <div style="
        text-align:center;
        padding:45px 20px;
        color:#6b7280;
      ">
        <div style="font-size:35px;">
          🔎
        </div>
        <h3 style="
          color:#172033;
          margin:10px 0;
        ">
          No teachers found
        </h3>
        <p>
          Try another name, teacher ID,
          subject or department.
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
        min-width:850px;
      ">
        <thead>
          <tr style="
            text-align:left;
            border-bottom:1px solid #e5e7eb;
          ">
            <th style="padding:13px 10px;">
              Teacher ID
            </th>
            <th style="padding:13px 10px;">
              Teacher
            </th>
            <th style="padding:13px 10px;">
              Gender
            </th>
            <th style="padding:13px 10px;">
              Subject
            </th>
            <th style="padding:13px 10px;">
              Department
            </th>
            <th style="padding:13px 10px;">
              Phone
            </th>
            <th style="padding:13px 10px;">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          ${filteredTeachers.map(function (teacher) {
            return `
              <tr style="
                border-bottom:1px solid #f1f5f9;
              ">
                <td style="padding:15px 10px;">
                  <strong>${teacher.id}</strong>
                </td>
                <td style="padding:15px 10px;">
                  ${teacher.name}
                </td>
                <td style="padding:15px 10px;">
                  ${teacher.gender}
                </td>
                <td style="padding:15px 10px;">
                  ${teacher.subject}
                </td>
                <td style="padding:15px 10px;">
                  ${teacher.department}
                </td>
                <td style="padding:15px 10px;">
                  ${teacher.phone}
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
                    ${teacher.status}
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
   ADD TEACHER
   ========================================================= */
function showAddTeacherForm() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Add Teacher</h1>
        <p>
          Register a new teacher in the school system.
        </p>
      </div>
      <button
        class="primary-button"
        id="backToTeachers"
      >
        ← Back to Teachers
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
              type="text"
              id="teacherId"
              placeholder="e.g. T005"
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
              type="text"
              id="teacherName"
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
              <option value="">
                Select gender
              </option>
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
              <option value="">
                Select subject
              </option>
              ${subjects.map(function(subject) {
                return `<option>${subject}</option>`;
              }).join("")}
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
              <option value="">
                Select department
              </option>
              <option>Sciences</option>
              <option>Languages</option>
              <option>Humanities</option>
              <option>Technical</option>
              <option>Mathematics</option>
              <option>Administration</option>
            </select>
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="tel"
              id="teacherPhone"
              placeholder="e.g. 0712345678"
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
    .getElementById("backToTeachers")
    .addEventListener("click", function () {
      showPage("teachers");
    });
  document
    .getElementById("cancelTeacher")
    .addEventListener("click", function () {
      showPage("teachers");
    });
  document
    .getElementById("teacherForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const newTeacher = {
        id:
          document
            .getElementById("teacherId")
            .value.trim(),
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
      };
      const duplicate =
        teachers.some(function (teacher) {
          return teacher.id.toLowerCase() ===
            newTeacher.id.toLowerCase();
        });
      if (duplicate) {
        alert(
          "That teacher ID already exists."
        );
        return;
      }
      teachers.push(newTeacher);
      alert(
        `${newTeacher.name} has been added successfully.`
      );
      showPage("teachers");
    });
}
/* =========================================================
   CLASSES PAGE
   ========================================================= */
function renderClassesPage() {
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
      <div id="classTableContainer"></div>
    </div>
  `;
  renderClassTable();
  document
    .getElementById("classSearch")
    .addEventListener("input", function () {
      renderClassTable(this.value);
    });
  document
    .getElementById("addClassButton")
    .addEventListener("click", function () {
      showAddClassForm();
    });
}
/* =========================================================
   CLASS TABLE
   ========================================================= */
function renderClassTable(searchTerm = "") {
  const container =
    document.getElementById("classTableContainer");
  if (!container) {
    return;
  }
  const search =
    searchTerm.toLowerCase().trim();
  const filteredClasses =
    classes.filter(function (item) {
      return (
        item.name.toLowerCase().includes(search) ||
        item.stream.toLowerCase().includes(search) ||
        item.teacher.toLowerCase().includes(search)
      );
    });
  if (filteredClasses.length === 0) {
    container.innerHTML = `
      <div style="
        text-align:center;
        padding:45px 20px;
        color:#6b7280;
      ">
        <div style="font-size:35px;">
          🔎
        </div>
        <h3 style="
          color:#172033;
          margin:10px 0;
        ">
          No classes found
        </h3>
      </div>
    `;
    return;
  }
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
            <th style="padding:13px 10px;">
              Class ID
            </th>
            <th style="padding:13px 10px;">
              Class
            </th>
            <th style="padding:13px 10px;">
              Stream
            </th>
            <th style="padding:13px 10px;">
              Class Teacher
            </th>
            <th style="padding:13px 10px;">
              Students
            </th>
            <th style="padding:13px 10px;">
              Capacity
            </th>
            <th style="padding:13px 10px;">
              Subjects
            </th>
          </tr>
        </thead>
        <tbody>
          ${filteredClasses.map(function (item) {
            const studentCount =
              students.filter(function(student) {
                return student.className === item.name;
              }).length;
            return `
              <tr style="
                border-bottom:1px solid #f1f5f9;
              ">
                <td style="padding:15px 10px;">
                  <strong>
                    ${item.id}
                  </strong>
                </td>
                <td style="padding:15px 10px;">
                  <strong>
                    ${item.name}
                  </strong>
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
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}
/* =========================================================
   ADD CLASS FORM
   ========================================================= */
function showAddClassForm() {
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Add Class</h1>
        <p>
          Create a new school class and assign its teacher.
        </p>
      </div>
      <button
        class="primary-button"
        id="backToClasses"
      >
        ← Back to Classes
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
              type="text"
              id="classId"
              placeholder="e.g. C006"
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
              <option value="">
                Select class
              </option>
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
              <option value="">
                Select stream
              </option>
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
              <option value="">
                Select teacher
              </option>
              ${teachers.map(function(teacher) {
                return `
                  <option>
                    ${teacher.name}
                  </option>
                `;
              }).join("")}
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
              ${subjects.map(function(subject) {
                return `
                  <option value="${subject}">
                    ${subject}
                  </option>
                `;
              }).join("")}
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
    .getElementById("backToClasses")
    .addEventListener("click", function () {
      showPage("classes");
    });
  document
    .getElementById("cancelClass")
    .addEventListener("click", function () {
      showPage("classes");
    });
  document
    .getElementById("classForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const selectedSubjects =
        Array.from(
          document.getElementById("classSubjects").selectedOptions
        ).map(function(option) {
          return option.value;
        });
      if (selectedSubjects.length === 0) {
        alert(
          "Please select at least one subject."
        );
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
        subjects:
          selectedSubjects
      };
      const duplicate =
        classes.some(function(item) {
          return (
            item.id.toLowerCase() ===
            newClass.id.toLowerCase()
          );
        });
      if (duplicate) {
        alert(
          "That class ID already exists."
        );
        return;
      }
      const classExists =
        classes.some(function(item) {
          return (
            item.name.toLowerCase() ===
            newClass.name.toLowerCase()
          );
        });
      if (classExists) {
        alert(
          "That class already exists."
        );
        return;
      }
      classes.push(newClass);
      alert(
        `${newClass.name} has been created successfully.`
      );
      showPage("classes");
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
        <h1>
          ${data.title}
        </h1>
        <p>
          ${data.description}
        </p>
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
   ANNOUNCEMENTS BUTTON
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
  profileName.textContent =
    "Administrator";
  profileRole.textContent =
    "Administrator";
  profileAvatar.textContent =
    "A";
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
