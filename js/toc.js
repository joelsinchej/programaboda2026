// ════════════════════════════════
//  TOC PANEL + SPOTLIGHT
// ════════════════════════════════

const allMainCards = [];
document.querySelectorAll('.ev-card:not(.sub)').forEach(c => allMainCards.push(c));

let tocOpen = false;

function toggleToc() {
  tocOpen = !tocOpen;
  document.getElementById('tocPanel').classList.toggle('open', tocOpen);
  document.getElementById('fab').classList.toggle('open', tocOpen);
}

function spotlightCard(card) {
  document.querySelectorAll('.ev-card.spotlit').forEach(c => c.classList.remove('spotlit'));
  void card.offsetWidth; // force reflow para reiniciar animación
  card.classList.add('spotlit');
  setTimeout(() => card.classList.remove('spotlit'), 2400);
}

function scrollToCard(idx) {
  const card = allMainCards[idx];
  if (!card) return;
  toggleToc();
  const navH = document.getElementById('mainNav').offsetHeight;
  const y    = card.getBoundingClientRect().top + window.scrollY - navH - 20;
  window.scrollTo({ top: y, behavior: 'smooth' });
  setTimeout(() => spotlightCard(card), 700);
}

function buildToc() {
  const list = document.getElementById('tocList');
  let cardCursor = 0;
  let html = '';

  tocData.forEach(section => {
    html += `<div class="toc-section-label">${section.label}</div>`;
    section.items.forEach(item => {
      const imp     = item.important;
      const cardIdx = cardCursor++;
      html += `
        <div class="toc-item${imp ? ' is-important' : ''}" onclick="scrollToCard(${cardIdx})">
          <div class="toc-dot"></div>
          <div class="toc-item-name">${item.name}</div>
          <div class="toc-time-badge">${item.time}</div>
        </div>`;
    });
  });

  list.innerHTML = html;
}
