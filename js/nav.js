// ════════════════════════════════
//  SCROLL PROGRESS + NAV PILLS
//  Requiere: jQuery
// ════════════════════════════════
$(function () {

  const $topBar     = $('#top-bar');
  const $progCircle = $('#progCircle');
  const $progPct    = $('#progPct');
  const circLen     = 2 * Math.PI * 15.9;

  $progCircle[0].style.strokeDasharray  = circLen;
  $progCircle[0].style.strokeDashoffset = circLen;

  const navTargetIds = [
    'sec-ingreso','sec-musica','sec-procesion','sec-votos',
    'sec-recepcion','sec-banquete','sec-horaloca','sec-cierre'
  ];

  function updateProgress() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct  = docH > 0 ? Math.min(100, Math.round(window.scrollY / docH * 100)) : 0;
    $topBar.css('width', pct + '%');
    $progCircle[0].style.strokeDashoffset = circLen - (circLen * pct / 100);
    $progPct.text(pct + '%');
    $('#mainNav').toggleClass('scrolled', window.scrollY > 60);
    updateActivePill();
  }

  function updateActivePill() {
    let active = 0;
    navTargetIds.forEach(function(id, i) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < 110) active = i;
    });
    $('.nav-pill').each(function(i) {
      $(this).toggleClass('active', i === active);
    });
  }

  $(window).on('scroll', updateProgress, { passive: true });
  updateProgress();

  /* Nav pill click → scroll */
  window.navTo = function(id) {
    const $el = $('#' + id);
    if (!$el.length) return;
    const navH = $('#mainNav').outerHeight();
    const top  = $el.offset().top - navH - 14;
    $('html, body').animate({ scrollTop: top }, 420);
  };
});
