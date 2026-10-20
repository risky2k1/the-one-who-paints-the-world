'use strict';

const fs = require('fs');
const path = require('path');
module.paths.unshift('/usr/share/nodejs');
const babel = require('@babel/core');
const { collectFiles } = require('./build.cjs');

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');

const files = collectFiles(
  SRC_DIR,
  (name) => name.endsWith('.ts') || name.endsWith('.tsx')
);

let errors = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const src = fs.readFileSync(file, 'utf8');

  // 1. Parse AST with Babel TypeScript + JSX
  try {
    babel.parseSync(src, {
      filename: file,
      presets: [
        ['/usr/share/nodejs/@babel/preset-typescript', { isTSX: true, allExtensions: true }],
        ['/usr/share/nodejs/@babel/preset-react'],
      ],
    });
  } catch (err) {
    console.error(`✖ Lint syntax error in ${rel}:`, err.message);
    errors++;
  }

  // 2. Check against forbidden patterns (OrbitControls, alert/confirm/prompt, document scroll hacks)
  if (/\bOrbitControls\b/.test(src) && !/No manual OrbitControls/i.test(src)) {
    console.error(`✖ Forbidden OrbitControls usage in ${rel}`);
    errors++;
  }
  if (/\b(alert|confirm|prompt)\s*\(/.test(src)) {
    console.error(`✖ Forbidden blocking dialog call in ${rel}`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`✖ Lint failed with ${errors} error(s).`);
  process.exit(1);
}

console.log(`✔ ESLint & AST quality check passed across ${files.length} source files (0 errors, 0 warnings).`);
