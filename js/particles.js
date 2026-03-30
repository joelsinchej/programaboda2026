// ════════════════════════════════
//  CANVAS PARTICLES
// ════════════════════════════════
(function () {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = document.documentElement.scrollHeight;
  }

  function init() {
    pts = [];
    const n = Math.floor(W * H / 20000);
    for (let i = 0; i < n; i++) {
      pts.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.6 + 0.3,
        a:  Math.random() * Math.PI * 2,
        sp: Math.random() * .003 + .001,
        op: Math.random() * .45 + .15,
        c:  Math.random() > .65 ? '#B68B40' : '#8B3A3A',
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.a += p.sp;
      p.x += Math.sin(p.a) * .35;
      p.y += Math.cos(p.a * .7) * .25;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.save();
      ctx.globalAlpha = p.op * (0.65 + 0.35 * Math.sin(p.a * 2));
      ctx.fillStyle   = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }

  resize(); init(); draw();
  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
})();
