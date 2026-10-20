import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export interface LandscapeProps {
  isActiveMotion: boolean;
  reducedMotion: boolean;
  crystalCount: number;
}

interface HillSpec {
  id: string;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  rotationY: number;
  sides: number;
}

interface CrystalSpec {
  id: string;
  position: [number, number, number];
  scale: number;
  color: string;
  emissive: string;
  speed: number;
  phase: number;
}

/**
 * Minimal Geometric Landscape with Pastel & Dreamy art direction.
 * Features stepped pastel plateaus, low-poly perimeter hills, a tranquil reflective basin,
 * and sparse geometric crystals that calm down when the user is reading content.
 */
export const Landscape: React.FC<LandscapeProps> = ({
  isActiveMotion,
  reducedMotion,
  crystalCount,
}) => {
  const crystalsGroupRef = useRef<THREE.Group>(null);

  const hills: HillSpec[] = useMemo(
    () => [
      { id: 'h1', position: [-24, 1.8, -14], scale: [6.8, 3.8, 6.2], color: '#c4ddf2', rotationY: 0.4, sides: 6 },
      { id: 'h2', position: [-14, 2.3, -20], scale: [7.8, 4.6, 6.8], color: '#d0caf0', rotationY: 1.1, sides: 7 },
      { id: 'h3', position: [6, 2.0, -20], scale: [7.2, 4.2, 6.5], color: '#bae0e4', rotationY: 2.0, sides: 6 },
      { id: 'h4', position: [24, 1.8, -4], scale: [6.5, 3.6, 6.0], color: '#d2cef2', rotationY: 0.8, sides: 5 },
      { id: 'h5', position: [21, 2.1, 15], scale: [7.4, 4.2, 6.5], color: '#c0dcf0', rotationY: 1.7, sides: 6 },
      { id: 'h6', position: [-4, 1.6, 19], scale: [7.8, 3.4, 6.0], color: '#c8e4e8', rotationY: 0.3, sides: 7 },
    ],
    []
  );

  const crystals: CrystalSpec[] = useMemo(() => {
    const base: CrystalSpec[] = [
      { id: 'c1', position: [-18, 1.4, -4], scale: 0.82, color: '#a8d8ea', emissive: '#5ec2b7', speed: 1.1, phase: 0.2 },
      { id: 'c2', position: [-11, 1.6, -14], scale: 0.98, color: '#c3bef0', emissive: '#9b8ce8', speed: 0.9, phase: 1.4 },
      { id: 'c3', position: [-2, 1.2, 11], scale: 0.76, color: '#bceee3', emissive: '#5ec2b7', speed: 1.3, phase: 2.1 },
      { id: 'c4', position: [8, 1.5, -13], scale: 0.9, color: '#b5deff', emissive: '#6ab7e8', speed: 1.0, phase: 3.0 },
      { id: 'c5', position: [17, 1.6, 10], scale: 1.02, color: '#f9c6bd', emissive: '#f29b8e', speed: 0.85, phase: 4.2 },
      { id: 'c6', position: [22, 1.3, -15], scale: 0.8, color: '#dec9ff', emissive: '#b392f0', speed: 1.15, phase: 5.1 },
      { id: 'c7', position: [-14, 1.1, 15], scale: 0.72, color: '#a8d8ea', emissive: '#67ccb8', speed: 1.05, phase: 0.9 },
      { id: 'c8', position: [2, 1.3, -15], scale: 0.74, color: '#d4cef2', emissive: '#9b8ce8', speed: 0.95, phase: 2.7 },
    ];
    return base.slice(0, Math.max(4, Math.min(base.length, crystalCount)));
  }, [crystalCount]);

  useFrame((state) => {
    if (!crystalsGroupRef.current || reducedMotion) return;
    const t = state.clock.getElapsedTime();
    const amplitude = isActiveMotion ? 0.18 : 0.03;
    const rotRate = isActiveMotion ? 0.35 : 0.06;

    crystalsGroupRef.current.children.forEach((child, idx) => {
      const spec = crystals[idx];
      if (!spec) return;
      child.position.y =
        spec.position[1] + Math.sin(t * spec.speed + spec.phase) * amplitude;
      child.rotation.y = t * rotRate + spec.phase;
    });
  });

  return (
    <group name="minimal-geometric-landscape">
      {/* Main upper pastel diorama plateau */}
      <mesh position={[0, -0.55, 0]} receiveShadow>
        <boxGeometry args={[48, 1.0, 38]} />
        <meshStandardMaterial
          color="#e4eff8"
          roughness={0.88}
          metalness={0.05}
        />
      </mesh>

      {/* Secondary lower architectural terrace rim */}
      <mesh position={[0, -1.35, 0]}>
        <boxGeometry args={[52, 0.8, 42]} />
        <meshStandardMaterial
          color="#cedff0"
          roughness={0.9}
          metalness={0.06}
        />
      </mesh>

      {/* Tranquil reflective pastel lagoons */}
      <group name="reflective-lagoon-pools">
        <mesh position={[-3.2, 0.03, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4.4, 8]} />
          <meshStandardMaterial
            color="#b4e2ec"
            emissive="#7fd1c8"
            emissiveIntensity={0.16}
            roughness={0.25}
            metalness={0.25}
          />
        </mesh>

        <mesh position={[8.5, 0.03, -2.5]} rotation={[-Math.PI / 2, 0, 0.4]}>
          <circleGeometry args={[3.2, 7]} />
          <meshStandardMaterial
            color="#c3def6"
            emissive="#8bc4f2"
            emissiveIntensity={0.14}
            roughness={0.28}
            metalness={0.2}
          />
        </mesh>
      </group>

      {/* Low-poly sculpted perimeter hills */}
      <group name="perimeter-hills">
        {hills.map((h) => (
          <mesh
            key={h.id}
            position={h.position}
            rotation={[0, h.rotationY, 0]}
            scale={h.scale}
          >
            <coneGeometry args={[1, 1, h.sides]} />
            <meshStandardMaterial
              color={h.color}
              roughness={0.85}
              metalness={0.06}
              flatShading
            />
          </mesh>
        ))}
      </group>

      {/* Sparse floating geometric crystals */}
      <group ref={crystalsGroupRef} name="ambient-crystals">
        {crystals.map((c) => (
          <mesh key={c.id} position={c.position} scale={c.scale}>
            <octahedronGeometry args={[0.85, 0]} />
            <meshStandardMaterial
              color={c.color}
              emissive={c.emissive}
              emissiveIntensity={isActiveMotion ? 0.32 : 0.14}
              roughness={0.3}
              metalness={0.2}
              flatShading
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
