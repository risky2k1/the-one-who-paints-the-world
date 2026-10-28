'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { hasWebGL } from '@/lib/kids/webgl';
import { stickerVisual } from '@/lib/kids/stickers';
import { useReducedMotion } from '@/lib/kids/useReducedMotion';
import type { Reward } from '@/lib/kids/types';
import { StickerBadge } from './StickerBadge';

const DynamicStickerViewer = dynamic(() => import('./StickerScene'), {
  ssr: false,
  loading: () => <div className="text-4xl animate-pulse">✨</div>,
});

export function StickerGallery({ rewards }: { rewards: Reward[] }) {
  const [canUseWebGL, setCanUseWebGL] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setCanUseWebGL(hasWebGL());
  }, []);

  // Aggregate duplicate stickers and preserve earliest earned order
  const aggregated = useMemo(() => {
    const map = new Map<string, { key: string; count: number }>();
    for (const r of rewards) {
      const existing = map.get(r.sticker_key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(r.sticker_key, { key: r.sticker_key, count: 1 });
      }
    }
    return Array.from(map.values());
  }, [rewards]);

  const selectedVisual = selectedKey ? stickerVisual(selectedKey) : null;

  return (
    <div className="w-full">
      {/* Shelf grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 bg-white/70 backdrop-blur-sm p-6 rounded-3xl border-2 border-amber-200/70 shadow-lg">
        {aggregated.map((item) => (
          <div
            key={item.key}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white hover:bg-amber-50/50 shadow-sm border border-amber-100 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedKey(item.key)}
          >
            <StickerBadge stickerKey={item.key} count={item.count} size="lg" />
            <button
              type="button"
              className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              {canUseWebGL ? 'Xem 3D ➔' : 'Chi tiết ➔'}
            </button>
          </div>
        ))}
      </div>

      {/* Modal / Inspector for selected sticker */}
      {selectedKey && selectedVisual && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedKey(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border-4 border-amber-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedKey(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-lg flex items-center justify-center"
              aria-label="Đóng"
            >
              ✕
            </button>

            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">
              {selectedVisual.label}
            </h3>

            <div className="w-64 h-64 mx-auto my-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
              {canUseWebGL ? (
                <DynamicStickerViewer
                  shape={selectedVisual.shape}
                  color={selectedVisual.color}
                  autoRotate={!reducedMotion}
                />
              ) : (
                <div className="text-7xl select-none">{selectedVisual.emoji}</div>
              )}
            </div>

            <p className="text-sm font-semibold text-slate-500 mb-4">
              {canUseWebGL
                ? '👆 Con có thể chạm hoặc kéo để xoay sticker nhé!'
                : 'Sticker siêu đáng yêu của con!'}
            </p>

            <button
              type="button"
              onClick={() => setSelectedKey(null)}
              className="min-h-[48px] px-8 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-base shadow-md active:scale-95 transition-all"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
