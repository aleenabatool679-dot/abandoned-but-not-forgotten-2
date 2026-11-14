/* Progressive enhancement only: navigation, reading progress and decorative motion.
   Catalog data and mission functionality remain owned by their existing scripts. */
(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-navigation');
  const pause = document.querySelector('#motion-toggle');
  const progress = document.querySelector('.reading-progress');
  const percent = document.querySelector('#reading-percent');
  const hero = document.querySelector('.home-hero, .collection-hero');
  const media = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : {matches: false};
  const raf = window.requestAnimationFrame?.bind(window);
  let paused = false;
  try { paused = localStorage.getItem('atl-motion-paused') === 'true'; } catch {}
  let reduced = media.matches;
  let heroVisible = true;
  let scrollQueued = false;
  let focusedBeforeMenu = null;

  function closeMenu(restoreFocus = false) {
    header.classList.remove('menu-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    if (restoreFocus) (focusedBeforeMenu || menu).focus();
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    if (open) focusedBeforeMenu = document.activeElement;
    header.classList.toggle('menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
    if (event.key === 'Tab' && menu.getAttribute('aria-expanded') === 'true') {
      const targets = [...nav.querySelectorAll('a'), menu];
      const first = targets[0], last = targets[targets.length-1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  document.addEventListener('click', event => {
    if (menu.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) closeMenu();
  });

  // Never hide content unless an observer is available to reveal it.
  let observer = null;
  if ('IntersectionObserver' in window) {
    observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {threshold: .05, rootMargin: '0px 0px -25px 0px'});
  }
  function observeContent() {
    if (!observer) return;
    document.querySelectorAll('.section-heading, .hardware-card, .destination, .timeline-item, .detail-list article, .about-section>div, .quote-section blockquote, .story-narrative, .story-figure, .story-passport').forEach((el, index) => {
      if (el.dataset.revealObserved) return;
      el.dataset.revealObserved = 'true';
      if (reduced || paused) return;
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`);
      if (el.getBoundingClientRect().top > window.innerHeight - 15) el.classList.add('reveal-pending');
      observer.observe(el);
    });
  }
  document.addEventListener('archive:rendered', observeContent);
  observeContent();

  function updateScroll() {
    scrollQueued = false;
    const y = window.scrollY || 0;
    const height = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const value = height ? Math.min(100, Math.max(0, Math.round(y / height * 100))) : 0;
    document.documentElement.style.setProperty('--reading-progress', String(value / 100));
    progress.setAttribute('aria-valuenow', String(value));
    percent.textContent = String(value).padStart(2, '0');
    header.classList.toggle('is-scrolled', y > 25);
    if (hero && !reduced && !paused && heroVisible) hero.style.setProperty('--parallax-y', `${Math.min(65, y * .085)}px`);
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued && raf) { scrollQueued = true; raf(updateScroll); }
  }, {passive: true});
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeMenu();
    updateScroll();
    resizeAtmosphere();
  }, {passive: true});

  // One canvas, capped resolution, 24fps and a small particle budget. No DOM particles.
  let canvas = null, context = null, width = 0, height = 0, particles = [];
  let animation = 0, previousTime = 0;
  const planet = document.body.dataset.page;
  const isMars = planet === 'mars';
  const isMoon = planet === 'moon';
  if (hero) {
    canvas = document.createElement('canvas');
    canvas.className = 'atmosphere-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    hero.prepend(canvas);
    if (typeof canvas.getContext === 'function') context = canvas.getContext('2d');
    if ('IntersectionObserver' in window) {
      const heroObserver = new window.IntersectionObserver(entries => {
        heroVisible = entries[0].isIntersecting;
        reconcileAnimation();
      }, {threshold: 0});
      heroObserver.observe(hero);
    }
  }
  function resizeAtmosphere() {
    if (!canvas || !context) return;
    width = hero.clientWidth;
    height = hero.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const amount = window.innerWidth < 640 ? 25 : 64;
    particles = Array.from({length: amount}, (_, index) => ({
      x: Math.random()*width, y: Math.random()*height,
      size: (index%3+1)*.38,
      depth: (index%3+1)/3,
      alpha: .13+Math.random()*.4,
      phase: Math.random()*Math.PI*2
    }));
    drawAtmosphere(0);
  }
  function drawAtmosphere(delta) {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    const dust = isMars || isMoon;
    particles.forEach(particle => {
      if (delta) {
        particle.y -= delta * (dust ? .006 : .0018) * particle.depth;
        particle.x += delta * (isMars ? .006 : .0013) * particle.depth;
        if (particle.y < -3) particle.y = height+3;
        if (particle.x > width+3) particle.x = -3;
      }
      context.beginPath();
      context.fillStyle = isMars ? `rgba(254,181,125,${particle.alpha*.75})` : `rgba(213,232,255,${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI*2);
      context.fill();
    });
  }
  function frame(now) {
    animation = 0;
    if (paused || reduced || !heroVisible || document.hidden || !context) return;
    const delta = now-previousTime;
    if (delta >= 42) { drawAtmosphere(Math.min(delta, 80)); previousTime = now; }
    animation = raf(frame);
  }
  function reconcileAnimation() {
    const shouldRun = context && raf && !paused && !reduced && heroVisible && !document.hidden;
    if (animation && !shouldRun) { window.cancelAnimationFrame(animation); animation = 0; }
    if (!animation && shouldRun) { previousTime = 0; animation = raf(frame); }
  }
  function updateMotion() {
    const stopped = paused || reduced;
    document.documentElement.classList.toggle('motion-paused', stopped);
    pause.setAttribute('aria-pressed', String(stopped));
    pause.querySelector('.motion-label').textContent = reduced ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion';
    pause.querySelector('.motion-symbol').textContent = stopped ? '▷' : 'Ⅱ';
    pause.title = reduced ? 'Your system requests reduced motion' : paused ? 'Resume decorative motion' : 'Pause decorative motion';
    pause.disabled = reduced;
    if (stopped) {
      document.querySelectorAll('.reveal-pending').forEach(el => { el.classList.remove('reveal-pending'); el.classList.add('is-visible'); });
      hero?.style.setProperty('--parallax-y', '0px');
    }
    reconcileAnimation();
  }
  pause.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('atl-motion-paused', String(paused)); } catch {}
    updateMotion();
  });
  media.addEventListener?.('change', event => { reduced = event.matches; updateMotion(); });
  document.addEventListener('visibilitychange', reconcileAnimation);
  resizeAtmosphere();
  updateScroll();
  updateMotion();
})();
