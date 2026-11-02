'use client';

import React from 'react';

export function ChestShape({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[1.1, 0.6, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 1.1, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.42]}>
        <boxGeometry args={[0.15, 0.15, 0.06]} />
        <meshStandardMaterial color="#facc15" metalness={0.6} />
      </mesh>
    </group>
  );
}

export function RingShape({ color }: { color: string }) {
  return (
    <mesh>
      <torusGeometry args={[0.65, 0.2, 16, 32]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
    </mesh>
  );
}

export function BoltShape({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0.1, 0.3, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.2, 0.8, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[-0.1, -0.3, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.2, 0.8, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function ArcShape({ color }: { color: string }) {
  return (
    <mesh>
      <torusGeometry args={[0.7, 0.25, 16, 32, Math.PI]} />
      <meshStandardMaterial color={color} roughness={0.3} />
    </mesh>
  );
}

export function FlameShape({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, -0.15, 0]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <coneGeometry args={[0.45, 0.8, 24]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function HeartShape({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[-0.3, 0.2, 0]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[0.3, 0.2, 0]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.65, 0.8, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function GlassesShape({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[-0.45, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 24]} />
        <meshStandardMaterial color={color} roughness={0.1} />
      </mesh>
      <mesh position={[0.45, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 24]} />
        <meshStandardMaterial color={color} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.08]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}

export function CapeShape({ color }: { color: string }) {
  return (
    <mesh rotation={[0.2, 0, 0]}>
      <boxGeometry args={[0.9, 1.2, 0.08]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  );
}

export function WandShape({ color }: { color: string }) {
  return (
    <group rotation={[0, 0, 0.4]}>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.2, 16]} />
        <meshStandardMaterial color="#78350f" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <octahedronGeometry args={[0.25]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.1} />
      </mesh>
    </group>
  );
}

export function FigureShape({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 0.8, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
    </group>
  );
}
