/**
 * Build delle landing di Orologi Famosi.
 * Legge le tavole .dc.html esportate dall'artifact di design (../landing-src),
 * le trasforma in pagine statiche (HTML completo per SEO/AEO/GEO) con idratazione Preact.
 *
 * Variabili:
 *   SITE_URL   dominio pubblico (default https://www.venditaorologiusati.it)
 *   DESK_URL   indirizzo di Dogo Desk per l'invio delle schede (default http://localhost:3000)
 *   DESK_ORG   cliente nel Desk (default of)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';
import * as esbuild from 'esbuild';
import { h } from 'preact';
import { renderToString } from 'preact-render-to-string';
import { DCLogic, imgPath } from '../src/dc.js';
import { PAGES, SITE, LINKS, BUSINESS } from '../src/site.js';
import { jsonLd } from '../src/seo.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.resolve(ROOT, '../landing-src');
const DIST = path.join(ROOT, 'dist');
const ASSETS = '/of-assets';
const DESK_URL = (process.env.DESK_URL || 'http://localhost:3000').replace(/\/$/, '');
const DESK_ORG = process.env.DESK_ORG || 'of';

// ---------- preparazione ----------
fs.rmSync(DIST, { recursive: true, force: true });
const out = (p, data) => { const f = path.join(DIST, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
const copyDir = (from, to) => { fs.mkdirSync(path.join(DIST, to), { recursive: true }); for (const f of fs.readdirSync(from)) fs.copyFileSync(path.join(from, f), path.join(DIST, to, f)); };

copyDir(path.join(SRC, 'project/fonts'), `${ASSETS}/fonts`);
copyDir(path.join(SRC, 'project/media'), `${ASSETS}/media`);
copyDir(path.join(SRC, 'blobs'), `${ASSETS}/img`);
const EXT = Object.fromEntries(fs.readdirSync(path.join(SRC, 'blobs')).map((f) => [f.replace(/\.[^.]+$/, ''), path.extname(f)]));
globalThis.__OF_IMG_EXT = EXT;
globalThis.__OF_ASSETS = ASSETS;

// ---------- riscritture ----------
function rewriteLinks(s) {
  return s
    .replace(/\/_blob\/([0-9a-f]{32})/g, (_, id) => imgPath(id))
    .replace(/(["'(])(media|fonts)\//g, `$1${ASSETS}/$2/`)
    .replace(/(["'])([A-Za-z]+)\.dc\.html/g, (m, q, name) => (LINKS[name] ? q + LINKS[name] : m));
}

/** Valore di un attributo già letto (senza virgolette): link tra tavole, media, font. */
function rewriteAttr(v) {
  let s = rewriteLinks(v);
  s = s.replace(/^([A-Za-z]+)\.dc\.html/, (m, name) => LINKS[name] ?? m);
  s = s.replace(/^(media|fonts)\//, `${ASSETS}/$1/`);
  return s;
}

function rewriteScript(code, page) {
  let s = code.replace(/'\/_blob\/'\s*\+\s*([\w$]+(?:\[\d+\])?)/g, '__ofImg($1)');
  s = rewriteLinks(s);
  if (page.id === 'richiesta') s = patchRequest(s);
  return s;
}

/** Collega il modulo a Dogo Desk: invio reale, foto, codice dal server. */
function patchRequest(s) {
  const must = (from, to) => { if (!s.includes(from)) throw new Error(`Aggancio non trovato nella tavola Richiesta: ${from.slice(0, 70)}`); s = s.replace(from, to); };
  // Codice: lo assegna Dogo Desk all'invio, non il browser.
  must("code: 'OF-' + (1000 + Math.floor(Math.random() * 9000)) }", "code: 'OF-····', entry: 'Scheda guidata' }");
  // Si ricorda da quale ingresso è partita la persona.
  must("go: function () { var p = { mode: 'form', sec: x[4] }; if (x[5]) p.ch = x[5]; self.setState(p); }",
    "go: function () { var p = { mode: 'form', sec: x[4], entry: x[0] === 'Solo foto' ? 'Solo foto' : (x[0] === 'Di persona' ? 'Preferisco parlarne' : 'Scheda guidata') }; if (x[5]) p.ch = x[5]; self.setState(p); }");
  must("if (go === 'foto') { patch.mode = 'form'; patch.sec = 2;", "if (go === 'foto') { patch.mode = 'form'; patch.sec = 2; patch.entry = 'Solo foto';");
  must("if (go === 'parla') { patch.mode = 'form'; patch.sec = 3;", "if (go === 'parla') { patch.mode = 'form'; patch.sec = 3; patch.entry = 'Preferisco parlarne';");
  // Il file originale serve per il caricamento.
  must('var ph = { id: seq, url: URL.createObjectURL(f),', 'var ph = { id: seq, file: f, url: URL.createObjectURL(f),');
  // Invio reale a Dogo Desk.
  must("var send = function () { if (sendOk) { try { localStorage.removeItem('of-draft'); } catch (e) {} self.setState({ sent: true, view: 0, restored: false }); window.scrollTo({ top: 0, behavior: 'smooth' }); } };",
    "var send = function () { if (!sendOk || self.state.sending) return; self.setState({ sending: true, sendError: '' }); window.__ofSubmit(self.state).then(function (r) { try { localStorage.removeItem('of-draft'); } catch (e) {} self.setState({ sent: true, sending: false, code: r.code || self.state.code, view: 0, restored: false }); window.scrollTo({ top: 0, behavior: 'smooth' }); }, function (err) { self.setState({ sending: false, sendError: (err && err.message) || 'Invio non riuscito.' }); }); };");
  must('sendWhy: why,', "sendWhy: s.sending ? 'Invio in corso…' : (s.sendError ? s.sendError + ' Riprova, oppure scrivi a Salvatore su WhatsApp.' : why),");
  return s;
}

// ---------- tavola → template ----------
const attrsOf = (el) => Object.fromEntries((el.attrs || []).map((a) => [a.name, a.value]));
function toTpl(node) {
  if (node.nodeName === '#text') return { t: '#t', v: rewriteLinks(node.value) };
  if (node.nodeName === '#comment') return null;
  const kids = (node.nodeName === 'template' ? node.content.childNodes : node.childNodes) || [];
  const a = {};
  for (const [k, v] of Object.entries(attrsOf(node))) a[k] = rewriteAttr(v);
  return { t: node.tagName, a, c: kids.map(toTpl).filter(Boolean) };
}
function find(node, pred) {
  if (pred(node)) return node;
  for (const c of node.childNodes || []) { const r = find(c, pred); if (r) return r; }
  return null;
}
const textOf = (n) => (n.childNodes || []).map((c) => c.value ?? textOf(c)).join('');

function readBoard(file) {
  const raw = fs.readFileSync(path.join(SRC, 'project', file), 'utf8');
  const doc = parse(raw);
  const head = find(doc, (n) => n.tagName === 'head');
  const title = textOf(find(head, (n) => n.tagName === 'title'));
  const descEl = find(head, (n) => n.tagName === 'meta' && attrsOf(n).name === 'description');
  const xdc = find(doc, (n) => n.tagName === 'x-dc');
  const helmet = xdc.childNodes.find((n) => n.tagName === 'helmet');
  const css = (helmet?.childNodes || []).filter((n) => n.tagName === 'style').map(textOf).join('\n');
  const tpl = xdc.childNodes.filter((n) => n !== helmet).map(toTpl).filter(Boolean);
  const script = find(doc, (n) => n.tagName === 'script' && attrsOf(n).type === 'text/x-dc');
  return { title, description: descEl ? attrsOf(descEl).content : '', css, tpl, code: textOf(script) };
}

// ---------- pagine ----------
const clientRuntime = fs.readFileSync(path.join(ROOT, 'src/client.js'), 'utf8');
const sitemap = [];

for (const page of PAGES) {
  const board = readBoard(page.file);
  const code = rewriteScript(board.code, page);
  // Server: stessa classe della tavola, eseguita su Preact.
  const Comp = new Function('DCLogic', '__ofImg', `${code}\n;return Component;`)(DCLogic, imgPath);
  Comp.__tpl = board.tpl;
  const html = renderToString(h(Comp, {}));
  // Le FAQ dei dati strutturati sono quelle visibili nella pagina (stesso array della tavola).
  const vals = new Comp({}).renderVals();
  const faqs = Object.values(vals).find((v) => Array.isArray(v) && v.length && v.every((x) => x && typeof x.q === 'string' && typeof x.a === 'string')) || [];

  // CSS della tavola, con percorsi riscritti e minificato.
  const css = (await esbuild.transform(rewriteLinks(board.css), { loader: 'css', minify: true })).code;
  out(`${ASSETS}/css/${page.id}.css`, css);

  // JS del browser: runtime + classe originale + template.
  const entry = path.join(ROOT, '.build', `${page.id}.js`);
  fs.mkdirSync(path.dirname(entry), { recursive: true });
  fs.writeFileSync(path.join(ROOT, '.build', `${page.id}.tpl.json`), JSON.stringify(board.tpl));
  fs.writeFileSync(entry, `import { DCLogic, imgPath as __ofImg } from '../src/dc.js';\nimport { mount } from '../src/client.js';\nimport tpl from './${page.id}.tpl.json';\n${code}\n;Component.__tpl = tpl;\nmount(Component, ${JSON.stringify({ page: page.id, route: page.route, pageName: page.name, desk: DESK_URL, org: DESK_ORG, landing: !!page.landing })});\n`);
  await esbuild.build({
    entryPoints: [entry], bundle: true, minify: true, format: 'esm', target: 'es2019', outfile: path.join(DIST, ASSETS, 'js', `${page.id}.js`),
    define: { 'globalThis.__OF_IMG_EXT': JSON.stringify(EXT) }, loader: { '.json': 'json' }, logLevel: 'warning',
  });

  const title = page.title || board.title;
  const description = page.description || board.description;
  const canonical = SITE + page.route;
  const ogImage = page.ogImage ? SITE + page.ogImage : SITE + (html.match(new RegExp(`${ASSETS}/img/[0-9a-f]{32}\\.(?:webp|jpg|png)`))?.[0] ?? '');
  const ld = jsonLd(page, { canonical, title, description, ogImage, faqs });
  const doc = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="${page.index === false ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
<meta name="theme-color" content="#fbf8f2">
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:locale" content="it_IT">
<meta property="og:site_name" content="${esc(BUSINESS.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
${ogImage.endsWith('/') ? '' : `<meta property="og:image" content="${ogImage}">\n<meta name="twitter:card" content="summary_large_image">`}
<meta name="geo.region" content="IT-BO">
<meta name="geo.placename" content="Medicina">
<link rel="preload" href="${ASSETS}/fonts/general-sans-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${ASSETS}/fonts/gambarino-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${ASSETS}/css/${page.id}.css">
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body>
<div id="dc-root">${html}</div>
<script type="module" src="${ASSETS}/js/${page.id}.js"></script>
</body>
</html>
`;
  out(`${page.route}index.html`, doc);
  if (page.index !== false) sitemap.push({ loc: canonical, priority: page.priority ?? 0.8 });
  console.log(`✓ ${page.route}  ${(doc.length / 1024).toFixed(0)} KB html · ${(css.length / 1024).toFixed(0)} KB css`);
}

// ---------- file per motori di ricerca e AI ----------
const today = new Date().toISOString().slice(0, 10);
out('sitemap-vendi-orologio.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}\n</urlset>\n`);
out('robots-snippet.txt', `# Da aggiungere al robots.txt del sito principale\nSitemap: ${SITE}/sitemap-vendi-orologio.xml\n`);
out('llms.txt', fs.readFileSync(path.join(ROOT, 'src/llms.txt'), 'utf8').replaceAll('{{SITE}}', SITE));
console.log(`✓ sitemap, llms.txt · Desk: ${DESK_URL}/api/intake/${DESK_ORG}`);
void clientRuntime;

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
