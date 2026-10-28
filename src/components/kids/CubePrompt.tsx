'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { hasWebGL } from '@/lib/kids/webgl';
import { CubeIsoFallback } from './CubeIsoFallback';

const DynamicCubeScene = dynamic(() => import('./CubeScene'), {
  ssr: false,
  loading: () => <div className="w-full max-w-[320px] aspect-square mx-auto flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400">Đang tải hình 3D...</div>,
});

export interface CubePromptProps {
  heights: number[][];
}

export function CubePrompt({ heights }: CubePromptProps) {
  const [canUseWebGL, setCanUseWebGL] = useState(false);
  const [checkedWebGL, setCheckedWebGL] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    setCanUseWebGL(hasWebGL());
    setCheckedWebGL(true);
  }, []);

  if (!checkedWebGL) {
    return <CubeIsoFallback heights={heights} />;
  }

  const use3D = canUseWebGL && !contextLost;

  return (
    <div className="flex flex-col items-center gap-2">
      {use3D ? (
        <div className="relative">
          <DynamicCubeScene heights={heights} onContextLost={() => setContextLost(true)} />
          <p className="mt-2 text-xs font-semibold text-slate-500 text-center">
            👆 Con có thể chạm hoặc kéo để xoay khối hình nhé!
          </p>
        </div>
      ) : (
        <CubeIsoFallback heights={heights} />
      )}
    </div>
  );
}

