'use client';

import { useMemo } from 'react';
import { isoFaces, type IsoFace } from '../lib/cubes';

interface CubeIsoFallbackProps {
  heights: number[][];
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function updateBounds(pair: string, b: Bounds) {
  const [xStr, yStr] = pair.split(',');
  const x = Number(xStr);
  const y = Number(yStr);
  if (isNaN(x) || isNaN(y)) return;
  if (x < b.minX) b.minX = x;
  if (x > b.maxX) b.maxX = x;
  if (y < b.minY) b.minY = y;
  if (y > b.maxY) b.maxY = y;
}

function computeViewBox(faces: IsoFace[]) {
  if (faces.length === 0) {
    return { viewBox: '0 0 100 100', valid: false };
  }

  const b: Bounds = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  for (const face of faces) {
    const coords = face.points.split(' ');
    for (const pair of coords) {
      updateBounds(pair, b);
    }
  }

  const pad = 24;
  const width = Math.max(10, b.maxX - b.minX + pad * 2);
  const height = Math.max(10, b.maxY - b.minY + pad * 2);
  const x0 = b.minX - pad;
  const y0 = b.minY - pad;

  return { viewBox: `${x0} ${y0} ${width} ${height}`, valid: true };
}

const FILL_COLORS: Record<'top' | 'left' | 'right', string> = {
  top: '#FFE600',
  left: '#A6FAFF',
  right: '#FF90E8',
};

export function CubeIsoFallback({ heights }: CubeIsoFallbackProps) {
  const faces = useMemo(() => isoFaces(heights), [heights]);
  const { viewBox, valid } = useMemo(() => computeViewBox(faces), [faces]);

  if (!valid) {
    return (
      <div className="flex items-center justify-center h-48 neo-box bg-[#FAF7F2] rounded-2xl text-neutral-600 font-bold">
        Không có khối lập phương
      </div>
    );
  }

  return (
    <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto aspect-square flex items-center justify-center p-2">
      <svg
        viewBox={viewBox}
        className="w-full h-full select-none"
        aria-label="Hình vẽ các khối lập phương"
      >
        {faces.map((f, i) => (
          <polygon
            key={i}
            points={f.points}
            fill={FILL_COLORS[f.face]}
            stroke="#000000"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </div>
  );
}
