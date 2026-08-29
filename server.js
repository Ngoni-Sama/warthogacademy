/**
 * Warthog Academy — production static server.
 *
 * The site itself is plain HTML/CSS/JS. This tiny Express app lets it run as a
 * cPanel "Setup Node.js App" (Passenger) and on any Node host. Passenger sets
 * PORT for us; locally it falls back to 3000.
 *
 *   npm install
 *   npm start        ->  http://localhost:3000
 */
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

// Static assets with sensible caching. Dotfiles (.git, .env, etc.) are ignored
// by default, so they are never served.
app.use(express.static(ROOT, {
  extensions: ['html'],
  setHeaders(res, filePath) {
    if (/\.(?:png|jpe?g|svg|webp|ico|woff2?)$/.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days for media/fonts
    } else if (/\.(?:css|js)$/.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=86400');    // 1 day for css/js
    }
  },
}));

// Simple health check for uptime monitoring
app.get('/healthz', (_req, res) => res.type('text').send('ok'));

// Single-page site: send index.html for any unmatched GET (not /assets or files)
app.get('*', (req, res, next) => {
  if (req.method !== 'GET' || req.path.includes('.')) return next();
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, () => console.log(`Warthog Academy running on port ${PORT}`));
