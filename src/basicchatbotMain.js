import "../basicchatbotStyles.css";

// .env 예시: VITE_OPENAI_API_KEY=sk-...
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY; // [web:61] 참고
const MODEL = "gpt-4o-mini"; // 모델은 계정/정책에 맞게 변경 가능

const chatLog = document.querySelector("#chatLog");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const sendBtn = document.querySelector("#sendBtn");

const messages = [
  {
    role: "system",
    content: "You are a helpful assistant. Keep answers concise.",
  },
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

async function callOpenAIChatCompletions() {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const assistantText = data?.choices?.[0]?.message?.content ?? "";
  return assistantText;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!OPENAI_API_KEY) {
    appendBubble("assistant", "VITE_OPENAI_API_KEY가 설정되지 않았어요 (.env 확인).");
    return;
  }

  const userText = chatInput.value.trim();
  if (!userText) return;

  chatInput.value = "";
  appendBubble("user", userText);
  messages.push({ role: "user", content: userText });

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  // 로딩 표시
  appendBubble("assistant", "...");
  const loadingBubble = chatLog.lastElementChild;

  try {
    const assistantText = await callOpenAIChatCompletions();
    messages.push({ role: "assistant", content: assistantText });

    // 로딩 "..."을 실제 답변으로 교체
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
