(() => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js", { scope: "/" })
        .catch(error => console.warn("Smartschool offline shell could not be registered:", error));
    });
  }

  let installPrompt = null;
  let installed = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

  const banner = document.createElement("div");
  banner.id = "smartschoolInstallBanner";
  banner.className = "smartschool-install-banner";
  banner.innerHTML = `
    <div class="smartschool-install-copy">
      <strong>Get Smartschool on your phone</strong>
      <span>Install the app for quick access from your home screen.</span>
    </div>
    <button type="button" id="smartschoolInstallButton">Install</button>
    <button type="button" id="smartschoolInstallDismiss" aria-label="Dismiss install message">×</button>
  `;
  document.body.appendChild(banner);

  const hide = () => banner.classList.remove("is-visible");
  const show = () => {
    if (!installed && !sessionStorage.getItem("smartschool-install-dismissed")) {
      banner.classList.add("is-visible");
    }
  };

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    show();
  });

  window.addEventListener("appinstalled", () => {
    installed = true;
    installPrompt = null;
    hide();
  });

  banner.querySelector("#smartschoolInstallButton").addEventListener("click", async () => {
    if (installed) return;
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      installPrompt = null;
      if (choice?.outcome === "accepted") hide();
      return;
    }
    alert("To install Smartschool on Android: open your browser menu (⋮), choose Install app or Add to Home screen, then confirm. On iPhone, use Share and choose Add to Home Screen.");
  });

  banner.querySelector("#smartschoolInstallDismiss").addEventListener("click", () => {
    sessionStorage.setItem("smartschool-install-dismissed", "1");
    hide();
  });

  // Keep an install route visible even in browsers that do not expose beforeinstallprompt.
  window.addEventListener("load", () => {
    if (!installed) window.setTimeout(show, 3500);
  });
})();
