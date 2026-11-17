const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const attachBtn = document.getElementById("attach-btn");
const fileInput = document.getElementById("file-input");
const filePreviewBar = document.getElementById("file-preview-bar");
const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggle-sidebar");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const newChatBtn = document.getElementById("new-chat-btn");
const mobileNewChatBtn = document.getElementById("mobile-new-chat");

let messages = [];
let attachedFiles = [];

// Format jam saat ini (contoh: 10:31 AM)
function getCurrentTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// SVG Avatar Robot untuk Bubble Bot
const BOT_AVATAR_SVG = `
<svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="18" fill="url(#botGrad)"/>
    <rect x="9" y="11" width="18" height="14" rx="7" fill="#F8FAFC"/>
    <rect x="11" y="14" width="14" height="8" rx="4" fill="#1E1B4B"/>
    <circle cx="15" cy="18" r="1.7" fill="#38BDF8"/>
    <circle cx="21" cy="18" r="1.7" fill="#38BDF8"/>
    <defs>
        <linearGradient id="botGrad" x1="0" y1="0" x2="36" y2="36">
            <stop stop-color="#818CF8"/>
            <stop offset="1" stop-color="#6D28D9"/>
        </linearGradient>
    </defs>
</svg>`;

// ========================
// Sidebar & Navigasi
// ========================
toggleSidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

mobileMenuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

document.querySelectorAll(".history-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".history-item").forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    userInput.value = item.dataset.prompt || "";
    userInput.focus();
    sidebar.classList.remove("open");
  });
});

// ========================
// Auto-resize Textarea & Shift+Enter
// ========================
userInput.addEventListener("input", () => {
  userInput.style.height = "auto";
  userInput.style.height = Math.min(userInput.scrollHeight, 130) + "px";
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event("submit"));
  }
});

// ========================
// Lampirkan File (Klip Kertas)
// ========================
attachBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async (e) => {
  const files = Array.from(e.target.files);
  for (const file of files) {
    const reader = new FileReader();
    const isImage = file.type.startsWith("image/");
    const data = await new Promise((resolve) => {
      reader.onload = () => resolve(reader.result);
      isImage ? reader.readAsDataURL(file) : reader.readAsText(file);
    });
    attachedFiles.push({ name: file.name, type: file.type, isImage, data });
  }
  fileInput.value = "";
  renderFilePreviews();
});

function renderFilePreviews() {
  filePreviewBar.innerHTML = "";
  if (attachedFiles.length === 0) {
    filePreviewBar.classList.add("hidden");
    return;
  }
  filePreviewBar.classList.remove("hidden");
  attachedFiles.forEach((f, idx) => {
    const chip = document.createElement("div");
    chip.className = "file-chip";
    chip.innerHTML = `<span>📎 ${f.name}</span>`;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "remove-file-btn";
    btn.textContent = "×";
    btn.onclick = () => {
      attachedFiles.splice(idx, 1);
      renderFilePreviews();
    };
    chip.appendChild(btn);
    filePreviewBar.appendChild(chip);
  });
}

// ========================
// Tambah Bubble Pesan
// ========================
function addMessage(text, sender) {
  const row = document.createElement("div");
  row.classList.add("message-row", sender);

  if (sender === "bot") {
    const avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    avatar.innerHTML = BOT_AVATAR_SVG;
    row.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  const textEl = document.createElement("div");
  textEl.className = "message-text";
  textEl.textContent = text;
  bubble.appendChild(textEl);

  const meta = document.createElement("div");
  meta.className = "message-meta";

  if (sender === "user") {
    meta.innerHTML = `
      <span class="msg-time">${getCurrentTime()}</span>
      <span class="read-check">✓✓</span>
    `;
  } else {
    meta.innerHTML = `
      <span class="msg-time">${getCurrentTime()}</span>
      <div class="msg-actions">
        <button type="button" class="action-icon copy-btn" title="Salin">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
        <button type="button" class="action-icon like-btn" title="Suka">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>
        </button>
        <button type="button" class="action-icon dislike-btn" title="Tidak Suka">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
          </svg>
        </button>
      </div>
    `;

    // Fungsi tombol Copy
    meta.querySelector(".copy-btn").addEventListener("click", function () {
      navigator.clipboard.writeText(textEl.textContent);
      this.classList.add("active");
      setTimeout(() => this.classList.remove("active"), 1200);
    });
  }

  bubble.appendChild(meta);
  row.appendChild(bubble);
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;

  return textEl;
}

// ========================
// Reset New Chat
// ========================
function resetChat() {
  messages = [];
  attachedFiles = [];
  renderFilePreviews();
  chatBox.innerHTML = `<div class="date-divider"><span>Today</span></div>`;
  addMessage("Halo! 👋\nSelamat datang di NOVA AI.\nAda yang bisa saya bantu hari ini?", "bot");
  userInput.focus();
}

newChatBtn.addEventListener("click", resetChat);
mobileNewChatBtn.addEventListener("click", resetChat);

// ========================
// Kirim Pesan ke /api/chat
// ========================
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = userInput.value.trim();
  if (!message && attachedFiles.length === 0) return;

  const displayMsg = attachedFiles.length > 0
    ? `${message}\n[Lampiran: ${attachedFiles.map((f) => f.name).join(", ")}]`.trim()
    : message;

  addMessage(displayMsg, "user");

  let fullPrompt = message;
  attachedFiles.forEach((f) => {
    if (!f.isImage) {
      fullPrompt += `\n\n[Lampiran File: ${f.name}]\n${f.data}`;
    }
  });

  messages.push({ role: "user", content: fullPrompt });

  userInput.value = "";
  userInput.style.height = "auto";
  attachedFiles = [];
  renderFilePreviews();
  userInput.disabled = true;
  sendBtn.disabled = true;

  // Bubble kosong otomatis menampilkan "NOVA AI is typing •••"
  const botContent = addMessage("", "bot");
  let botResponse = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Terjadi kesalahan");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || !trimmedLine.startsWith("data:")) continue;
        const data = trimmedLine.slice(5).trim();
        if (data === "[DONE]") continue;

        try {
          const token = JSON.parse(data);
          botResponse += token;
          botContent.textContent = botResponse;
          chatBox.scrollTop = chatBox.scrollHeight;
        } catch (err) {
          console.error("Gagal membaca token:", err);
        }
      }
    }

    messages.push({ role: "assistant", content: botResponse });
  } catch (error) {
    console.error(error);
    botContent.textContent = "Maaf, terjadi kesalahan: " + error.message;
  } finally {
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
  }
});