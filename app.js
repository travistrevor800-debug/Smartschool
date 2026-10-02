// ============================================================
// KIRIMUNGE SENIOR SCHOOL MANAGEMENT SYSTEM
// Frontend Demo Version
// ============================================================

// -------------------- DOM ELEMENTS --------------------

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


// ============================================================
// SAMPLE DATA
// ============================================================

let students = [
  {
    admission: "KS001",
    name: "Brian Mwangi",
    gender: "Male",
    className: "Form 4A",
    parent: "John Mwangi"
  },
  {
    admission: "KS002",
    name: "Faith Wanjiku",
    gender: "Female",
    className: "Form 3B",
    parent: "Mary Wanjiku"
  },
  {
    admission: "KS003",
    name: "Kevin Kamau",
    gender: "Male",
    className: "Form 2A",
    parent: "Peter Kamau"
  },
  {
    admission: "KS004",
    name: "Sharon Njeri",
    gender: "Female",
    className: "Form 1A",
    parent: "Jane Njeri"
  },
  {
    admission: "KS005",
    name: "Daniel Kariuki",
    gender: "Male",
    className: "Form 4A",
    parent: "David Kariuki"
  }
];


let teachers = [
  {
    id: "T001",
    name: "Peter Kamau",
    gender: "Male",
    subject: "Mathematics",
    department: "Sciences",
    phone: "0712345678"
  },
  {
    id: "T002",
    name: "Mary Wanjiku",
    gender: "Female",
    subject: "English",
    department: "Languages",
    phone: "0723456789"
  },
  {
    id: "T003",
    name: "James Kariuki",
    gender: "Male",
    subject: "Biology",
    department: "Sciences",
    phone: "0734567890"
  },
  {
    id: "T004",
    name: "Jane Njeri",
    gender: "Female",
    subject: "History",
    department: "Humanities",
    phone: "0745678901"
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
    className: "Form 1A",
    stream: "A",
    teacher: "Mary Wanjiku",
    capacity: 45,
    subjects: ["Mathematics", "English", "Kiswahili", "Biology"]
  },
  {
    id: "C002",
    className: "Form 1B",
    stream: "B",
    teacher: "James Kariuki",
    capacity: 45,
    subjects: ["Mathematics", "English", "Kiswahili", "History"]
  },
  {
    id: "C003",
    className: "Form 2A",
    stream: "A",
    teacher: "Peter Kamau",
    capacity: 45,
    subjects: ["Mathematics", "English", "Biology", "Chemistry"]
  },
  {
    id: "C004",
    className: "Form 3B",
    stream: "B",
    teacher: "Jane Njeri",
    capacity: 45,
    subjects: ["History", "Geography", "English", "Kiswahili"]
  },
  {
    id: "C005",
    className: "Form 4A",
    stream: "A",
    teacher: "Peter Kamau",
    capacity: 45,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology"]
  }
];


let attendanceRecords = [];


let results = [
  {
    admission: "KS001",
    student: "Brian Mwangi",
    className: "Form 4A",
    subject: "Mathematics",
    marks: 78,
    grade: "B"
  },
  {
    admission: "KS002",
    student: "Faith Wanjiku",
    className: "Form 3B",
    subject: "English",
    marks: 84,
    grade: "A"
  },
  {
    admission: "KS003",
    student: "Kevin Kamau",
    className: "Form 2A",
    subject: "Biology",
    marks: 67,
    grade: "C"
  }
];


let assignments = [
  {
    id: "A001",
    title: "Algebra Exercise",
    subject: "Mathematics",
    className: "Form 4A",
    dueDate: "2026-10-08",
    teacher: "Peter Kamau",
    status: "Active"
  },
  {
    id: "A002",
    title: "English Composition",
    subject: "English",
    className: "Form 3B",
    dueDate: "2026-10-10",
    teacher: "Mary Wanjiku",
    status: "Active"
  }
];


let announcements = [
  {
    id: "N001",
    title: "School Assembly",
    message: "All students should attend the morning assembly.",
    audience: "Everyone",
    date: "Today"
  },
  {
    id: "N002",
    title: "Parents Meeting",
    message: "Parents meeting will be held this Friday.",
    audience: "Parents",
    date: "Today"
  }
];


// ============================================================
// FEES DATA
// ============================================================

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


// ============================================================
// PAGE DATA
// ============================================================

const pageData = {

  dashboard: {
    title: "Dashboard",
    subtitle: "Kirimunge Senior School overview"
  },

  students: {
    title: "Students",
    subtitle: "Manage student records"
  },

  teachers: {
    title: "Teachers",
    subtitle: "Manage teaching staff"
  },

  classes: {
    title: "Classes",
    subtitle: "Manage classes and streams"
  },

  attendance: {
    title: "Attendance",
    subtitle: "Track student attendance"
  },

  results: {
    title: "Results",
    subtitle: "Manage academic results"
  },

  assignments: {
    title: "Assignments",
    subtitle: "Manage student assignments"
  },

  announcements: {
    title: "Announcements",
    subtitle: "School announcements"
  },

  fees: {
    title: "Fees",
    subtitle: "Manage student fees and payments"
  }

};


const roleNames = {
  student: "Student",
  teacher: "Teacher",
  parent: "Parent",
  admin: "Administrator"
};


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function money(amount) {
  return `KSh ${Number(amount || 0).toLocaleString()}`;
}


function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function getFeeBalance(record) {
  return Math.max(0, Number(record.total) - Number(record.paid));
}


function getFeeStatus(record) {
  const balance = getFeeBalance(record);

  if (balance <= 0) {
    return "Paid";
  }

  if (record.paid > 0) {
    return "Partially Paid";
  }

  return "Not Paid";
}


// ============================================================
// LOGIN
// ============================================================

loginForm?.addEventListener("submit", function (event) {

  event.preventDefault();

  const role = userRole.value;
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!role || !username || !password) {
    alert("Please fill in all login fields.");
    return;
  }

  const displayName =
    username.charAt(0).toUpperCase() + username.slice(1);

  profileName.textContent = displayName;
  profileRole.textContent = roleNames[role] || role;
  profileAvatar.textContent = displayName.charAt(0).toUpperCase();

  welcomeMessage.textContent =
    `Welcome back, ${displayName}!`;

  loginPage.classList.add("hidden");
  appPage.classList.remove("hidden");

  showPage("dashboard");

});


// ============================================================
// NAVIGATION
// ============================================================

navigationItems.forEach(item => {

  item.addEventListener("click", function () {

    const page = this.dataset.page;

    if (page) {
      showPage(page);
    }

  });

});


function showPage(page) {

  navigationItems.forEach(item => {

    item.classList.toggle(
      "active",
      item.dataset.page === page
    );

  });


  if (pageTitle && pageData[page]) {
    pageTitle.textContent = pageData[page].title;
  }


  if (page === "dashboard") {

    dashboardPage.classList.remove("hidden");
    contentPage.classList.add("hidden");

    updateDashboard();

    return;
  }


  dashboardPage.classList.add("hidden");
  contentPage.classList.remove("hidden");


  if (page === "students") {
    renderStudentsPage();
  }

  else if (page === "teachers") {
    renderTeachersPage();
  }

  else if (page === "classes") {
    renderClassesPage();
  }

  else if (page === "attendance") {
    renderAttendancePage();
  }

  else if (page === "results") {
    renderResultsPage();
  }

  else if (page === "assignments") {
    renderAssignmentsPage();
  }

  else if (page === "announcements") {
    renderAnnouncementsPage();
  }

  else if (page === "fees") {
    renderFeesPage();
  }

}


// ============================================================
// DASHBOARD
// ============================================================

function updateDashboard() {

  const totalFees = fees.reduce(
    (sum, item) => sum + Number(item.total),
    0
  );

  const totalPaid = fees.reduce(
    (sum, item) => sum + Number(item.paid),
    0
  );

  const outstanding = totalFees - totalPaid;


  const stats = document.querySelectorAll(".stat-card");


  if (stats.length >= 4) {

    const values = [
      students.length,
      teachers.length,
      classes.length,
      money(outstanding)
    ];


    stats.forEach((card, index) => {

      const valueElement =
        card.querySelector(".stat-value");

      if (valueElement && values[index] !== undefined) {
        valueElement.textContent = values[index];
      }

    });

  }

}


// ============================================================
// STUDENTS
// ============================================================

function renderStudentsPage(searchTerm = "") {

  contentPage.innerHTML = `

    <div class="content-header">

      <div>
        <h2>Students</h2>
        <p>Manage all student records.</p>
      </div>

      <button class="primary-button"
        onclick="showAddStudentForm()">
        + Add Student
      </button>

    </div>


    <div class="panel">

      <input
        type="search"
        id="studentSearch"
        placeholder="Search students..."
        value="${escapeHTML(searchTerm)}"
        oninput="renderStudentTable(this.value)"
        style="width:100%;padding:12px;margin-bottom:18px;border:1px solid #ddd;border-radius:8px;"
      />

      <div id="studentTable"></div>

    </div>

  `;

  renderStudentTable(searchTerm);
}


function renderStudentTable(searchTerm = "") {

  const table = document.getElementById("studentTable");

  if (!table) return;


  const term = searchTerm.toLowerCase();

  const filtered = students.filter(student =>

    student.name.toLowerCase().includes(term) ||
    student.admission.toLowerCase().includes(term) ||
    student.className.toLowerCase().includes(term)

  );


  table.innerHTML = `

    <div style="overflow-x:auto;">

      <table style="width:100%;border-collapse:collapse;">

        <thead>

          <tr>
            <th style="padding:12px;text-align:left;">Admission</th>
            <th style="padding:12px;text-align:left;">Name</th>
            <th style="padding:12px;text-align:left;">Gender</th>
            <th style="padding:12px;text-align:left;">Class</th>
            <th style="padding:12px;text-align:left;">Parent</th>
          </tr>

        </thead>

        <tbody>

          ${
            filtered.map(student => `

              <tr>

                <td style="padding:12px;">
                  ${escapeHTML(student.admission)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(student.name)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(student.gender)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(student.className)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(student.parent)}
                </td>

              </tr>

            `).join("")
          }

        </tbody>

      </table>

    </div>

  `;

}


function showAddStudentForm() {

  contentPage.innerHTML = `

    <div class="content-header">
      <h2>Add Student</h2>
    </div>


    <div class="panel">

      <form id="addStudentForm">

        <input name="admission"
          placeholder="Admission Number"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <input name="name"
          placeholder="Student Name"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <select name="gender"
          style="width:100%;padding:12px;margin-bottom:10px;">

          <option>Male</option>
          <option>Female</option>

        </select>

        <input name="className"
          placeholder="Class e.g. Form 4A"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <input name="parent"
          placeholder="Parent / Guardian"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <button class="primary-button">
          Save Student
        </button>

      </form>

    </div>

  `;


  document
    .getElementById("addStudentForm")
    .addEventListener("submit", function(event) {

      event.preventDefault();

      const data = new FormData(this);

      const admission = data.get("admission").trim();

      if (students.some(s => s.admission === admission)) {
        alert("Admission number already exists.");
        return;
      }


      students.push({

        admission,
        name: data.get("name").trim(),
        gender: data.get("gender"),
        className: data.get("className").trim(),
        parent: data.get("parent").trim()

      });


      alert("Student added successfully.");

      showPage("students");

    });

}


// ============================================================
// TEACHERS
// ============================================================

function renderTeachersPage(searchTerm = "") {

  contentPage.innerHTML = `

    <div class="content-header">

      <div>
        <h2>Teachers</h2>
        <p>Manage teaching staff.</p>
      </div>

      <button class="primary-button"
        onclick="showAddTeacherForm()">
        + Add Teacher
      </button>

    </div>


    <div class="panel">

      <input
        type="search"
        placeholder="Search teachers..."
        value="${escapeHTML(searchTerm)}"
        oninput="renderTeacherTable(this.value)"
        style="width:100%;padding:12px;margin-bottom:18px;border:1px solid #ddd;border-radius:8px;"
      />

      <div id="teacherTable"></div>

    </div>

  `;

  renderTeacherTable(searchTerm);
}


function renderTeacherTable(searchTerm = "") {

  const table = document.getElementById("teacherTable");

  if (!table) return;


  const term = searchTerm.toLowerCase();

  const filtered = teachers.filter(teacher =>

    teacher.name.toLowerCase().includes(term) ||
    teacher.subject.toLowerCase().includes(term) ||
    teacher.department.toLowerCase().includes(term)

  );


  table.innerHTML = `

    <div style="overflow-x:auto;">

      <table style="width:100%;border-collapse:collapse;">

        <thead>
          <tr>
            <th style="padding:12px;text-align:left;">ID</th>
            <th style="padding:12px;text-align:left;">Name</th>
            <th style="padding:12px;text-align:left;">Subject</th>
            <th style="padding:12px;text-align:left;">Department</th>
            <th style="padding:12px;text-align:left;">Phone</th>
          </tr>
        </thead>

        <tbody>

          ${
            filtered.map(teacher => `

              <tr>

                <td style="padding:12px;">
                  ${escapeHTML(teacher.id)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(teacher.name)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(teacher.subject)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(teacher.department)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(teacher.phone)}
                </td>

              </tr>

            `).join("")
          }

        </tbody>

      </table>

    </div>

  `;

}


function showAddTeacherForm() {

  contentPage.innerHTML = `

    <div class="content-header">
      <h2>Add Teacher</h2>
    </div>

    <div class="panel">

      <form id="addTeacherForm">

        <input name="id"
          placeholder="Teacher ID"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <input name="name"
          placeholder="Teacher Name"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <select name="gender"
          style="width:100%;padding:12px;margin-bottom:10px;">

          <option>Male</option>
          <option>Female</option>

        </select>

        <input name="subject"
          placeholder="Subject"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <input name="department"
          placeholder="Department"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <input name="phone"
          placeholder="Phone"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <button class="primary-button">
          Save Teacher
        </button>

      </form>

    </div>

  `;


  document
    .getElementById("addTeacherForm")
    .addEventListener("submit", function(event) {

      event.preventDefault();

      const data = new FormData(this);

      const id = data.get("id").trim();

      if (teachers.some(t => t.id === id)) {
        alert("Teacher ID already exists.");
        return;
      }


      teachers.push({

        id,
        name: data.get("name").trim(),
        gender: data.get("gender"),
        subject: data.get("subject").trim(),
        department: data.get("department").trim(),
        phone: data.get("phone").trim()

      });


      alert("Teacher added successfully.");

      showPage("teachers");

    });

}


// ============================================================
// CLASSES
// ============================================================

function renderClassesPage(searchTerm = "") {

  contentPage.innerHTML = `

    <div class="content-header">

      <div>
        <h2>Classes</h2>
        <p>Manage school classes.</p>
      </div>

      <button class="primary-button"
        onclick="showAddClassForm()">
        + Add Class
      </button>

    </div>


    <div class="panel">

      <input
        type="search"
        placeholder="Search classes..."
        value="${escapeHTML(searchTerm)}"
        oninput="renderClassTable(this.value)"
        style="width:100%;padding:12px;margin-bottom:18px;border:1px solid #ddd;border-radius:8px;"
      />

      <div id="classTable"></div>

    </div>

  `;

  renderClassTable(searchTerm);
}


function renderClassTable(searchTerm = "") {

  const table = document.getElementById("classTable");

  if (!table) return;


  const term = searchTerm.toLowerCase();

  const filtered = classes.filter(item =>

    item.className.toLowerCase().includes(term) ||
    item.stream.toLowerCase().includes(term) ||
    item.teacher.toLowerCase().includes(term)

  );


  table.innerHTML = `

    <div style="overflow-x:auto;">

      <table style="width:100%;border-collapse:collapse;">

        <thead>

          <tr>
            <th style="padding:12px;text-align:left;">ID</th>
            <th style="padding:12px;text-align:left;">Class</th>
            <th style="padding:12px;text-align:left;">Stream</th>
            <th style="padding:12px;text-align:left;">Teacher</th>
            <th style="padding:12px;text-align:left;">Capacity</th>
            <th style="padding:12px;text-align:left;">Subjects</th>
          </tr>

        </thead>

        <tbody>

          ${
            filtered.map(item => `

              <tr>

                <td style="padding:12px;">
                  ${escapeHTML(item.id)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(item.className)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(item.stream)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(item.teacher)}
                </td>

                <td style="padding:12px;">
                  ${item.capacity}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(item.subjects.join(", "))}
                </td>

              </tr>

            `).join("")
          }

        </tbody>

      </table>

    </div>

  `;

}


function showAddClassForm() {

  contentPage.innerHTML = `

    <div class="content-header">
      <h2>Add Class</h2>
    </div>

    <div class="panel">

      <form id="addClassForm">

        <input name="id"
          placeholder="Class ID"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <input name="className"
          placeholder="Class Name e.g. Form 4A"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <input name="stream"
          placeholder="Stream"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <input name="teacher"
          placeholder="Class Teacher"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <input name="capacity"
          type="number"
          placeholder="Capacity"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <input name="subjects"
          placeholder="Subjects separated by commas"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <button class="primary-button">
          Save Class
        </button>

      </form>

    </div>

  `;


  document
    .getElementById("addClassForm")
    .addEventListener("submit", function(event) {

      event.preventDefault();

      const data = new FormData(this);

      const id = data.get("id").trim();
      const className = data.get("className").trim();

      if (
        classes.some(
          c => c.id === id || c.className === className
        )
      ) {
        alert("Class ID or class name already exists.");
        return;
      }


      classes.push({

        id,
        className,
        stream: data.get("stream").trim(),
        teacher: data.get("teacher").trim(),
        capacity: Number(data.get("capacity")),
        subjects: data.get("subjects")
          .split(",")
          .map(s => s.trim())
          .filter(Boolean)

      });


      alert("Class added successfully.");

      showPage("classes");

    });

}


// ============================================================
// ATTENDANCE
// ============================================================

function renderAttendancePage() {

  const today =
    new Date().toISOString().split("T")[0];


  contentPage.innerHTML = `

    <div class="content-header">

      <div>
        <h2>Attendance</h2>
        <p>Mark daily student attendance.</p>
      </div>

    </div>


    <div class="panel">

      <label>Date</label>

      <input
        type="date"
        id="attendanceDate"
        value="${today}"
        style="padding:12px;margin:8px 0 15px;width:100%;"
      />


      <label>Class</label>

      <select
        id="attendanceClass"
        onchange="renderAttendanceStudents()"
        style="padding:12px;margin:8px 0 20px;width:100%;"
      >

        <option value="">Select class</option>

        ${
          classes.map(c => `
            <option value="${escapeHTML(c.className)}">
              ${escapeHTML(c.className)}
            </option>
          `).join("")
        }

      </select>


      <div id="attendanceStudents"></div>

    </div>

  `;

}


function renderAttendanceStudents() {

  const classInput =
    document.getElementById("attendanceClass");

  const dateInput =
    document.getElementById("attendanceDate");

  const container =
    document.getElementById("attendanceStudents");


  if (!classInput || !container) return;


  const className = classInput.value;
  const date = dateInput.value;


  if (!className) {

    container.innerHTML =
      "<p>Select a class to continue.</p>";

    return;

  }


  const classStudents =
    students.filter(
      student => student.className === className
    );


  container.innerHTML = `

    <div style="overflow-x:auto;">

      <table style="width:100%;border-collapse:collapse;">

        <thead>

          <tr>
            <th style="padding:12px;text-align:left;">Student</th>
            <th style="padding:12px;text-align:left;">Status</th>
          </tr>

        </thead>

        <tbody>

          ${
            classStudents.map(student => {

              const existing =
                attendanceRecords.find(
                  record =>
                    record.date === date &&
                    record.admission === student.admission
                );


              const status =
                existing?.status || "Present";


              return `

                <tr>

                  <td style="padding:12px;">
                    ${escapeHTML(student.name)}
                  </td>

                  <td style="padding:12px;">

                    <select
                      class="attendance-status"
                      data-admission="${escapeHTML(student.admission)}"
                      style="padding:8px;"
                    >

                      <option ${status === "Present" ? "selected" : ""}>
                        Present
                      </option>

                      <option ${status === "Absent" ? "selected" : ""}>
                        Absent
                      </option>

                      <option ${status === "Late" ? "selected" : ""}>
                        Late
                      </option>

                    </select>

                  </td>

                </tr>

              `;

            }).join("")
          }

        </tbody>

      </table>

    </div>


    <button
      class="primary-button"
      onclick="saveAttendance()"
      style="margin-top:20px;"
    >
      Save Attendance
    </button>

  `;

}


function saveAttendance() {

  const date =
    document.getElementById("attendanceDate").value;


  document
    .querySelectorAll(".attendance-status")
    .forEach(select => {

      const admission =
        select.dataset.admission;

      const status =
        select.value;


      const existingIndex =
        attendanceRecords.findIndex(
          record =>
            record.date === date &&
            record.admission === admission
        );


      const student =
        students.find(
          item => item.admission === admission
        );


      const record = {

        date,
        admission,
        student: student?.name || "",
        status

      };


      if (existingIndex >= 0) {

        attendanceRecords[existingIndex] =
          record;

      } else {

        attendanceRecords.push(record);

      }

    });


  alert("Attendance saved successfully.");

  updateDashboard();

}


// ============================================================
// RESULTS
// ============================================================

function getGrade(marks) {

  if (marks >= 80) return "A";
  if (marks >= 70) return "B";
  if (marks >= 60) return "C";
  if (marks >= 50) return "D";

  return "E";
}


function renderResultsPage() {

  contentPage.innerHTML = `

    <div class="content-header">

      <div>
        <h2>Results</h2>
        <p>Manage academic results.</p>
      </div>

      <button class="primary-button"
        onclick="showAddResultForm()">
        + Add Result
      </button>

    </div>


    <div class="panel">

      <input
        type="search"
        placeholder="Search results..."
        oninput="renderResultsTable(this.value)"
        style="width:100%;padding:12px;margin-bottom:18px;border:1px solid #ddd;border-radius:8px;"
      />

      <div id="resultsTable"></div>

    </div>

  `;

  renderResultsTable();
}


function renderResultsTable(searchTerm = "") {

  const table =
    document.getElementById("resultsTable");

  if (!table) return;


  const term =
    searchTerm.toLowerCase();


  const filtered =
    results.filter(result =>

      result.student.toLowerCase().includes(term) ||
      result.subject.toLowerCase().includes(term) ||
      result.admission.toLowerCase().includes(term)

    );


  table.innerHTML = `

    <div style="overflow-x:auto;">

      <table style="width:100%;border-collapse:collapse;">

        <thead>

          <tr>
            <th style="padding:12px;text-align:left;">Admission</th>
            <th style="padding:12px;text-align:left;">Student</th>
            <th style="padding:12px;text-align:left;">Subject</th>
            <th style="padding:12px;text-align:left;">Marks</th>
            <th style="padding:12px;text-align:left;">Grade</th>
          </tr>

        </thead>

        <tbody>

          ${
            filtered.map(result => `

              <tr>

                <td style="padding:12px;">
                  ${escapeHTML(result.admission)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(result.student)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(result.subject)}
                </td>

                <td style="padding:12px;">
                  ${result.marks}
                </td>

                <td style="padding:12px;">
                  ${result.grade}
                </td>

              </tr>

            `).join("")
          }

        </tbody>

      </table>

    </div>

  `;

}


function showAddResultForm() {

  contentPage.innerHTML = `

    <div class="content-header">
      <h2>Add Result</h2>
    </div>

    <div class="panel">

      <form id="addResultForm">

        <select name="admission"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

          <option value="">
            Select student
          </option>

          ${
            students.map(student => `

              <option value="${escapeHTML(student.admission)}">
                ${escapeHTML(student.name)}
                (${escapeHTML(student.admission)})
              </option>

            `).join("")
          }

        </select>


        <select name="subject"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

          <option value="">
            Select subject
          </option>

          ${
            subjects.map(subject => `

              <option>
                ${escapeHTML(subject)}
              </option>

            `).join("")
          }

        </select>


        <input
          name="marks"
          type="number"
          min="0"
          max="100"
          placeholder="Marks"
          required
          style="width:100%;padding:12px;margin-bottom:10px;"
        />


        <button class="primary-button">
          Save Result
        </button>

      </form>

    </div>

  `;


  document
    .getElementById("addResultForm")
    .addEventListener("submit", function(event) {

      event.preventDefault();

      const data =
        new FormData(this);


      const admission =
        data.get("admission");


      const student =
        students.find(
          s => s.admission === admission
        );


      const marks =
        Number(data.get("marks"));


      results.push({

        admission,
        student: student.name,
        className: student.className,
        subject: data.get("subject"),
        marks,
        grade: getGrade(marks)

      });


      alert("Result added successfully.");

      showPage("results");

    });

}


// ============================================================
// ASSIGNMENTS
// ============================================================

function renderAssignmentsPage() {

  contentPage.innerHTML = `

    <div class="content-header">

      <div>
        <h2>Assignments</h2>
        <p>Manage student assignments.</p>
      </div>

      <button class="primary-button"
        onclick="showAddAssignmentForm()">
        + Add Assignment
      </button>

    </div>


    <div class="panel">

      <div id="assignmentList"></div>

    </div>

  `;

  renderAssignmentList();
}


function renderAssignmentList() {

  const container =
    document.getElementById("assignmentList");

  if (!container) return;


  container.innerHTML = assignments.map(item => `

    <div style="
      padding:16px;
      border:1px solid #e5e7eb;
      border-radius:10px;
      margin-bottom:12px;
    ">

      <h3>${escapeHTML(item.title)}</h3>

      <p>
        ${escapeHTML(item.subject)}
        · ${escapeHTML(item.className)}
      </p>

      <p>
        Due: ${escapeHTML(item.dueDate)}
      </p>

      <small>
        Teacher: ${escapeHTML(item.teacher)}
      </small>

    </div>

  `).join("");

}


function showAddAssignmentForm() {

  contentPage.innerHTML = `

    <div class="content-header">
      <h2>Add Assignment</h2>
    </div>

    <div class="panel">

      <form id="addAssignmentForm">

        <input name="title"
          placeholder="Assignment title"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <input name="subject"
          placeholder="Subject"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <input name="className"
          placeholder="Class"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <input name="dueDate"
          type="date"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <input name="teacher"
          placeholder="Teacher"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <button class="primary-button">
          Save Assignment
        </button>

      </form>

    </div>

  `;


  document
    .getElementById("addAssignmentForm")
    .addEventListener("submit", function(event) {

      event.preventDefault();

      const data =
        new FormData(this);


      assignments.push({

        id:
          `A${String(assignments.length + 1).padStart(3, "0")}`,

        title: data.get("title"),
        subject: data.get("subject"),
        className: data.get("className"),
        dueDate: data.get("dueDate"),
        teacher: data.get("teacher"),
        status: "Active"

      });


      alert("Assignment added successfully.");

      showPage("assignments");

    });

}


// ============================================================
// ANNOUNCEMENTS
// ============================================================

function renderAnnouncementsPage() {

  contentPage.innerHTML = `

    <div class="content-header">

      <div>
        <h2>Announcements</h2>
        <p>School announcements and notices.</p>
      </div>

      <button class="primary-button"
        onclick="showAddAnnouncementForm()">
        + New Announcement
      </button>

    </div>


    <div class="panel">

      <div id="announcementList"></div>

    </div>

  `;

  renderAnnouncementList();
}


function renderAnnouncementList() {

  const container =
    document.getElementById("announcementList");

  if (!container) return;


  container.innerHTML =
    announcements.map(item => `

      <div style="
        padding:16px;
        border:1px solid #e5e7eb;
        border-radius:10px;
        margin-bottom:12px;
      ">

        <h3>${escapeHTML(item.title)}</h3>

        <p>
          ${escapeHTML(item.message)}
        </p>

        <small>
          Audience:
          ${escapeHTML(item.audience)}
          · ${escapeHTML(item.date)}
        </small>

      </div>

    `).join("");

}


function showAddAnnouncementForm() {

  contentPage.innerHTML = `

    <div class="content-header">
      <h2>New Announcement</h2>
    </div>

    <div class="panel">

      <form id="addAnnouncementForm">

        <input name="title"
          placeholder="Announcement title"
          required
          style="width:100%;padding:12px;margin-bottom:10px;">

        <textarea name="message"
          placeholder="Announcement message"
          required
          rows="5"
          style="width:100%;padding:12px;margin-bottom:10px;">
        </textarea>

        <select name="audience"
          style="width:100%;padding:12px;margin-bottom:10px;">

          <option>Everyone</option>
          <option>Students</option>
          <option>Teachers</option>
          <option>Parents</option>
          <option>Administrators</option>

        </select>

        <button class="primary-button">
          Publish Announcement
        </button>

      </form>

    </div>

  `;


  document
    .getElementById("addAnnouncementForm")
    .addEventListener("submit", function(event) {

      event.preventDefault();

      const data =
        new FormData(this);


      announcements.unshift({

        id:
          `N${String(announcements.length + 1).padStart(3, "0")}`,

        title: data.get("title"),
        message: data.get("message"),
        audience: data.get("audience"),
        date: "Today"

      });


      alert("Announcement published.");

      showPage("announcements");

    });

}


// ============================================================
// FEES MODULE
// ============================================================

function renderFeesPage(searchTerm = "") {

  const totalFees =
    fees.reduce(
      (sum, item) => sum + Number(item.total),
      0
    );


  const totalPaid =
    fees.reduce(
      (sum, item) => sum + Number(item.paid),
      0
    );


  const outstanding =
    totalFees - totalPaid;


  const paidStudents =
    fees.filter(
      item => getFeeBalance(item) <= 0
    ).length;


  contentPage.innerHTML = `

    <div class="content-header">

      <div>

        <h2>Fees Management</h2>

        <p>
          Track school fees, payments and outstanding balances.
        </p>

      </div>

      <button
        class="primary-button"
        onclick="showRecordPaymentForm()"
      >
        + Record Payment
      </button>

    </div>


    <!-- FEE SUMMARY -->

    <div style="
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
      gap:16px;
      margin-bottom:20px;
    ">


      <div class="panel">

        <small>Total Expected</small>

        <h2>
          ${money(totalFees)}
        </h2>

      </div>


      <div class="panel">

        <small>Total Collected</small>

        <h2>
          ${money(totalPaid)}
        </h2>

      </div>


      <div class="panel">

        <small>Outstanding</small>

        <h2>
          ${money(outstanding)}
        </h2>

      </div>


      <div class="panel">

        <small>Fully Paid Students</small>

        <h2>
          ${paidStudents}
        </h2>

      </div>

    </div>


    <!-- FEE RECORDS -->

    <div class="panel">

      <input
        type="search"
        placeholder="Search student or admission number..."
        value="${escapeHTML(searchTerm)}"
        oninput="renderFeesTable(this.value)"
        style="
          width:100%;
          padding:12px;
          margin-bottom:18px;
          border:1px solid #ddd;
          border-radius:8px;
        "
      />


      <div id="feesTable"></div>

    </div>


    <!-- PAYMENT HISTORY -->

    <div class="panel" style="margin-top:20px;">

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        flex-wrap:wrap;
      ">

        <div>

          <h2>Payment History</h2>

          <p>
            Recent fee payments.
          </p>

        </div>

      </div>


      <div id="paymentHistory"></div>

    </div>

  `;


  renderFeesTable(searchTerm);
  renderPaymentHistory();

}


function renderFeesTable(searchTerm = "") {

  const table =
    document.getElementById("feesTable");

  if (!table) return;


  const term =
    searchTerm.toLowerCase();


  const filtered =
    fees.filter(item =>

      item.student.toLowerCase().includes(term) ||
      item.admission.toLowerCase().includes(term) ||
      item.className.toLowerCase().includes(term)

    );


  table.innerHTML = `

    <div style="overflow-x:auto;">

      <table style="
        width:100%;
        border-collapse:collapse;
      ">

        <thead>

          <tr>

            <th style="padding:12px;text-align:left;">
              Admission
            </th>

            <th style="padding:12px;text-align:left;">
              Student
            </th>

            <th style="padding:12px;text-align:left;">
              Class
            </th>

            <th style="padding:12px;text-align:left;">
              Total
            </th>

            <th style="padding:12px;text-align:left;">
              Paid
            </th>

            <th style="padding:12px;text-align:left;">
              Balance
            </th>

            <th style="padding:12px;text-align:left;">
              Status
            </th>

            <th style="padding:12px;text-align:left;">
              Action
            </th>

          </tr>

        </thead>


        <tbody>

          ${
            filtered.length === 0

              ? `

                <tr>

                  <td
                    colspan="8"
                    style="padding:20px;text-align:center;"
                  >
                    No fee records found.
                  </td>

                </tr>

              `

              : filtered.map(item => {

                  const balance =
                    getFeeBalance(item);

                  const status =
                    getFeeStatus(item);


                  return `

                    <tr>

                      <td style="padding:12px;">
                        ${escapeHTML(item.admission)}
                      </td>

                      <td style="padding:12px;">
                        ${escapeHTML(item.student)}
                      </td>

                      <td style="padding:12px;">
                        ${escapeHTML(item.className)}
                      </td>

                      <td style="padding:12px;">
                        ${money(item.total)}
                      </td>

                      <td style="padding:12px;">
                        ${money(item.paid)}
                      </td>

                      <td style="padding:12px;">
                        <strong>
                          ${money(balance)}
                        </strong>
                      </td>

                      <td style="padding:12px;">

                        <span style="
                          padding:6px 10px;
                          border-radius:20px;
                          background:#f3f4f6;
                        ">
                          ${status}
                        </span>

                      </td>

                      <td style="padding:12px;">

                        ${
                          balance > 0

                            ? `

                              <button
                                onclick="recordPaymentForStudent('${escapeHTML(item.admission)}')"
                                style="
                                  padding:8px 12px;
                                  border:0;
                                  border-radius:6px;
                                  cursor:pointer;
                                "
                              >
                                Pay
                              </button>

                            `

                            : "—"
                        }

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


function renderPaymentHistory() {

  const container =
    document.getElementById("paymentHistory");

  if (!container) return;


  const history =
    [...feePayments].reverse();


  if (history.length === 0) {

    container.innerHTML =
      "<p>No payments recorded yet.</p>";

    return;

  }


  container.innerHTML = `

    <div style="overflow-x:auto;">

      <table style="
        width:100%;
        border-collapse:collapse;
      ">

        <thead>

          <tr>

            <th style="padding:12px;text-align:left;">
              Reference
            </th>

            <th style="padding:12px;text-align:left;">
              Student
            </th>

            <th style="padding:12px;text-align:left;">
              Amount
            </th>

            <th style="padding:12px;text-align:left;">
              Method
            </th>

            <th style="padding:12px;text-align:left;">
              Date
            </th>

          </tr>

        </thead>


        <tbody>

          ${
            history.map(payment => `

              <tr>

                <td style="padding:12px;">
                  ${escapeHTML(payment.reference)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(payment.student)}
                </td>

                <td style="padding:12px;">
                  ${money(payment.amount)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(payment.method)}
                </td>

                <td style="padding:12px;">
                  ${escapeHTML(payment.date)}
                </td>

              </tr>

            `).join("")
          }

        </tbody>

      </table>

    </div>

  `;

}


// ============================================================
// RECORD PAYMENT
// ============================================================

function recordPaymentForStudent(admission) {

  showRecordPaymentForm(admission);

}


function showRecordPaymentForm(selectedAdmission = "") {

  contentPage.innerHTML = `

    <div class="content-header">

      <div>

        <h2>Record Fee Payment</h2>

        <p>
          Record a payment made by a student.
        </p>

      </div>

    </div>


    <div class="panel">

      <form id="paymentForm">


        <label>
          Student
        </label>

        <select
          name="admission"
          required
          style="
            width:100%;
            padding:12px;
            margin:8px 0 15px;
          "
        >

          <option value="">
            Select student
          </option>


          ${
            fees.map(item => `

              <option
                value="${escapeHTML(item.admission)}"
                ${item.admission === selectedAdmission
                  ? "selected"
                  : ""}
              >

                ${escapeHTML(item.student)}
                —
                ${escapeHTML(item.admission)}

              </option>

            `).join("")
          }

        </select>


        <label>
          Amount
        </label>

        <input
          name="amount"
          type="number"
          min="1"
          step="1"
          required
          placeholder="Amount paid"
          style="
            width:100%;
            padding:12px;
            margin:8px 0 15px;
          "
        />


        <label>
          Payment Method
        </label>

        <select
          name="method"
          required
          style="
            width:100%;
            padding:12px;
            margin:8px 0 15px;
          "
        >

          <option>M-Pesa</option>
          <option>Bank</option>
          <option>Cash</option>
          <option>Cheque</option>

        </select>


        <label>
          Payment Reference
        </label>

        <input
          name="reference"
          placeholder="e.g. M-PESA transaction code"
          required
          style="
            width:100%;
            padding:12px;
            margin:8px 0 15px;
          "
        />


        <label>
          Date
        </label>

        <input
          name="date"
          type="date"
          value="${new Date().toISOString().split("T")[0]}"
          required
          style="
            width:100%;
            padding:12px;
            margin:8px 0 20px;
          "
        />


        <button
          type="submit"
          class="primary-button"
        >
          Save Payment
        </button>


        <button
          type="button"
          onclick="showPage('fees')"
          style="
            margin-left:10px;
            padding:12px 18px;
            border:1px solid #ddd;
            border-radius:8px;
            background:white;
            cursor:pointer;
          "
        >
          Cancel
        </button>


      </form>

    </div>

  `;


  document
    .getElementById("paymentForm")
    .addEventListener("submit", function(event) {

      event.preventDefault();


      const data =
        new FormData(this);


      const admission =
        data.get("admission");


      const amount =
        Number(data.get("amount"));


      const feeRecord =
        fees.find(
          item => item.admission === admission
        );


      if (!feeRecord) {

        alert("Student fee record not found.");

        return;

      }


      if (amount <= 0) {

        alert("Payment amount must be greater than zero.");

        return;

      }


      const balance =
        getFeeBalance(feeRecord);


      if (amount > balance) {

        alert(
          `Payment cannot exceed the outstanding balance of ${money(balance)}.`
        );

        return;

      }


      feeRecord.paid =
        Number(feeRecord.paid) + amount;


      const student =
        students.find(
          item => item.admission === admission
        );


      feePayments.push({

        id:
          `P${String(feePayments.length + 1).padStart(3, "0")}`,

        admission,

        student:
          student?.name ||
          feeRecord.student,

        amount,

        method:
          data.get("method"),

        reference:
          data.get("reference").trim(),

        date:
          data.get("date")

      });


      alert("Payment recorded successfully.");

      updateDashboard();

      showPage("fees");

    });

}


// ============================================================
// QUICK ACTIONS
// ============================================================

quickActions.forEach(action => {

  action.addEventListener("click", function() {

    const actionName =
      this.dataset.action;


    if (actionName === "students") {
      showPage("students");
    }

    else if (actionName === "results") {
      showPage("results");
    }

    else if (actionName === "announcements") {
      showPage("announcements");
    }

    else if (actionName === "attendance") {
      showPage("attendance");
    }

    else if (actionName === "fees") {
      showPage("fees");
    }

  });

});


viewAllButton?.addEventListener("click", function() {

  showPage("announcements");

});


// ============================================================
// LOGOUT
// ============================================================

logoutButton?.addEventListener("click", function() {

  const confirmLogout =
    confirm("Are you sure you want to logout?");


  if (!confirmLogout) return;


  loginForm.reset();

  profileName.textContent = "";
  profileRole.textContent = "";
  profileAvatar.textContent = "?";

  appPage.classList.add("hidden");
  loginPage.classList.remove("hidden");

});


// ============================================================
// INITIALIZE
// ============================================================

function initializeApp() {

  loginPage.classList.remove("hidden");
  appPage.classList.add("hidden");

  showPage("dashboard");

}


initializeApp();
