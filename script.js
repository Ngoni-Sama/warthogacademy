// ===== Warthog Academy — interactions =====

// Mobile nav toggle
const burger = document.getElementById('navBurger');
const links = document.getElementById('navLinks');
if (burger && links) {
  burger.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

// Current year
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();

// Graceful image fallbacks — show a styled placeholder until real photos are added
const FALLBACKS = {
  crest:    { icon: '🐗', label: 'Crest' },
  student:  { icon: '🎒', label: 'Add student photo' },
  students: { icon: '📖', label: 'Add photo' },
  reading:  { icon: '📚', label: 'Add photo' },
  uniform:  { icon: '🎓', label: 'Add photo' },
};
function placeholderFor(key, host) {
  const f = FALLBACKS[key] || { icon: '🖼️', label: 'Add photo' };
  const div = document.createElement('div');
  div.className = 'img-fallback';
  div.innerHTML = `<div>${f.icon}<small>${f.label}</small></div>`;
  host.innerHTML = '';
  host.appendChild(div);
}
document.querySelectorAll('img[data-fallback]').forEach(img => {
  img.addEventListener('error', () => {
    const key = img.getAttribute('data-fallback');
    const host = img.closest('[data-fallback]') || img.parentElement;
    placeholderFor(key, host);
  });
});

// Enquiry form -> compose email / WhatsApp
function handleEnquiry(e) {
  e.preventDefault();
  const f = e.target;
  const name = f.name.value.trim();
  const contact = f.contact.value.trim();
  const form = f.form.value;
  const message = f.message.value.trim();
  const note = document.getElementById('formNote');
  if (note) note.hidden = false;

  const body = `Enrollment enquiry%0A%0AParent/Guardian: ${encodeURIComponent(name)}%0AContact: ${encodeURIComponent(contact)}%0AForm: ${encodeURIComponent(form)}%0AMessage: ${encodeURIComponent(message)}`;
  // Open WhatsApp with the enquiry pre-filled
  const wa = `https://wa.me/263772620045?text=${body.replace(/%0A/g, '%0A')}`;
  window.open(wa, '_blank');
  // Also offer email as a fallback
  window.location.href = `mailto:thkamota@gmail.com?subject=${encodeURIComponent('Enrollment enquiry — ' + name)}&body=${body}`;
  return false;
}
window.handleEnquiry = handleEnquiry;
