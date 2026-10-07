const $=id=>document.getElementById(id);
const state={muted:false,voice:true,busy:false};
function showScreen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));const e=$(id);if(e)e.classList.add("active")}
function buildWaveform(){const w=$("waveform");if(!w)return;w.innerHTML="";for(let i=0;i<20;i++){const b=document.createElement("span");w.appendChild(b)}}
let timer=null;
function animateWave(on){document.querySelectorAll("#waveform span").forEach(b=>b.style.height=on?(6+Math.random()*22)+"px":"6px")}
function setOrbState(s){const o=$("mainOrb"),t=$("statusText");if(!o)return;o.classList.remove("orb-idle","orb-listening","orb-speaking");clearInterval(timer);if(s==="listening"){o.classList.add("orb-listening");t.textContent="শুনছি...";timer=setInterval(()=>animateWave(true),140)}else if(s==="speaking"){o.classList.add("orb-speaking");t.textContent="বলছি...";timer=setInterval(()=>animateWave(true),140)}else{o.classList.add("orb-idle");t.textContent="শুনছি...";animateWave(false)}}
function saveName(n){localStorage.setItem("nr_ai_user_name",n);if($("welcomeUser"))$("welcomeUser").textContent=n?"হ্যালো, "+n+" 👋":"";if($("settingsName"))$("settingsName").value=n}
function addChatBubble(text,sender){const l=$("chatList");if(!l)return;const b=document.createElement("div");b.className="chat-bubble "+sender;const m=document.createElement("div");m.textContent=text;const tm=document.createElement("span");tm.className="chat-time";tm.textContent=new Date().toLocaleTimeString("bn-BD",{hour:"2-digit",minute:"2-digit"});b.append(m,tm);l.appendChild(b);l.scrollTop=l.scrollHeight;const h=JSON.parse(localStorage.getItem("nr_ai_history")||"[]");h.push({text,sender,time:tm.textContent});localStorage.setItem("nr_ai_history",JSON.stringify(h.slice(-100)))}
function loadChat(){const l=$("chatList");if(!l)return;l.innerHTML="";JSON.parse(localStorage.getItem("nr_ai_history")||"[]").forEach(m=>{const b=document.createElement("div");b.className="chat-bubble "+m.sender;const d=document.createElement("div");d.textContent=m.text;const t=document.createElement("span");t.className="chat-time";t.textContent=m.time||"";b.append(d,t);l.appendChild(b)})}
function speak(text){if(state.muted||!state.voice||!("speechSynthesis"in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="bn-BD";u.rate=.95;u.onstart=()=>setOrbState("speaking");u.onend=()=>setOrbState("idle");speechSynthesis.speak(u)}
function demoVoice(){if(state.busy)return;state.busy=true;setOrbState("listening");setTimeout(()=>{const r="হ্যালো! আমি NR Ai। আপনার কথা শুনতে প্রস্তুত।";addChatBubble(r,"ai");speak(r);setTimeout(()=>{setOrbState("idle");state.busy=false},2500)},1600)}
async function sendChatMessage(){const i=$("chatInput"),text=i.value.trim();if(!text)return;addChatBubble(text,"user");i.value="";const endpoint=localStorage.getItem("nr_ai_api_url")||"";if(endpoint){try{const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text,name:localStorage.getItem("nr_ai_user_name")||""})});if(!r.ok)throw Error();const d=await r.json(),reply=d.reply||d.message||"কোনো উত্তর পাওয়া যায়নি।";addChatBubble(reply,"ai");speak(reply);return}catch(e){console.warn("API unavailable",e)}}const reply="আমি এখন ডেমো মোডে আছি। আসল AI API যুক্ত করলে আমি আপনার মেসেজের উত্তর দিতে পারব।";addChatBubble(reply,"ai");speak(reply)}
$("getStartedBtn").onclick=()=>{const n=$("nameInput").value.trim();if(n)saveName(n);showScreen("screenHome");setOrbState("idle")};
$("nameInput").onkeydown=e=>{if(e.key==="Enter")$("getStartedBtn").click()};
$("micBtn").onclick=demoVoice;
$("chatHistoryBtn").onclick=()=>{loadChat();showScreen("screenChat")};
$("chatBackBtn").onclick=()=>showScreen("screenHome");
$("settingsBtn").onclick=()=>{if($("settingsName"))$("settingsName").value=localStorage.getItem("nr_ai_user_name")||"";showScreen("screenSettings")};
$("settingsBackBtn").onclick=()=>showScreen("screenHome");
$("muteBtn").onclick=()=>{state.muted=!state.muted;$("muteBtn").textContent=state.muted?"🔈":"🔇"};
$("voiceToggle").onchange=e=>state.voice=e.target.checked;
$("clearChatBtn").onclick=()=>{localStorage.removeItem("nr_ai_history");loadChat()};
$("settingsName").onchange=e=>saveName(e.target.value.trim());
$("chatSendBtn").onclick=sendChatMessage;
$("chatInput").onkeydown=e=>{if(e.key==="Enter")sendChatMessage()};
$("chatMicBtn").onclick=()=>{const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){alert("এই ব্রাউজারে voice input সমর্থিত নয়।");return}const r=new R();r.lang="bn-BD";r.interimResults=false;r.onresult=e=>$("chatInput").value=e.results[0][0].transcript;r.start()};
window.addEventListener("DOMContentLoaded",()=>{buildWaveform();loadChat();const n=localStorage.getItem("nr_ai_user_name");if(n){$("nameInput").value=n;saveName(n)}if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(console.warn)});