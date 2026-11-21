/**
 * Interprete delle tavole di design (.dc.html) su Preact.
 * Stessa semantica del formato originale: {{segnaposto}}, <sc-for>, <sc-if>,
 * eventi in stile React (onClick, onChange…), stato e ciclo di vita della classe.
 * Usato sia nella build (HTML statico) sia nel browser (idratazione).
 */
import { h, Component, Fragment } from 'preact';

const HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
const WHOLE = /^\{\{\s*([^}]+?)\s*\}\}$/;
const BOOL_ATTRS = new Set(['autoplay', 'muted', 'loop', 'playsinline', 'controls', 'hidden', 'disabled', 'checked', 'open', 'required', 'readonly', 'multiple', 'selected', 'novalidate', 'inert', 'default', 'reversed']);
const TEXT_INPUT = (tag, a) => tag === 'textarea' || (tag === 'input' && !['checkbox', 'radio', 'file', 'button', 'submit', 'range', 'color'].includes(String(a.type || 'text').toLowerCase()));

function literal(p) {
  if (p === 'true') return true;
  if (p === 'false') return false;
  if (p === 'null') return null;
  if (p === 'undefined') return undefined;
  if (/^-?\d+(\.\d+)?$/.test(p)) return Number(p);
  if (/^(['"]).*\1$/.test(p)) return p.slice(1, -1);
  return NO;
}
const NO = Symbol('no-literal');

function lookup(path, scope) {
  const lit = literal(path);
  if (lit !== NO) return lit;
  const parts = path.split('.');
  let v = scope;
  for (const k of parts) { if (v == null) return undefined; v = v[k]; }
  return v;
}

const str = (v) => (v == null || v === false ? '' : String(v));

function attrValue(raw, scope) {
  const m = WHOLE.exec(raw);
  if (m) return lookup(m[1], scope);
  if (!raw.includes('{{')) return raw;
  return raw.replace(HOLE, (_, p) => str(lookup(p, scope)));
}

function renderNodes(nodes, scope, out) {
  for (const n of nodes) renderNode(n, scope, out);
  return out;
}

function renderNode(n, scope, out) {
  if (n.t === '#t') {
    if (!n.v.includes('{{')) { out.push(n.v); return; }
    let last = 0;
    n.v.replace(HOLE, (m, p, i) => { if (i > last) out.push(n.v.slice(last, i)); const v = lookup(p, scope); if (v != null && v !== false && v !== true) out.push(typeof v === 'object' ? v : String(v)); last = i + m.length; return m; });
    if (last < n.v.length) out.push(n.v.slice(last));
    return;
  }
  if (n.t === 'sc-if') {
    if (attrValue(n.a.value ?? '', scope)) renderNodes(n.c, scope, out);
    return;
  }
  if (n.t === 'sc-for') {
    const list = attrValue(n.a.list ?? '', scope);
    const as = n.a.as || 'item';
    if (Array.isArray(list)) list.forEach((item, i) => out.push(h(Fragment, { key: i }, renderNodes(n.c, { ...scope, [as]: item, $index: i }, []))));
    return;
  }
  const props = {};
  for (const [k, raw] of Object.entries(n.a)) {
    if (k.startsWith('hint-')) continue;
    let v = attrValue(raw, scope);
    if (k.startsWith('on') && k.length > 2) {
      if (typeof v !== 'function') continue;
      let ev = k.slice(2).toLowerCase();
      if (ev === 'change' && TEXT_INPUT(n.t, n.a)) ev = 'input';   // onChange React = a ogni battitura
      props['on' + ev] = v;
      continue;
    }
    if (typeof v === 'function') continue;
    if (BOOL_ATTRS.has(k) && (v === '' || v === k)) v = true;
    if (BOOL_ATTRS.has(k) && (v === 'false')) v = false;
    if (k === 'class') { props.class = v; continue; }
    if (k === 'value' && n.t !== 'option' && v == null) v = '';
    props[k] = v;
  }
  out.push(h(n.t, props, n.c.length ? renderNodes(n.c, scope, []) : undefined));
}

/** Classe base delle tavole: stato e ciclo di vita di Preact, render dal template. */
export class DCLogic extends Component {
  constructor(props) { super(props); this.state = this.state || {}; }
  renderVals() { return {}; }
  render() {
    const vals = this.renderVals() || {};
    return h(Fragment, null, renderNodes(this.constructor.__tpl, vals, []));
  }
}

/** Percorso pubblico di un'immagine caricata nella tavola (id → file). */
export function imgPath(id) {
  if (!id) return '';
  const ext = (globalThis.__OF_IMG_EXT && globalThis.__OF_IMG_EXT[id]) || '.webp';
  const L = globalThis.__OF_IMG_LOCAL;   // Set durante la build, elenco nel bundle del browser
  const local = !!L && (L.has ? L.has(id) : L.indexOf(id) > -1);
  return (local ? globalThis.__OF_ASSETS_LOCAL : globalThis.__OF_ASSETS || '/of-assets') + '/img/' + id + ext;
}
