/* Sartonero — script del sito (nessuna libreria esterna). */

/* ===== CONFIGURAZIONE: unico punto da modificare ===== */
const SARTONERO = {
  // ID del video YouTube (es. 'dQw4w9WgXcQ'). Vuoto = la sezione video resta nascosta.
  videoYouTube: '',
  // Copertina del video (si usa finché non si preme Play).
  copertinaVideo: 'assets/img/schermate/dashboard.webp',
};

document.addEventListener('DOMContentLoaded', () => {
  // anno automatico
  document.querySelectorAll('[data-anno]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // testata che si scurisce allo scorrimento
  const testata = document.querySelector('.testata');
  const aggiorna = () => testata && testata.classList.toggle('scorsa', window.scrollY > 24);
  aggiorna();
  window.addEventListener('scroll', aggiorna, { passive: true });

  // menu da telefono
  const bottoneMenu = document.querySelector('.apri-menu');
  const menu = document.getElementById('menu');
  if (bottoneMenu && menu) {
    const chiudi = () => { menu.classList.remove('aperto'); bottoneMenu.setAttribute('aria-expanded', 'false'); };
    bottoneMenu.addEventListener('click', () => {
      const aperto = menu.classList.toggle('aperto');
      bottoneMenu.setAttribute('aria-expanded', String(aperto));
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', chiudi));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') chiudi(); });
  }

  // metro da sarto: numeri in centimetri (due giri per lo scorrimento continuo)
  document.querySelectorAll('.nastro').forEach((n) => {
    let html = '';
    for (let giro = 0; giro < 2; giro++) for (let cm = 0; cm < 40; cm += 1) html += `<span>${cm * 10}</span>`;
    n.innerHTML = html;
  });

  // comparse allo scorrimento
  const elementi = document.querySelectorAll('.appare');
  if ('IntersectionObserver' in window) {
    const oss = new IntersectionObserver((voci) => {
      voci.forEach((v) => { if (v.isIntersecting) { v.target.classList.add('visto'); oss.unobserve(v.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    elementi.forEach((el) => oss.observe(el));
  } else {
    elementi.forEach((el) => el.classList.add('visto'));
  }

  // luce che segue il puntatore sulle schede
  document.querySelectorAll('.scheda').forEach((s) => {
    s.addEventListener('pointermove', (e) => {
      const r = s.getBoundingClientRect();
      s.style.setProperty('--mx', `${e.clientX - r.left}px`);
      s.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // galleria a schede
  const pulsanti = document.querySelectorAll('.schede-galleria [role=tab]');
  const immagine = document.getElementById('schermata');
  const didascalia = document.getElementById('didascalia');
  pulsanti.forEach((p, i) => {
    p.addEventListener('click', () => mostra(p));
    p.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const prossimo = pulsanti[(i + (e.key === 'ArrowRight' ? 1 : pulsanti.length - 1)) % pulsanti.length];
      prossimo.focus(); mostra(prossimo);
    });
  });
  function mostra(p) {
    if (!immagine) return;
    pulsanti.forEach((x) => { x.setAttribute('aria-selected', String(x === p)); x.tabIndex = x === p ? 0 : -1; });
    immagine.classList.add('cambia');
    setTimeout(() => {
      immagine.src = p.dataset.immagine;
      immagine.alt = p.dataset.alt;
      if (didascalia) didascalia.textContent = p.dataset.testo;
      immagine.onload = () => immagine.classList.remove('cambia');
      if (immagine.complete) immagine.classList.remove('cambia');
    }, 220);
  }

  // video: compare solo se c'è un ID; il lettore YouTube si carica al clic (privacy e velocità)
  const sezioneVideo = document.getElementById('video');
  if (sezioneVideo && SARTONERO.videoYouTube) {
    sezioneVideo.hidden = false;
    const copertina = sezioneVideo.querySelector('.video-copertina');
    copertina.style.backgroundImage = `url(${SARTONERO.copertinaVideo})`;
    copertina.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(SARTONERO.videoYouTube)}?autoplay=1&rel=0`;
      f.title = 'Sartonero in 90 secondi';
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      copertina.replaceWith(f);
    }, { once: true });
  }
});
