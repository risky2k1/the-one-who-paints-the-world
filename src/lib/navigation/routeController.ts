import * as THREE from 'three';
import { DESTINATIONS, getDestinationById } from '../../data/portfolio';
import {
  DestinationId,
  RouteSample,
  TravelPlan,
  Vector3Tuple,
} from '../../types/portfolio';

/**
 * Control points defining one continuous, scenic low-poly road across the miniature world.
 * Engineered in isometric space so that from the elevated (+35, +31, +35) overview camera,
 * the road forms a sweeping left-to-right S-curve and all six destinations
 * (Intro -> About -> Skills -> Projects -> Experience -> Contact) are well separated.
 */
export const ROAD_CONTROL_POINTS: Vector3Tuple[] = [
  { x: -11.5, y: 0.25, z: 15.5 },  // Pre-Intro tail (screen left)
  { x: -8.5,  y: 0.28, z: 11.0 },  // 01 Intro region (u = 0.05) - center-left foreground
  { x: -9.0,  y: 0.36, z: 3.5 },
  { x: -9.5,  y: 0.48, z: -4.0 },  // 02 About region (u = 0.23) - upper-left
  { x: -5.5,  y: 0.55, z: -8.5 },
  { x: 0.0,   y: 0.45, z: -6.0 },  // 03 Skills region (u = 0.41) - upper-center
  { x: 3.5,   y: 0.35, z: 1.5 },
  { x: 5.5,   y: 0.46, z: 7.0 },   // 04 Projects region (u = 0.59) - lower-center
  { x: 10.5,  y: 0.58, z: 4.0 },
  { x: 12.5,  y: 0.50, z: -3.0 },  // 05 Experience region (u = 0.77) - center-right
  { x: 16.0,  y: 0.36, z: -10.5 }, // 06 Contact region (u = 0.95) - upper-right
  { x: 18.5,  y: 0.30, z: -13.5 }, // Post-Contact tail
];

let cachedCurve: THREE.CatmullRomCurve3 | null = null;
let cachedLength = 0;

export function getRoadCurve(): THREE.CatmullRomCurve3 {
  if (!cachedCurve) {
    const pts = ROAD_CONTROL_POINTS.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    cachedCurve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
    cachedCurve.arcLengthDivisions = 400;
    cachedCurve.updateArcLengths();
    cachedLength = cachedCurve.getLength();
  }
  return cachedCurve;
}

export function getTotalRouteLength(): number {
  if (!cachedCurve) {
    getRoadCurve();
  }
  return cachedLength;
}

export function clampU(u: number): number {
  if (Number.isNaN(u)) return 0;
  return Math.max(0, Math.min(1, u));
}

/**
 * Samples the continuous road curve at arc-length normalized parameter u in [0, 1].
 */
export function sampleRouteAt(u: number): RouteSample {
  const curve = getRoadCurve();
  const safeU = clampU(u);
  const pos = curve.getPointAt(safeU);
  const tan = curve.getTangentAt(safeU).normalize();

  // Horizontal normal in XZ plane (perpendicular to tangent)
  const normalXZ = new THREE.Vector3(-tan.z, 0, tan.x);
  if (normalXZ.lengthSq() > 1e-6) {
    normalXZ.normalize();
  } else {
    normalXZ.set(1, 0, 0);
  }

  // Estimate signed horizontal curvature via small delta along u
  const eps = 0.006;
  const uPrev = clampU(safeU - eps);
  const uNext = clampU(safeU + eps);
  const tanPrev = curve.getTangentAt(uPrev);
  const tanNext = curve.getTangentAt(uNext);
  const anglePrev = Math.atan2(tanPrev.x, tanPrev.z);
  const angleNext = Math.atan2(tanNext.x, tanNext.z);
  let deltaAngle = angleNext - anglePrev;
  while (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
  while (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;
  const curvature = Math.max(-1, Math.min(1, deltaAngle / (eps * 45)));

  const headingRad = Math.atan2(tan.x, tan.z);

  return {
    u: safeU,
    position: { x: pos.x, y: pos.y, z: pos.z },
    tangent: { x: tan.x, y: tan.y, z: tan.z },
    normal: { x: normalXZ.x, y: normalXZ.y, z: normalXZ.z },
    curvature,
    headingRad,
  };
}

export function getRouteDistanceBetween(u1: number, u2: number): number {
  const total = getTotalRouteLength();
  return Math.abs(clampU(u2) - clampU(u1)) * total;
}

export interface LandmarkTransform {
  id: DestinationId;
  routeU: number;
  roadPosition: Vector3Tuple;
  sculpturePosition: Vector3Tuple;
  rotationY: number;
}

export function getLandmarkTransform(id: DestinationId): LandmarkTransform {
  const dest = getDestinationById(id);
  const sample = sampleRouteAt(dest.routeU);
  const sculptureX = sample.position.x + sample.normal.x * dest.lateralOffset;
  const sculptureZ = sample.position.z + sample.normal.z * dest.lateralOffset;
  const sculptureY = sample.position.y + 0.1;

  // Face the sculpture toward the road point
  const dx = sample.position.x - sculptureX;
  const dz = sample.position.z - sculptureZ;
  const rotationY = Math.atan2(dx, dz);

  return {
    id,
    routeU: dest.routeU,
    roadPosition: sample.position,
    sculpturePosition: { x: sculptureX, y: sculptureY, z: sculptureZ },
    rotationY,
  };
}

export function getAllLandmarkTransforms(): Record<DestinationId, LandmarkTransform> {
  const result = {} as Record<DestinationId, LandmarkTransform>;
  for (const dest of DESTINATIONS) {
    result[dest.id] = getLandmarkTransform(dest.id);
  }
  return result;
}

/**
 * Computes a TravelPlan from the vehicle's current physical route parameter u
 * to the target destination along the continuous road.
 */
export function computeTravelPlan(
  fromU: number,
  targetId: DestinationId,
  reducedMotion = false,
  startedAtMs = 0
): TravelPlan {
  const safeFromU = clampU(fromU);
  const dest = getDestinationById(targetId);
  const toU = clampU(dest.routeU);
  const arcDelta = toU - safeFromU;
  const absDelta = Math.abs(arcDelta);
  const distanceUnits = getRouteDistanceBetween(safeFromU, toU);
  const direction: 1 | -1 = arcDelta >= 0 ? 1 : -1;

  let durationSec: number;
  if (absDelta < 0.001) {
    durationSec = 0;
  } else if (reducedMotion) {
    durationSec = Math.max(0.28, Math.min(0.6, 0.25 + absDelta * 0.35));
  } else {
    const baseSec = 1.1 + Math.pow(absDelta, 0.72) * 2.55;
    durationSec = Math.max(1.15, Math.min(3.65, baseSec));
  }

  return {
    fromU: safeFromU,
    toU,
    targetId,
    distanceUnits,
    arcDelta,
    direction,
    durationSec,
    elapsedSec: 0,
    startedAtMs,
  };
}

export interface TravelKinematics {
  u: number;
  progress: number;
  normalizedSpeed: number;
  acceleration: number;
  isBraking: boolean;
  isSettling: boolean;
  arrived: boolean;
}

export function evaluateTravelKinematics(
  plan: TravelPlan,
  elapsedSec: number
): TravelKinematics {
  if (plan.durationSec <= 0.0001 || Math.abs(plan.arcDelta) < 0.0005) {
    return {
      u: plan.toU,
      progress: 1,
      normalizedSpeed: 0,
      acceleration: 0,
      isBraking: false,
      isSettling: false,
      arrived: true,
    };
  }

  const rawT = Math.max(0, Math.min(1, elapsedSec / plan.durationSec));
  const t2 = rawT * rawT;
  const t3 = t2 * rawT;
  const easedProgress = t3 * (rawT * (rawT * 6 - 15) + 10);

  const oneMinusT = 1 - rawT;
  const speedDerivative = 30 * t2 * (oneMinusT * oneMinusT);
  const normalizedSpeed = Math.min(1, speedDerivative / 1.875);

  const secondDeriv = 60 * rawT * oneMinusT * (1 - 2 * rawT);
  const acceleration = Math.max(-1, Math.min(1, secondDeriv / 14.5));

  const isBraking = rawT > 0.62 && rawT < 0.98;
  const isSettling = rawT >= 0.88 && rawT < 1.0;
  const arrived = rawT >= 1.0;

  const u = arrived ? plan.toU : clampU(plan.fromU + plan.arcDelta * easedProgress);

  return {
    u,
    progress: arrived ? 1 : easedProgress,
    normalizedSpeed: arrived ? 0 : normalizedSpeed,
    acceleration: arrived ? 0 : acceleration,
    isBraking,
    isSettling,
    arrived,
  };
}
