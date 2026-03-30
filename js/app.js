// ════════════════════════════════
//  APP — init, reveal, toggle-sub, toast
//  Requiere: jQuery, popup.js, nav.js, toc.js
// ════════════════════════════════

$(function () {

  /* ─── Card reveal con IntersectionObserver ─── */
  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        $(e.target).addClass('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

  $('.ev-card').each(function(i) {
    this.style.transitionDelay = (i % 5) * 0.05 + 's';
    obs.observe(this);
  });

  /* ─── Toggle sub-lista procesión ─── */
  $(document).on('click', '.toggle-sub', function(e) {
    e.stopPropagation(); // evitar que abra el detalle de la tarjeta padre
    const $btn  = $(this);
    const id    = $btn.data('target');
    const $list = $('#' + id);
    const $icon = $btn.find('.toggle-sub-icon i');

    $list.toggleClass('open');
    if ($list.hasClass('open')) {
      $icon.attr('class', 'fa-solid fa-chevron-up');
      $btn.find('span').text('Ocultar desfile de ingreso');
    } else {
      $icon.attr('class', 'fa-solid fa-chevron-down');
      $btn.find('span').text('Ver desfile de ingreso — 9 momentos');
    }
  });

  /* ─── Toast ─── */
  window.showToast = function(msg) {
    const $t = $('#toast');
    $('#toastMsg').text(msg);
    $t.addClass('show');
    setTimeout(function() { $t.removeClass('show'); }, 3200);
  };

  /* ─── Init ─── */
  updateCounts();
});
