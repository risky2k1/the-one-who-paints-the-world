'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { StickerShape } from '@/lib/kids/stickers';
import { StickerModel } from './StickerModel';

export default function StickerScene({
  shape,
  color,
  autoRotate = false,
}: {
  shape: StickerShape;
  color: string;
  autoRotate?: boolean;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <directionalLight position={[-5, -5, -5]} intensity={0.4} />
      <StickerModel shape={shape} color={color} autoRotate={autoRotate} />
      <OrbitControls enablePan={false} minDistance={2} maxDistance={6} />
    </Canvas>
  );
}

