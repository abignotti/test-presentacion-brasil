/* ============================================================
   SHARED / CORE.JS — Score Energy Drink Presentation Platform
   Funciones compartidas: contadores, barra de progreso,
   IntersectionObserver, utilidades globales
   ============================================================ */

'use strict';

/* ── Barra de Progreso ────────────────────────────────────── */
(function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  function updateProgress() {
    const scrollTop    = window.scrollY || document.documentElement.scrollTop;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const percent      = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = Math.min(percent, 100) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

/* ── Contadores Animados ──────────────────────────────────── */
/**
 * Anima un elemento numérico del valor inicial al final.
 * @param {HTMLElement} el      - Elemento DOM que muestra el número
 * @param {number}      start   - Valor inicial (default: 0)
 * @param {number}      end     - Valor final
 * @param {number}      duration- Duración en ms (default: 1800)
 * @param {number}      decimals- Decimales a mostrar (default: 0)
 * @param {string}      prefix  - Prefijo opcional (e.g. "Nº")
 */
function animateCounter(el, start = 0, end, duration = 1800, decimals = 0, prefix = '') {
  if (!el) return;
  const startTime  = performance.now();
  const range      = end - start;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutExpo(progress);
    const current  = start + range * eased;

    el.textContent = prefix + current.toFixed(decimals);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = prefix + end.toFixed(decimals);
    }
  }

  requestAnimationFrame(tick);
}

/* ── IntersectionObserver para contadores ─────────────────── */
/**
 * Observa elementos con [data-counter] y los anima cuando
 * entran en el viewport. Soporta atributos:
 *   data-counter="130"     → valor final
 *   data-counter-decimals  → decimales
 *   data-counter-prefix    → prefijo (Nº, $, etc.)
 *   data-counter-duration  → duración ms
 */
function initCounters() {
  const counterEls = document.querySelectorAll('[data-counter]');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el       = entry.target;
          const end      = parseFloat(el.dataset.counter);
          const decimals = parseInt(el.dataset.counterDecimals || '0', 10);
          const prefix   = el.dataset.counterPrefix || '';
          const duration = parseInt(el.dataset.counterDuration || '1800', 10);

          animateCounter(el, 0, end, duration, decimals, prefix);
          observer.unobserve(el); // disparar solo una vez
        }
      });
    },
    { threshold: 0.5 }
  );

  counterEls.forEach((el) => observer.observe(el));
}

/* ── Fade-in con IntersectionObserver ────────────────────────
   Agrega clase "is-visible" a elementos con .js-fade-in
   cuando entran en el viewport                               */
function initFadeIns() {
  const fadeEls = document.querySelectorAll('.js-fade-in');
  if (!fadeEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach((el) => observer.observe(el));
}

/* ── Stagger para grupos de cards ───────────────────────────
   Los hijos directos de .js-stagger reciben delay escalonado */
function initStagger() {
  const groups = document.querySelectorAll('.js-stagger');
  if (!groups.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          Array.from(children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 120}ms`;
            child.classList.add('is-visible');
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  groups.forEach((g) => observer.observe(g));
}

/* ── Detector de mobile para Chart.js ───────────────────────
   Devuelve true si el viewport es <= 768px                  */
function isMobile() {
  return window.innerWidth <= 768;
}

/* ── Inicialización global ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initFadeIns();
  initStagger();
});

/* ── Exportar para uso en main.js ────────────────────────── */
window.ScoreCore = {
  animateCounter,
  isMobile,
};
