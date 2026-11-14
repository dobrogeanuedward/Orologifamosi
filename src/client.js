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

/** Invia la scheda: prima le foto (URL firmati), poi i dati. Restituisce { code }. */
function makeSubmit(cfg) {
  return async function submit(s) {
    const base = `${cfg.desk}/api/intake/${cfg.org}`;
    let rid = safe(() => localStorage.getItem(RID_KEY));
    if (!rid) { rid = crypto.randomUUID(); safe(() => localStorage.setItem(RID_KEY, rid)); }

    // 1. Foto: libere, nell'ordine in cui la persona le ha caricate.
    const files = (s.photos || []).map((p) => p.file).filter((f) => f && typeOf(f));
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
 * Anello che accompagna la freccia del mouse. La freccia di sistema resta sempre: l'anello è solo
 * un segno in più, quindi il suo leggero ritardo non pesa. Un elemento, mosso con le trasformazioni.
 * Non parte su telefono e tablet, né con «riduci le animazioni». Un elemento può dichiarare
 * un'etichetta con data-cursor="Testo" (solo dove il clic fa davvero qualcosa).
 */
const CUR_LINK = 'a, .btn, button:not([disabled]), summary, label, [role="button"], input[type="checkbox"], input[type="radio"], input[type="file"], input[type="submit"], input[type="button"]';
const CUR_TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="submit"]):not([type="button"]):not([type="range"]), textarea, select, [contenteditable=""], [contenteditable="true"]';
const CUR_CSS = `
.of-cur{position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:2147483000;will-change:transform}
.of-ring{position:absolute;left:0;top:0;width:28px;height:28px;margin:-14px 0 0 -14px;border-radius:50%;border:1.5px solid #c9a35a;box-shadow:0 0 0 1px rgba(20,19,16,.28),inset 0 0 0 1px rgba(20,19,16,.14);background:rgba(201,163,90,0);opacity:0;display:grid;place-items:center;transition:width 240ms cubic-bezier(.23,1,.32,1),height 240ms cubic-bezier(.23,1,.32,1),margin 240ms cubic-bezier(.23,1,.32,1),background-color 200ms ease,border-color 200ms ease,box-shadow 200ms ease,opacity 180ms ease,transform 140ms ease}
.of-ring.on{opacity:1}
.of-ring.link{width:56px;height:56px;margin:-28px 0 0 -28px;background:rgba(201,163,90,.16)}
.of-ring.label{width:92px;height:92px;margin:-46px 0 0 -46px;background:rgba(20,19,16,.88);border-color:transparent;box-shadow:none}
.of-ring.text{opacity:0}
.of-ring.down{transform:scale(.86)}
.of-lab{font:600 13px/1 'General Sans',system-ui,sans-serif;color:#fff;letter-spacing:.01em;opacity:0;transition:opacity 160ms ease;white-space:nowrap}
.of-ring.label .of-lab{opacity:1}
@media print{.of-cur{display:none}}
`;

function initCursor() {
  if (!window.matchMedia || !window.requestAnimationFrame) return;
  if (!safe(() => matchMedia('(hover: hover) and (pointer: fine)').matches, false)) return;
  if (safe(() => matchMedia('(prefers-reduced-motion: reduce)').matches, false)) return;

  const style = document.createElement('style');
  style.textContent = CUR_CSS;
  document.head.appendChild(style);
  const cur = document.createElement('div');
  cur.className = 'of-cur';
  cur.setAttribute('aria-hidden', 'true');
  const ring = document.createElement('div');
  ring.className = 'of-ring';
  const lab = document.createElement('span');
  lab.className = 'of-lab';
  ring.appendChild(lab);
  cur.appendChild(ring);
  document.body.appendChild(cur);

  let tx = 0, ty = 0, x = 0, y = 0, first = true, raf = 0, on = false, kind = '', text = '', down = false, checkQueued = false, lastEl = null;
  const paint = () => { ring.className = 'of-ring' + (on ? ' on' : '') + (kind ? ' ' + kind : '') + (down ? ' down' : ''); };
  const place = () => { cur.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)'; };
  const loop = () => {
    x += (tx - x) * 0.2; y += (ty - y) * 0.2;
    place();
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(loop) : 0;
  };
  /** Cosa c'è sotto la freccia: campo di testo (l'anello sparisce), etichetta dichiarata, cosa cliccabile, o niente. */
  const read = (el) => {
    if (el === lastEl && on) return;                     // stesso elemento di prima: niente da ricalcolare
    lastEl = el;
    let k = '', t = '';
    if (el && el.closest) {
      const labelled = el.closest('[data-cursor]');
      if (el.closest(CUR_TEXT)) k = 'text';
      else if (labelled && labelled.getAttribute('data-cursor')) { k = 'label'; t = labelled.getAttribute('data-cursor'); }
      else if (el.closest(CUR_LINK) || safe(() => getComputedStyle(el).cursor === 'pointer', false)) k = 'link';
    }
    if (k !== kind || t !== text || !on) {
      kind = k; text = t; on = true;
      if (t) lab.textContent = t;
      paint();
    }
  };
  const hide = () => { first = true; lastEl = null; if (on) { on = false; paint(); } };

  addEventListener('pointermove', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') { hide(); return; }
    tx = e.clientX; ty = e.clientY;
    if (first) { x = tx; y = ty; first = false; place(); }
    if (!raf) raf = requestAnimationFrame(loop);
    read(e.target);
  }, { passive: true });
  // La pagina scorre sotto la freccia ferma: si rilegge cosa c'è sotto, al massimo una volta per fotogramma.
  addEventListener('scroll', () => {
    if (!on || checkQueued) return;
    checkQueued = true;
    requestAnimationFrame(() => { checkQueued = false; if (on) read(document.elementFromPoint(tx, ty)); });
  }, { passive: true, capture: true });
  addEventListener('pointerdown', (e) => { if (!e.pointerType || e.pointerType === 'mouse') { down = true; paint(); } else hide(); }, { passive: true });
  addEventListener('pointerup', () => { if (down) { down = false; paint(); } }, { passive: true });
  document.documentElement.addEventListener('mouseleave', hide);
  addEventListener('blur', hide);
}

export function mount(Component, cfg) {
  if (cfg.landing) rememberSource(cfg);
  if (cfg.page === 'richiesta') window.__ofSubmit = makeSubmit(cfg);
  const root = document.getElementById('dc-root');
  hydrate(h(Component, {}), root);
  checkVideoSources();
  addEventListener('load', checkVideoSources, { once: true });
  initCursor();
}
