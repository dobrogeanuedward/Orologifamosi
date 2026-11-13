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

export function mount(Component, cfg) {
  if (cfg.landing) rememberSource(cfg);
  if (cfg.page === 'richiesta') window.__ofSubmit = makeSubmit(cfg);
  const root = document.getElementById('dc-root');
  hydrate(h(Component, {}), root);
}
