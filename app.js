/* =========================================================
   KIRIMUNGE SENIOR SCHOOL MANAGEMENT SYSTEM
   Frontend Application Logic
   ========================================================= */
/*
  IMPORTANT:
  This is currently a frontend demo.
  Any non-empty username and password will allow login.
  Real authentication, database records, and permissions
  will be added in the backend development stage.
*/
/* =========================================================
   ELEMENTS
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
   PAGE INFORMATION
   ========================================================= */
const pageData = {
  dashboard: {
    title: "Dashboard",
    description: "Overview of school activities and information.",
    emptyTitle: "",
    emptyDescription: "",
    action: ""
  },
  students: {
    title: "Students",
    description: "Manage student records and academic information.",
    emptyTitle: "Student Management",
    emptyDescription:
      "Student registration, profiles, class allocation, academic records and other student information will be managed from this section.",
    action: "+ Add Student"
  },
  teachers: {
    title: "Teachers",
    description: "Manage teachers and teaching information.",
    emptyTitle: "Teacher Management",
    emptyDescription:
      "Teacher profiles, departments, subjects and assigned classes will be managed from this section.",
    action: "+ Add Teacher"
  },
  classes: {
    title: "Classes",
    description: "Manage school classes and class information.",
    emptyTitle: "Class Management",
    emptyDescription:
      "Create classes, assign teachers and organize students into their respective classes.",
    action: "+ Add Class"
  },
  attendance: {
    title: "Attendance",
    description: "Monitor and record student attendance.",
    emptyTitle: "Attendance Management",
    emptyDescription:
      "Teachers will be able to record attendance while administrators can monitor attendance across the school.",
    action: "+ Record Attendance"
  },
  results: {
    title: "Results",
    description: "Manage student academic performance and examination results.",
    emptyTitle: "Academic Results",
    emptyDescription:
      "Student marks, examination results, grades and academic performance will be managed from this section.",
    action: "+ Enter Results"
  },
  assignments: {
    title: "Assignments",
    description: "Create and manage student assignments.",
    emptyTitle: "Assignment Management",
    emptyDescription:
      "Teachers will be able to create assignments while students will be able to view and complete them.",
    action: "+ Create Assignment"
  },
  announcements: {
    title: "Announcements",
    description: "Publish important school announcements and notices.",
    emptyTitle: "School Announcements",
    emptyDescription:
      "School administrators and authorized staff will be able to publish important announcements for students, teachers and parents.",
    action: "+ New Announcement"
  }
};
/* =========================================================
   ROLE INFORMATION
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
  /*
    Demo validation.
    At this stage we only require the fields to contain
    information. Real authentication will be connected
    to the backend later.
  */
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
  /* Get display name */
  const selectedRole = roleNames[role] || "User";
  /*
    Capitalize username for display.
  */
  const displayName =
    username.charAt(0).toUpperCase() + username.slice(1);
  /* Update profile */
  profileName.textContent = displayName;
  profileRole.textContent = selectedRole;
  profileAvatar.textContent =
    displayName.charAt(0).toUpperCase();
  /* Update welcome message */
  welcomeMessage.textContent =
    `Welcome, ${displayName}. You are logged in as ${selectedRole}.`;
  /* Show application */
  loginPage.classList.add("hidden");
  appPage.classList.remove("hidden");
  /* Always start on dashboard */
  showPage("dashboard");
});
/* =========================================================
   NAVIGATION
   ========================================================= */
navigationItems.forEach(function (item) {
  item.addEventListener("click", function () {
    const page = item.dataset.page;
    showPage(page);
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
  /* Update active navigation */
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
  emptyTitle.textContent =
    data.emptyTitle;
  emptyDescription.textContent =
    data.emptyDescription;
  actionButton.textContent =
    data.action;
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
    const selectedPage = pages[index];
    if (selectedPage) {
      showPage(selectedPage);
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
   ACTION BUTTON
   ========================================================= */
actionButton.addEventListener("click", function () {
  const currentPage = pageTitle.textContent;
  alert(
    `${currentPage} feature is ready for backend development.`
  );
});
/* =========================================================
   LOGOUT
   ========================================================= */
logoutButton.addEventListener("click", function () {
  const confirmLogout = confirm(
    "Are you sure you want to logout?"
  );
  if (!confirmLogout) {
    return;
  }
  /* Hide application */
  appPage.classList.add("hidden");
  /* Show login */
  loginPage.classList.remove("hidden");
  /* Clear form */
  loginForm.reset();
  /* Reset profile */
  profileName.textContent = "Administrator";
  profileRole.textContent = "Administrator";
  profileAvatar.textContent = "A";
  welcomeMessage.textContent =
    "Welcome to Kirimunge Senior School.";
  /* Return to dashboard */
  showPage("dashboard");
});
/* =========================================================
   INITIAL STATE
   ========================================================= */
function initializeApp() {
  loginPage.classList.remove("hidden");
  appPage.classList.add("hidden");
  showPage("dashboard");
}
/* Start application */
initializeApp();
