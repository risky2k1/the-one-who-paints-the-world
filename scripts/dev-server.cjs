'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { buildBundle } = require('./build.cjs');

const PORT = Number(process.env.PORT || 3000);
const OUT_DIR = path.resolve(__dirname, '../out');

if (!fs.existsSync(path.join(OUT_DIR, 'index.html')) || process.argv.includes('--rebuild')) {
  buildBundle();
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  let filePath = path.join(
    OUT_DIR,
    urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '')
  );

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(OUT_DIR, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const content = fs.readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(content);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`▲ Next.js Dev Server ready on http://localhost:${PORT}`);
});
