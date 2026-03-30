// ════════════════════════════════
//  DATA — bloques de música y TOC
// ════════════════════════════════

const STORAGE_KEY = 'jl_boda_2026_v2';

let songData = {};
try { songData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) {}

const blocks = {
  dj1:  { title: 'DJ — Bloque 1',          sub: 'Música de Bienvenida · 6:07 PM' },
  dj2:  { title: 'DJ — Bloque 2',          sub: 'Durante El Banquete · 7:30 PM' },
  djhl: { title: 'DJ — Mix Hora Loca',     sub: '¡La Fiesta! · 9:05 PM' },
  orq1: { title: 'N3 Band — Bloque 1',     sub: 'Primer Bloque Orquesta · 8:05 PM' },
  orq2: { title: 'N3 Band — Bloque 2',     sub: 'Segundo Bloque Orquesta · 8:45 PM' },
  orq3: { title: 'N3 Band — Bloque Final', sub: 'Gran Cierre Orquesta · 10:00 PM' },
};

const tocData = [
  { label: 'I. Ceremonia', items: [
    { id: 'sec-ingreso',   time: '4:00 PM',  name: 'Apertura e Ingreso al Local',            important: false },
    { id: 'sec-musica',    time: '4:30 PM',  name: 'Ambientación Musical Pre-Ceremonia',     important: false },
    { id: 'sec-procesion', time: '5:00 PM',  name: 'Inicio de la Presentación Ceremonial',  important: false },
    { id: null,            time: '5:15 PM',  name: 'Presentación del Pastor',               important: false },
    { id: 'sec-votos',     time: '5:35 PM',  name: '✦ Intercambio de Votos',                important: true  },
    { id: null,            time: '5:45 PM',  name: 'Acto Simbólico de Unión',               important: false },
    { id: null,            time: '5:55 PM',  name: '✦ El Beso de los Esposos',              important: true  },
    { id: null,            time: '6:00 PM',  name: 'Salida Triunfal de los Esposos',        important: false },
    { id: null,            time: '6:05 PM',  name: 'Sesión Fotográfica',                    important: false },
  ]},
  { label: 'II. Recepción', items: [
    { id: 'sec-recepcion', time: '6:07 PM',  name: 'Ambientación Musical — DJ Bloque 1',    important: false },
    { id: null,            time: '6:30 PM',  name: 'Apertura Oficial de la Recepción',      important: false },
    { id: null,            time: '6:35 PM',  name: 'Gran Ingreso de los Esposos',           important: false },
    { id: null,            time: '6:40 PM',  name: '✦ Primer Baile — Vals',                 important: true  },
    { id: null,            time: '6:55 PM',  name: 'Brindis de Honor',                      important: false },
    { id: 'sec-banquete',  time: '7:30 PM',  name: 'El Banquete · DJ Bloque 2',            important: false },
    { id: null,            time: '8:05 PM',  name: 'Orquesta en Vivo — Bloque 1',          important: false },
    { id: null,            time: '8:30 PM',  name: '✦ Canción & Vals Sorpresa del Novio',   important: true  },
    { id: null,            time: '8:45 PM',  name: 'Orquesta en Vivo — Bloque 2',          important: false },
    { id: null,            time: '9:00 PM',  name: '✦ Baile Sorpresa de los Esposos',       important: true  },
    { id: 'sec-horaloca',  time: '9:05 PM',  name: '✦ ¡Hora Loca!',                         important: true  },
    { id: null,            time: '9:45 PM',  name: 'Lanzamiento del Bouquet',               important: false },
    { id: null,            time: '10:00 PM', name: 'Orquesta en Vivo — Bloque Final',       important: false },
    { id: 'sec-cierre',    time: '11:00 PM', name: 'Cierre y Agradecimientos',             important: false },
  ]},
];
