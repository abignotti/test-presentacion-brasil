/* ============================================================
   BRANDS/SCORE-BRASIL/JS/MAIN.JS
   Lógica y animaciones de la presentación Score Brasil 2026.
   Usa GSAP + ScrollTrigger (cargados vía CDN).
   Gráfico de crecimiento: SVG puro, sin dependencias externas.
   ============================================================ */

'use strict';

/* ────────────────────────────────────────────────────────────
   1. PARTÍCULAS DEL HERO (Canvas puro, sin librerías extra)
   ──────────────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles(n) {
    return Array.from({ length: n }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.5 + 0.3,
      dx:    (Math.random() - 0.5) * 0.3,
      dy:    (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  }

  resize();
  particles = createParticles(80);
  draw();
  window.addEventListener('resize', () => {
    resize();
    particles = createParticles(80);
  });
})();


/* ────────────────────────────────────────────────────────────
   2. GSAP + ScrollTrigger — inicialización y animaciones
   ──────────────────────────────────────────────────────────── */
(function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP / ScrollTrigger no disponibles.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ── 2a. HERO — entrada al cargar ──────────────────────── */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero__eyebrow',  { opacity: 0, y: 30, duration: 0.7 })
    .from('.hero__title',    { opacity: 0, y: 60, duration: 0.8 }, '-=0.3')
    .from('.hero__subtitle', { opacity: 0, y: 30, duration: 0.6 }, '-=0.4')
    .from('.scroll-indicator', { opacity: 0, duration: 0.5 },       '-=0.2');

  /* ── 2b. HERO — pin con parallax leve en scroll ─────────── */
  gsap.to('#hero .hero__content', {
    scrollTrigger: {
      trigger: '#hero',
      start:   'top top',
      end:     'bottom top',
      scrub:   1,
    },
    y:       80,
    opacity: 0,
    ease:    'none',
  });

  /* ── 2c. SECCIÓN GRÁFICO — fade in general ──────────────── */
  gsap.from('#crecimiento .section__header', {
    scrollTrigger: {
      trigger: '#crecimiento',
      start:   'top 80%',
    },
    opacity: 0,
    y:       40,
    duration: 0.8,
    ease:    'power2.out',
  });

  /* ── 2d. KPI CARDS — stagger desde abajo ────────────────── */
  gsap.from('.kpi-card', {
    scrollTrigger: {
      trigger: '#credenciales',
      start:   'top 75%',
    },
    opacity:  0,
    y:        50,
    duration: 0.7,
    stagger:  0.15,
    ease:     'power2.out',
  });

  /* ── 2e. ADN BLOQUES — stagger ──────────────────────────── */
  gsap.from('.adn-bloque', {
    scrollTrigger: {
      trigger: '#adn',
      start:   'top 75%',
    },
    opacity:  0,
    y:        40,
    duration: 0.7,
    stagger:  0.15,
    ease:     'power2.out',
  });

  /* ── 2f. MERCADO BLOQUES — stagger ─────────────────────── */
  gsap.from('.mercado-bloque', {
    scrollTrigger: {
      trigger: '#mercado',
      start:   'top 75%',
    },
    opacity:  0,
    x:        -30,
    duration: 0.7,
    stagger:  0.15,
    ease:     'power2.out',
  });

  /* ── 2g. BARRAS CONSUMO — animar width ──────────────────── */
  ScrollTrigger.create({
    trigger: '#mercado',
    start:   'top 65%',
    onEnter: animarBarrasConsumo,
    once:    true,
  });

  /* ── 2h. PILARES PRODUCCIÓN — stagger ───────────────────── */
  gsap.from('.pilar-card', {
    scrollTrigger: {
      trigger: '#produccion',
      start:   'top 75%',
    },
    opacity:  0,
    x:        40,
    duration: 0.7,
    stagger:  0.18,
    ease:     'power2.out',
  });

  /* ── 2i. PORTAFOLIO CARDS — stagger ─────────────────────── */
  gsap.from('.producto-card', {
    scrollTrigger: {
      trigger: '#portafolio',
      start:   'top 75%',
    },
    opacity:  0,
    y:        60,
    duration: 0.8,
    stagger:  0.2,
    ease:     'back.out(1.2)',
  });

  /* ── 2j. CIERRE — pin + revelado escalonado ─────────────── */
  const cierreTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#cierre',
      start:   'top top',
      end:     '+=120%',
      pin:     true,
      scrub:   1,
    },
  });

  cierreTl
    .from('.cierre__frase--blanco',  { opacity: 0, y: 50, duration: 0.4 })
    .from('.cierre__frase--accent',  { opacity: 0, y: 50, duration: 0.4 }, '+=0.1')
    .from('.cierre__cta',            { opacity: 0, y: 30, duration: 0.3 }, '+=0.1')
    .from('.cierre__divider',        { scaleX: 0, duration: 0.3 },         '+=0.05')
    .from('.cierre__contacto',       { opacity: 0, y: 20, duration: 0.3 }, '+=0.05')
    .from('.cierre__footer',         { opacity: 0, duration: 0.2 },        '+=0.05');

})();


/* ────────────────────────────────────────────────────────────
   3. BARRAS DE CONSUMO COMPARATIVO
   ──────────────────────────────────────────────────────────── */
function animarBarrasConsumo() {
  const barChile   = document.querySelector('.consumo-row__bar--chile');
  const barBrasil  = document.querySelector('.consumo-row__bar--brasil');
  if (barChile)  barChile.style.width  = '100%';
  if (barBrasil) barBrasil.style.width = '33.3%';
}


/* ────────────────────────────────────────────────────────────
   4. GRÁFICO DE CRECIMIENTO — SVG PURO (sin Chart.js)
   6 hitos clave animados con stagger al entrar en pantalla.
   Tooltip interactivo al hacer hover.
   ──────────────────────────────────────────────────────────── */
(function initBarChart() {
  const container = document.getElementById('growth-chart-container');
  if (!container) return;

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        observer.disconnect();
        buildBarChart(container);
      }
    },
    { threshold: 0.25 }
  );

  observer.observe(container);
})();

function buildBarChart(container) {
  const milestones = [
    { year: '2012', value: 1.07,   label: '1M',      note: 'Inicio en Chile',       accent: false, proj: false },
    { year: '2016', value: 5.36,   label: '5.4M',    note: 'Expansión nacional',    accent: false, proj: false },
    { year: '2020', value: 39.85,  label: '39.9M',   note: '🚀 Explosión mercado',  accent: false, proj: false },
    { year: '2021', value: 100.22, label: '100M',    note: '⚡ +151% en 12 meses',  accent: true,  proj: false },
    { year: '2025', value: 113.81, label: '113.8M',  note: '★ Récord histórico',    accent: true,  proj: false },
    { year: '2026', value: 120,    label: '120M',    note: '⟶ Objetivo Brasil',     accent: false, proj: true  },
  ];

  /* ── Dimensiones ─── */
  const W        = 660;
  const H        = 320;
  const TOP      = 24;
  const BOTTOM   = 248;
  const CHART_H  = BOTTOM - TOP;   // 224px de altura útil
  const MAX_VAL  = 130;
  const SCALE    = (CHART_H * 0.92) / MAX_VAL;
  const BAR_W    = 62;
  const GAP      = 28;
  const LEFT_PAD = 68;

  const ns = 'http://www.w3.org/2000/svg';

  /* ── SVG ─── */
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('xmlns', ns);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Gráfico de crecimiento Score Energy 2012-2026');
  svg.style.cssText = 'width:100%;height:auto;display:block;overflow:visible';

  /* ── Tooltip div ─── */
  const tooltip = document.createElement('div');
  tooltip.setAttribute('role', 'tooltip');
  tooltip.style.cssText = [
    'position:absolute',
    'display:none',
    'pointer-events:none',
    'background:rgba(12,12,12,0.96)',
    'border:1px solid rgba(255,215,0,0.45)',
    'color:#fff',
    'padding:10px 16px',
    'border-radius:8px',
    'font-family:Inter,sans-serif',
    'font-size:13px',
    'line-height:1.6',
    'z-index:200',
    'white-space:nowrap',
    'box-shadow:0 4px 24px rgba(0,0,0,0.6)',
    'transform:translateX(-50%)',
  ].join(';');
  container.style.position = 'relative';
  container.appendChild(tooltip);

  /* ── Defs: filtro glow ─── */
  const defs = document.createElementNS(ns, 'defs');
  defs.innerHTML =
    '<filter id="scoreGlow" x="-30%" y="-30%" width="160%" height="160%">' +
      '<feGaussianBlur stdDeviation="4" result="blur"/>' +
      '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
    '</filter>';
  svg.appendChild(defs);

  /* ── Líneas de referencia Y ─── */
  [25, 50, 75, 100].forEach((tick) => {
    const y = BOTTOM - tick * SCALE;

    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', LEFT_PAD);
    line.setAttribute('y1', y);
    line.setAttribute('x2', W - 16);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(255,255,255,0.055)');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);

    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', LEFT_PAD - 8);
    label.setAttribute('y', y + 4);
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('fill', '#555');
    label.setAttribute('font-family', 'Inter,sans-serif');
    label.setAttribute('font-size', '11');
    label.textContent = tick + 'M';
    svg.appendChild(label);
  });

  /* ── Línea base ─── */
  const baseline = document.createElementNS(ns, 'line');
  baseline.setAttribute('x1', LEFT_PAD);
  baseline.setAttribute('y1', BOTTOM);
  baseline.setAttribute('x2', W - 16);
  baseline.setAttribute('y2', BOTTOM);
  baseline.setAttribute('stroke', 'rgba(255,255,255,0.18)');
  baseline.setAttribute('stroke-width', '1');
  svg.appendChild(baseline);

  /* ── Barras ─── */
  const barItems = [];

  milestones.forEach((m, i) => {
    const x      = LEFT_PAD + i * (BAR_W + GAP);
    const cx     = x + BAR_W / 2;
    const finalH = Math.max(5, m.value * SCALE);

    /* Color de la barra */
    const fillColor = m.accent
      ? '#FFD700'
      : m.proj
        ? 'rgba(255,215,0,0.28)'
        : 'rgba(255,215,0,0.60)';

    /* Rect de la barra (altura 0 al inicio para la animación) */
    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', BOTTOM);
    rect.setAttribute('width', BAR_W);
    rect.setAttribute('height', 0);
    rect.setAttribute('rx', '5');
    rect.setAttribute('fill', fillColor);
    if (m.proj) {
      rect.setAttribute('stroke', 'rgba(255,215,0,0.7)');
      rect.setAttribute('stroke-width', '1.5');
      rect.setAttribute('stroke-dasharray', '5 3');
    }
    if (m.accent) {
      rect.setAttribute('filter', 'url(#scoreGlow)');
    }
    svg.appendChild(rect);

    /* Etiqueta de valor (encima de la barra, invisible hasta que termine la animación) */
    const valText = document.createElementNS(ns, 'text');
    valText.setAttribute('x', cx);
    valText.setAttribute('y', BOTTOM - finalH - 9);
    valText.setAttribute('text-anchor', 'middle');
    valText.setAttribute('fill', m.accent ? '#FFD700' : m.proj ? 'rgba(255,215,0,0.7)' : '#999');
    valText.setAttribute('font-family', 'Inter,sans-serif');
    valText.setAttribute('font-size', m.accent ? '13' : '11');
    valText.setAttribute('font-weight', m.accent ? '700' : '400');
    valText.setAttribute('opacity', '0');
    valText.textContent = m.label;
    svg.appendChild(valText);

    /* Etiqueta año (debajo de la línea base) */
    const yearText = document.createElementNS(ns, 'text');
    yearText.setAttribute('x', cx);
    yearText.setAttribute('y', BOTTOM + 22);
    yearText.setAttribute('text-anchor', 'middle');
    yearText.setAttribute('fill', m.accent ? '#FFD700' : m.proj ? 'rgba(255,215,0,0.65)' : '#666');
    yearText.setAttribute('font-family', 'Inter,sans-serif');
    yearText.setAttribute('font-size', '12');
    yearText.setAttribute('font-weight', m.accent ? '600' : '400');
    yearText.textContent = m.year;
    svg.appendChild(yearText);

    /* Badge especial para barras accent */
    if (m.accent) {
      const badge = document.createElementNS(ns, 'text');
      badge.setAttribute('x', cx);
      badge.setAttribute('y', BOTTOM - finalH - 26);
      badge.setAttribute('text-anchor', 'middle');
      badge.setAttribute('fill', '#FFD700');
      badge.setAttribute('font-size', '14');
      badge.setAttribute('opacity', '0');
      badge.textContent = m.year === '2021' ? '⚡' : '★';
      svg.appendChild(badge);
      barItems.push({ rect, valText, badge, finalH, delay: i * 100 });
    } else {
      barItems.push({ rect, valText, badge: null, finalH, delay: i * 100 });
    }

    /* Rect invisible para eventos hover (cubre toda la columna) */
    const hitRect = document.createElementNS(ns, 'rect');
    hitRect.setAttribute('x', x - GAP / 2);
    hitRect.setAttribute('y', TOP);
    hitRect.setAttribute('width', BAR_W + GAP);
    hitRect.setAttribute('height', BOTTOM - TOP + 36);
    hitRect.setAttribute('fill', 'transparent');
    hitRect.style.cursor = 'pointer';

    hitRect.addEventListener('mouseenter', () => {
      tooltip.innerHTML =
        '<strong style="color:#FFD700;font-size:15px">' + m.year + '</strong><br/>' +
        '<span style="color:#aaa;font-size:12px">' + m.note + '</span><br/>' +
        '<span style="font-size:20px;font-weight:700;color:#fff">' + m.label + '</span>' +
        '<span style="color:#888;font-size:12px"> latas</span>';
      tooltip.style.display = 'block';
    });

    hitRect.addEventListener('mousemove', (e) => {
      const bounds = container.getBoundingClientRect();
      const relX   = e.clientX - bounds.left;
      const relY   = e.clientY - bounds.top;
      /* Evitar que el tooltip se salga por la derecha */
      const maxLeft = bounds.width - 10;
      tooltip.style.left = Math.min(relX, maxLeft) + 'px';
      tooltip.style.top  = (relY - 72) + 'px';
    });

    hitRect.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });

    svg.appendChild(hitRect);
  });

  container.appendChild(svg);

  /* ── Animación: barras crecen de abajo hacia arriba ─── */
  const startTs = performance.now();
  const DURATION = 1100;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animate(ts) {
    let running = false;

    barItems.forEach(({ rect, valText, badge, finalH, delay }) => {
      const elapsed  = ts - startTs - delay;
      if (elapsed <= 0) { running = true; return; }

      const progress = Math.min(1, elapsed / DURATION);
      const eased    = easeOutCubic(progress);
      const h        = finalH * eased;

      rect.setAttribute('y',      BOTTOM - h);
      rect.setAttribute('height', h);

      /* Fade in del valor al 75% de la animación */
      if (progress >= 0.75) {
        const a = Math.min(1, (progress - 0.75) / 0.25);
        valText.setAttribute('opacity', a.toFixed(3));
        if (badge) badge.setAttribute('opacity', a.toFixed(3));
      }

      if (progress < 1) running = true;
    });

    if (running) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}


/* ────────────────────────────────────────────────────────────
   5. CONTADORES KPI (via data-counter, manejados por core.js)
   ──────────────────────────────────────────────────────────── */
// Los contadores usan data-counter="VALUE" + data-counter-* en el HTML.
// core.js los inicializa automáticamente vía DOMContentLoaded.


/* ────────────────────────────────────────────────────────────
   6. RESIZE — recalcular barras consumo en responsive
   ──────────────────────────────────────────────────────────── */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    animarBarrasConsumo();
  }, 200);
});
