'use client';

import { useReducedMotion } from '@/lib/kids/useReducedMotion';

export function Celebration({ message = 'Giỏi quá! 🎉' }: { message?: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      {!reducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <span className="animate-bounce text-2xl mx-2">⭐</span>
          <span className="animate-pulse text-2xl mx-4">✨</span>
          <span className="animate-bounce text-2xl mx-2" style={{ animationDelay: '0.15s' }}>
            🌟
          </span>
          <span className="animate-pulse text-2xl mx-4" style={{ animationDelay: '0.3s' }}>
            🎉
          </span>
        </div>
      )}
      <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-wide text-center">
        {message}
      </div>
    </div>
  );
}
