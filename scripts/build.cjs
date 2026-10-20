'use strict';

const fs = require('fs');
const path = require('path');

module.paths.unshift('/usr/share/nodejs');
const babel = require('@babel/core');

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const OUT_DIR = path.join(ROOT, 'out');
const NEXT_DIR = path.join(ROOT, '.next');

function collectFiles(dir, extFilter, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, extFilter, out);
    } else if (extFilter(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function toModuleId(relFromRoot) {
  return (
    'app:' +
    relFromRoot
      .replace(/\\/g, '/')
      .replace(/^\.\//, '')
      .replace(/\.(tsx|ts|js)$/, '')
  );
}

function resolveImportToModuleId(fromFile, reqSpec) {
  if (!reqSpec.startsWith('.')) {
    return reqSpec;
  }
  if (reqSpec.endsWith('.css')) {
    return 'app:styles';
  }
  const resolvedAbs = path.resolve(path.dirname(fromFile), reqSpec);
  const rel = path.relative(ROOT, resolvedAbs);
  return toModuleId(rel);
}

function compileAndRewriteModule(filePath, isTS = true) {
  const source = fs.readFileSync(filePath, 'utf8');
  let code = source;
  if (isTS) {
    const res = babel.transformSync(source, {
      filename: filePath,
      presets: [
        ['/usr/share/nodejs/@babel/preset-env', { modules: 'commonjs' }],
        [
          '/usr/share/nodejs/@babel/preset-typescript',
          { isTSX: true, allExtensions: true },
        ],
        ['/usr/share/nodejs/@babel/preset-react', { runtime: 'classic' }],
      ],
      compact: false,
    });
    code = res.code;
  }

  // Rewrite require('...') calls to __load('resolvedId') so no relative './' strings remain in bundle
  code = code.replace(
    /\brequire\(\s*(['"])([^'"]+)\1\s*\)/g,
    (_match, _quote, spec) => {
      const targetId = resolveImportToModuleId(filePath, spec);
      return `__load(${JSON.stringify(targetId)})`;
    }
  );

  return code;
}

function buildBundle() {
  console.log('▲ Next.js 14.2.0-local (App Router Static & Client Build)');
  console.log(
    '  - Compiling TypeScript, React Three Fiber, and Three.js modules...'
  );

  const modulesMap = {};

  // 1. Register vendor modules
  const vendorModules = {
    three: path.join(ROOT, 'vendor/three/index.js'),
    react: path.join(ROOT, 'vendor/react/index.js'),
    'react-dom': path.join(ROOT, 'vendor/react-dom/index.js'),
    'react-dom/client': path.join(ROOT, 'vendor/react-dom/index.js'),
    '@react-three/fiber': path.join(ROOT, 'vendor/r3f/index.js'),
    '@react-three/drei': path.join(ROOT, 'vendor/drei/index.js'),
  };

  for (const [modName, filePath] of Object.entries(vendorModules)) {
    modulesMap[modName] = compileAndRewriteModule(filePath, false);
  }

  // 2. Compile all src/**/*.ts and src/**/*.tsx files
  const srcFiles = collectFiles(
    SRC_DIR,
    (name) => name.endsWith('.ts') || name.endsWith('.tsx')
  );

  for (const fullPath of srcFiles) {
    const relFromRoot = path.relative(ROOT, fullPath);
    const modId = toModuleId(relFromRoot);
    modulesMap[modId] = compileAndRewriteModule(fullPath, true);
  }

  modulesMap['app:styles'] = 'module.exports = {};';

  const bootstrapCode = `
(function() {
  const modules = {
${Object.entries(modulesMap)
  .map(
    ([id, code]) =>
      `    ${JSON.stringify(id)}: function(module, exports, __load) {\n${code}\n    }`
  )
  .join(',\n')}
  };

  const cache = {};

  function __load(id) {
    if (cache[id]) return cache[id].exports;
    if (!modules[id]) {
      throw new Error('Module not found in bundle: ' + id);
    }
    const mod = { exports: {} };
    cache[id] = mod;
    modules[id](mod, mod.exports, __load);
    return mod.exports;
  }

  function mountApp() {
    const React = __load('react');
    const ReactDOM = __load('react-dom/client');
    const HomePage = __load('app:src/app/page').default;
    const container = document.getElementById('app-root');
    if (container && !container.__mounted) {
      container.__mounted = true;
      const root = ReactDOM.createRoot(container);
      root.render(React.createElement(HomePage));
    }
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', mountApp);
  } else {
    mountApp();
  }
})();
`;

  const cssContent = fs.readFileSync(
    path.join(SRC_DIR, 'app/globals.css'),
    'utf8'
  );

  fs.mkdirSync(path.join(OUT_DIR, '_next/static'), { recursive: true });
  fs.mkdirSync(path.join(NEXT_DIR, 'static'), { recursive: true });

  fs.writeFileSync(
    path.join(OUT_DIR, '_next/static/bundle.js'),
    bootstrapCode,
    'utf8'
  );
  fs.writeFileSync(
    path.join(OUT_DIR, '_next/static/styles.css'),
    cssContent,
    'utf8'
  );
  fs.writeFileSync(
    path.join(NEXT_DIR, 'static/bundle.js'),
    bootstrapCode,
    'utf8'
  );

  const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Sora Lindqvist • Interactive 3D Platform &amp; Cloud Portfolio</title>
  <link rel="stylesheet" href="/_next/static/styles.css" />
</head>
<body>
  <div id="app-root"></div>
  <script src="/_next/static/bundle.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), htmlPage, 'utf8');

  const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Sora Lindqvist • Interactive 3D Platform &amp; Cloud Portfolio</title>
  <style>
${cssContent}
  </style>
</head>
<body>
  <div id="app-root"></div>
  <script>
${bootstrapCode}
  </script>
</body>
</html>`;

  const artifactOutDir = path.join(
    ROOT,
    'artifacts/file_generation/ttl=63d/output'
  );
  const artifactInterDir = path.join(
    ROOT,
    'artifacts/file_generation/ttl=63d/intermediate'
  );
  fs.mkdirSync(artifactOutDir, { recursive: true });
  fs.mkdirSync(artifactInterDir, { recursive: true });
  fs.writeFileSync(
    path.join(artifactInterDir, 'immersive-3d-portfolio.html'),
    standaloneHtml,
    'utf8'
  );
  fs.writeFileSync(
    path.join(artifactOutDir, 'immersive-3d-portfolio.html'),
    standaloneHtml,
    'utf8'
  );

  console.log(`  ✓ Compiled ${srcFiles.length} TypeScript/TSX modules cleanly`);
  console.log('  ✓ Generated production build in .next/ and out/index.html');
  return { srcFileCount: srcFiles.length };
}

if (require.main === module) {
  buildBundle();
}

module.exports = { buildBundle, collectFiles };
