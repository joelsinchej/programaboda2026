// ════════════════════════════════
//  POPUP UNIFICADO — detalle + canciones
//  Requiere: jQuery, data.js
// ════════════════════════════════

let currentBlock  = null;
let _scrollY      = 0;
let _popupMode    = 'detail'; // 'detail' | 'songs'

/* ─── Scroll lock compatible con iOS ─── */
function lockScroll() {
  _scrollY = window.scrollY;
  $('body').css({ overflow:'hidden', position:'fixed', top: -_scrollY + 'px', width:'100%' });
}
function unlockScroll() {
  $('body').css({ overflow:'', position:'', top:'', width:'' });
  window.scrollTo(0, _scrollY);
}

/* ─── Abrir popup con detalle de una tarjeta ─── */
function openDetail($card) {
  if ($card.hasClass('sub')) return;

  currentBlock = $card.data('block') || null;

  /* ── Leer contenido del DOM ── */
  const title     = $card.find('.ev-title').first().text().trim();
  const $timeEl   = $card.find('.ev-time').first();
  const timeText  = $timeEl.text().replace(/\s+/g,' ').trim();
  const isHighlight = $card.hasClass('highlight');
  const $musicBadge = $card.find('.music-badge').first();
  const $impBadge   = $card.find('.important-badge').first();

  /* Badge del encabezado */
  let badgeHtml = '';
  if ($impBadge.length)   badgeHtml = $impBadge.prop('outerHTML');
  else if ($musicBadge.length) badgeHtml = $musicBadge.prop('outerHTML');

  /* Meta items */
  const metaHtml = $card.find('.ev-meta-item').map(function() {
    const icon = $(this).find('i').prop('outerHTML') || '';
    const text = $(this).text().trim();
    return `<div class="detail-meta-item">${icon}<span>${text}</span></div>`;
  }).get().join('');

  /* Nota */
  const $note = $card.find('.ev-note').first();
  const noteHtml = $note.length ? $note.prop('outerHTML').replace('ev-note','detail-note') : '';

  /* ── Poblar vista detalle ── */
  $('#detailBadge').html(badgeHtml);
  $('#detailTitle').text(title);
  $('#detailTime').text(timeText);
  $('#detailMeta').html(metaHtml || '<p style="color:var(--muted);font-size:13px;padding:8px 0">Sin información adicional.</p>');
  $('#detailNoteWrap').html(noteHtml);

  /* Color del header según tipo de tarjeta */
  const $head = $('#detailHead');
  $head.removeClass('popup-head--gold popup-head--burg popup-head--plain');
  if (isHighlight)         $head.addClass('popup-head--burg');
  else if ($musicBadge.length) $head.addClass('popup-head--gold');
  else                     $head.addClass('popup-head--plain');

  /* Botón playlist */
  if (currentBlock) {
    const count = (songData[currentBlock] || []).filter(s => s.trim()).length;
    $('#playlistCount').text(count);
    const blockLabel = blocks[currentBlock] ? blocks[currentBlock].sub : '';
    $('#playlistBlockLabel').text(blockLabel);
    $('#btnOpenPlaylist').show();
  } else {
    $('#btnOpenPlaylist').hide();
  }

  /* Mostrar vista detalle */
  showView('detail');
  openOverlay();
}

/* ─── Cambiar a vista canciones ─── */
function openSongsView() {
  if (!currentBlock) return;
  const m = blocks[currentBlock];
  $('#songsTitle').text(m.title);
  $('#songsSub').text(m.sub);
  renderSongList();
  showView('songs');
}

/* ─── Abrir directamente la playlist (compat. con botones externos) ─── */
function openSongs(id) {
  currentBlock = id;
  const $card = $(`[data-block="${id}"]`);
  if ($card.length) {
    openDetail($card);
    openSongsView();
  } else {
    openSongsView();
    openOverlay();
  }
}

/* ─── Helpers de vista y overlay ─── */
function showView(mode) {
  _popupMode = mode;
  if (mode === 'detail') {
    $('#viewDetail').show();
    $('#viewSongs').hide();
  } else {
    $('#viewDetail').hide();
    $('#viewSongs').show();
    // Scroll body al inicio
    $('#popupOverlay .popup-body').last().scrollTop(0);
  }
}

function openOverlay() {
  $('#popupOverlay').addClass('open');
  lockScroll();
}

function closePopup() {
  $('#popupOverlay').removeClass('open');
  unlockScroll();
  setTimeout(() => showView('detail'), 420); // reset después de animación
}

/* ─── Escapa HTML ─── */
function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/"/g,'&quot;')
    .replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ─── Render lista de canciones ─── */
function renderSongList() {
  const $list = $('#songList');
  const songs = songData[currentBlock] || [];

  if (!songs.length) {
    $list.html(`
      <div class="empty-songs">
        <i class="fa-solid fa-music"></i>
        Aún no hay canciones.<br>¡Agrega la primera!
      </div>`);
    return;
  }

  $list.html(songs.map((s, i) => `
    <li class="song-item" style="animation-delay:${i * .04}s">
      <div class="song-num">${i + 1}</div>
      <input class="song-input"
        value="${esc(s)}"
        placeholder="Nombre — Artista"
        inputmode="text" autocomplete="off"
        data-idx="${i}">
      <button class="song-del" data-idx="${i}" aria-label="Eliminar canción ${i + 1}">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </li>`).join(''));
}

function syncInputs() {
  $('#songList .song-input').each(function() {
    const i = +$(this).data('idx');
    if (songData[currentBlock] && i < songData[currentBlock].length) {
      songData[currentBlock][i] = $(this).val();
    }
  });
}

function addSong() {
  if (!songData[currentBlock]) songData[currentBlock] = [];
  syncInputs();
  songData[currentBlock].push('');
  renderSongList();
  setTimeout(() => {
    const $inputs = $('#songList .song-input');
    if ($inputs.length) $inputs.last().focus();
  }, 60);
}

function deleteSong(i) {
  syncInputs();
  songData[currentBlock].splice(i, 1);
  renderSongList();
}

function saveSongs() {
  syncInputs();
  if (songData[currentBlock]) {
    songData[currentBlock] = songData[currentBlock].filter(s => s.trim());
  }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(songData)); } catch(e) {}
  updateCounts();
  showToast('✦  Lista guardada correctamente');
  closePopup();
}

function updateCounts() {
  $.each(blocks, function(id) {
    const count = (songData[id] || []).filter(s => s.trim()).length;
    $('#count-' + id).text(count);
  });
}

/* ════════════════════════════════
   EVENTOS jQuery
   ════════════════════════════════ */
$(function () {

  /* Cerrar al tocar el fondo del overlay */
  $('#popupOverlay').on('click', function(e) {
    if ($(e.target).is('#popupOverlay')) closePopup();
  });

  /* Botón cerrar (ambas vistas) */
  $(document).on('click', '#btnClose, #btnCloseSongs', closePopup);

  /* Volver de songs → detail */
  $('#btnBack').on('click', function() { showView('detail'); });

  /* Abrir playlist desde detalle */
  $('#btnOpenPlaylist').on('click', openSongsView);

  /* Agregar canción */
  $('#btnAddSong').on('click', addSong);

  /* Guardar */
  $('#btnSave').on('click', saveSongs);

  /* Editar canción (delegado) */
  $(document).on('input', '#songList .song-input', function() {
    const i = +$(this).data('idx');
    if (songData[currentBlock]) songData[currentBlock][i] = $(this).val();
  });

  /* Enter en input → agregar nueva */
  $(document).on('keydown', '#songList .song-input', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); addSong(); }
  });

  /* Eliminar canción (delegado) */
  $(document).on('click', '#songList .song-del', function() {
    deleteSong(+$(this).data('idx'));
  });

  /* Clic en tarjetas de evento (todas las no-sub) */
  $(document).on('click', '.ev-card:not(.sub)', function(e) {
    /* No abrir si el clic es dentro del toggle-sub o sub-list */
    if ($(e.target).closest('.toggle-sub, .sub-list').length) return;
    openDetail($(this));
  });

  /* Ripple táctil en tarjetas */
  $(document).on('click', '.ev-card', function(e) {
    const $card   = $(this);
    const offset  = $card.offset();
    const x       = e.pageX - offset.left;
    const y       = e.pageY - offset.top;
    const size    = Math.max($card.outerWidth(), $card.outerHeight()) * 2.5;
    const $dot    = $('<div class="ripple-dot">').css({
      left: x - size / 2, top: y - size / 2,
      width: size, height: size
    });
    $card.append($dot);
    setTimeout(() => $dot.remove(), 600);
  });

  /* Keyboard */
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') closePopup();
  });
});
