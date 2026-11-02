'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { StickerShape } from '../lib/stickers';
import {
  BladeShape,
  ConeShape,
  CrownShape,
  CupShape,
  GemShape,
  MedalShape,
  RocketShape,
  ShieldShape,
  SphereShape,
  StarShape,
} from './stickerShapesA';
import {
  ArcShape,
  BoltShape,
  CapeShape,
  ChestShape,
  FigureShape,
  FlameShape,
  GlassesShape,
  HeartShape,
  RingShape,
  WandShape,
} from './stickerShapesB';

export interface StickerModelProps {
  shape: StickerShape;
  color: string;
  autoRotate?: boolean;
}

const SHAPE_MAP: Record<StickerShape, React.ComponentType<{ color: string }>> = {
  star: StarShape,
  rocket: RocketShape,
  sphere: SphereShape,
  cup: CupShape,
  medal: MedalShape,
  crown: CrownShape,
  gem: GemShape,
  cone: ConeShape,
  shield: ShieldShape,
  blade: BladeShape,
  chest: ChestShape,
  ring: RingShape,
  bolt: BoltShape,
  arc: ArcShape,
  flame: FlameShape,
  heart: HeartShape,
  glasses: GlassesShape,
  cape: CapeShape,
  wand: WandShape,
  figure: FigureShape,
};

export function StickerModel({ shape, color, autoRotate = false }: StickerModelProps) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8;
    }
  });

  const Component = SHAPE_MAP[shape] ?? FigureShape;

  return (
    <group ref={groupRef}>
      <Component color={color} />
    </group>
  );
}
