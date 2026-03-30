// ════════════════════════════════
//  TOGGLE SUB-LISTS (desfile procesión)
// ════════════════════════════════
function toggleSub(id, btn) {
  const el    = document.getElementById(id);
  const icon  = btn.querySelector('.toggle-sub-icon i');
  const label = btn.querySelector('span');
  el.classList.toggle('open');
  if (el.classList.contains('open')) {
    icon.className   = 'fa-solid fa-chevron-up';
    label.textContent = 'Ocultar desfile de ingreso';
  } else {
    icon.className   = 'fa-solid fa-chevron-down';
    label.textContent = 'Ver desfile de ingreso — 9 momentos';
  }
}

// ════════════════════════════════
//  INTERSECTION OBSERVER (card reveal)
// ════════════════════════════════
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

document.querySelectorAll('.ev-card').forEach((c, i) => {
  c.style.transitionDelay = (i % 5) * 0.055 + 's';
  revealObs.observe(c);
});

// ════════════════════════════════
//  TOAST
// ════════════════════════════════
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ════════════════════════════════
//  KEYBOARD
// ════════════════════════════════
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closePopup();
    if (tocOpen) toggleToc();
  }
});

// ════════════════════════════════
//  INIT
// ════════════════════════════════
updateCounts();
buildToc();
