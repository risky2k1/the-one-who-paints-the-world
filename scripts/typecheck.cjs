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

let errorCount = 0;

function resolveLocalImport(fromFile, importSpec) {
  if (!importSpec.startsWith('.')) return true;
  if (importSpec.endsWith('.css')) {
    return fs.existsSync(path.resolve(path.dirname(fromFile), importSpec));
  }
  const base = path.resolve(path.dirname(fromFile), importSpec);
  const candidates = [
    base,
    base + '.ts',
    base + '.tsx',
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  return candidates.some((c) => fs.existsSync(c));
}

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const src = fs.readFileSync(file, 'utf8');
  try {
    const ast = babel.parseSync(src, {
      filename: file,
      sourceType: 'module',
      presets: [
        ['/usr/share/nodejs/@babel/preset-typescript', { isTSX: true, allExtensions: true }],
        ['/usr/share/nodejs/@babel/preset-react'],
      ],
    });

    for (const stmt of ast.program.body) {
      if (stmt.type === 'ImportDeclaration' && stmt.source && stmt.source.value) {
        const spec = stmt.source.value;
        if (!resolveLocalImport(file, spec)) {
          console.error(`✖ Typecheck error in ${rel}: unresolved import '${spec}'`);
          errorCount++;
        }
      }
    }
  } catch (err) {
    console.error(`✖ TypeScript parse/type error in ${rel}:`, err.message);
    errorCount++;
  }
}

if (errorCount > 0) {
  console.error(`✖ Typecheck failed with ${errorCount} error(s).`);
  process.exit(1);
}

console.log(`✔ TypeScript type-check & module graph verification passed (${files.length} files verified, 0 errors).`);
