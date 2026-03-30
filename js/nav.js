// ════════════════════════════════
//  SCROLL PROGRESS + NAV PILLS
// ════════════════════════════════

const topBar     = document.getElementById('top-bar');
const progCircle = document.getElementById('progCircle');
const progPct    = document.getElementById('progPct');
const circLen    = 2 * Math.PI * 15.9;

progCircle.style.strokeDasharray  = circLen;
progCircle.style.strokeDashoffset = circLen;

const navTargetIds = [
  'sec-ingreso', 'sec-musica', 'sec-procesion', 'sec-votos',
  'sec-recepcion', 'sec-banquete', 'sec-horaloca', 'sec-cierre',
];

function updateActivePill() {
  let active = 0;
  navTargetIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < 110) active = i;
  });
  document.querySelectorAll('.nav-pill').forEach((p, i) => {
    p.classList.toggle('active', i === active);
  });
}

window.addEventListener('scroll', () => {
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct  = Math.min(100, Math.round(window.scrollY / docH * 100));
  topBar.style.width = pct + '%';
  progCircle.style.strokeDashoffset = circLen - (circLen * pct / 100);
  progPct.textContent = pct + '%';
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 60);
  updateActivePill();
}, { passive: true });

function navTo(id) {
  const el   = document.getElementById(id);
  if (!el) return;
  const navH = document.getElementById('mainNav').offsetHeight;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navH - 16, behavior: 'smooth' });
}
