'use client';

import React from 'react';

export function StarShape({ color }: { color: string }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.5, 0.35, 0.25]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 3]}>
        <boxGeometry args={[1.5, 0.35, 0.25]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 3]}>
        <boxGeometry args={[1.5, 0.35, 0.25]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
}

export function RocketShape({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 1.1, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <coneGeometry args={[0.35, 0.6, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[-0.45, -0.55, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.18, 0.45, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.45, -0.55, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.18, 0.45, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function SphereShape({ color }: { color: string }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.2, 0.08, 16, 64]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
      </mesh>
    </group>
  );
}

export function CupShape({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.6, 0.35, 0.8, 24]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.45, 0.5, 0.15, 24]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function MedalShape({ color }: { color: string }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.15, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <torusGeometry args={[0.2, 0.05, 12, 24]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
    </group>
  );
}

export function CrownShape({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.3, 24]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[-0.4, 0.2, 0]}>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <coneGeometry args={[0.25, 0.7, 16]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0.4, 0.2, 0]}>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function GemShape({ color }: { color: string }) {
  return (
    <mesh>
      <octahedronGeometry args={[0.85, 0]} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.2} />
    </mesh>
  );
}

export function ConeShape({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <coneGeometry args={[0.6, 1.2, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.08, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function ShieldShape({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.0, 1.1, 0.15]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.55, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.5, 0.5, 4]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function BladeShape({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.15, 1.3, 0.06]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 12]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}
