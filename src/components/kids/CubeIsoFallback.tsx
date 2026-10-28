'use client';

import { useMemo } from 'react';
import { isoFaces } from '@/lib/kids/cubes';

interface CubeIsoFallbackProps {
  heights: number[][];
}

export function CubeIsoFallback({ heights }: CubeIsoFallbackProps) {
  const faces = useMemo(() => isoFaces(heights), [heights]);

  const { viewBox, valid } = useMemo(() => {
    if (faces.length === 0) {
      return { viewBox: '0 0 100 100', valid: false };
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const face of faces) {
      const coords = face.points.split(' ');
      for (const pair of coords) {
        const [xStr, yStr] = pair.split(',');
        const x = Number(xStr);
        const y = Number(yStr);
        if (!isNaN(x) && !isNaN(y)) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const pad = 24;
    const width = Math.max(10, maxX - minX + pad * 2);
    const height = Math.max(10, maxY - minY + pad * 2);
    const x0 = minX - pad;
    const y0 = minY - pad;

    return { viewBox: `${x0} ${y0} ${width} ${height}`, valid: true };
  }, [faces]);

  if (!valid) {
    return (
      <div className="flex items-center justify-center h-48 bg-slate-50 rounded-2xl text-slate-400">
        Không có khối lập phương
      </div>
    );
  }

  const fillColors: Record<'top' | 'left' | 'right', string> = {
    top: '#a5b4fc', // indigo-300
    left: '#6366f1', // indigo-500
    right: '#4338ca', // indigo-700
  };

  return (
    <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto aspect-square flex items-center justify-center p-2">
      <svg
        viewBox={viewBox}
        className="w-full h-full drop-shadow-md select-none"
        aria-label="Hình vẽ các khối lập phương"
      >
        {faces.map((f, i) => (
          <polygon
            key={i}
            points={f.points}
            fill={fillColors[f.face]}
            stroke="#1e1b4b"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </div>
  );
}

