'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { StickerShape } from '@/lib/kids/stickers';

export interface StickerModelProps {
  shape: StickerShape;
  color: string;
  autoRotate?: boolean;
}

export function StickerModel({ shape, color, autoRotate = false }: StickerModelProps) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8;
    }
  });

  const renderShape = () => {
    switch (shape) {
      case 'star':
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

      case 'rocket':
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

      case 'sphere':
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

      case 'cup':
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

      case 'medal':
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

      case 'crown':
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

      case 'gem':
        return (
          <mesh>
            <octahedronGeometry args={[0.85, 0]} />
            <meshStandardMaterial color={color} roughness={0.1} metalness={0.2} />
          </mesh>
        );

      case 'cone':
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

      case 'shield':
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

      case 'blade':
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

      case 'chest':
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

      case 'ring':
        return (
          <mesh>
            <torusGeometry args={[0.65, 0.2, 16, 32]} />
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
          </mesh>
        );

      case 'bolt':
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

      case 'arc':
        return (
          <mesh>
            <torusGeometry args={[0.7, 0.25, 16, 32, Math.PI]} />
            <meshStandardMaterial color={color} roughness={0.3} />
          </mesh>
        );

      case 'flame':
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

      case 'heart':
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

      case 'glasses':
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

      case 'cape':
        return (
          <mesh rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.9, 1.2, 0.08]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
        );

      case 'wand':
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

      case 'figure':
      default:
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
  };

  return <group ref={groupRef}>{renderShape()}</group>;
}

