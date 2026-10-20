import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  getTotalRouteLength,
  sampleRouteAt,
} from '../../lib/navigation/routeController';
import { NavigationState } from '../../types/portfolio';

export interface VehicleProps {
  navState: NavigationState;
}

/**
 * The signature coral/peach low-poly studio coupe.
 * Follows the continuous CatmullRomCurve3 road at navState.currentU with:
 * - Real distance-based wheel rotation
 * - Curvature-driven front-wheel steering
 * - Subtle body roll/lean on bends and pitch on acceleration/braking
 * - Warm headlights and deceleration brake-light response
 * - Gentle parked idle breathing
 */
export const Vehicle: React.FC<VehicleProps> = ({ navState }) => {
  const rootRef = useRef<THREE.Group>(null);
  const chassisRef = useRef<THREE.Group>(null);
  const flWheelSteerRef = useRef<THREE.Group>(null);
  const frWheelSteerRef = useRef<THREE.Group>(null);
  const flWheelSpinRef = useRef<THREE.Mesh>(null);
  const frWheelSpinRef = useRef<THREE.Mesh>(null);
  const rlWheelSpinRef = useRef<THREE.Mesh>(null);
  const rrWheelSpinRef = useRef<THREE.Mesh>(null);

  const prevURef = useRef<number>(navState.currentU);
  const wheelSpinAngleRef = useRef<number>(0);
  const currentHeadingRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number>(0);
  const wasTravellingRef = useRef<boolean>(false);

  const isBraking =
    navState.isTravelling &&
    navState.journeyProgress > 0.62 &&
    navState.journeyProgress < 0.99;

  useFrame((state, delta) => {
    if (!rootRef.current || !chassisRef.current) return;
    const dt = Math.min(0.1, Math.max(0.001, delta));
    const t = state.clock.getElapsedTime();

    const sample = sampleRouteAt(navState.currentU);
    rootRef.current.position.set(
      sample.position.x,
      sample.position.y + 0.08,
      sample.position.z
    );

    const totalLen = getTotalRouteLength();
    const deltaU = navState.currentU - prevURef.current;
    prevURef.current = navState.currentU;
    const signedDistance = deltaU * totalLen;

    const desiredHeading =
      navState.direction === -1
        ? sample.headingRad + Math.PI
        : sample.headingRad;

    if (currentHeadingRef.current === null || navState.reducedMotion) {
      currentHeadingRef.current = desiredHeading;
    } else {
      let diff = desiredHeading - currentHeadingRef.current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      currentHeadingRef.current += diff * Math.min(1, dt * 12);
    }
    rootRef.current.rotation.y = currentHeadingRef.current;

    if (wasTravellingRef.current && !navState.isTravelling) {
      settleTimerRef.current = 0.55;
    }
    wasTravellingRef.current = navState.isTravelling;
    if (settleTimerRef.current > 0) {
      settleTimerRef.current = Math.max(0, settleTimerRef.current - dt);
    }

    const wheelRadius = 0.28;
    const forwardDistance = Math.abs(signedDistance);
    wheelSpinAngleRef.current += forwardDistance / wheelRadius;

    const spinMeshes = [
      flWheelSpinRef.current,
      frWheelSpinRef.current,
      rlWheelSpinRef.current,
      rrWheelSpinRef.current,
    ];
    spinMeshes.forEach((mesh) => {
      if (mesh) {
        mesh.rotation.x = wheelSpinAngleRef.current;
      }
    });

    const steerAngle = navState.isTravelling
      ? THREE.MathUtils.clamp(
          sample.curvature * navState.direction * 0.55,
          -0.42,
          0.42
        )
      : 0;
    if (flWheelSteerRef.current) {
      flWheelSteerRef.current.rotation.y = steerAngle;
    }
    if (frWheelSteerRef.current) {
      frWheelSteerRef.current.rotation.y = steerAngle;
    }

    if (navState.reducedMotion) {
      chassisRef.current.position.y = 0.36;
      chassisRef.current.rotation.x = 0;
      chassisRef.current.rotation.z = 0;
    } else if (navState.isTravelling) {
      const speedFactor = Math.min(1, Math.abs(navState.velocityU) * 3.2);
      const targetRoll = -steerAngle * speedFactor * 0.16;
      const targetPitch = isBraking
        ? 0.045 * speedFactor
        : -0.035 * speedFactor;
      const roadHum = Math.sin(t * 18) * 0.012 * speedFactor;

      chassisRef.current.position.y = 0.36 + roadHum;
      chassisRef.current.rotation.z = THREE.MathUtils.lerp(
        chassisRef.current.rotation.z,
        targetRoll,
        Math.min(1, dt * 10)
      );
      chassisRef.current.rotation.x = THREE.MathUtils.lerp(
        chassisRef.current.rotation.x,
        targetPitch,
        Math.min(1, dt * 10)
      );
    } else {
      const settleWave =
        settleTimerRef.current > 0
          ? Math.sin(settleTimerRef.current * 18) *
            0.035 *
            settleTimerRef.current
          : 0;
      const idleBreath = Math.sin(t * 2.2) * 0.012;
      chassisRef.current.position.y = 0.36 + idleBreath;
      chassisRef.current.rotation.x = settleWave;
      chassisRef.current.rotation.z = THREE.MathUtils.lerp(
        chassisRef.current.rotation.z,
        0,
        Math.min(1, dt * 8)
      );
    }
  });

  return (
    <group
      ref={rootRef}
      name="signature-coral-vehicle"
      scale={[1.38, 1.38, 1.38]}
    >
      {/* Soft luminous ground halo beneath vehicle for instant readability */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.35, 16]} />
        <meshBasicMaterial color="#ffb3a7" transparent opacity={0.45} />
      </mesh>

      {/* Suspended vehicle body */}
      <group ref={chassisRef} position={[0, 0.36, 0]}>
        {/* Lower coral/peach body hull */}
        <mesh position={[0, 0.14, 0]} castShadow>
          <boxGeometry args={[1.24, 0.42, 2.36]} />
          <meshStandardMaterial
            color="#ff7f6e"
            emissive="#ff6b57"
            emissiveIntensity={0.18}
            roughness={0.32}
            metalness={0.08}
          />
        </mesh>

        {/* Sculpted hood & rear deck accent */}
        <mesh position={[0, 0.3, 0.05]} castShadow>
          <boxGeometry args={[1.12, 0.18, 2.1]} />
          <meshStandardMaterial
            color="#ff988a"
            emissive="#ff7f6e"
            emissiveIntensity={0.12}
            roughness={0.3}
            metalness={0.06}
          />
        </mesh>

        {/* Pale blue panoramic cabin greenhouse */}
        <mesh position={[0, 0.54, -0.08]} castShadow>
          <boxGeometry args={[0.98, 0.36, 1.22]} />
          <meshStandardMaterial
            color="#bce3ff"
            emissive="#8bc9ff"
            emissiveIntensity={0.28}
            roughness={0.18}
            metalness={0.25}
          />
        </mesh>

        {/* Coral roof cap */}
        <mesh position={[0, 0.74, -0.08]} castShadow>
          <boxGeometry args={[0.92, 0.07, 1.1]} />
          <meshStandardMaterial color="#ff8b7b" roughness={0.3} />
        </mesh>

        {/* Warm white headlights (+Z is forward) */}
        <mesh position={[-0.4, 0.18, 1.19]}>
          <boxGeometry args={[0.24, 0.12, 0.06]} />
          <meshStandardMaterial
            color="#fff9e6"
            emissive="#ffe9a8"
            emissiveIntensity={0.95}
          />
        </mesh>
        <mesh position={[0.4, 0.18, 1.19]}>
          <boxGeometry args={[0.24, 0.12, 0.06]} />
          <meshStandardMaterial
            color="#fff9e6"
            emissive="#ffe9a8"
            emissiveIntensity={0.95}
          />
        </mesh>

        {/* Tail / Brake lights (-Z is rear) */}
        <mesh position={[-0.4, 0.18, -1.19]}>
          <boxGeometry args={[0.26, 0.11, 0.06]} />
          <meshStandardMaterial
            color={isBraking ? '#ff2a4b' : '#e05368'}
            emissive="#ff1e42"
            emissiveIntensity={isBraking ? 1.25 : 0.35}
          />
        </mesh>
        <mesh position={[0.4, 0.18, -1.19]}>
          <boxGeometry args={[0.26, 0.11, 0.06]} />
          <meshStandardMaterial
            color={isBraking ? '#ff2a4b' : '#e05368'}
            emissive="#ff1e42"
            emissiveIntensity={isBraking ? 1.25 : 0.35}
          />
        </mesh>
      </group>

      {/* Four dark low-poly wheels */}
      <group
        ref={flWheelSteerRef}
        position={[-0.62, 0.26, 0.72]}
        name="wheel-fl"
      >
        <mesh ref={flWheelSpinRef} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.24, 12]} />
          <meshStandardMaterial color="#242d3f" roughness={0.75} />
        </mesh>
      </group>

      <group
        ref={frWheelSteerRef}
        position={[0.62, 0.26, 0.72]}
        name="wheel-fr"
      >
        <mesh ref={frWheelSpinRef} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.24, 12]} />
          <meshStandardMaterial color="#242d3f" roughness={0.75} />
        </mesh>
      </group>

      <group position={[-0.62, 0.26, -0.72]} name="wheel-rl">
        <mesh ref={rlWheelSpinRef} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.24, 12]} />
          <meshStandardMaterial color="#242d3f" roughness={0.75} />
        </mesh>
      </group>

      <group position={[0.62, 0.26, -0.72]} name="wheel-rr">
        <mesh ref={rrWheelSpinRef} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.24, 12]} />
          <meshStandardMaterial color="#242d3f" roughness={0.75} />
        </mesh>
      </group>
    </group>
  );
};
