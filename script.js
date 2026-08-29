// ===== Warthog Academy — interactions =====

const WA_NUMBER = '263772620045';        // WhatsApp (with country code, no +)
const SCHOOL_EMAIL = 'thkamota@gmail.com';

// If you deploy a Cloudflare Worker (Workers AI) like the CanChem bot, put its URL
// here and the chat will POST {message} to it and show the AI reply. Leave '' to
// use the built-in FAQ + WhatsApp handoff (fully static, no backend, no secrets).
const BOT_ENDPOINT = '';

// ---- Mobile nav ----
const burger = document.getElementById('navBurger');
const links = document.getElementById('navLinks');
if (burger && links) {
  burger.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

// ---- Year ----
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();

// ---- Image fallbacks (clean SVG placeholder if a photo is ever missing) ----
const SVG_PH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`;
document.querySelectorAll('img[data-fallback]').forEach(img => {
  img.addEventListener('error', () => {
    const host = img.closest('[data-fallback]') || img.parentElement;
    const div = document.createElement('div');
    div.className = 'img-fallback';
    div.innerHTML = SVG_PH;
    host.innerHTML = '';
    host.appendChild(div);
  });
});

// ---- Enquiry form -> WhatsApp (instant delivery to the school) ----
function handleEnquiry(e) {
  e.preventDefault();
  const f = e.target;
  const name = f.name.value.trim();
  const contact = f.contact.value.trim();
  const form = f.form.value;
  const message = f.message.value.trim();
  const text =
    `*Enrollment enquiry — Warthog Academy*\n\n` +
    `Parent/Guardian: ${name}\n` +
    `Contact: ${contact}\n` +
    `Form: ${form}\n` +
    (message ? `Message: ${message}\n` : '');
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  return false;
}
window.handleEnquiry = handleEnquiry;

// ================= CHAT WIDGET =================
const chat = document.getElementById('chat');
const chatFab = document.getElementById('chatFab');
const chatPanel = document.getElementById('chatPanel');
const chatBody = document.getElementById('chatBody');
const chatForm = document.getElementById('chatForm');
const chatText = document.getElementById('chatText');
const chatQuick = document.getElementById('chatQuick');
let greeted = false;

function addMsg(html, who) {
  const el = document.createElement('div');
  el.className = `msg msg--${who}`;
  el.innerHTML = html;
  chatBody.appendChild(el);
  chatBody.scrollTop = chatBody.scrollHeight;
  return el;
}
function typing() {
  const el = addMsg('<span class="chat__typing"><span></span><span></span><span></span></span>', 'bot');
  el.dataset.typing = '1';
  return el;
}

const WA_LINK = `<a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener">WhatsApp us</a>`;
const FAQ = {
  fees:     `Our fees are affordable and vary by <b>day vs boarding</b> and the form. For the current fee structure and payment plans, ${WA_LINK} or call <a href="tel:+263772620044">+263&nbsp;772&nbsp;620&nbsp;044</a>.`,
  enroll:   `Enrollment for <b>Forms 1–4</b> is open now! Fill the enquiry form on this page, or ${WA_LINK} with the learner's name and desired form — we'll guide you through the rest.`,
  boarding: `We offer both <b>boarding and day</b> schooling, and school <b>transport is available</b> for day scholars.`,
  subjects: `We follow the Zimbabwe Ministry of Primary &amp; Secondary Education curriculum — a balance of academics, sciences, sport and practical subjects. For the full subject list per form, ${WA_LINK}.`,
  location: `Reach us on <a href="tel:+263772620044">+263&nbsp;772&nbsp;620&nbsp;044</a>, WhatsApp <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener">+263&nbsp;772&nbsp;620&nbsp;045</a>, or email <a href="mailto:${SCHOOL_EMAIL}">${SCHOOL_EMAIL}</a>.`,
  transport:`Yes — safe, reliable school <b>transport is available</b>. ${WA_LINK} to check routes for your area.`,
  staff:    `Our teachers are <b>qualified and experienced</b>, and a <b>low teacher-to-student ratio</b> means more attention for every learner.`,
  greet:    `Hi! I'm the Warthog Academy assistant. Ask about <b>fees</b>, <b>enrollment</b>, <b>boarding</b>, <b>subjects</b> or <b>contact</b> — or tap a button below. For anything specific, ${WA_LINK}.`,
  fallback: `Good question! I can help with <b>fees</b>, <b>enrollment</b>, <b>boarding</b>, <b>transport</b>, <b>subjects</b> and <b>contact</b> details. For a personal answer, ${WA_LINK} and the school will assist you directly.`,
};

function matchFaq(q) {
  const s = q.toLowerCase();
  if (/(fee|cost|price|how much|pay|tuition)/.test(s)) return FAQ.fees;
  if (/(enrol|enroll|register|admission|apply|join|intake|place)/.test(s)) return FAQ.enroll;
  if (/(board|hostel|day school|day scholar|accommodat)/.test(s)) return FAQ.boarding;
  if (/(transport|bus|pick.?up|route)/.test(s)) return FAQ.transport;
  if (/(subject|curriculum|class|course|o.?level|form)/.test(s)) return FAQ.subjects;
  if (/(teacher|staff|ratio)/.test(s)) return FAQ.staff;
  if (/(where|location|address|contact|phone|call|email|reach|number)/.test(s)) return FAQ.location;
  if (/(hi|hello|hey|good (morning|afternoon|evening)|greet)/.test(s)) return FAQ.greet;
  if (/(thank|thanx|thanks|ok|great)/.test(s)) return `You're welcome! Anything else I can help with? ${WA_LINK} anytime.`;
  return FAQ.fallback;
}

async function botReply(q) {
  const t = typing();
  let answer;
  if (BOT_ENDPOINT) {
    try {
      const r = await fetch(BOT_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
      });
      const data = await r.json();
      answer = (data.reply || data.response || '').trim() || matchFaq(q);
    } catch {
      answer = matchFaq(q);
    }
  } else {
    await new Promise(res => setTimeout(res, 500)); // small human-like delay
    answer = matchFaq(q);
  }
  t.remove();
  addMsg(answer, 'bot');
}

function openChat() {
  chat.classList.add('open');
  chatPanel.hidden = false;
  if (!greeted) { greeted = true; addMsg(FAQ.greet, 'bot'); }
  setTimeout(() => chatText && chatText.focus(), 50);
}
function closeChat() { chat.classList.remove('open'); chatPanel.hidden = true; }

if (chatFab) chatFab.addEventListener('click', () => (chat.classList.contains('open') ? closeChat() : openChat()));
if (chatForm) chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const q = chatText.value.trim();
  if (!q) return;
  addMsg(q.replace(/</g, '&lt;'), 'user');
  chatText.value = '';
  botReply(q);
});
if (chatQuick) chatQuick.addEventListener('click', e => {
  const btn = e.target.closest('button[data-q]');
  if (!btn) return;
  const label = btn.textContent;
  addMsg(label, 'user');
  const map = { fees: 'fees', enroll: 'enroll', boarding: 'boarding', subjects: 'subjects', location: 'location' };
  const key = map[btn.dataset.q] || btn.dataset.q;
  const t = typing();
  setTimeout(() => { t.remove(); addMsg(FAQ[key] || FAQ.fallback, 'bot'); }, 450);
});
