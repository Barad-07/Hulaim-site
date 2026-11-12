/* ==========================================================================
   extras.js — إضافات صفحة المشروع
   1. صورة المشروع على الجوال تظهر كاملة بدل أن تُقص من المنتصف
   2. الضغط على أي صورة في صفحة المشروع يفتحها بحجمها الكامل
      (السهمان على جانبي الصورة، أو الضغط على الصورة، أو أسهم لوحة المفاتيح، أو السحب على الجوال
       للتنقل بين الصور — Close أو Esc للإغلاق)
   3. زر «زيارة الموقع» إذا أضفت للمشروع في projects.js السطر:
        link:'https://example.com'

   يُضاف في index.html قبل </body> مباشرة:
     <script src="extras.js"></script>
   ========================================================================== */
(function () {
  'use strict';

  // ===================== الإعدادات (عدّل هنا) =====================
  const TEXT = {
    visit: 'Visit the live site',  // نص زر زيارة الموقع
    close: 'Close',
    prev: 'Previous image',
    next: 'Next image'
  };
  // ================================================================

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- styles ---------- */
  const css = `
  /* 1. mobile: show the project picture whole, no tall centre crop */
  @media (max-width: 899px) {
    .case__hero { margin: 0 var(--pad) !important; height: auto !important; aspect-ratio: 16 / 10; }
    .case__hero .art { height: 100% !important; transform: none !important; }
  }
  /* pictures can be clicked */
  .case__strip > div { pointer-events: auto !important; }
  .case__strip img { pointer-events: none; -webkit-user-drag: none; }

  /* 3. visit link */
  .case__link {
    display: inline-flex; align-items: center; gap: .6rem; justify-self: start; margin-top: 1.4rem;
    padding: .7rem 1.2rem; border: 1px solid var(--ink); border-radius: 2rem; font: 500 .8rem/1 var(--mono);
    transition: background .3s, color .3s;
  }
  .case__link:hover, .case__link:focus-visible { background: var(--ink); color: var(--sand); }
  .case__link svg { width: .9em; height: .9em; transition: transform .3s; }
  .case__link:hover svg { transform: translate(2px, -2px); }

  /* 2. full-size viewer */
  .lb { position: fixed; inset: 0; z-index: 350; display: grid; grid-template-rows: auto minmax(0, 1fr); background: rgba(24, 34, 28, .985); color: var(--sand);
        opacity: 0; transition: opacity .3s; touch-action: pan-y; overscroll-behavior: contain; }
  .lb.is-open { opacity: 1; }
  .lb[hidden] { display: none !important; }
  .lb__bar { display: flex; justify-content: space-between; align-items: center; padding: 1.1rem var(--pad); font: 400 .8rem var(--mono); }
  .lb__stage { position: relative; min-height: 0; overflow: hidden; }
  .lb__img { position: absolute; inset: 0 0 var(--pad); margin: auto; max-width: calc(100% - 2 * var(--pad) - 7rem); max-height: calc(100% - var(--pad));
             object-fit: contain; display: block; cursor: pointer; user-select: none; -webkit-user-drag: none;
             transition: opacity .25s, transform .35s cubic-bezier(.2,.8,.2,1); }
  .lb__img.is-swap { opacity: 0; transform: scale(.98); }
  .lb button { color: var(--sand); font: 400 .8rem var(--mono); padding: .6rem 1rem; border: 1px solid rgba(210,200,178,.4); border-radius: 2rem; cursor: pointer; }
  .lb button:hover, .lb button:focus-visible { border-color: var(--sand); }
  /* arrows sit on both sides of the picture, always on screen */
  .lb .lb__arrow { position: absolute; top: 50%; z-index: 2; width: 3.2rem; height: 3.2rem; padding: 0; margin-top: -1.6rem; display: grid; place-items: center;
                   font-size: 1.1rem; background: rgba(24, 34, 28, .6); }
  .lb .lb__prev { left: var(--pad); }
  .lb .lb__next { right: var(--pad); }
  .lb .lb__arrow[hidden] { display: none !important; }
  @media (max-width: 699px) {
    .lb__img { max-width: 100%; }
    .lb .lb__arrow { top: auto; bottom: calc(var(--pad) + .5rem); margin: 0; width: 2.8rem; height: 2.8rem; }
  }
  @media (prefers-reduced-motion: reduce) { .lb, .lb__img { transition: none; } }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- which project is open ---------- */
  function currentProject() {
    if (typeof works === 'undefined') return null;
    const m = ($('.case__idx') || {}).textContent?.match(/(\d+)/);
    if (m && works[+m[1] - 1]) return works[+m[1] - 1];
    const title = ($('#case-title') || {}).textContent?.trim();
    return works.find((w) => w.t === title) || null;
  }

  /* ---------- 3. visit link ---------- */
  function updateLink(w) {
    const body = $('.case__body');
    if (!body) return;
    let a = $('.case__link', body);
    if (!w || !w.link) { if (a) a.remove(); return; }
    if (!a) {
      a = document.createElement('a');
      a.className = 'case__link';
      a.target = '_blank';
      a.rel = 'noopener';
      a.dataset.cursor = 'link';
      const host = $('.case__text', body) || body;
      host.insertAdjacentElement('afterend', a);
    }
    a.href = w.link;
    a.innerHTML = `<span>${TEXT.visit}</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9L9 3M4 3h5v5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`;
  }

  /* ---------- 2. full-size viewer ---------- */
  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.hidden = true;
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image viewer');
  lb.dataset.lenisPrevent = '';
  lb.dataset.ink = '';
  lb.innerHTML = `
    <div class="lb__bar"><span class="lb__count"></span><button type="button" class="lb__close">${TEXT.close}</button></div>
    <div class="lb__stage">
      <button type="button" class="lb__arrow lb__prev" aria-label="${TEXT.prev}">←</button>
      <img class="lb__img" alt="">
      <button type="button" class="lb__arrow lb__next" aria-label="${TEXT.next}">→</button>
    </div>`;
  document.body.appendChild(lb);
  const lbImg = $('.lb__img', lb);
  let pics = [], at = 0, lastFocus = null;

  function show(i) {
    at = (i + pics.length) % pics.length;
    lbImg.classList.add('is-swap');
    const next = new Image();
    next.onload = next.onerror = () => {
      lbImg.src = pics[at].src;
      lbImg.alt = pics[at].alt || '';
      requestAnimationFrame(() => lbImg.classList.remove('is-swap'));
    };
    next.src = pics[at].src;
    $('.lb__count', lb).textContent = `${String(at + 1).padStart(2, '0')} / ${String(pics.length).padStart(2, '0')}`;
    $$('.lb__arrow', lb).forEach((b) => { b.hidden = pics.length < 2; });
  }
  function open(list, i) {
    if (!list.length) return;
    pics = list;
    lastFocus = document.activeElement;
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('is-open'));
    show(i);
    $('.lb__close', lb).focus();
  }
  function close() {
    lb.classList.remove('is-open');
    setTimeout(() => { lb.hidden = true; lbImg.removeAttribute('src'); }, 300);
    if (lastFocus) lastFocus.focus();
  }
  $('.lb__close', lb).addEventListener('click', close);
  $('.lb__prev', lb).addEventListener('click', () => show(at - 1));
  $('.lb__next', lb).addEventListener('click', () => show(at + 1));
  lbImg.addEventListener('click', () => { if (pics.length > 1) show(at + 1); });
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lb__stage')) close(); });
  // keys: handled here first so Esc closes the picture, not the whole project
  window.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); close(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); }
  }, true);
  // swipe on phones
  let sx = null;
  lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50 && pics.length > 1) show(at + (dx < 0 ? 1 : -1));
    sx = null;
  });

  // all pictures of the open project, in order: main picture, then the gallery
  function projectPictures() {
    return [...$$('.case__hero img'), ...$$('.case__strip img')].map((img) => ({ src: img.currentSrc || img.src, alt: img.alt }));
  }
  // main picture
  document.addEventListener('click', (e) => {
    const hero = e.target.closest('.case__hero');
    if (hero && $('img', hero)) open(projectPictures(), 0);
  });
  // gallery: tell a tap from a drag (the strip can be dragged sideways)
  let down = null;
  document.addEventListener('pointerdown', (e) => { if (e.target.closest('.case__strip')) down = { x: e.clientX, y: e.clientY }; }, true);
  document.addEventListener('pointerup', (e) => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    down = null;
    if (moved > 6) return;
    const tiles = $$('.case__strip > div');
    const tile = document.elementsFromPoint(e.clientX, e.clientY).find((el) => tiles.includes(el));
    if (!tile || !$('img', tile)) return;
    const heroCount = $$('.case__hero img').length;
    open(projectPictures(), heroCount + tiles.indexOf(tile));
  }, true);

  /* ---------- refresh whenever a project is opened or "Next project" is pressed ---------- */
  function onProject() {
    updateLink(currentProject());
  }
  const title = $('#case-title');
  if (title) new MutationObserver(onProject).observe(title, { childList: true, characterData: true, subtree: true });
})();