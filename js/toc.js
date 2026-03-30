// ════════════════════════════════
//  TOC PANEL + SPOTLIGHT
//  Requiere: jQuery, data.js
// ════════════════════════════════

const allMainCards = [];
let tocOpen = false;

$(function () {

  /* Recoger todas las tarjetas principales (no sub) */
  $('.ev-card:not(.sub)').each(function() { allMainCards.push(this); });

  /* FAB toggle */
  $('#fab').on('click', toggleToc);

  /* Cerrar TOC al clic fuera */
  $(document).on('click', function(e) {
    if (tocOpen && !$(e.target).closest('.fab-wrap').length) {
      closeToc();
    }
  });

  buildToc();
});

function toggleToc() { tocOpen ? closeToc() : openToc(); }
function openToc()  { tocOpen = true;  $('#tocPanel').addClass('open'); $('#fab').addClass('open'); }
function closeToc() { tocOpen = false; $('#tocPanel').removeClass('open'); $('#fab').removeClass('open'); }

function spotlightCard(card) {
  $('.ev-card.spotlit').removeClass('spotlit');
  void card.offsetWidth;
  $(card).addClass('spotlit');
  setTimeout(() => $(card).removeClass('spotlit'), 2400);
}

function scrollToCard(idx) {
  const card = allMainCards[idx];
  if (!card) return;
  closeToc();
  const navH = $('#mainNav').outerHeight();
  const top  = $(card).offset().top - navH - 18;
  $('html, body').animate({ scrollTop: top }, 420, function() {
    setTimeout(() => spotlightCard(card), 200);
  });
}

function buildToc() {
  const $list = $('#tocList');
  let cardCursor = 0;
  let html = '';

  tocData.forEach(function(section) {
    html += `<div class="toc-section-label">${section.label}</div>`;
    section.items.forEach(function(item) {
      const imp     = item.important;
      const cardIdx = cardCursor++;
      html += `
        <div class="toc-item${imp ? ' is-important' : ''}" data-idx="${cardIdx}">
          <div class="toc-dot"></div>
          <div class="toc-item-name">${item.name}</div>
          <div class="toc-time-badge">${item.time}</div>
        </div>`;
    });
  });

  $list.html(html);

  /* Clic en item del TOC */
  $list.on('click', '.toc-item', function() {
    scrollToCard(+$(this).data('idx'));
  });
}
