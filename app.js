/* =========================================================
   KIRIMUNGE SENIOR SCHOOL MANAGEMENT SYSTEM
   Students + Teachers + Classes + Attendance
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
   ATTENDANCE RECORDS
   ========================================================= */
let attendanceRecords = [];
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
            ${students.length} students registered
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
    .addEventListener("input", function() {
      renderStudentTable(this.value);
    });
  document
    .getElementById("addStudentButton")
    .addEventListener("click", showAddStudentForm);
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
    students.filter(function(student) {
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
      </div>
    `;
    return;
  }
  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table style="
        width:100%;
        border-collapse:collapse;
        min-width:900px;
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
            <th style="padding:13px 10px;">Parent</th>
            <th style="padding:13px 10px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${filteredStudents.map(function(student) {
            return `
              <tr style="
                border-bottom:1px solid #f1f5f9;
              ">
                <td style="padding:15px 10px;">
                  <strong>${student.admission}</strong>
                </td>
                <td style="padding:15px 10px;">
                  <strong>${student.name}</strong>
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
                    color:#15803d;
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
        <p>Register a new student.</p>
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
              id="studentAdmission"
              type="text"
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
            <label>Student Name</label>
            <input
              id="studentName"
              type="text"
              placeholder="Full name"
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
              ${classes.map(function(item) {
                return `<option>${item.name}</option>`;
              }).join("")}
            </select>
          </div>
          <div>
            <label>Parent / Guardian</label>
            <input
              id="studentParent"
              type="text"
              placeholder="Parent or guardian name"
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
    .addEventListener("click", function() {
      showPage("students");
    });
  document
    .getElementById("cancelStudent")
    .addEventListener("click", function() {
      showPage("students");
    });
  document
    .getElementById("studentForm")
    .addEventListener("submit", function(event) {
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
      const duplicate =
        students.some(function(student) {
          return student.admission.toLowerCase() ===
            newStudent.admission.toLowerCase();
        });
      if (duplicate) {
        alert("That admission number already exists.");
        return;
      }
      students.push(newStudent);
      alert(
        `${newStudent.name} has been registered successfully.`
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
        <p>Manage teachers and teaching information.</p>
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
    .addEventListener("input", function() {
      renderTeacherTable(this.value);
    });
  document
    .getElementById("addTeacherButton")
    .addEventListener("click", showAddTeacherForm);
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
    teachers.filter(function(teacher) {
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
        <div style="font-size:35px;">🔎</div>
        <h3 style="
          color:#172033;
          margin:10px 0;
        ">
          No teachers found
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
        min-width:900px;
      ">
        <thead>
          <tr style="
            text-align:left;
            border-bottom:1px solid #e5e7eb;
          ">
            <th style="padding:13px 10px;">Teacher ID</th>
            <th style="padding:13px 10px;">Teacher</th>
            <th style="padding:13px 10px;">Gender</th>
            <th style="padding:13px 10px;">Subject</th>
            <th style="padding:13px 10px;">Department</th>
            <th style="padding:13px 10px;">Phone</th>
          </tr>
        </thead>
        <tbody>
          ${filteredTeachers.map(function(teacher) {
            return `
              <tr style="
                border-bottom:1px solid #f1f5f9;
              ">
                <td style="padding:15px 10px;">
                  <strong>${teacher.id}</strong>
                </td>
                <td style="padding:15px 10px;">
                  <strong>${teacher.name}</strong>
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
        <p>Register a new teacher.</p>
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
              id="teacherId"
              type="text"
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
            <label>Teacher Name</label>
            <input
              id="teacherName"
              type="text"
              placeholder="Full name"
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
              <option value="">Select department</option>
              <option>Sciences</option>
              <option>Languages</option>
              <option>Humanities</option>
              <option>Technical</option>
              <option>Creative Arts</option>
            </select>
          </div>
          <div>
            <label>Phone</label>
            <input
              id="teacherPhone"
              type="tel"
              placeholder="e.g. 0712 345 678"
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
    .addEventListener("click", function() {
      showPage("teachers");
    });
  document
    .getElementById("cancelTeacher")
    .addEventListener("click", function() {
      showPage("teachers");
    });
  document
    .getElementById("teacherForm")
    .addEventListener("submit", function(event) {
      event.preventDefault();
      const newTeacher = {
        id:
          document.getElementById("teacherId").value.trim(),
        name:
          document.getElementById("teacherName").value.trim(),
        gender:
          document.getElementById("teacherGender").value,
        subject:
          document.getElementById("teacherSubject").value,
        department:
          document.getElementById("teacherDepartment").value,
        phone:
          document.getElementById("teacherPhone").value.trim(),
        status: "Active"
      };
      const duplicate =
        teachers.some(function(teacher) {
          return teacher.id.toLowerCase() ===
            newTeacher.id.toLowerCase();
        });
      if (duplicate) {
        alert("That teacher ID already exists.");
        return;
      }
      teachers.push(newTeacher);
      alert(
        `${newTeacher.name} has been registered successfully.`
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
    .addEventListener("input", function() {
      renderClassTable(this.value);
    });
  document
    .getElementById("addClassButton")
    .addEventListener("click", showAddClassForm);
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
    classes.filter(function(item) {
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
        <div style="font-size:35px;">🔎</div>
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
          ${filteredClasses.map(function(item) {
            const studentCount =
              students.filter(function(student) {
                return student.className === item.name;
              }).length;
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
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}
/* =========================================================
   ADD CLASS
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
              ${teachers.map(function(teacher) {
                return `<option>${teacher.name}</option>`;
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
    .addEventListener("click", function() {
      showPage("classes");
    });
  document
    .getElementById("cancelClass")
    .addEventListener("click", function() {
      showPage("classes");
    });
  document
    .getElementById("classForm")
    .addEventListener("submit", function(event) {
      event.preventDefault();
      const selectedSubjects =
        Array.from(
          document.getElementById("classSubjects").selectedOptions
        ).map(function(option) {
          return option.value;
        });
      if (selectedSubjects.length === 0) {
        alert("Please select at least one subject.");
        return;
      }
      const newClass = {
        id:
          document.getElementById("classId").value.trim(),
        name:
          document.getElementById("className").value,
        stream:
          document.getElementById("classStream").value,
        teacher:
          document.getElementById("classTeacher").value,
        capacity:
          Number(
            document.getElementById("classCapacity").value
          ),
        subjects:
          selectedSubjects
      };
      const duplicate =
        classes.some(function(item) {
          return item.id.toLowerCase() ===
            newClass.id.toLowerCase();
        });
      if (duplicate) {
        alert("That class ID already exists.");
        return;
      }
      const classExists =
        classes.some(function(item) {
          return item.name.toLowerCase() ===
            newClass.name.toLowerCase();
        });
      if (classExists) {
        alert("That class already exists.");
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
   ATTENDANCE PAGE
   ========================================================= */
function renderAttendancePage() {
  const today =
    new Date().toISOString().split("T")[0];
  contentPage.innerHTML = `
    <div class="content-header">
      <div>
        <h1>Attendance</h1>
        <p>
          Record and monitor daily student attendance.
        </p>
      </div>
    </div>
    <div class="panel">
      <div style="
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:18px;
        margin-bottom:25px;
      ">
        <div>
          <label
            for="attendanceDate"
            style="
              display:block;
              font-weight:600;
              margin-bottom:8px;
            "
          >
            Attendance Date
          </label>
          <input
            type="date"
            id="attendanceDate"
            value="${today}"
            style="
              width:100%;
              padding:12px;
              border:1px solid #e5e7eb;
              border-radius:9px;
            "
          >
        </div>
        <div>
          <label
            for="attendanceClass"
            style="
              display:block;
              font-weight:600;
              margin-bottom:8px;
            "
          >
            Select Class
          </label>
          <select
            id="attendanceClass"
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
            ${classes.map(function(item) {
              return `
                <option value="${item.name}">
                  ${item.name}
                </option>
              `;
            }).join("")}
          </select>
        </div>
      </div>
      <div id="attendanceArea">
        <div style="
          text-align:center;
          padding:50px 20px;
          color:#6b7280;
        ">
          <div style="font-size:40px;">
            ✅
          </div>
          <h3 style="
            color:#172033;
            margin:12px 0 7px;
          ">
            Select a class
          </h3>
          <p>
            Choose a class above to load its students.
          </p>
        </div>
      </div>
    </div>
  `;
  document
    .getElementById("attendanceClass")
    .addEventListener("change", function() {
      renderAttendanceStudents();
    });
  document
    .getElementById("attendanceDate")
    .addEventListener("change", function() {
      const classSelect =
        document.getElementById("attendanceClass");
      if (classSelect.value) {
        renderAttendanceStudents();
      }
    });
}
/* =========================================================
   LOAD STUDENTS FOR ATTENDANCE
   ========================================================= */
function renderAttendanceStudents() {
  const date =
    document.getElementById("attendanceDate").value;
  const className =
    document.getElementById("attendanceClass").value;
  const area =
    document.getElementById("attendanceArea");
  if (!date || !className) {
    area.innerHTML = `
      <div style="
        text-align:center;
        padding:45px 20px;
        color:#6b7280;
      ">
        Please select both a date and class.
      </div>
    `;
    return;
  }
  const classStudents =
    students.filter(function(student) {
      return student.className === className &&
             student.status === "Active";
    });
  if (classStudents.length === 0) {
    area.innerHTML = `
      <div style="
        text-align:center;
        padding:45px 20px;
        color:#6b7280;
      ">
        <div style="font-size:38px;">
          👨‍🎓
        </div>
        <h3 style="
          color:#172033;
          margin:10px 0;
        ">
          No students found
        </h3>
        <p>
          There are no active students registered in ${className}.
        </p>
      </div>
    `;
    return;
  }
  const existingRecord =
    attendanceRecords.find(function(record) {
      return (
        record.date === date &&
        record.className === className
      );
    });
  const attendanceMap = {};
  classStudents.forEach(function(student) {
    attendanceMap[student.admission] =
      existingRecord
        ? (
            existingRecord.students.find(function(item) {
              return item.admission === student.admission;
            })?.status || "Present"
          )
        : "Present";
  });
  area.innerHTML = `
    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:15px;
      flex-wrap:wrap;
      margin-bottom:20px;
    ">
      <div>
        <h3>
          ${className} Attendance
        </h3>
        <p style="
          color:#6b7280;
          font-size:13px;
          margin-top:4px;
        ">
          ${formatAttendanceDate(date)}
          · ${classStudents.length} students
        </p>
      </div>
      <div style="
        display:flex;
        gap:8px;
        flex-wrap:wrap;
      ">
        <button
          type="button"
          id="markAllPresent"
          style="
            border:1px solid #bbf7d0;
            background:#f0fdf4;
            color:#15803d;
            padding:9px 12px;
            border-radius:8px;
            font-weight:600;
          "
        >
          ✓ Mark All Present
        </button>
        <button
          type="button"
          id="markAllAbsent"
          style="
            border:1px solid #fecaca;
            background:#fef2f2;
            color:#dc2626;
            padding:9px 12px;
            border-radius:8px;
            font-weight:600;
          "
        >
          ✕ Mark All Absent
        </button>
      </div>
    </div>
    <div style="
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:12px;
      margin-bottom:22px;
    ">
      <div style="
        background:#f0fdf4;
        border:1px solid #dcfce7;
        padding:15px;
        border-radius:12px;
      ">
        <small style="color:#15803d;">
          Present
        </small>
        <strong
          id="presentCount"
          style="
            display:block;
            font-size:24px;
            margin-top:4px;
          "
        >
          0
        </strong>
      </div>
      <div style="
        background:#fef2f2;
        border:1px solid #fee2e2;
        padding:15px;
        border-radius:12px;
      ">
        <small style="color:#dc2626;">
          Absent
        </small>
        <strong
          id="absentCount"
          style="
            display:block;
            font-size:24px;
            margin-top:4px;
          "
        >
          0
        </strong>
      </div>
      <div style="
        background:#fffbeb;
        border:1px solid #fef3c7;
        padding:15px;
        border-radius:12px;
      ">
        <small style="color:#b45309;">
          Late
        </small>
        <strong
          id="lateCount"
          style="
            display:block;
            font-size:24px;
            margin-top:4px;
          "
        >
          0
        </strong>
      </div>
    </div>
    <div style="overflow-x:auto;">
      <table style="
        width:100%;
        border-collapse:collapse;
        min-width:700px;
      ">
        <thead>
          <tr style="
            text-align:left;
            border-bottom:1px solid #e5e7eb;
          ">
            <th style="padding:13px 10px;">
              #
            </th>
            <th style="padding:13px 10px;">
              Admission No.
            </th>
            <th style="padding:13px 10px;">
              Student
            </th>
            <th style="padding:13px 10px;">
              Attendance
            </th>
          </tr>
        </thead>
        <tbody>
          ${classStudents.map(function(student, index) {
            const status =
              attendanceMap[student.admission];
            return `
              <tr
                data-admission="${student.admission}"
                style="
                  border-bottom:1px solid #f1f5f9;
                "
              >
                <td style="padding:15px 10px;">
                  ${index + 1}
                </td>
                <td style="padding:15px 10px;">
                  <strong>
                    ${student.admission}
                  </strong>
                </td>
                <td style="padding:15px 10px;">
                  <strong>
                    ${student.name}
                  </strong>
                </td>
                <td style="padding:15px 10px;">
                  <div style="
                    display:flex;
                    gap:7px;
                    flex-wrap:wrap;
                  ">
                    <button
                      type="button"
                      class="attendance-status-button"
                      data-status="Present"
                      data-admission="${student.admission}"
                      style="
                        padding:8px 12px;
                        border-radius:8px;
                        border:1px solid #bbf7d0;
                        cursor:pointer;
                        font-weight:600;
                        background:${
                          status === "Present"
                            ? "#16a34a"
                            : "#f0fdf4"
                        };
                        color:${
                          status === "Present"
                            ? "white"
                            : "#15803d"
                        };
                      "
                    >
                      ✓ Present
                    </button>
                    <button
                      type="button"
                      class="attendance-status-button"
                      data-status="Absent"
                      data-admission="${student.admission}"
                      style="
                        padding:8px 12px;
                        border-radius:8px;
                        border:1px solid #fecaca;
                        cursor:pointer;
                        font-weight:600;
                        background:${
                          status === "Absent"
                            ? "#dc2626"
                            : "#fef2f2"
                        };
                        color:${
                          status === "Absent"
                            ? "white"
                            : "#dc2626"
                        };
                      "
                    >
                      ✕ Absent
                    </button>
                    <button
                      type="button"
                      class="attendance-status-button"
                      data-status="Late"
                      data-admission="${student.admission}"
                      style="
                        padding:8px 12px;
                        border-radius:8px;
                        border:1px solid #fde68a;
                        cursor:pointer;
                        font-weight:600;
                        background:${
                          status === "Late"
                            ? "#d97706"
                            : "#fffbeb"
                        };
                        color:${
                          status === "Late"
                            ? "white"
                            : "#b45309"
                        };
                      "
                    >
                      ⏰ Late
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
    <div style="
      display:flex;
      justify-content:flex-end;
      margin-top:22px;
    ">
      <button
        class="primary-button"
        id="saveAttendance"
      >
        💾 Save Attendance
      </button>
    </div>
  `;
  let statuses = {};
  classStudents.forEach(function(student) {
    statuses[student.admission] =
      attendanceMap[student.admission];
  });
  function updateSummary() {
    const values =
      Object.values(statuses);
    const present =
      values.filter(status => status === "Present").length;
    const absent =
      values.filter(status => status === "Absent").length;
    const late =
      values.filter(status => status === "Late").length;
    document.getElementById("presentCount").textContent =
      present;
    document.getElementById("absentCount").textContent =
      absent;
    document.getElementById("lateCount").textContent =
      late;
  }
  function refreshButtons() {
    document
      .querySelectorAll(".attendance-status-button")
      .forEach(function(button) {
        const admission =
          button.dataset.admission;
        const status =
          button.dataset.status;
        const active =
          statuses[admission] === status;
        if (status === "Present") {
          button.style.background =
            active ? "#16a34a" : "#f0fdf4";
          button.style.color =
            active ? "white" : "#15803d";
        }
        if (status === "Absent") {
          button.style.background =
            active ? "#dc2626" : "#fef2f2";
          button.style.color =
            active ? "white" : "#dc2626";
        }
        if (status === "Late") {
          button.style.background =
            active ? "#d97706" : "#fffbeb";
          button.style.color =
            active ? "white" : "#b45309";
        }
      });
    updateSummary();
  }
  document
    .querySelectorAll(".attendance-status-button")
    .forEach(function(button) {
      button.addEventListener("click", function() {
        statuses[this.dataset.admission] =
          this.dataset.status;
        refreshButtons();
      });
    });
  document
    .getElementById("markAllPresent")
    .addEventListener("click", function() {
      classStudents.forEach(function(student) {
        statuses[student.admission] =
          "Present";
      });
      refreshButtons();
    });
  document
    .getElementById("markAllAbsent")
    .addEventListener("click", function() {
      classStudents.forEach(function(student) {
        statuses[student.admission] =
          "Absent";
      });
      refreshButtons();
    });
  document
    .getElementById("saveAttendance")
    .addEventListener("click", function() {
      saveAttendanceRecord(
        date,
        className,
        classStudents,
        statuses
      );
    });
  refreshButtons();
}
/* =========================================================
   SAVE ATTENDANCE
   ========================================================= */
function saveAttendanceRecord(
  date,
  className,
  classStudents,
  statuses
) {
  const recordStudents =
    classStudents.map(function(student) {
      return {
        admission:
          student.admission,
        name:
          student.name,
        status:
          statuses[student.admission] || "Present"
      };
    });
  const existingIndex =
    attendanceRecords.findIndex(function(record) {
      return (
        record.date === date &&
        record.className === className
      );
    });
  const record = {
    date: date,
    className: className,
    students: recordStudents,
    savedAt: new Date().toISOString()
  };
  if (existingIndex !== -1) {
    attendanceRecords[existingIndex] =
      record;
  } else {
    attendanceRecords.push(record);
  }
  const present =
    recordStudents.filter(
      student => student.status === "Present"
    ).length;
  const absent =
    recordStudents.filter(
      student => student.status === "Absent"
    ).length;
  const late =
    recordStudents.filter(
      student => student.status === "Late"
    ).length;
  alert(
    `Attendance saved successfully!\n\n` +
    `${className}\n` +
    `${formatAttendanceDate(date)}\n\n` +
    `Present: ${present}\n` +
    `Absent: ${absent}\n` +
    `Late: ${late}`
  );
}
/* =========================================================
   ATTENDANCE DATE FORMAT
   ========================================================= */
function formatAttendanceDate(dateString) {
  const date =
    new Date(dateString + "T00:00:00");
  return date.toLocaleDateString(
    "en-KE",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );
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
