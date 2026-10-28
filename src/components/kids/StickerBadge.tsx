'use client';

import { stickerVisual } from '@/lib/kids/stickers';

interface StickerBadgeProps {
  stickerKey: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?(): void;
}

export function StickerBadge({
  stickerKey,
  count,
  size = 'md',
  showLabel = true,
  onClick,
}: StickerBadgeProps) {
  const visual = stickerVisual(stickerKey);

  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
  }[size];

  const badgeContent = (
    <div
      className={`relative inline-flex flex-col items-center gap-1.5 ${
        onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''
      }`}
      onClick={onClick}
    >
      <div
        className={`${sizeClasses} rounded-3xl flex items-center justify-center shadow-md border-2 border-white/80 select-none relative`}
        style={{ backgroundColor: `${visual.color}33` }}
      >
        <span role="img" aria-label={visual.label}>
          {visual.emoji}
        </span>

        {count !== undefined && count > 1 && (
          <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 bg-amber-500 text-white text-xs font-black rounded-full shadow-sm border border-white">
            ×{count}
          </span>
        )}
      </div>

      {showLabel && (
        <span className="text-xs sm:text-sm font-bold text-slate-700 text-center max-w-[100px] truncate">
          {visual.label}
        </span>
      )}
    </div>
  );

  return badgeContent;
}
