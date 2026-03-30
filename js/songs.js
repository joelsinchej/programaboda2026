// ════════════════════════════════
//  SONGS POPUP
// ════════════════════════════════

let currentBlock = null;
let _scrollY = 0;

/** Escapa caracteres HTML para evitar XSS en el value del input */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Bloquea el scroll del body de forma compatible con iOS Safari */
function _lockScroll() {
  _scrollY = window.scrollY;
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${_scrollY}px`;
  document.body.style.width = '100%';
}

/** Restaura el scroll del body sin saltar de posición */
function _unlockScroll() {
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, _scrollY);
}

function openSongs(id) {
  currentBlock = id;
  const m = blocks[id];
  document.getElementById('popupTitle').textContent = m.title;
  document.getElementById('popupSub').textContent   = m.sub;
  renderSongList();
  document.getElementById('popupOverlay').classList.add('open');
  _lockScroll();
  document.getElementById('btnAddSong').onclick = () => addSong();
}

function renderSongList() {
  const list  = document.getElementById('songList');
  const songs = songData[currentBlock] || [];

  if (!songs.length) {
    list.innerHTML = `
      <div class="empty-songs">
        <i class="fa-solid fa-music"></i>
        Aún no hay canciones.<br>¡Agrega la primera!
      </div>`;
    return;
  }

  list.innerHTML = songs.map((s, i) => `
    <li class="song-item" style="animation-delay:${i * .04}s">
      <div class="song-num">${i + 1}</div>
      <input
        class="song-input"
        value="${esc(s)}"
        placeholder="Nombre — Artista"
        inputmode="text"
        autocomplete="off"
        oninput="updateSong(${i}, this.value)"
        onkeydown="if(event.key==='Enter'){event.preventDefault();addSong()}">
      <button class="song-del" onclick="deleteSong(${i})" aria-label="Eliminar canción ${i + 1}">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </li>`).join('');
}

function addSong() {
  if (!songData[currentBlock]) songData[currentBlock] = [];
  // Sync valores actuales antes de agregar
  _syncInputs();
  songData[currentBlock].push('');
  renderSongList();
  setTimeout(() => {
    const inputs = document.querySelectorAll('.song-input');
    if (inputs.length) inputs[inputs.length - 1].focus();
  }, 50);
}

function updateSong(i, v) {
  if (songData[currentBlock]) songData[currentBlock][i] = v;
}

function deleteSong(i) {
  _syncInputs();
  songData[currentBlock].splice(i, 1);
  renderSongList();
}

function saveSongs() {
  _syncInputs();
  if (songData[currentBlock]) {
    songData[currentBlock] = songData[currentBlock].filter(s => s.trim());
  }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(songData)); } catch (e) {}
  updateCounts();
  showToast('✦  Lista guardada correctamente');
  closePopup();
}

function closePopup() {
  document.getElementById('popupOverlay').classList.remove('open');
  _unlockScroll();
}

function closeOnBg(e) {
  if (e.target === document.getElementById('popupOverlay')) closePopup();
}

/** Sincroniza los inputs del DOM al array antes de operar */
function _syncInputs() {
  document.querySelectorAll('.song-input').forEach((inp, j) => {
    if (songData[currentBlock] && j < songData[currentBlock].length) {
      songData[currentBlock][j] = inp.value;
    }
  });
}

function updateCounts() {
  Object.keys(blocks).forEach(id => {
    const el = document.getElementById('count-' + id);
    if (el) el.textContent = (songData[id] || []).filter(s => s.trim()).length;
  });
}
