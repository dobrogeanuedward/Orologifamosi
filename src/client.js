/** Lato browser: idratazione delle tavole, provenienza della visita, invio delle schede a Dogo Desk. */
import { h, hydrate } from 'preact';

const SRC_KEY = 'of-src';
const RID_KEY = 'of-rid';
const safe = (fn, fallback) => { try { return fn(); } catch { return fallback; } };

/** Prima pagina di ingresso della visita (first touch), con UTM e sito di provenienza. */
function rememberSource(cfg) {
  if (safe(() => sessionStorage.getItem(SRC_KEY))) return;
  const q = new URLSearchParams(location.search);
  const utm = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']) { const v = q.get(k); if (v) utm[k] = v.slice(0, 120); }
  let referrer = null;
  safe(() => { const r = document.referrer && new URL(document.referrer); if (r && r.host !== location.host) referrer = r.host; });
  const src = { page: cfg.route, pageName: cfg.pageName, utm: Object.keys(utm).length ? utm : null, referrer };
  safe(() => sessionStorage.setItem(SRC_KEY, JSON.stringify(src)));
}

/**
 * Statistiche anonime per Dogo Desk: visite, ingressi, clic su WhatsApp/telefono/email/catalogo e modulo.
 * Nessun cookie e nessun identificativo: solo pagina, evento, provenienza della visita e tipo di schermo.
 */
let trackCfg = null;
function track(event) {
  adsEvent(event);
  const cfg = trackCfg;
  if (!cfg || !cfg.desk) return;
  safe(() => {
    const src = safe(() => JSON.parse(sessionStorage.getItem(SRC_KEY) || 'null'), null) || {};
    const utm = src.utm || {};
    const body = { p: location.pathname.slice(0, 200), e: event, d: matchMedia('(max-width: 760px)').matches ? 'mobile' : 'desktop' };
    if (utm.utm_source) body.s = utm.utm_source;
    if (utm.utm_medium) body.m = utm.utm_medium;
    if (utm.utm_campaign) body.c = utm.utm_campaign;
    if (utm.gclid) body.g = 1;
    if (utm.fbclid) body.f = 1;
    if (src.referrer) body.r = src.referrer;
    const url = `${cfg.desk}/api/site/${cfg.org}/track`;
    const blob = new Blob([JSON.stringify(body)], { type: 'text/plain' });
    if (!(navigator.sendBeacon && navigator.sendBeacon(url, blob))) fetch(url, { method: 'POST', body: blob, keepalive: true, mode: 'no-cors' }).catch(() => {});
  });
}

function setupTracking(cfg) {
  trackCfg = cfg;
  window.__ofTrack = track;
  // ingresso: la visita arriva da fuori (o senza provenienza), non da un'altra pagina del sito
  const fromOutside = safe(() => !document.referrer || new URL(document.referrer).host !== location.host, true);
  if (fromOutside) {
    // la provenienza va ricordata anche se si entra dalla pagina del modulo
    if (!cfg.landing) rememberSource(cfg);
    track('ingresso');
  }
  track('visita');
  document.addEventListener('click', (e) => {
    const a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//.test(href)) track('whatsapp');
    else if (href.startsWith('tel:')) track('telefono');
    else if (href.startsWith('mailto:')) track('email');
    else if (/venditaorologiusati\.it/.test(href)) track('catalogo');
  }, { capture: true, passive: true });
  if (cfg.page === 'richiesta') {
    let started = false;
    const start = () => { if (!started) { started = true; track('modulo_inizio'); } };
    document.addEventListener('input', start, { capture: true, passive: true });
    document.addEventListener('change', start, { capture: true, passive: true });
  }
}

const KIT = { box: 'Scatola', papers: 'Garanzia', service: 'Revisioni', links: 'Maglie extra', none: 'Solo l’orologio' };
const CH = { WhatsApp: 'whatsapp', Telefonata: 'telefono', Email: 'email', 'Visita a Medicina': 'visita-medicina', 'Visita a Medicina (BO)': 'visita-medicina', 'Visita a Bologna': 'visita-bologna' };
const TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic', heif: 'image/heif' };
const typeOf = (f) => (Object.values(TYPES).includes(f.type) ? f.type : TYPES[(f.name.split('.').pop() || '').toLowerCase()] || null);

async function readError(res, fallback) {
  const data = await res.json().catch(() => ({}));
  if (res.status === 429) return 'Troppi invii ravvicinati: riprova tra qualche minuto.';
  if (res.status === 422 && data.fields?.length) return `${data.error}: ${data.fields.map((f) => f.message).join(', ')}.`;
  return data.error || fallback;
}

/**
 * Ridisegna la foto prima di caricarla: così spariscono i dati nascosti nel file (posizione GPS,
 * modello del telefono, data e ora) e i file enormi si alleggeriscono. L'immagine resta dritta.
 * Se il browser non sa leggere il formato (alcuni HEIC), la foto parte com'è.
 */
async function cleanPhoto(file) {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const max = 2600, k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    if (bmp.close) bmp.close();
    const blob = await new Promise((res) => c.toBlob(res, 'image/jpeg', 0.9));
    if (!blob) return file;
    return new File([blob], 'foto.jpg', { type: 'image/jpeg' });
  } catch { return file; }
}

/** Verifica antispam (Cloudflare Turnstile), solo se il sito ha una chiave: restituisce il gettone o ''. */
let turnstileReady = null;
/** Scarica in anticipo lo script della verifica antispam, così all'invio non si aspetta. */
function loadTurnstile() {
  turnstileReady = turnstileReady || new Promise((res, rej) => {
    const sc = document.createElement('script');
    sc.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    sc.async = true; sc.onload = res; sc.onerror = () => { turnstileReady = null; rej(new Error('Verifica antispam non disponibile.')); };
    document.head.appendChild(sc);
  });
  return turnstileReady;
}
function turnstileToken(siteKey) {
  if (!siteKey) return Promise.resolve('');
  loadTurnstile();
  return turnstileReady.then(() => new Promise((res, rej) => {
    // Di solito la verifica è invisibile. Se Cloudflare chiede un gesto (una spunta), la casella
    // compare al centro con una riga di spiegazione: non deve restare nascosta in un angolo.
    const veil = document.createElement('div');
    veil.setAttribute('role', 'dialog');
    veil.setAttribute('aria-label', 'Verifica di sicurezza');
    veil.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:none;place-items:center;background:rgba(20,19,16,.55);padding:20px';
    const card = document.createElement('div');
    card.style.cssText = 'background:#fbf8f2;color:#141310;border-radius:16px;padding:24px;max-width:360px;width:100%;box-shadow:0 24px 60px -20px rgba(0,0,0,.5);font:400 16px/1.45 "General Sans",system-ui,sans-serif;display:grid;gap:14px;justify-items:center;text-align:center';
    const msg = document.createElement('p');
    msg.style.margin = '0';
    msg.textContent = 'Un’ultima verifica prima di inviare: spunta la casella qui sotto.';
    const box = document.createElement('div');
    card.appendChild(msg); card.appendChild(box); veil.appendChild(card);
    document.body.appendChild(veil);
    let over = false;
    const done = (fn, v) => { if (over) return; over = true; clearTimeout(timer); veil.remove(); fn(v); };
    const timer = setTimeout(() => done(rej, new Error('La verifica di sicurezza non è stata completata.')), 120000);
    window.turnstile.render(box, {
      sitekey: siteKey, appearance: 'interaction-only', language: 'it',
      callback: (t) => done(res, t),
      'before-interactive-callback': () => { veil.style.display = 'grid'; },
      'error-callback': () => done(rej, new Error('Verifica di sicurezza non riuscita.')),
    });
  }));
}

/**
 * Foto caricate in anticipo, mentre la persona compila: all'invio sono già sul server.
 * Ogni gruppo aggiunto parte subito (pulizia dei dati nascosti, URL firmati, caricamento).
 */
const pre = { rid: null, next: 0, keys: new Map() };   // File originale → Promise<chiave | null>
function requestId() {
  let rid = safe(() => localStorage.getItem(RID_KEY));
  if (!rid) { rid = crypto.randomUUID(); safe(() => localStorage.setItem(RID_KEY, rid)); }
  if (pre.rid !== rid) { pre.rid = rid; pre.next = 0; pre.keys = new Map(); }
  return rid;
}
function uploadBatch(cfg, originals) {
  if (!originals.length) return;
  const rid = requestId(), start = pre.next, base = `${cfg.desk}/api/intake/${cfg.org}`;
  pre.next += originals.length;
  const job = (async () => {
    const files = await Promise.all(originals.map(cleanPhoto));
    const res = await fetch(`${base}/upload`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ requestId: rid, start, files: files.map((f) => ({ type: typeOf(f), size: f.size })) }) }).catch(() => null);
    if (res && res.status === 501) return null;   // caricamento non attivo: la scheda parte con una nota
    if (!res || !res.ok) throw new Error(res ? await readError(res, 'Le foto non sono state caricate.') : 'Connessione assente: le foto non sono partite.');
    const { uploads } = await res.json();
    await Promise.all(uploads.map((u, i) => fetch(u.url, { method: 'PUT', headers: { 'content-type': typeOf(files[i]) }, body: files[i] }).then((r) => { if (!r.ok) throw new Error('Una foto non è stata caricata.'); })));
    return uploads.map((u) => u.key);
  })();
  originals.forEach((f, i) => { const one = job.then((keys) => (keys ? keys[i] : null)); one.catch(() => {}); pre.keys.set(f, one); });
}

/** Invia la scheda: le foto (già caricate in anticipo, o caricate adesso), poi i dati. Restituisce { code }. */
function makeSubmit(cfg) {
  return async function submit(s) {
    const base = `${cfg.desk}/api/intake/${cfg.org}`;
    const rid = requestId();

    // 1. Foto: libere, nell'ordine in cui la persona le ha caricate. Quelle non ancora partite partono ora; quelle fallite si riprovano una volta.
    const originals = (s.photos || []).map((p) => p.file).filter((f) => f && typeOf(f));
    uploadBatch(cfg, originals.filter((f) => !pre.keys.has(f)));
    const first = await Promise.allSettled(originals.map((f) => pre.keys.get(f)));
    const failed = originals.filter((_, i) => first[i].status === 'rejected');
    if (failed.length) {
      failed.forEach((f) => pre.keys.delete(f));
      uploadBatch(cfg, failed);
      try { await Promise.all(failed.map((f) => pre.keys.get(f))); }
      catch (e) { failed.forEach((f) => pre.keys.delete(f)); throw e; }
    }
    const keys = await Promise.all(originals.map((f) => pre.keys.get(f)));
    const photoKeys = keys.filter(Boolean);
    const note = keys.some((k) => k === null) ? `
[${originals.length} foto scelte: il caricamento non è ancora attivo, vanno chieste alla persona]` : '';

    // 2. Scheda, con i campi del modulo (contratto in dogo-desk/BETA.md).
    const src = safe(() => JSON.parse(sessionStorage.getItem(SRC_KEY) || 'null'), null) || { page: cfg.route, pageName: cfg.pageName, utm: null, referrer: null };
    const brand = s.brand === '__other' ? (s.other || '').trim() : s.brand || '';
    const model = (s.modelOther || '').trim() || s.model || '';
    // email: parte solo se è scritta bene; se non serve al canale scelto, una sbagliata non blocca la scheda
    const emailRaw = (s.email || '').trim();
    const emailOut = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailRaw) && emailRaw.length <= 160 ? emailRaw : (s.ch && s.ch.Email ? emailRaw : '');
    const payload = {
      requestId: rid,
      entry: s.entry || 'Scheda guidata',
      brand: brand.slice(0, 60), model: model.slice(0, 80), ref: (s.refNo || '').trim().slice(0, 40), year: /^(19|20)\d\d$/.test((s.year || '').trim()) && +s.year <= new Date().getFullYear() ? s.year.trim() : '',
      cond: s.cond || '',
      kit: Object.keys(s.kit || {}).filter((k) => s.kit[k]).map((k) => KIT[k]).filter(Boolean),
      flags: Object.keys(s.flags || {}).filter((k) => s.flags[k]),
      extra: ((s.notes || '').trim() + note).slice(0, 2000),
      photoKeys,
      person: { name: (s.name || '').trim().slice(0, 120), phone: (s.phone || '').trim().slice(0, 30), email: emailOut, city: '' },
      channels: Object.keys(s.ch || {}).filter((k) => s.ch[k]).map((k) => CH[k]).filter(Boolean),
      days: Object.keys(s.days || {}).filter((k) => s.days[k]),
      times: Object.keys(s.times || {}).filter((k) => s.times[k]),
      intent: s.intent || '',
      price: (s.price || '').trim().slice(0, 40),
      alsoBuy: !!s.alsoBuy,
      consent: !!s.consent,
      source: { page: src.page || cfg.route, pageName: src.pageName || cfg.pageName, query: null, utm: src.utm || null, referrer: src.referrer || null },
      website: '',
    };
    const token = await turnstileToken(cfg.turnstile);
    if (token) payload.turnstileToken = token;
    const res = await fetch(base, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => null);
    if (!res) throw new Error('Connessione assente: la scheda non è partita.');
    if (!res.ok) throw new Error(await readError(res, 'La scheda non è partita.'));
    const data = await res.json();
    safe(() => localStorage.removeItem(RID_KEY));
    track('modulo_invio');
    return data;
  };
}

/**
 * Video con una sorgente per telefono (source media) e una per desktop: se il browser ha scelto
 * quella sbagliata (finestra misurata male al primo caricamento, anteprime in iframe), lo ricarica.
 */
function checkVideoSources() {
  for (const v of document.querySelectorAll('video')) {
    const sources = [...v.querySelectorAll('source')];
    if (!sources.some((s) => s.media)) continue;
    const want = sources.find((s) => !s.media || safe(() => matchMedia(s.media).matches, false));
    if (want && v.currentSrc && v.currentSrc !== want.src) {
      v.load();
      if (v.autoplay) v.play().catch(() => {});
    }
  }
}

/**
 * Finale del piè di pagina, versione leggera: lo scroll muove pochi valori scritti direttamente
 * (trasformazione del marchio, opacità di tre blocchi, --lp/--ig sul solo contenitore del marchio).
 * Il riflesso oro-azzurro segue il puntatore (desktop) o lo scroll (telefono), smorzato.
 */
function setupFinale() {
  // «Il bulino»: il nome si incide davanti a chi guarda, una volta, quando è visibile per metà.
  // Niente spostamenti né ingrandimenti: il finale resta al suo posto e non copre nulla.
  const bu = document.querySelector('.foot-mark .bu');
  if (!bu) return;
  const lines = [...bu.querySelectorAll('.bu-l')];
  const fill = bu.querySelector('.bu-fill');
  const spark = bu.querySelector('.bu-spark');
  const sweep = bu.querySelector('#bu-sweep');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const io3 = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const out3 = (t) => 1 - Math.pow(1 - t, 3);
  const setSweep = (x) => sweep && sweep.setAttribute('gradientTransform', `translate(${x.toFixed(1)} 0)`);
  const finish = () => {
    lines.forEach((l) => { l.style.strokeDashoffset = '0'; });
    fill.style.opacity = '1';
    spark.style.opacity = '0';
    bu.classList.add('is-done');
    setSweep(-600);
    follow();
  };

  // dopo l'incisione il riflesso segue il puntatore (computer) o lo scroll (telefono), solo quando serve
  let rx = 0, tx = 0, loop = 0;
  const tick = () => {
    loop = 0;
    rx += (tx - rx) * 0.1;
    setSweep(rx * 1500 - 300);
    if (Math.abs(tx - rx) > 0.001) loop = requestAnimationFrame(tick);
  };
  const nudge = () => { if (!loop) loop = requestAnimationFrame(tick); };
  function follow() {
    if (still) return;
    rx = tx = 0.5;
    if (fine) {
      bu.addEventListener('pointermove', (e) => { const r = bu.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; nudge(); }, { passive: true });
      bu.addEventListener('pointerleave', () => { tx = -0.3; nudge(); }, { passive: true });
      tx = -0.3; nudge();
    } else {
      addEventListener('scroll', () => {
        const r = bu.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        tx = 1.15 - (r.top + r.height / 2) / innerHeight; nudge();
      }, { passive: true });
    }
  }

  if (still || !('IntersectionObserver' in window)) { finish(); return; }

  const lens = lines.map((l) => l.getTotalLength());
  const total = lens.reduce((a, b) => a + b, 0) || 1;
  const cum = []; lens.reduce((a, b, i) => (cum[i] = a) + b, 0);
  const T_CUT = 2700, F0 = 2250, TF = 1150;
  let t0 = 0;
  const frame = (now) => {
    if (!t0) t0 = now;
    const t = now - t0;
    const c = io3(clamp(t / T_CUT)) * total;
    let tip = -1, tipLen = 0;
    for (let i = 0; i < lines.length; i++) {
      const k = clamp((c - cum[i]) / lens[i]);
      const v = (1 - k).toFixed(4);
      if (lines[i].__v !== v) { lines[i].__v = v; lines[i].style.strokeDashoffset = v; }
      if (k > 0 && k < 1) { tip = i; tipLen = k * lens[i]; }
    }
    if (tip >= 0) {
      const pt = lines[tip].getPointAtLength(tipLen);
      spark.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
    }
    spark.style.opacity = (t < T_CUT ? clamp(t / 180) : clamp(1 - (t - T_CUT) / 380)).toFixed(3);
    const f = clamp((t - F0) / TF);
    fill.style.opacity = out3(f).toFixed(3);
    setSweep(-400 + io3(f) * 1800);
    if (t < Math.max(T_CUT + 400, F0 + TF)) requestAnimationFrame(frame);
    else finish();
  };
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) { io.disconnect(); requestAnimationFrame(frame); }
  }, { threshold: 0.55 });
  io.observe(bu);
}

// «Salvatore» nel titolo della home: il bulino incide il nome e lo incastona in ossidiana.
// Il testo vero resta nella pagina (per chi legge e per Google); il disegno è solo decorazione.
const SV_GLYPHS = {"upm":1000,"g":{"S":["M235 10Q196 10 159 -2Q122 -14 119 -14Q96 -14 84 28H62L46 -224L68 -230Q117 -25 242 -25Q297 -25 332 -59Q367 -93 367 -146Q367 -195 334.5 -234.5Q302 -274 256 -303.5Q210 -333 164 -364Q118 -395 85.5 -442Q53 -489 53 -549Q53 -635 109.5 -692.5Q166 -750 248 -750Q276 -750 305 -742Q334 -734 338 -734Q361 -734 368 -770L390 -772L412 -537L390 -531Q338 -715 235 -715Q193 -715 164 -680Q135 -645 135 -595Q135 -554 158 -520Q181 -486 215.5 -463.5Q250 -441 290.5 -413Q331 -385 365.5 -358Q400 -331 423 -287.5Q446 -244 446 -190Q446 -101 387 -45.5Q328 10 235 10Z"],"a":["M449 0H282V-58Q194 10 130 10Q77 10 50.5 -24Q24 -58 24 -102Q24 -147 56.5 -174.5Q89 -202 171 -229L282 -266V-374Q282 -452 263.5 -487Q245 -522 204 -522Q176 -522 162.5 -508Q149 -494 146 -474Q143 -454 140.5 -433.5Q138 -413 126.5 -399Q115 -385 90 -385Q64 -385 51.5 -398Q39 -411 39 -429Q39 -473 104.5 -511.5Q170 -550 241 -550Q374 -550 374 -401V-132Q374 -54 384.5 -39Q395 -24 449 -19Z","M178 -43Q212 -43 244.5 -65.5Q277 -88 282 -132V-231L207 -207Q158 -191 138 -168Q118 -145 118 -113Q118 -84 133 -63.5Q148 -43 178 -43Z"],"l":["M264 -19V0H4V-19Q28 -21 38.5 -22Q49 -23 61 -28Q73 -33 76.5 -38Q80 -43 84 -58Q88 -73 88 -87.5Q88 -102 88 -132V-647Q88 -693 69 -706Q50 -719 -6 -719V-738Q50 -738 89.5 -754.5Q129 -771 172 -808L180 -803V-132Q180 -91 182 -71Q184 -51 196 -39Q208 -27 220 -24.5Q232 -22 264 -19Z"],"v":["M432 -433 274 15H250L80 -440Q62 -488 49.5 -499Q37 -510 6 -511V-530Q76 -526 117 -526Q157 -526 235 -530V-511Q198 -510 185 -505.5Q172 -501 172 -485Q172 -473 187 -426L290 -115L379 -388Q402 -457 402 -480Q402 -499 388.5 -504.5Q375 -510 338 -511V-530Q398 -526 425 -526Q457 -526 505 -530V-511Q472 -510 461.5 -498.5Q451 -487 432 -433Z"],"t":["M296 -67 307 -49Q257 10 187 10Q138 10 108 -19Q78 -48 78 -99V-499L17 -509V-530Q73 -530 109 -562.5Q145 -595 151 -650H170V-544L292 -530V-509L170 -497V-113Q170 -34 225 -34Q263 -34 296 -67Z"],"o":["M273 -550Q378 -550 435.5 -479.5Q493 -409 493 -284Q493 -151 429 -70.5Q365 10 260 10Q153 10 96.5 -60Q40 -130 40 -255Q40 -389 103.5 -469.5Q167 -550 273 -550Z","M277 -16Q328 -16 359.5 -70.5Q391 -125 391 -235Q391 -313 377.5 -376Q364 -439 332 -481.5Q300 -524 253 -524Q145 -524 145 -307Q145 -182 178 -99Q211 -16 277 -16Z"],"r":["M300 -19V0H19V-19Q43 -21 53.5 -22Q64 -23 76 -28Q88 -33 91.5 -38Q95 -43 99 -58Q103 -73 103 -87.5Q103 -102 103 -132V-389Q103 -435 84 -448Q65 -461 9 -461V-480Q66 -480 104.5 -496.5Q143 -513 177 -550L195 -545V-459Q264 -550 333 -550Q366 -550 387 -535Q408 -520 408 -495Q408 -474 394.5 -458Q381 -442 359 -442Q337 -442 318.5 -468Q300 -494 282 -494Q246 -494 220.5 -443Q195 -392 195 -298V-132Q195 -54 209 -39Q223 -24 300 -19Z"],"e":["M245 10Q158 10 99 -60Q40 -130 40 -257Q40 -384 99 -467Q158 -550 257 -550Q328 -550 378.5 -501.5Q429 -453 429 -344L138 -314Q139 -203 179.5 -125Q220 -47 289 -47Q359 -47 431 -122L443 -106Q347 10 245 10Z","M244 -521Q200 -521 173 -477.5Q146 -434 140 -361H334Q327 -521 244 -521Z"]}};
function setupObsidian() {
  const sv = document.querySelector('#hero-title .sv');
  if (!sv || sv.dataset.sv) return;
  sv.dataset.sv = '1';
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const io3 = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const out3 = (t) => 1 - Math.pow(1 - t, 3);
  const U = SV_GLYPHS.upm, A = 1150, D = 420, P = 160;

  const build = () => {
    const text = sv.firstChild;
    if (!text || text.nodeType !== 3) return null;
    const k = parseFloat(getComputedStyle(sv).fontSize) / U;
    const r0 = sv.getBoundingClientRect();
    if (!r0.width) return null;
    const probe = document.createElement('i');
    probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    sv.appendChild(probe);
    const base = (probe.getBoundingClientRect().top - r0.top) / k;
    probe.remove();
    const rg = document.createRange();
    const placed = [];
    for (let i = 0; i < text.data.length; i++) {
      const subs = SV_GLYPHS.g[text.data[i]];
      if (!subs) continue;
      rg.setStart(text, i); rg.setEnd(text, i + 1);
      placed.push({ x: (rg.getBoundingClientRect().left - r0.left) / k, subs });
    }
    const W = r0.width / k, VW = (W + 2 * P).toFixed(1);
    const at = (x) => `transform="translate(${x.toFixed(1)} 0)"`;
    const whole = placed.map((p) => `<path ${at(p.x)} d="${p.subs.join('')}"/>`).join('');
    const cuts = placed.map((p) => p.subs.map((d) => `<path class="sv-l" pathLength="1" ${at(p.x)} d="${d}"/>`).join('')).join('');
    const svg = `<svg class="sv-svg" aria-hidden="true" viewBox="${-P} ${-A} ${VW} ${A + D}" style="left:${(-P / U).toFixed(4)}em;top:${((base - A) / U).toFixed(4)}em;width:${(VW / U).toFixed(4)}em;height:${((A + D) / U).toFixed(4)}em">
<defs>
<clipPath id="sv-c">${whole}</clipPath>
<linearGradient id="sv-ob" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#343a4a"/><stop offset=".3" stop-color="#11141c"/><stop offset=".56" stop-color="#030305"/><stop offset=".82" stop-color="#090b11"/><stop offset="1" stop-color="#20263a"/></linearGradient>
<linearGradient id="sv-gl" x1="0" y1="0" x2="0" y2="1"><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".355" stop-color="#fff" stop-opacity=".52"/><stop offset=".38" stop-color="#fff" stop-opacity=".06"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="sv-ir" gradientUnits="userSpaceOnUse" x1="-520" y1="0" x2="0" y2="-260" gradientTransform="translate(-900 0)"><stop offset=".15" stop-color="#6d55ff" stop-opacity="0"/><stop offset=".33" stop-color="#7a5cff" stop-opacity=".55"/><stop offset=".5" stop-color="#ffd38a" stop-opacity=".78"/><stop offset=".67" stop-color="#4fdccc" stop-opacity=".5"/><stop offset=".85" stop-color="#4fdccc" stop-opacity="0"/></linearGradient>
<radialGradient id="sv-sp"><stop offset="0" stop-color="#fff"/><stop offset=".22" stop-color="#fff4da" stop-opacity=".95"/><stop offset=".5" stop-color="#ffc861" stop-opacity=".38"/><stop offset="1" stop-color="#ffc861" stop-opacity="0"/></radialGradient>
</defs>
<g class="sv-fill" clip-path="url(#sv-c)" opacity="0">
<rect x="${-P}" y="-760" width="${VW}" height="1010" fill="url(#sv-ob)"/>
<rect x="${-P}" y="-760" width="${VW}" height="1010" fill="url(#sv-gl)"/>
<rect class="sv-irr" x="${-P}" y="${-A}" width="${VW}" height="${A + D}" fill="url(#sv-ir)"/>
<g fill="none" stroke="#fff" stroke-opacity=".72" stroke-width="22" transform="translate(-10 -14)">${whole}</g>
<g fill="none" stroke="#000" stroke-opacity=".7" stroke-width="18" transform="translate(9 13)">${whole}</g>
</g>
<g class="sv-cut" fill="none" stroke="#eef2fa" stroke-linejoin="round" stroke-dasharray="1" stroke-dashoffset="1">${cuts}</g>
<g class="sv-spark" opacity="0" transform="translate(-999 -999)"><ellipse rx="340" ry="9" fill="url(#sv-sp)"/><ellipse rx="9" ry="120" fill="url(#sv-sp)" opacity=".7"/><circle r="120" fill="url(#sv-sp)"/><circle r="14" fill="#fff"/></g>
</svg>`;
    sv.insertAdjacentHTML('beforeend', svg);
    const el = sv.lastElementChild;
    const cut = el.querySelector('.sv-cut');
    const setW = () => cut.setAttribute('stroke-width', ((innerWidth < 700 ? 1.4 : 2.3) * U / parseFloat(getComputedStyle(sv).fontSize)).toFixed(1));
    setW(); addEventListener('resize', setW, { passive: true });
    return { el, xs: placed.flatMap((p) => p.subs.map(() => p.x)) };
  };

  const run = () => {
    const b = build();
    if (!b) return;
    const { el, xs } = b;
    const lines = [...el.querySelectorAll('.sv-l')];
    const fill = el.querySelector('.sv-fill'), spark = el.querySelector('.sv-spark');
    const ir = el.querySelector('#sv-ir'), irr = el.querySelector('.sv-irr');
    const vbW = el.viewBox.baseVal.width;
    const setIr = (x) => ir.setAttribute('gradientTransform', `translate(${x.toFixed(0)} 0)`);
    const done = () => {
      lines.forEach((l) => { l.style.strokeDashoffset = '0'; });
      fill.setAttribute('opacity', '1'); spark.setAttribute('opacity', '0');
      sv.classList.add('sv-on', 'sv-done');
      // a riposo resta una velatura iridescente, come l'ossidiana arcobaleno
      const park = vbW * 0.62;
      irr.setAttribute('opacity', '.5'); setIr(park);
      if (still || !fine) return;
      // a lavoro finito, il lampo iridescente segue il puntatore sul titolo
      const h1 = document.getElementById('hero-title');
      let rx = park, tx = park, loop = 0;
      const tick = () => { loop = 0; rx += (tx - rx) * 0.12; setIr(rx); if (Math.abs(tx - rx) > 1) loop = requestAnimationFrame(tick); };
      const go = () => { if (!loop) loop = requestAnimationFrame(tick); };
      h1.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width) * vbW + 120; go(); }, { passive: true });
      h1.addEventListener('pointerleave', () => { tx = park; go(); }, { passive: true });
    };
    if (still) { done(); return; }
    const line = sv.closest('.line');
    if (line) line.style.overflow = 'visible';
    sv.classList.add('sv-on');
    const lens = lines.map((l) => l.getTotalLength());
    const total = lens.reduce((a, c) => a + c, 0) || 1;
    const cum = []; lens.reduce((a, c, i) => (cum[i] = a) + c, 0);
    const T = 1800, F0 = 1500, TF = 1000;
    let t0 = 0;
    const frame = (now) => {
      if (!t0) t0 = now;
      const t = now - t0, c = io3(clamp(t / T)) * total;
      let tip = -1, tl = 0;
      for (let i = 0; i < lines.length; i++) {
        const kk = clamp((c - cum[i]) / lens[i]), v = (1 - kk).toFixed(4);
        if (lines[i].__v !== v) { lines[i].__v = v; lines[i].style.strokeDashoffset = v; }
        if (kk > 0 && kk < 1) { tip = i; tl = kk * lens[i]; }
      }
      if (tip >= 0) { const pt = lines[tip].getPointAtLength(tl); spark.setAttribute('transform', `translate(${(pt.x + xs[tip]).toFixed(1)} ${pt.y.toFixed(1)})`); }
      spark.setAttribute('opacity', (t < T ? clamp(t / 160) : clamp(1 - (t - T) / 320)).toFixed(3));
      const f = clamp((t - F0) / TF);
      fill.setAttribute('opacity', out3(f).toFixed(3));
      setIr(-900 + io3(f) * (vbW + 1700));
      if (t < Math.max(T + 340, F0 + TF)) requestAnimationFrame(frame); else done();
    };
    requestAnimationFrame(frame);
  };
  const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  ready.then(() => setTimeout(run, still ? 0 : 1250));
}

/**
 * Campagne (Meta e Google Ads): spente finché nel progetto Vercel non ci sono META_PIXEL_ID e/o GOOGLE_ADS_ID.
 * Con gli ID compare il banner di consenso; i pixel si caricano solo dopo «Accetto» e la scelta si può cambiare
 * dal link «Preferenze cookie» in fondo alla pagina. Senza consenso restano solo le statistiche anonime del Desk.
 * Eventi: pagina vista, Contatto (clic su WhatsApp, telefono, email), Lead (scheda inviata).
 */
const CONSENT_KEY = 'of-consent';
let adsCfg = null, adsOn = false;
function loadAds() {
  if (adsOn || !adsCfg) return;
  adsOn = true;
  if (adsCfg.meta) {
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', adsCfg.meta); window.fbq('track', 'PageView');
  }
  if (adsCfg.gads) {
    const sc = document.createElement('script'); sc.async = true; sc.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(adsCfg.gads)}`; document.head.appendChild(sc);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', adsCfg.gads);
  }
}
function adsEvent(event) {
  if (!adsOn) return;
  safe(() => {
    if (event === 'modulo_invio') {
      if (window.fbq) window.fbq('track', 'Lead');
      if (window.gtag && adsCfg.gadsLead) window.gtag('event', 'conversion', { send_to: `${adsCfg.gads}/${adsCfg.gadsLead}` });
    } else if (event === 'whatsapp' || event === 'telefono' || event === 'email') {
      if (window.fbq) window.fbq('track', 'Contact');
      if (window.gtag && adsCfg.gadsContact) window.gtag('event', 'conversion', { send_to: `${adsCfg.gads}/${adsCfg.gadsContact}` });
    }
  });
}
function consentBanner(force) {
  if (document.getElementById('of-consent')) return;
  const saved = safe(() => JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'), null);
  if (saved && !force) { if (saved.ok) loadAds(); return; }
  const box = document.createElement('div');
  box.id = 'of-consent'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Preferenze cookie');
  box.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:2147482000;max-width:560px;margin:0 auto;background:#141310;color:#f3ecdf;border:1px solid rgba(226,198,143,.35);border-radius:16px;padding:18px 20px;box-shadow:0 24px 60px -20px rgba(0,0,0,.7);font:400 15px/1.5 "General Sans",system-ui,sans-serif';
  const p = document.createElement('p'); p.style.cssText = 'margin:0 0 14px';
  p.append('Usiamo cookie di misurazione per capire quali annunci portano le richieste. Si attivano solo se accetti. ');
  const a = document.createElement('a'); a.href = 'https://www.iubenda.com/privacy-policy/32325462/cookie-policy'; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Cookie policy'; a.style.cssText = 'color:#e2c68f'; p.append(a);
  const row = document.createElement('div'); row.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
  const mk = (label, primary, ok) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.style.cssText = `flex:1 1 140px;min-height:46px;border-radius:999px;font:600 14px/1 "General Sans",system-ui,sans-serif;letter-spacing:.06em;cursor:pointer;${primary ? 'background:#f3ecdf;color:#141310;border:0' : 'background:transparent;color:#f3ecdf;border:1px solid rgba(243,236,223,.45)'}`;
    b.addEventListener('click', () => { safe(() => localStorage.setItem(CONSENT_KEY, JSON.stringify({ ok, t: Date.now() }))); box.remove(); if (ok) loadAds(); else if (adsOn) location.reload(); }); return b; };
  // stessa evidenza per le due scelte: rifiutare è facile quanto accettare
  row.append(mk('Rifiuto', false, false), mk('Accetto', true, true));
  box.append(p, row); document.body.appendChild(box);
}
function setupAds(cfg) {
  const a = cfg.ads || {};
  if (!a.meta && !a.gads) return;
  adsCfg = a;
  consentBanner(false);
  // link per cambiare idea, accanto alle voci legali del fondo pagina
  safe(() => { const legal = document.querySelector('.foot-legal'); if (!legal) return; const l = document.createElement('a'); l.href = '#'; l.textContent = 'Preferenze cookie'; l.addEventListener('click', (e) => { e.preventDefault(); consentBanner(true); }); legal.append(' · ', l); });
}

export function mount(Component, cfg) {
  if (cfg.landing) rememberSource(cfg);
  safe(() => setupTracking(cfg));
  if (cfg.page === 'richiesta') {
    window.__ofSubmit = makeSubmit(cfg);
    window.__ofPreload = (files) => safe(() => uploadBatch(cfg, Array.prototype.filter.call(files || [], (f) => f && typeOf(f))));
    if (cfg.turnstile) setTimeout(() => { loadTurnstile().catch(() => {}); }, 2500);
  }
  const root = document.getElementById('dc-root');
  hydrate(h(Component, {}), root);
  checkVideoSources();
  addEventListener('load', checkVideoSources, { once: true });
  safe(setupFinale);
  safe(setupObsidian);
  safe(() => setupAds(cfg));
}
