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
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid']) { const v = q.get(k); if (v) utm[k] = v.slice(0, 120); }
  let referrer = null;
  safe(() => { const r = document.referrer && new URL(document.referrer); if (r && r.host !== location.host) referrer = r.host; });
  const src = { page: cfg.route, pageName: cfg.pageName, utm: Object.keys(utm).length ? utm : null, referrer };
  safe(() => sessionStorage.setItem(SRC_KEY, JSON.stringify(src)));
}

const KIT = { box: 'Scatola', papers: 'Garanzia', service: 'Revisioni', links: 'Maglie extra', none: 'Solo l’orologio' };
const CH = { WhatsApp: 'whatsapp', Telefonata: 'telefono', Email: 'email', 'Visita a Medicina': 'visita-medicina', 'Visita a Bologna': 'visita-bologna' };
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
function turnstileToken(siteKey) {
  if (!siteKey) return Promise.resolve('');
  turnstileReady = turnstileReady || new Promise((res, rej) => {
    const sc = document.createElement('script');
    sc.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    sc.async = true; sc.onload = res; sc.onerror = () => rej(new Error('Verifica antispam non disponibile.'));
    document.head.appendChild(sc);
  });
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
    const timer = setTimeout(() => done(rej, new Error('La verifica di sicurezza non è stata completata. Riprova.')), 120000);
    window.turnstile.render(box, {
      sitekey: siteKey, appearance: 'interaction-only', language: 'it',
      callback: (t) => done(res, t),
      'before-interactive-callback': () => { veil.style.display = 'grid'; },
      'error-callback': () => done(rej, new Error('Verifica di sicurezza non riuscita. Riprova.')),
    });
  }));
}

/** Invia la scheda: prima le foto (URL firmati), poi i dati. Restituisce { code }. */
function makeSubmit(cfg) {
  return async function submit(s) {
    const base = `${cfg.desk}/api/intake/${cfg.org}`;
    let rid = safe(() => localStorage.getItem(RID_KEY));
    if (!rid) { rid = crypto.randomUUID(); safe(() => localStorage.setItem(RID_KEY, rid)); }

    // 1. Foto: libere, nell'ordine in cui la persona le ha caricate.
    const files = await Promise.all((s.photos || []).map((p) => p.file).filter((f) => f && typeOf(f)).map(cleanPhoto));
    let photoKeys = [];
    let note = '';
    if (files.length) {
      const res = await fetch(`${base}/upload`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ requestId: rid, files: files.map((f) => ({ type: typeOf(f), size: f.size })) }) }).catch(() => null);
      if (res && res.status === 501) note = `\n[${files.length} foto scelte: il caricamento non è ancora attivo, vanno chieste alla persona]`;
      else if (!res || !res.ok) throw new Error(res ? await readError(res, 'Le foto non sono state caricate.') : 'Connessione assente: le foto non sono partite.');
      else {
        const { uploads } = await res.json();
        await Promise.all(uploads.map((u, i) => fetch(u.url, { method: 'PUT', headers: { 'content-type': typeOf(files[i]) }, body: files[i] }).then((r) => { if (!r.ok) throw new Error('Una foto non è stata caricata.'); })));
        photoKeys = uploads.map((u) => u.key);
      }
    }

    // 2. Scheda, con i campi del modulo (contratto in dogo-desk/BETA.md).
    const src = safe(() => JSON.parse(sessionStorage.getItem(SRC_KEY) || 'null'), null) || { page: cfg.route, pageName: cfg.pageName, utm: null, referrer: null };
    const brand = s.brand === '__other' ? (s.other || '').trim() : s.brand || '';
    const model = (s.modelOther || '').trim() || s.model || '';
    const payload = {
      requestId: rid,
      entry: s.entry || 'Scheda guidata',
      brand, model, ref: (s.refNo || '').trim(), year: (s.year || '').trim(),
      cond: s.cond || '',
      kit: Object.keys(s.kit || {}).filter((k) => s.kit[k]).map((k) => KIT[k]).filter(Boolean),
      flags: Object.keys(s.flags || {}).filter((k) => s.flags[k]),
      extra: ((s.notes || '').trim() + note).slice(0, 2000),
      photoKeys,
      person: { name: (s.name || '').trim(), phone: (s.phone || '').trim(), email: (s.email || '').trim(), city: '' },
      channels: Object.keys(s.ch || {}).filter((k) => s.ch[k]).map((k) => CH[k]).filter(Boolean),
      days: Object.keys(s.days || {}).filter((k) => s.days[k]),
      times: Object.keys(s.times || {}).filter((k) => s.times[k]),
      intent: s.intent || '',
      price: (s.price || '').trim(),
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

export function mount(Component, cfg) {
  if (cfg.landing) rememberSource(cfg);
  if (cfg.page === 'richiesta') window.__ofSubmit = makeSubmit(cfg);
  const root = document.getElementById('dc-root');
  hydrate(h(Component, {}), root);
  checkVideoSources();
  addEventListener('load', checkVideoSources, { once: true });
  safe(setupFinale);
}
