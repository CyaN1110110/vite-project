import "../basicchatbotStyles.css";

const chatLog = document.querySelector("#chatLog");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const sendBtn = document.querySelector("#sendBtn");

const messages = [
  { role: "system", content: "You are a helpful assistant. Keep answers concise." },
];

function appendBubble(role, text) {
  const wrap = document.createElement("div");
  wrap.className = `bubble-row ${role}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  wrap.appendChild(bubble);
  chatLog.appendChild(wrap);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function callProxy(messages) {
  const res = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Proxy error ${res.status}: ${t}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userText = chatInput.value.trim();
  if (!userText) return;

  chatInput.value = "";
  appendBubble("user", userText);
  messages.push({ role: "user", content: userText });

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  appendBubble("assistant", "...");
  const loadingBubble = chatLog.lastElementChild;

  try {
    const assistantText = await callProxy(messages);
    messages.push({ role: "assistant", content: assistantText });
    loadingBubble.querySelector(".bubble").textContent =
      assistantText || "(empty response)";
  } catch (err) {
    loadingBubble.querySelector(".bubble").textContent =
      err?.message || "요청 중 오류가 발생했어요.";
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
    chatInput.focus();
  }
});
