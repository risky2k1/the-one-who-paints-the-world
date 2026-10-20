'use strict';

const MathUtils = {
  clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  },
  lerp(x, y, t) {
    return (1 - t) * x + t * y;
  },
  degToRad(deg) {
    return (deg * Math.PI) / 180;
  },
  radToDeg(rad) {
    return (rad * 180) / Math.PI;
  },
};

class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  clone() {
    return new Vector2(this.x, this.y);
  }
}

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }
  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }
  addVectors(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
  }
  multiplyScalar(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.lengthSq());
  }
  distanceTo(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  distanceToSquared(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }
  normalize() {
    const len = this.length();
    if (len > 1e-8) {
      this.x /= len;
      this.y /= len;
      this.z /= len;
    }
    return this;
  }
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  crossVectors(a, b) {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }
  lerp(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;
    return this;
  }
}

class Euler {
  constructor(x = 0, y = 0, z = 0, order = 'XYZ') {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  copy(e) {
    this.x = e.x;
    this.y = e.y;
    this.z = e.z;
    return this;
  }
}

class Color {
  constructor(hexOrStr = '#ffffff') {
    this.r = 1;
    this.g = 1;
    this.b = 1;
    this.set(hexOrStr);
  }
  set(val) {
    if (typeof val === 'string') {
      let s = val.trim();
      if (s.startsWith('#')) s = s.slice(1);
      if (s.length === 3) {
        s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
      }
      const num = parseInt(s, 16);
      if (!Number.isNaN(num)) {
        this.r = ((num >> 16) & 255) / 255;
        this.g = ((num >> 8) & 255) / 255;
        this.b = (num & 255) / 255;
      }
    } else if (typeof val === 'number') {
      this.r = ((val >> 16) & 255) / 255;
      this.g = ((val >> 8) & 255) / 255;
      this.b = (val & 255) / 255;
    } else if (val && typeof val === 'object' && 'r' in val) {
      this.r = val.r;
      this.g = val.g;
      this.b = val.b;
    }
    return this;
  }
  getStyle() {
    const r = Math.round(MathUtils.clamp(this.r, 0, 1) * 255);
    const g = Math.round(MathUtils.clamp(this.g, 0, 1) * 255);
    const b = Math.round(MathUtils.clamp(this.b, 0, 1) * 255);
    return `rgb(${r},${g},${b})`;
  }
}

/**
 * Centripetal / Uniform Catmull-Rom 1D cubic polynomial helper
 */
function interpolateCatmullRom(p0, p1, p2, p3, t) {
  const v0 = (p2 - p0) * 0.5;
  const v1 = (p3 - p1) * 0.5;
  const t2 = t * t;
  const t3 = t * t2;
  return (
    (2 * p1 - 2 * p2 + v0 + v1) * t3 +
    (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 +
    v0 * t +
    p1
  );
}

class CatmullRomCurve3 {
  constructor(
    points = [],
    closed = false,
    curveType = 'centripetal',
    tension = 0.5
  ) {
    this.points = points;
    this.closed = closed;
    this.curveType = curveType;
    this.tension = tension;
    this.arcLengthDivisions = 300;
    this.cacheArcLengths = null;
  }

  getPoint(t, optionalTarget = new Vector3()) {
    const pts = this.points;
    const l = pts.length;
    if (l === 0) return optionalTarget.set(0, 0, 0);
    if (l === 1) return optionalTarget.copy(pts[0]);

    const clampedT = MathUtils.clamp(t, 0, 1);
    const p = (l - 1) * clampedT;
    let intPoint = Math.floor(p);
    let weight = p - intPoint;

    if (weight === 0 && intPoint === l - 1) {
      intPoint = l - 2;
      weight = 1;
    }

    const p0 = pts[Math.max(0, intPoint - 1)];
    const p1 = pts[intPoint];
    const p2 = pts[Math.min(l - 1, intPoint + 1)];
    const p3 = pts[Math.min(l - 1, intPoint + 2)];

    optionalTarget.set(
      interpolateCatmullRom(p0.x, p1.x, p2.x, p3.x, weight),
      interpolateCatmullRom(p0.y, p1.y, p2.y, p3.y, weight),
      interpolateCatmullRom(p0.z, p1.z, p2.z, p3.z, weight)
    );
    return optionalTarget;
  }

  getLengths(divisions = this.arcLengthDivisions) {
    if (
      this.cacheArcLengths &&
      this.cacheArcLengths.length === divisions + 1
    ) {
      return this.cacheArcLengths;
    }
    const cache = [0];
    let current;
    let last = this.getPoint(0);
    let sum = 0;
    for (let p = 1; p <= divisions; p++) {
      current = this.getPoint(p / divisions);
      sum += current.distanceTo(last);
      cache.push(sum);
      last = current;
    }
    this.cacheArcLengths = cache;
    return cache;
  }

  updateArcLengths() {
    this.cacheArcLengths = null;
    this.getLengths();
  }

  getLength() {
    const lengths = this.getLengths();
    return lengths[lengths.length - 1] || 0;
  }

  getUtoTmapping(u, distance) {
    const arcLengths = this.getLengths();
    const il = arcLengths.length;
    const targetArcLength =
      distance !== undefined
        ? distance
        : MathUtils.clamp(u, 0, 1) * arcLengths[il - 1];

    let low = 0;
    let high = il - 1;
    let i = 0;

    while (low <= high) {
      i = Math.floor(low + (high - low) / 2);
      const comparison = arcLengths[i] - targetArcLength;
      if (comparison < 0) {
        low = i + 1;
      } else if (comparison > 0) {
        high = i - 1;
      } else {
        high = i;
        break;
      }
    }

    i = Math.max(0, high);
    if (arcLengths[i] === targetArcLength) {
      return i / (il - 1);
    }

    const lengthBefore = arcLengths[i];
    const lengthAfter = arcLengths[i + 1] ?? lengthBefore;
    const segmentLength = lengthAfter - lengthBefore;
    const segmentFraction =
      segmentLength > 1e-8 ? (targetArcLength - lengthBefore) / segmentLength : 0;
    return (i + segmentFraction) / (il - 1);
  }

  getPointAt(u, optionalTarget = new Vector3()) {
    const t = this.getUtoTmapping(u);
    return this.getPoint(t, optionalTarget);
  }

  getTangent(t, optionalTarget = new Vector3()) {
    const delta = 0.0005;
    const t1 = Math.max(0, t - delta);
    const t2 = Math.min(1, t + delta);
    const pt1 = this.getPoint(t1);
    const pt2 = this.getPoint(t2);
    return optionalTarget.subVectors(pt2, pt1).normalize();
  }

  getTangentAt(u, optionalTarget = new Vector3()) {
    const t = this.getUtoTmapping(u);
    return this.getTangent(t, optionalTarget);
  }
}

class Float32BufferAttribute {
  constructor(array, itemSize) {
    this.array =
      array instanceof Float32Array ? array : new Float32Array(array);
    this.itemSize = itemSize;
    this.count = this.array.length / itemSize;
  }
}

class BufferGeometry {
  constructor() {
    this.attributes = {};
    this.index = null;
    this.boundingSphere = null;
  }
  setAttribute(name, attribute) {
    this.attributes[name] = attribute;
    return this;
  }
  getAttribute(name) {
    return this.attributes[name];
  }
  setIndex(index) {
    this.index = Array.isArray(index) ? index : Array.from(index);
    return this;
  }
  computeBoundingSphere() {
    const pos = this.attributes.position;
    if (!pos) {
      this.boundingSphere = { center: new Vector3(), radius: 1 };
      return;
    }
    let maxR2 = 0;
    for (let i = 0; i < pos.array.length; i += 3) {
      const x = pos.array[i];
      const y = pos.array[i + 1];
      const z = pos.array[i + 2];
      const r2 = x * x + y * y + z * z;
      if (r2 > maxR2) maxR2 = r2;
    }
    this.boundingSphere = {
      center: new Vector3(0, 0, 0),
      radius: Math.sqrt(maxR2),
    };
  }
  dispose() {}
}

function buildBoxGeometry(width = 1, height = 1, depth = 1) {
  const geom = new BufferGeometry();
  const hw = width / 2;
  const hh = height / 2;
  const hd = depth / 2;
  const positions = [
    // Front (+Z)
    -hw, -hh,  hd,   hw, -hh,  hd,   hw,  hh,  hd,  -hw,  hh,  hd,
    // Back (-Z)
     hw, -hh, -hd,  -hw, -hh, -hd,  -hw,  hh, -hd,   hw,  hh, -hd,
    // Top (+Y)
    -hw,  hh,  hd,   hw,  hh,  hd,   hw,  hh, -hd,  -hw,  hh, -hd,
    // Bottom (-Y)
    -hw, -hh, -hd,   hw, -hh, -hd,   hw, -hh,  hd,  -hw, -hh,  hd,
    // Right (+X)
     hw, -hh,  hd,   hw, -hh, -hd,   hw,  hh, -hd,   hw,  hh,  hd,
    // Left (-X)
    -hw, -hh, -hd,  -hw, -hh,  hd,  -hw,  hh,  hd,  -hw,  hh, -hd,
  ];
  const normals = [
    0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
    0, 0,-1,  0, 0,-1,  0, 0,-1,  0, 0,-1,
    0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
    0,-1, 0,  0,-1, 0,  0,-1, 0,  0,-1, 0,
    1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
   -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
  ];
  const indices = [];
  for (let f = 0; f < 6; f++) {
    const b = f * 4;
    indices.push(b, b + 1, b + 2, b, b + 2, b + 3);
  }
  geom.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geom.setAttribute('normal', new Float32BufferAttribute(normals, 3));
  geom.setIndex(indices);
  geom.computeBoundingSphere();
  return geom;
}

function buildCylinderGeometry(
  radiusTop = 1,
  radiusBottom = 1,
  height = 1,
  radialSegments = 8
) {
  const geom = new BufferGeometry();
  const segs = Math.max(3, radialSegments);
  const hh = height / 2;
  const positions = [];
  const normals = [];
  const indices = [];

  for (let i = 0; i <= segs; i++) {
    const theta = (i / segs) * Math.PI * 2;
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    positions.push(c * radiusTop, hh, s * radiusTop);
    normals.push(c, 0.25, s);
    positions.push(c * radiusBottom, -hh, s * radiusBottom);
    normals.push(c, -0.25, s);
  }

  for (let i = 0; i < segs; i++) {
    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, b, c, b, d, c);
  }

  // Top cap
  if (radiusTop > 0.001) {
    const topCenterIdx = positions.length / 3;
    positions.push(0, hh, 0);
    normals.push(0, 1, 0);
    for (let i = 0; i < segs; i++) {
      const a = i * 2;
      const c = (i + 1) * 2;
      indices.push(topCenterIdx, c, a);
    }
  }

  geom.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geom.setAttribute('normal', new Float32BufferAttribute(normals, 3));
  geom.setIndex(indices);
  geom.computeBoundingSphere();
  return geom;
}

function buildOctahedronGeometry(radius = 1) {
  const geom = new BufferGeometry();
  const r = radius;
  const verts = [
    [0, r, 0],
    [0, -r, 0],
    [r, 0, 0],
    [-r, 0, 0],
    [0, 0, r],
    [0, 0, -r],
  ];
  const faces = [
    [0, 4, 2],
    [0, 2, 5],
    [0, 5, 3],
    [0, 3, 4],
    [1, 2, 4],
    [1, 5, 2],
    [1, 3, 5],
    [1, 4, 3],
  ];
  const positions = [];
  const normals = [];
  const indices = [];
  faces.forEach((f, idx) => {
    const v0 = new Vector3(...verts[f[0]]);
    const v1 = new Vector3(...verts[f[1]]);
    const v2 = new Vector3(...verts[f[2]]);
    const e1 = new Vector3().subVectors(v1, v0);
    const e2 = new Vector3().subVectors(v2, v0);
    const n = new Vector3().crossVectors(e1, e2).normalize();
    positions.push(v0.x, v0.y, v0.z, v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
    normals.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
    const b = idx * 3;
    indices.push(b, b + 1, b + 2);
  });
  geom.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geom.setAttribute('normal', new Float32BufferAttribute(normals, 3));
  geom.setIndex(indices);
  geom.computeBoundingSphere();
  return geom;
}

function buildRingOrCircleGeometry(innerR = 0, outerR = 1, segments = 16) {
  const geom = new BufferGeometry();
  const segs = Math.max(5, segments);
  const positions = [];
  const normals = [];
  const indices = [];
  for (let i = 0; i <= segs; i++) {
    const theta = (i / segs) * Math.PI * 2;
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    positions.push(c * innerR, s * innerR, 0);
    normals.push(0, 0, 1);
    positions.push(c * outerR, s * outerR, 0);
    normals.push(0, 0, 1);
  }
  for (let i = 0; i < segs; i++) {
    const b = i * 2;
    indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
  }
  geom.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geom.setAttribute('normal', new Float32BufferAttribute(normals, 3));
  geom.setIndex(indices);
  geom.computeBoundingSphere();
  return geom;
}

class BoxGeometry extends BufferGeometry {
  constructor(w = 1, h = 1, d = 1) {
    super();
    Object.assign(this, buildBoxGeometry(w, h, d));
  }
}

class CylinderGeometry extends BufferGeometry {
  constructor(rt = 1, rb = 1, h = 1, segs = 8) {
    super();
    Object.assign(this, buildCylinderGeometry(rt, rb, h, segs));
  }
}

class ConeGeometry extends BufferGeometry {
  constructor(r = 1, h = 1, segs = 8) {
    super();
    Object.assign(this, buildCylinderGeometry(0.01, r, h, segs));
  }
}

class OctahedronGeometry extends BufferGeometry {
  constructor(r = 1) {
    super();
    Object.assign(this, buildOctahedronGeometry(r));
  }
}

class DodecahedronGeometry extends BufferGeometry {
  constructor(r = 1) {
    super();
    Object.assign(this, buildOctahedronGeometry(r * 1.05));
  }
}

class IcosahedronGeometry extends BufferGeometry {
  constructor(r = 1) {
    super();
    Object.assign(this, buildOctahedronGeometry(r * 1.02));
  }
}

class TorusGeometry extends BufferGeometry {
  constructor(radius = 1, tube = 0.15, radialSegments = 6, tubularSegments = 16) {
    super();
    Object.assign(
      this,
      buildRingOrCircleGeometry(
        Math.max(0.05, radius - tube),
        radius + tube,
        tubularSegments
      )
    );
  }
}

class RingGeometry extends BufferGeometry {
  constructor(innerRadius = 0.5, outerRadius = 1, thetaSegments = 16) {
    super();
    Object.assign(
      this,
      buildRingOrCircleGeometry(innerRadius, outerRadius, thetaSegments)
    );
  }
}

class CircleGeometry extends BufferGeometry {
  constructor(radius = 1, segments = 16) {
    super();
    Object.assign(this, buildRingOrCircleGeometry(0, radius, segments));
  }
}

class Object3D {
  constructor() {
    this.position = new Vector3(0, 0, 0);
    this.rotation = new Euler(0, 0, 0);
    this.scale = new Vector3(1, 1, 1);
    this.children = [];
    this.parent = null;
    this.name = '';
  }
  add(child) {
    if (child && child !== this) {
      child.parent = this;
      this.children.push(child);
    }
    return this;
  }
  remove(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      child.parent = null;
      this.children.splice(idx, 1);
    }
    return this;
  }
}

class Group extends Object3D {}
class Scene extends Object3D {}
class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    this.geometry = geometry || new BufferGeometry();
    this.material = material || {};
  }
}

class OrthographicCamera extends Object3D {
  constructor(left = -20, right = 20, top = 20, bottom = -20, near = -100, far = 250) {
    super();
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
    this.zoom = 1.0;
    this.target = new Vector3(0, 0, 0);
  }
  lookAt(xOrVec, y, z) {
    if (xOrVec && typeof xOrVec === 'object') {
      this.target.copy(xOrVec);
    } else {
      this.target.set(xOrVec || 0, y || 0, z || 0);
    }
  }
  updateProjectionMatrix() {}
}

module.exports = {
  MathUtils,
  Vector2,
  Vector3,
  Euler,
  Color,
  CatmullRomCurve3,
  Float32BufferAttribute,
  BufferGeometry,
  BoxGeometry,
  CylinderGeometry,
  ConeGeometry,
  OctahedronGeometry,
  DodecahedronGeometry,
  IcosahedronGeometry,
  TorusGeometry,
  RingGeometry,
  CircleGeometry,
  Object3D,
  Group,
  Scene,
  Mesh,
  OrthographicCamera,
  buildBoxGeometry,
  buildCylinderGeometry,
  buildOctahedronGeometry,
  buildRingOrCircleGeometry,
};
