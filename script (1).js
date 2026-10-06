// ===== স্ক্রিন সুইচ করার ফাংশন =====
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ===== ওয়েভফর্ম বার তৈরি করা =====
function buildWaveform() {
  const wf = document.getElementById("waveform");
  wf.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    const bar = document.createElement("span");
    wf.appendChild(bar);
  }
}
buildWaveform();

function animateWaveform(active) {
  const bars = document.querySelectorAll("#waveform span");
  bars.forEach(bar => {
    if (active) {
      bar.style.height = (6 + Math.random() * 22) + "px";
    } else {
      bar.style.height = "6px";
    }
  });
}
let waveInterval = null;

// ===== orb-এর অবস্থা বদলানো (idle / listening / speaking) =====
const mainOrb = document.getElementById("mainOrb");
const statusText = document.getElementById("statusText");

function setOrbState(state) {
  mainOrb.classList.remove("orb-idle", "orb-listening", "orb-speaking");
  clearInterval(waveInterval);

  if (state === "idle") {
    mainOrb.classList.add("orb-idle");
    statusText.textContent = "Sun rahi hoon...";
    animateWaveform(false);
  } else if (state === "listening") {
    mainOrb.classList.add("orb-listening");
    statusText.textContent = "Listening...";
    waveInterval = setInterval(() => animateWaveform(true), 150);
  } else if (state === "speaking") {
    mainOrb.classList.add("orb-speaking");
    statusText.textContent = "Bol rahi hoon...";
    waveInterval = setInterval(() => animateWaveform(true), 150);
  }
}

// ===== Onboarding → Get Started =====
document.getElementById("getStartedBtn").addEventListener("click", () => {
  const name = document.getElementById("nameInput").value.trim();
  if (name) {
    localStorage.setItem("nr_ai_user_name", name);
  }
  showScreen("screenHome");
  setOrbState("idle");
});

// আগে থেকে নাম সেভ করা থাকলে সরাসরি হোমে যাওয়া
window.addEventListener("DOMContentLoaded", () => {
  const savedName = localStorage.getItem("nr_ai_user_name");
  if (savedName) {
    document.getElementById("nameInput").value = savedName;
  }
});

// ===== মাইক বাটন — ডেমো হিসেবে অবস্থা পরিবর্তন করে (আসল ভয়েস পরের ধাপে) =====
let demoState = "idle";
document.getElementById("micBtn").addEventListener("click", () => {
  if (demoState === "idle") {
    demoState = "listening";
    setOrbState("listening");
    // ৩ সেকেন্ড পর স্বয়ংক্রিয়ভাবে "speaking" দেখানো (শুধু ডেমোর জন্য)
    setTimeout(() => {
      demoState = "speaking";
      setOrbState("speaking");
      setTimeout(() => {
        demoState = "idle";
        setOrbState("idle");
      }, 2500);
    }, 2000);
  }
});

// ===== সেটিংস বাটন (এখন শুধু প্লেসহোল্ডার) =====
document.getElementById("settingsBtn").addEventListener("click", () => {
  alert("সেটিংস স্ক্রিন পরের ধাপে যোগ হবে");
});

// ===== চ্যাট স্ক্রিনে যাওয়া-আসা =====
document.getElementById("chatHistoryBtn").addEventListener("click", () => {
  showScreen("screenChat");
});
document.getElementById("chatBackBtn").addEventListener("click", () => {
  showScreen("screenHome");
});

// ===== ডেমো চ্যাট পাঠানো (আসল AI সংযোগ পরের ধাপে) =====
function addChatBubble(text, sender) {
  const list = document.getElementById("chatList");
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble " + sender;
  const time = new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });
  bubble.innerHTML = text + `<span class="chat-time">${time}</span>`;
  list.appendChild(bubble);
  list.scrollTop = list.scrollHeight;
}

document.getElementById("chatSendBtn").addEventListener("click", sendChatMessage);
document.getElementById("chatInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendChatMessage();
});

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;
  addChatBubble(text, "user");
  input.value = "";

  // ডেমো রেসপন্স (আসল Gemini সংযোগ পরের ধাপে বসবে)
  setTimeout(() => {
    addChatBubble("Hean, main yahan hoon! Yeh abhi ek demo reply hai 😊", "ai");
  }, 600);
}

console.log("NR Ai ধাপ ১ লোড হয়েছে ✅");
