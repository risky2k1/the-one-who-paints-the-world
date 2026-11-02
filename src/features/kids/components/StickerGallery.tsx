'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { hasWebGL } from '@/shared/three';
import { stickerVisual, type StickerVisual } from '../lib/stickers';
import { useReducedMotion } from '@/shared/hooks';
import type { Reward } from '@/shared/api/kids';
import { StickerBadge } from './StickerBadge';

const DynamicStickerViewer = dynamic(() => import('../scene/StickerScene'), {
  ssr: false,
  loading: () => <div className="text-4xl animate-pulse">✨</div>,
});

interface StickerModalProps {
  visual: StickerVisual;
  canUseWebGL: boolean;
  reducedMotion: boolean;
  onClose: () => void;
}

function StickerModal({ visual, canUseWebGL, reducedMotion, onClose }: StickerModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <div
        className="neo-card bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-xl neo-btn bg-[#FAF7F2] text-black font-black text-lg flex items-center justify-center"
          aria-label="Đóng"
        >
          ✕
        </button>

        <h3 className="text-2xl font-black text-neutral-950 mb-2">
          {visual.label}
        </h3>

        <div className="w-64 h-64 mx-auto my-4 rounded-xl neo-box bg-[#FAF7F2] flex items-center justify-center overflow-hidden">
          {canUseWebGL ? (
            <DynamicStickerViewer
              shape={visual.shape}
              color={visual.color}
              autoRotate={!reducedMotion}
            />
          ) : (
            <div className="text-7xl select-none">{visual.emoji}</div>
          )}
        </div>

        <p className="text-sm font-bold text-neutral-700 mb-4">
          {canUseWebGL
            ? '👆 Con có thể chạm hoặc kéo để xoay sticker nhé!'
            : 'Sticker siêu đáng yêu của con!'}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="min-h-[56px] px-8 rounded-xl neo-btn bg-[#FFE600] text-black font-black text-base"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}

export function StickerGallery({ rewards }: { rewards: Reward[] }) {
  const [canUseWebGL, setCanUseWebGL] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setCanUseWebGL(hasWebGL());
  }, []);

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 neo-box bg-white p-6 rounded-2xl">
        {aggregated.map((item) => (
          <div
            key={item.key}
            className="flex flex-col items-center justify-center p-4 rounded-xl neo-card bg-[#FAF7F2] hover:bg-[#FFE600] transition-colors cursor-pointer"
            onClick={() => setSelectedKey(item.key)}
          >
            <StickerBadge stickerKey={item.key} count={item.count} size="lg" />
            <button
              type="button"
              className="mt-2 px-2.5 py-1 rounded-md neo-badge bg-white text-black text-xs font-black"
            >
              {canUseWebGL ? 'Xem 3D ➔' : 'Chi tiết ➔'}
            </button>
          </div>
        ))}
      </div>

      {selectedVisual && (
        <StickerModal
          visual={selectedVisual}
          canUseWebGL={canUseWebGL}
          reducedMotion={reducedMotion}
          onClose={() => setSelectedKey(null)}
        />
      )}
    </div>
  );
}
