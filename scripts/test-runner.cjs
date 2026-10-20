'use strict';

const fs = require('fs');
const path = require('path');
const Module = require('module');
module.paths.unshift('/usr/share/nodejs');
const babel = require('@babel/core');

const ROOT = path.resolve(__dirname, '..');

// Register on-the-fly TypeScript compiler hook for Node test runner
const origLoad = Module._extensions['.js'];
function compileTS(module, filename) {
  const src = fs.readFileSync(filename, 'utf8');
  const res = babel.transformSync(src, {
    filename,
    presets: [
      ['/usr/share/nodejs/@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }],
      ['/usr/share/nodejs/@babel/preset-typescript', { isTSX: true, allExtensions: true }],
      ['/usr/share/nodejs/@babel/preset-react', { runtime: 'classic' }],
    ],
  });
  module._compile(res.code, filename);
}

Module._extensions['.ts'] = compileTS;
Module._extensions['.tsx'] = compileTS;

const { runPortfolioTestSuite } = require('../tests/portfolio.test.ts');

console.log('Running Portfolio 3D Route & Navigation State Test Suite...\n');
const results = runPortfolioTestSuite();
let failed = 0;

for (const res of results) {
  if (res.passed) {
    console.log(`  ✔ PASS: ${res.name}`);
  } else {
    console.error(`  ✖ FAIL: ${res.name}\n     -> ${res.error}`);
    failed++;
  }
}

console.log(`\nSummary: ${results.length - failed}/${results.length} tests passed.`);
if (failed > 0) {
  process.exit(1);
}
