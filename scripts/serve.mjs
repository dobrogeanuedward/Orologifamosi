/** Server statico per provare la build in locale: http://localhost:4321/vendi-orologio/ */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const PORT = Number(process.env.PORT || 4321);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') { res.writeHead(302, { location: '/vendi-orologio/' }); return res.end(); }
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(DIST, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(DIST) || !fs.existsSync(file)) { res.writeHead(404); return res.end('Non trovato'); }
  const stat = fs.statSync(file);
  const type = TYPES[path.extname(file)] || 'application/octet-stream';
  const range = req.headers.range;
  if (range && type === 'video/mp4') {
    const [s, e] = range.replace('bytes=', '').split('-').map(Number);
    const end = e || stat.size - 1;
    res.writeHead(206, { 'content-type': type, 'content-range': `bytes ${s}-${end}/${stat.size}`, 'accept-ranges': 'bytes', 'content-length': end - s + 1 });
    return fs.createReadStream(file, { start: s, end }).pipe(res);
  }
  res.writeHead(200, { 'content-type': type, 'content-length': stat.size, 'accept-ranges': 'bytes' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`Landing su http://localhost:${PORT}/vendi-orologio/`));
