/**
 * Warthog Academy — production static server (ZERO dependencies).
 *
 * Uses only Node's built-in modules, so cPanel's "Run NPM Install" has nothing
 * to install and cannot fail. Runs as a cPanel "Setup Node.js App" (Passenger
 * sets PORT) or anywhere Node is available.
 *
 *   npm start        ->  http://localhost:3000   (or process.env.PORT)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.map': 'application/json',
};

function cacheFor(ext) {
  if (/\.(png|jpe?g|svg|webp|ico|woff2?)$/.test(ext)) return 'public, max-age=2592000'; // 30d
  if (/\.(css|js)$/.test(ext)) return 'public, max-age=86400';                            // 1d
  return 'no-cache';
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'Not found', { 'Content-Type': 'text/plain' });
    send(res, 200, data, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': cacheFor(ext),
      'X-Content-Type-Options': 'nosniff',
    });
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'Method not allowed', { 'Content-Type': 'text/plain' });
  }

  // Decode + strip query, normalise, block traversal and dotfiles
  let urlPath;
  try { urlPath = decodeURIComponent(req.url.split('?')[0]); }
  catch { return send(res, 400, 'Bad request', { 'Content-Type': 'text/plain' }); }

  if (urlPath === '/healthz') return send(res, 200, 'ok', { 'Content-Type': 'text/plain' });
  if (urlPath === '/') urlPath = '/index.html';

  const segments = urlPath.split('/').filter(Boolean);
  if (segments.some(s => s.startsWith('.'))) {
    return send(res, 404, 'Not found', { 'Content-Type': 'text/plain' });
  }

  const filePath = path.join(ROOT, ...segments);
  if (!filePath.startsWith(ROOT)) {
    return send(res, 403, 'Forbidden', { 'Content-Type': 'text/plain' });
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) return serveFile(res, filePath);
    // Extensionless GET -> single-page fallback to index.html
    if (!path.extname(filePath)) return serveFile(res, path.join(ROOT, 'index.html'));
    return send(res, 404, 'Not found', { 'Content-Type': 'text/plain' });
  });
});

server.listen(PORT, () => console.log(`Warthog Academy running on port ${PORT}`));
