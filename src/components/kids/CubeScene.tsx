'use client';

import { useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Edges, OrbitControls } from '@react-three/drei';
import { cubePositions } from '@/lib/kids/cubes';

interface CubeSceneProps {
  heights: number[][];
  onContextLost?(): void;
}

const LAYER_COLORS = [
  '#93c5fd', // sky-300
  '#a7f3d0', // emerald-200
  '#fde047', // yellow-300
  '#f472b6', // pink-400
  '#c084fc', // purple-400
];

function ContextWatcher({ onContextLost }: { onContextLost?(): void }) {
  const { gl } = useThree();

  useEffect(() => {
    const handleLost = (e: Event) => {
      e.preventDefault();
      onContextLost?.();
    };

    const dom = gl.domElement;
    dom.addEventListener('webglcontextlost', handleLost);
    return () => dom.removeEventListener('webglcontextlost', handleLost);
  }, [gl, onContextLost]);

  return null;
}

function CubesGroup({ heights }: { heights: number[][] }) {
  const positions = useMemo(() => cubePositions(heights), [heights]);

  return (
    <group>
      {positions.map(([x, y, z], i) => {
        // layer k = Math.floor(y - 0.5)
        const layer = Math.max(0, Math.floor(y - 0.5));
        const color = LAYER_COLORS[layer % LAYER_COLORS.length];

        return (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            <Edges color="#334155" threshold={15} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function CubeScene({ heights, onContextLost }: CubeSceneProps) {
  return (
    <div className="w-full max-w-[320px] aspect-square mx-auto rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-inner">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [4.5, 5.5, 6], fov: 42 }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} />
        <directionalLight position={[-10, 10, -10]} intensity={0.4} />

        <CubesGroup heights={heights} />

        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={4}
          maxDistance={15}
        />

        <ContextWatcher onContextLost={onContextLost} />
      </Canvas>
    </div>
  );
}

