'use client';

import { stickerVisual } from '../lib/stickers';

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

  return (
    <div
      className={`relative inline-flex flex-col items-center gap-1.5 ${
        onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''
      }`}
      onClick={onClick}
    >
      <div
        className={`${sizeClasses} rounded-2xl neo-box flex items-center justify-center select-none relative`}
        style={{ backgroundColor: visual.color || '#FFE600' }}
      >
        <span role="img" aria-label={visual.label}>
          {visual.emoji}
        </span>

        {count !== undefined && count > 1 && (
          <span className="absolute -top-2 -right-2 px-1.5 py-0.2 neo-badge bg-black text-white text-xs font-black rounded-md">
            ×{count}
          </span>
        )}
      </div>

      {showLabel && (
        <span className="text-xs sm:text-sm font-black text-neutral-950 text-center max-w-[100px] truncate">
          {visual.label}
        </span>
      )}
    </div>
  );
}
