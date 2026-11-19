(() => {
  const root = document.createElement("div");
  root.id = "schoolAssistantRoot";
  root.innerHTML = `
    <button id="schoolAssistantBubble" class="school-assistant-bubble" type="button" aria-label="Open school assistant" aria-expanded="false">✦</button>
    <section id="schoolAssistantPanel" class="school-assistant-panel hidden" aria-label="School assistant chat">
      <header class="school-assistant-head">
        <div><strong>School Assistant</strong><small id="schoolAssistantRole">Ready to help</small></div>
        <button id="schoolAssistantClose" type="button" aria-label="Close assistant">×</button>
      </header>
      <div id="schoolAssistantMessages" class="school-assistant-messages" aria-live="polite">
        <div class="assistant-message assistant-reply">Hello! Ask me about the school information available to your account. I can also help draft messages and explain records.</div>
      </div>
      <div id="schoolAssistantDraft" class="school-assistant-draft hidden"></div>
      <form id="schoolAssistantForm" class="school-assistant-form">
        <label class="school-assistant-attach">＋ Attach
          <input id="schoolAssistantFile" type="file" accept=".pdf,image/jpeg,image/png,image/webp">
        </label>
        <textarea id="schoolAssistantInput" rows="2" maxlength="6000" placeholder="Ask a question..." aria-label="Message"></textarea>
        <div class="school-assistant-actions">
          <span id="schoolAssistantFileName">No file attached</span>
          <button id="schoolAssistantSend" type="submit">Send</button>
        </div>
        <small class="school-assistant-note">Your access follows your Smartschool role. Check all suggestions before using them.</small>
      </form>
    </section>`;
  document.body.appendChild(root);

  const bubble = root.querySelector("#schoolAssistantBubble");
  const panel = root.querySelector("#schoolAssistantPanel");
  const close = root.querySelector("#schoolAssistantClose");
  const form = root.querySelector("#schoolAssistantForm");
  const input = root.querySelector("#schoolAssistantInput");
  const fileInput = root.querySelector("#schoolAssistantFile");
  const fileName = root.querySelector("#schoolAssistantFileName");
  const send = root.querySelector("#schoolAssistantSend");
  const messages = root.querySelector("#schoolAssistantMessages");
  const draft = root.querySelector("#schoolAssistantDraft");
  let selectedFile = null;

  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));

  function roleLabel(role) {
    return ({admin:"Administrator",teacher:"Teacher",class_teacher:"Class teacher",student:"Student",parent:"Parent"})[role] || "School user";
  }

  function show() {
    if (!currentUser) return;
    bubble.classList.remove("hidden");
    root.classList.add("assistant-visible");
    root.querySelector("#schoolAssistantRole").textContent = roleLabel(currentUser.role) + " access";
  }
  function closePanel() {
    root.classList.remove("assistant-visible");
    panel.classList.add("hidden");
    bubble.setAttribute("aria-expanded", "false");
  }
  function hide() {
    closePanel();
    bubble.classList.add("hidden");
  }
  function toggle() {
    if (!currentUser) return;
    const opening = panel.classList.contains("hidden");
    panel.classList.toggle("hidden", !opening);
    bubble.setAttribute("aria-expanded", String(opening));
    if (opening) input.focus();
  }
  function addMessage(text, who) {
    const item = document.createElement("div");
    item.className = "assistant-message " + (who === "user" ? "assistant-user" : "assistant-reply");
    item.textContent = text;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }
  function activePage() {
    return document.querySelector(".nav-item.active")?.dataset.page || "dashboard";
  }
  async function invoke(payload) {
    const { data, error } = await sb.auth.getSession();
    if (error || !data.session?.access_token) throw new Error("Your session has expired. Sign in again.");
    const response = await fetch(window.SUPABASE_URL + "/functions/v1/smart-assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + data.session.access_token,
        "apikey": window.SUPABASE_PUBLISHABLE_KEY
      },
      body: JSON.stringify({ ...payload, page: activePage() })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "The assistant request failed.");
    return result;
  }
  async function encodeFile(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    return { mimeType: file.type, data: btoa(binary), filename: file.name };
  }
  function renderDraft(records, notes) {
    draft.classList.remove("hidden");
    if (!records.length) {
      draft.innerHTML = "<p>No student rows were confidently extracted. Try a clearer scan.</p>";
      return;
    }
    draft.innerHTML = `
      <div class="assistant-draft-heading"><strong>Review extracted students</strong><small>${esc(notes || "Check every field against the original document.")}</small></div>
      <div class="assistant-draft-table-wrap"><table class="assistant-draft-table">
        <thead><tr><th>Student name</th><th>Admission no.</th><th>Class</th><th>Reading</th><th></th></tr></thead>
        <tbody>${records.map((r,i)=>`
          <tr data-row="${i}">
            <td><input data-field="full_name" value="${esc(r.full_name)}" aria-label="Student name"></td>
            <td><input data-field="admission_no" value="${esc(r.admission_no)}" aria-label="Admission number"></td>
            <td><input data-field="class_name" value="${esc(r.class_name)}" aria-label="Class name" placeholder="Exact class name"></td>
            <td><span class="assistant-confidence">${esc(r.confidence || "check")}</span><small>${esc(r.notes || "")}</small></td>
            <td><button type="button" class="assistant-remove-row" aria-label="Remove row">×</button></td>
          </tr>`).join("")}</tbody>
      </table></div>
      <p class="assistant-warning">Nothing has been saved yet. Review names, admission numbers and classes against the original register.</p>
      <div class="assistant-draft-actions"><button type="button" id="assistantCancelDraft" class="assistant-secondary">Discard</button><button type="button" id="assistantConfirmDraft">Confirm and register</button></div>`;
    draft.querySelectorAll(".assistant-remove-row").forEach(btn => btn.addEventListener("click", () => btn.closest("tr").remove()));
    draft.querySelector("#assistantCancelDraft").addEventListener("click", () => { draft.classList.add("hidden"); draft.innerHTML = ""; });
    draft.querySelector("#assistantConfirmDraft").addEventListener("click", async event => {
      const button = event.currentTarget;
      const students = Array.from(draft.querySelectorAll("tbody tr")).map(row => {
        const value = field => row.querySelector('[data-field="' + field + '"]').value.trim();
        return { full_name:value("full_name"), admission_no:value("admission_no"), class_name:value("class_name") };
      });
      if (!students.length) return addMessage("There are no rows to register.", "assistant");
      if (students.some(s => !s.full_name || !s.admission_no)) return addMessage("Every row needs a student name and admission number.", "assistant");
      if (!confirm("Register " + students.length + " reviewed student record(s)? This writes to the school database. Login accounts are not created automatically.")) return;
      button.disabled = true;
      try {
        const result = await invoke({ task:"register_students", students });
        addMessage(result.inserted + " student record(s) registered successfully. Login accounts have not been created.", "assistant");
        draft.classList.add("hidden");
        draft.innerHTML = "";
        await loadSchoolData(currentUser.role);
        if (activePage() === "students") showPage("students");
      } catch (error) {
        addMessage(error.message, "assistant");
        button.disabled = false;
      }
    });
  }

  bubble.addEventListener("click", toggle);
  close.addEventListener("click", closePanel);
  fileInput.addEventListener("change", () => {
    selectedFile = fileInput.files?.[0] || null;
    fileName.textContent = selectedFile ? selectedFile.name : "No file attached";
  });
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!currentUser) return;
    const message = input.value.trim();
    if (!message && !selectedFile) return;
    if (selectedFile && selectedFile.size > 8 * 1024 * 1024) return addMessage("Please use a file smaller than 8 MB.", "assistant");
    const file = selectedFile;
    const role = currentUser.role;
    if (file && role !== "admin") return addMessage("Document register extraction is available to administrators only.", "assistant");
    addMessage(message || (file ? "Please read this student register and extract the student details." : ""), "user");
    input.value = "";
    send.disabled = true;
    send.textContent = "Working…";
    try {
      const attachment = file ? await encodeFile(file) : undefined;
      const result = await invoke({
        task: file ? "extract_students" : "chat",
        message: message || "Read this student register and extract the student details.",
        attachment
      });
      if (file) {
        renderDraft(result.students || [], result.document_notes || "");
        addMessage("I have prepared a draft from the document. Please check every row before confirming registration.", "assistant");
      } else addMessage(result.reply || "I couldn't prepare a reply. Please try again.", "assistant");
      if (file) {
        selectedFile = null;
        fileInput.value = "";
        fileName.textContent = "No file attached";
      }
    } catch (error) {
      addMessage(error.message, "assistant");
    } finally {
      send.disabled = false;
      send.textContent = "Send";
    }
  });

  window.SmartschoolAssistant = { show, hide };
  bubble.classList.add("hidden");
})();