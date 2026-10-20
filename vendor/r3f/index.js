'use strict';

const React = require('react');
const THREE = require('three');

const R3FContext = React.createContext(null);
const GroupStackContext = React.createContext([]);

function useThree() {
  const ctx = React.useContext(R3FContext);
  if (!ctx) {
    return {
      camera: new THREE.OrthographicCamera(),
      size: { width: 1280, height: 800 },
      clock: { getElapsedTime: () => 0 },
    };
  }
  return ctx.store;
}

function useFrame(callback) {
  const ctx = React.useContext(R3FContext);
  const cbRef = React.useRef(callback);
  cbRef.current = callback;

  React.useEffect(() => {
    if (!ctx) return;
    const entry = (state, delta) => cbRef.current(state, delta);
    ctx.subscribers.add(entry);
    return () => {
      ctx.subscribers.delete(entry);
    };
  }, [ctx]);
}

function transformPointLocalToWorld(localPt, matrixStack) {
  let x = localPt.x;
  let y = localPt.y;
  let z = localPt.z;

  for (let i = matrixStack.length - 1; i >= 0; i--) {
    const obj = matrixStack[i];
    x *= obj.scale.x;
    y *= obj.scale.y;
    z *= obj.scale.z;

    const rx = obj.rotation.x;
    if (rx !== 0) {
      const c = Math.cos(rx);
      const s = Math.sin(rx);
      const ny = y * c - z * s;
      const nz = y * s + z * c;
      y = ny;
      z = nz;
    }

    const ry = obj.rotation.y;
    if (ry !== 0) {
      const c = Math.cos(ry);
      const s = Math.sin(ry);
      const nx = x * c + z * s;
      const nz = -x * s + z * c;
      x = nx;
      z = nz;
    }

    const rz = obj.rotation.z;
    if (rz !== 0) {
      const c = Math.cos(rz);
      const s = Math.sin(rz);
      const nx = x * c - y * s;
      const ny = x * s + y * c;
      x = nx;
      y = ny;
    }

    x += obj.position.x;
    y += obj.position.y;
    z += obj.position.z;
  }

  return { x, y, z };
}

function transformNormalLocalToWorld(localNorm, matrixStack) {
  let x = localNorm.x;
  let y = localNorm.y;
  let z = localNorm.z;

  for (let i = matrixStack.length - 1; i >= 0; i--) {
    const obj = matrixStack[i];
    const rx = obj.rotation.x;
    if (rx !== 0) {
      const c = Math.cos(rx);
      const s = Math.sin(rx);
      const ny = y * c - z * s;
      const nz = y * s + z * c;
      y = ny;
      z = nz;
    }
    const ry = obj.rotation.y;
    if (ry !== 0) {
      const c = Math.cos(ry);
      const s = Math.sin(ry);
      const nx = x * c + z * s;
      const nz = -x * s + z * c;
      x = nx;
      z = nz;
    }
    const rz = obj.rotation.z;
    if (rz !== 0) {
      const c = Math.cos(rz);
      const s = Math.sin(rz);
      const nx = x * c - y * s;
      const ny = x * s + y * c;
      x = nx;
      y = ny;
    }
  }
  const len = Math.sqrt(x * x + y * y + z * z) || 1;
  return { x: x / len, y: y / len, z: z / len };
}

function buildCameraBasis(cam) {
  const eye = cam.position;
  const target = cam.target || new THREE.Vector3(0, 0, 0);
  const forward = new THREE.Vector3().subVectors(target, eye).normalize();
  const worldUp = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(forward, worldUp).normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();
  return { eye, target, forward, right, up };
}

function projectWorldToScreen(worldPt, cam, basis, width, height) {
  const dx = worldPt.x - basis.target.x;
  const dy = worldPt.y - basis.target.y;
  const dz = worldPt.z - basis.target.z;

  const camX = dx * basis.right.x + dy * basis.right.y + dz * basis.right.z;
  const camY = dx * basis.up.x + dy * basis.up.y + dz * basis.up.z;
  const camZ =
    (worldPt.x - basis.eye.x) * basis.forward.x +
    (worldPt.y - basis.eye.y) * basis.forward.y +
    (worldPt.z - basis.eye.z) * basis.forward.z;

  const worldHeight = 32 / Math.max(0.15, cam.zoom || 1);
  const pixelsPerUnit = height / worldHeight;

  const sx = width * 0.5 + camX * pixelsPerUnit;
  const sy = height * 0.5 - camY * pixelsPerUnit;

  return { sx, sy, depth: camZ, pixelsPerUnit };
}

// Geometry cache so procedural geometries are reused across frames instead of recreated
const geometryCache = new Map();

function createGeometryFromNode(type, args = []) {
  const key = `${type}:${args.join(',')}`;
  if (geometryCache.has(key)) {
    return geometryCache.get(key);
  }
  let geom;
  switch (type) {
    case 'boxGeometry':
      geom = new THREE.BoxGeometry(args[0], args[1], args[2]);
      geom.__isClosed = true;
      break;
    case 'cylinderGeometry':
      geom = new THREE.CylinderGeometry(args[0], args[1], args[2], args[3]);
      geom.__isClosed = true;
      break;
    case 'coneGeometry':
      geom = new THREE.ConeGeometry(args[0], args[1], args[2]);
      geom.__isClosed = true;
      break;
    case 'octahedronGeometry':
      geom = new THREE.OctahedronGeometry(args[0]);
      geom.__isClosed = true;
      break;
    case 'dodecahedronGeometry':
      geom = new THREE.DodecahedronGeometry(args[0]);
      geom.__isClosed = true;
      break;
    case 'icosahedronGeometry':
      geom = new THREE.IcosahedronGeometry(args[0]);
      geom.__isClosed = true;
      break;
    case 'torusGeometry':
      geom = new THREE.TorusGeometry(args[0], args[1], args[2], args[3]);
      geom.__isClosed = false;
      break;
    case 'ringGeometry':
      geom = new THREE.RingGeometry(args[0], args[1], args[2]);
      geom.__isClosed = false;
      break;
    case 'circleGeometry':
      geom = new THREE.CircleGeometry(args[0], args[1]);
      geom.__isClosed = false;
      break;
    default:
      geom = new THREE.BoxGeometry(1, 1, 1);
      geom.__isClosed = true;
      break;
  }
  geometryCache.set(key, geom);
  return geom;
}

function applyTransformProps(obj3d, props) {
  if (!props) return;
  if (props.name) obj3d.name = props.name;
  if (Array.isArray(props.position)) {
    obj3d.position.set(
      props.position[0] || 0,
      props.position[1] || 0,
      props.position[2] || 0
    );
  }
  if (Array.isArray(props.rotation)) {
    obj3d.rotation.set(
      props.rotation[0] || 0,
      props.rotation[1] || 0,
      props.rotation[2] || 0
    );
  }
  if (Array.isArray(props.scale)) {
    obj3d.scale.set(
      props.scale[0] ?? 1,
      props.scale[1] ?? 1,
      props.scale[2] ?? 1
    );
  } else if (typeof props.scale === 'number') {
    obj3d.scale.set(props.scale, props.scale, props.scale);
  }
  obj3d.__handlers = {
    onClick: props.onClick || null,
    onPointerOver: props.onPointerOver || null,
    onPointerOut: props.onPointerOut || null,
  };
}

function getRenderLayerForStack(stack) {
  for (let i = 0; i < stack.length; i++) {
    const name = (stack[i].name || '').toLowerCase();
    if (name.includes('vehicle')) return 5;
    if (name.includes('landmark-') || name.includes('sculpture-')) return 4;
    if (name.includes('hills') || name.includes('crystals')) return 3;
    if (name.includes('road')) return 2;
    if (name.includes('lagoon') || name.includes('pool')) return 1;
    if (name.includes('landscape')) return 0;
  }
  return 2;
}

function Canvas(props) {
  const wrapperRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const hoveredGroupRef = React.useRef(null);

  const engineRef = React.useRef(null);
  if (!engineRef.current) {
    const camInit = props.camera || {};
    const cam = new THREE.OrthographicCamera();
    if (Array.isArray(camInit.position)) {
      cam.position.set(
        camInit.position[0] || 35,
        camInit.position[1] || 31,
        camInit.position[2] || 35
      );
    }
    cam.zoom = camInit.zoom || 1.0;

    const startMs =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
    const clock = {
      getElapsedTime() {
        const now =
          typeof performance !== 'undefined' ? performance.now() : Date.now();
        return (now - startMs) / 1000;
      },
    };

    const subscribers = new Set();
    const sceneRoot = new THREE.Scene();

    engineRef.current = {
      subscribers,
      sceneRoot,
      store: {
        camera: cam,
        size: {
          width: typeof window !== 'undefined' ? window.innerWidth : 1280,
          height: typeof window !== 'undefined' ? window.innerHeight : 800,
        },
        clock,
        gl: {},
      },
    };
  }

  const engine = engineRef.current;

  React.useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    if (typeof props.onCreated === 'function') {
      props.onCreated(engine.store);
    }

    const updateSize = () => {
      const rect = canvas.parentElement
        ? canvas.parentElement.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight };
      const w = Math.max(300, rect.width || window.innerWidth);
      const h = Math.max(240, rect.height || window.innerHeight);
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      engine.store.size.width = w;
      engine.store.size.height = h;
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    let animId = 0;
    let lastMs = performance.now();

    const renderLoop = (nowMs) => {
      const dt = Math.min(0.08, Math.max(0.001, (nowMs - lastMs) / 1000));
      lastMs = nowMs;

      engine.subscribers.forEach((fn) => {
        try {
          fn(engine.store, dt);
        } catch {}
      });

      drawSceneToCanvas(canvas, engine);
      animId = window.requestAnimationFrame(renderLoop);
    };

    animId = window.requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.cancelAnimationFrame(animId);
    };
  }, [engine]);

  const handleCanvasClick = (e) => {
    if (!canvasRef.current || !engine.interactiveTargets) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let bestHit = null;
    let bestDist = Infinity;
    for (const item of engine.interactiveTargets) {
      const dx = mx - item.sx;
      const dy = my - item.sy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= item.hitRadius && dist < bestDist) {
        bestDist = dist;
        bestHit = item;
      }
    }
    if (bestHit && bestHit.onClick) {
      bestHit.onClick({ stopPropagation: () => {} });
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!canvasRef.current || !engine.interactiveTargets) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let bestHit = null;
    let bestDist = Infinity;
    for (const item of engine.interactiveTargets) {
      const dx = mx - item.sx;
      const dy = my - item.sy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= item.hitRadius && dist < bestDist) {
        bestDist = dist;
        bestHit = item;
      }
    }

    const prevHovered = hoveredGroupRef.current;
    if (bestHit !== prevHovered) {
      if (prevHovered && prevHovered.onPointerOut) {
        prevHovered.onPointerOut({ stopPropagation: () => {} });
      }
      if (bestHit && bestHit.onPointerOver) {
        bestHit.onPointerOver({ stopPropagation: () => {} });
      }
      hoveredGroupRef.current = bestHit;
    }
  };

  return React.createElement(
    R3FContext.Provider,
    { value: engine },
    React.createElement(
      'div',
      {
        ref: wrapperRef,
        style: {
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        },
      },
      React.createElement('canvas', {
        ref: canvasRef,
        'data-testid': 'r3f-webgl-canvas',
        onClick: handleCanvasClick,
        onMouseMove: handleCanvasMouseMove,
        style: {
          display: 'block',
          width: '100%',
          height: '100%',
        },
      }),
      React.createElement(
        'div',
        {
          className: 'r3f-html-overlay-layer',
          style: {
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 5,
          },
        },
        React.createElement(SceneGraphBridge, {
          engine,
          children: props.children,
        })
      )
    )
  );
}

function extractMeshSpecFromChildren(children) {
  let geometry = null;
  let material = {};
  const otherChildren = [];

  const flat = [];
  const push = (c) => {
    if (Array.isArray(c)) c.forEach(push);
    else if (c) flat.push(c);
  };
  push(children);

  flat.forEach((child) => {
    if (!child || typeof child !== 'object') return;
    if (typeof child.type === 'string') {
      const t = child.type;
      if (t.endsWith('Geometry')) {
        geometry = createGeometryFromNode(t, (child.props && child.props.args) || []);
      } else if (t.endsWith('Material')) {
        material = Object.assign({}, child.props || {});
      } else if (!t.endsWith('Light')) {
        otherChildren.push(child);
      }
    } else {
      otherChildren.push(child);
    }
  });

  return { geometry, material, otherChildren };
}

function R3FObjectNode(props) {
  const engine = React.useContext(R3FContext);
  const parentStack = React.useContext(GroupStackContext);

  const objRef = React.useRef(null);
  if (!objRef.current) {
    objRef.current =
      props.__tag === 'mesh' ? new THREE.Mesh() : new THREE.Group();
    applyTransformProps(objRef.current, props);
  }
  const obj = objRef.current;

  if (props.__ref) {
    if (typeof props.__ref === 'function') props.__ref(obj);
    else if (typeof props.__ref === 'object') props.__ref.current = obj;
  }

  const { geometry, material, otherChildren } = extractMeshSpecFromChildren(
    props.children
  );

  if (props.__tag === 'mesh') {
    obj.geometry = props.geometry || geometry || obj.geometry;
    obj.material = material || obj.material;
  }

  if (props.name) obj.name = props.name;
  if (Array.isArray(props.position)) {
    obj.position.set(
      props.position[0] || 0,
      props.position[1] || 0,
      props.position[2] || 0
    );
  }
  if (Array.isArray(props.rotation)) {
    obj.rotation.set(
      props.rotation[0] || 0,
      props.rotation[1] || 0,
      props.rotation[2] || 0
    );
  }
  if (Array.isArray(props.scale)) {
    obj.scale.set(
      props.scale[0] ?? 1,
      props.scale[1] ?? 1,
      props.scale[2] ?? 1
    );
  } else if (typeof props.scale === 'number') {
    obj.scale.set(props.scale, props.scale, props.scale);
  }

  obj.__handlers = {
    onClick: props.onClick || null,
    onPointerOver: props.onPointerOver || null,
    onPointerOut: props.onPointerOut || null,
  };

  const nextStack = parentStack.concat([obj]);
  const entryRef = React.useRef(null);
  if (!entryRef.current) {
    entryRef.current = {
      obj,
      tag: props.__tag,
      stack: nextStack,
      layer: getRenderLayerForStack(nextStack),
    };
  }
  entryRef.current.stack = nextStack;
  entryRef.current.layer = getRenderLayerForStack(nextStack);

  React.useEffect(() => {
    if (!engine) return;
    if (!engine.registeredObjects) {
      engine.registeredObjects = new Set();
    }
    const entry = entryRef.current;
    engine.registeredObjects.add(entry);
    return () => {
      engine.registeredObjects.delete(entry);
    };
  }, [engine, obj]);

  if (!otherChildren.length) return null;

  return React.createElement(
    GroupStackContext.Provider,
    { value: nextStack },
    ...otherChildren
  );
}

const origCreateElement = React.createElement;
const R3F_TAGS = new Set(['group', 'mesh']);
const R3F_LIGHT_TAGS = new Set([
  'ambientLight',
  'hemisphereLight',
  'directionalLight',
]);

React.createElement = function patchedCreateElement(type, props, ...children) {
  if (typeof type === 'string') {
    if (R3F_TAGS.has(type)) {
      const nextProps = Object.assign({}, props || {}, {
        __tag: type,
        __ref: props && props.ref ? props.ref : null,
      });
      return origCreateElement(R3FObjectNode, nextProps, ...children);
    }
    if (R3F_LIGHT_TAGS.has(type)) {
      return null;
    }
  }
  return origCreateElement(type, props, ...children);
};

function SceneGraphBridge({ children }) {
  return React.createElement(
    GroupStackContext.Provider,
    { value: [] },
    children
  );
}

function drawSceneToCanvas(canvas, engine) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = canvas.width / Math.max(1, engine.store.size.width);
  const width = engine.store.size.width;
  const height = engine.store.size.height;
  const cam = engine.store.camera;
  const basis = buildCameraBasis(cam);

  ctx.save();
  ctx.scale(dpr, dpr);

  // Soft pastel atmospheric sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#daf0fc');
  grad.addColorStop(0.55, '#e8eef9');
  grad.addColorStop(1, '#cde0f2');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const facesToDraw = [];
  const interactiveTargets = [];
  const lightDir = { x: 0.48, y: 0.76, z: 0.43 };

  const registered = engine.registeredObjects
    ? Array.from(engine.registeredObjects)
    : [];

  for (const item of registered) {
    const { obj, tag, stack, layer } = item;

    if (
      tag === 'group' &&
      obj.__handlers &&
      (obj.__handlers.onClick || obj.__handlers.onPointerOver)
    ) {
      const worldCenter = transformPointLocalToWorld(
        { x: 0, y: 1.6, z: 0 },
        stack
      );
      const proj = projectWorldToScreen(worldCenter, cam, basis, width, height);
      interactiveTargets.push({
        obj,
        sx: proj.sx,
        sy: proj.sy,
        hitRadius: Math.max(28, 2.3 * proj.pixelsPerUnit),
        onClick: obj.__handlers.onClick,
        onPointerOver: obj.__handlers.onPointerOver,
        onPointerOut: obj.__handlers.onPointerOut,
      });
    }

    if (tag !== 'mesh' || !obj.geometry || !obj.geometry.attributes.position) {
      continue;
    }

    const posAttr = obj.geometry.attributes.position.array;
    const normAttr = obj.geometry.attributes.normal
      ? obj.geometry.attributes.normal.array
      : null;
    const indices = obj.geometry.index;
    if (!indices || !indices.length) continue;

    const isClosedMesh = Boolean(obj.geometry.__isClosed);
    const mat = obj.material || {};
    const baseCol = new THREE.Color(mat.color || '#ffffff');
    const emiCol = new THREE.Color(mat.emissive || '#000000');
    const emiInt =
      typeof mat.emissiveIntensity === 'number' ? mat.emissiveIntensity : 0;
    const opacity =
      mat.transparent && typeof mat.opacity === 'number' ? mat.opacity : 1.0;

    const numVerts = posAttr.length / 3;
    const screenVerts = new Array(numVerts);

    for (let v = 0; v < numVerts; v++) {
      const lp = {
        x: posAttr[v * 3],
        y: posAttr[v * 3 + 1],
        z: posAttr[v * 3 + 2],
      };
      const wp = transformPointLocalToWorld(lp, stack);
      screenVerts[v] = projectWorldToScreen(wp, cam, basis, width, height);
    }

    for (let f = 0; f < indices.length; f += 3) {
      const i0 = indices[f];
      const i1 = indices[f + 1];
      const i2 = indices[f + 2];
      const sv0 = screenVerts[i0];
      const sv1 = screenVerts[i1];
      const sv2 = screenVerts[i2];
      if (!sv0 || !sv1 || !sv2) continue;

      let wn;
      if (normAttr) {
        wn = transformNormalLocalToWorld(
          {
            x: normAttr[i0 * 3],
            y: normAttr[i0 * 3 + 1],
            z: normAttr[i0 * 3 + 2],
          },
          stack
        );
      } else {
        wn = { x: 0, y: 1, z: 0 };
      }

      // Cull back-facing triangles on closed 3D meshes so bottom/rear faces never draw over top/front faces
      if (isClosedMesh) {
        const dotForward =
          wn.x * basis.forward.x +
          wn.y * basis.forward.y +
          wn.z * basis.forward.z;
        if (dotForward > 0.08) {
          continue;
        }
      }

      const ndotl = Math.max(
        0,
        wn.x * lightDir.x + wn.y * lightDir.y + wn.z * lightDir.z
      );
      const hemi = 0.72 + 0.14 * wn.y;
      const shade = hemi + ndotl * 0.28;

      const r = Math.min(
        255,
        Math.round((baseCol.r * shade + emiCol.r * emiInt * 0.55) * 255)
      );
      const g = Math.min(
        255,
        Math.round((baseCol.g * shade + emiCol.g * emiInt * 0.55) * 255)
      );
      const b = Math.min(
        255,
        Math.round((baseCol.b * shade + emiCol.b * emiInt * 0.55) * 255)
      );

      const avgDepth = (sv0.depth + sv1.depth + sv2.depth) / 3;

      facesToDraw.push({
        sv0,
        sv1,
        sv2,
        layer: layer ?? 2,
        fill:
          opacity < 0.99
            ? `rgba(${r},${g},${b},${opacity.toFixed(2)})`
            : `rgb(${r},${g},${b})`,
        stroke:
          layer >= 4
            ? `rgba(${Math.max(0, r - 22)},${Math.max(0, g - 22)},${Math.max(
                0,
                b - 22
              )},0.2)`
            : null,
        sortKey: avgDepth,
      });
    }
  }

  facesToDraw.sort((a, b) => {
    if (a.layer !== b.layer) return a.layer - b.layer;
    return b.sortKey - a.sortKey;
  });

  for (let i = 0; i < facesToDraw.length; i++) {
    const face = facesToDraw[i];
    ctx.beginPath();
    ctx.moveTo(face.sv0.sx, face.sv0.sy);
    ctx.lineTo(face.sv1.sx, face.sv1.sy);
    ctx.lineTo(face.sv2.sx, face.sv2.sy);
    ctx.closePath();
    ctx.fillStyle = face.fill;
    ctx.fill();
    if (face.stroke) {
      ctx.strokeStyle = face.stroke;
      ctx.lineWidth = 0.65;
      ctx.stroke();
    }
  }

  ctx.restore();

  engine.interactiveTargets = interactiveTargets;

  if (engine.htmlNodes) {
    engine.htmlNodes.forEach((entry) => {
      if (!entry.dom) return;
      const worldPt = transformPointLocalToWorld(
        entry.localPosition,
        entry.stack
      );
      const proj = projectWorldToScreen(worldPt, cam, basis, width, height);
      entry.dom.style.left = `${proj.sx.toFixed(1)}px`;
      entry.dom.style.top = `${proj.sy.toFixed(1)}px`;
    });
  }
}

module.exports = {
  Canvas,
  useFrame,
  useThree,
  R3FContext,
  GroupStackContext,
  transformPointLocalToWorld,
  buildCameraBasis,
  projectWorldToScreen,
};
