/* ============================================================
   BRANDS/SCORE-BRASIL/JS/MAIN.JS
   Lógica y animaciones de la presentación Score Brasil 2026.
   Usa GSAP + ScrollTrigger y Chart.js (cargados vía CDN).
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
   4. CHART.JS — CURVA DE CRECIMIENTO
   ──────────────────────────────────────────────────────────── */
(function initChart() {
  const canvas = document.getElementById('growth-chart');
  if (!canvas) return;
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js no disponible.');
    return;
  }

  let chartInitialized = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !chartInitialized) {
          chartInitialized = true;
          observer.disconnect();
          buildChart(canvas);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(canvas);
})();

function buildChart(canvas) {
  const isMobile = window.innerWidth <= 768;
  const ctx      = canvas.getContext('2d');

  /* Gradiente de relleno */
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight || 300);
  gradient.addColorStop(0,   'rgba(255, 215, 0, 0.35)');
  gradient.addColorStop(0.6, 'rgba(255, 215, 0, 0.08)');
  gradient.addColorStop(1,   'rgba(255, 215, 0, 0)');

  /* ── Datos reales extraídos del Excel de ventas históricas ── */
  const labels = ['2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026'];
  const data   = [1.07,  1.74,  1.69,  2.15,  5.36,  9.20,  11.65, 17.14, 39.85, 100.22, 99.46, 88.72, 99.04, 113.81, 120];

  /* Puntos especiales: 2021, 2025 y 2026 destacados */
  const pointBg = labels.map((l) => {
    if (l === '2021' || l === '2025') return '#FFD700';
    if (l === '2026') return 'rgba(255,215,0,0.4)';
    return 'rgba(255,215,0,0.55)';
  });
  const pointRadii = labels.map((l) =>
    l === '2021' || l === '2025' ? 7 : l === '2026' ? 7 : 4
  );
  const pointBorder = labels.map((l) => l === '2026' ? '#FFFFFF' : '#FFD700');

  /* Dataset sólido (hasta 2025) */
  const dataSolid  = data.map((v, i) => i < labels.indexOf('2026') ? v : null);
  /* Dataset punteado (2025 → 2026 proyección) */
  const dataDashed = data.map((v, i) => {
    if (i === labels.indexOf('2025') || i === labels.indexOf('2026')) return v;
    return null;
  });

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label:               'Ventas reales (millones de unidades)',
          data:                dataSolid,
          fill:                true,
          backgroundColor:     gradient,
          borderColor:         '#FFD700',
          borderWidth:         2.5,
          pointBackgroundColor: pointBg,
          pointBorderColor:    pointBorder,
          pointBorderWidth:    2,
          pointRadius:         pointRadii,
          pointHoverRadius:    8,
          tension:             0.45,
          spanGaps:            false,
        },
        {
          label:               'Objetivo 2026: 120M',
          data:                dataDashed,
          fill:                false,
          borderColor:         'rgba(255,215,0,0.55)',
          borderWidth:         2,
          borderDash:          [6, 4],
          pointBackgroundColor: labels.map((l) => l === '2025' ? 'transparent' : '#FFD700'),
          pointBorderColor:    labels.map((l) => l === '2026' ? '#FFFFFF' : 'transparent'),
          pointBorderWidth:    2,
          pointRadius:         labels.map((l) => l === '2026' ? 7 : 0),
          pointHoverRadius:    labels.map((l) => l === '2026' ? 9 : 0),
          tension:             0.4,
          spanGaps:            true,
        },
      ],
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000,
        easing:   'easeInOutQuart',
      },
      interaction: {
        mode:      'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display:  true,
          position: 'bottom',
          labels: {
            color:     '#888888',
            font:      { family: 'Inter', size: isMobile ? 11 : 12 },
            boxWidth:  14,
            padding:   20,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(20,20,20,0.95)',
          borderColor:     'rgba(255,215,0,0.3)',
          borderWidth:     1,
          titleColor:      '#FFD700',
          bodyColor:       '#FFFFFF',
          padding:         12,
          titleFont:       { family: 'Bebas Neue', size: isMobile ? 14 : 16 },
          bodyFont:        { family: 'Inter', size: isMobile ? 12 : 13 },
          callbacks: {
            title: (items) => items[0].label,
            label: (item) => {
              if (item.datasetIndex === 1 && item.raw === null) return null;
              const notas = {
                '2020': '🚀 Explosión de mercado',
                '2021': '⚡ +151%: de 40M a 100M',
                '2022': 'Ajuste post-pandemia',
                '2023': 'Ajuste de mercado',
                '2024': 'Recuperación',
                '2025': '★ Récord histórico',
                '2026': '⟶ Objetivo: 120M unidades',
              };
              const nota = notas[item.label] ? `  ${notas[item.label]}` : '';
              return ` ${item.raw}M latas${nota}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color:   '#888888',
            font:    { family: 'Inter', size: isMobile ? 10 : 12 },
            maxTicksLimit: isMobile ? 6 : 12,
          },
          grid: {
            color: 'rgba(255,255,255,0.04)',
          },
        },
        y: {
          ticks: {
            color:     '#888888',
            font:      { family: 'Inter', size: isMobile ? 10 : 12 },
            callback:  (v) => v + 'M',
            maxTicksLimit: 7,
          },
          grid: {
            color: 'rgba(255,255,255,0.05)',
          },
          beginAtZero: true,
        },
      },
    },
  });
}


/* ────────────────────────────────────────────────────────────
   5. CONTADORES KPI (via data-counter, ya manejados por core.js)
   Aquí solo se sobreescriben configuraciones específicas si
   fuera necesario.
   ──────────────────────────────────────────────────────────── */
// Los contadores usan data-counter="VALUE" + data-counter-* en el HTML.
// core.js los inicializa automáticamente vía DOMContentLoaded.


/* ────────────────────────────────────────────────────────────
   6. RESIZE — actualizar Chart.js en responsive
   ──────────────────────────────────────────────────────────── */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Chart.js maneja su propio resize; solo recalcular las barras
    animarBarrasConsumo();
  }, 200);
});
