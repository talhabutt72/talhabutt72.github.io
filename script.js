document.getElementById('year').textContent = new Date().getFullYear();

const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

// reveal sections and cards as they scroll into view
const items = document.querySelectorAll('.section .card, .section h2, .stat, .tl');
items.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
items.forEach(el => io.observe(el));

// click ripple on the Contact button, then pop the contact cards
const btn = document.getElementById('contactBtn');
btn.addEventListener('click', (e) => {
  const r = btn.getBoundingClientRect();
  const s = Math.max(r.width, r.height);
  const dot = document.createElement('span');
  dot.className = 'ripple';
  dot.style.width = dot.style.height = s + 'px';
  dot.style.left = (e.clientX - r.left - s / 2) + 'px';
  dot.style.top = (e.clientY - r.top - s / 2) + 'px';
  btn.appendChild(dot);
  setTimeout(() => dot.remove(), 600);

  const contact = document.getElementById('contact');
  contact.classList.remove('pop');
  setTimeout(() => contact.classList.add('pop'), 500);
});
