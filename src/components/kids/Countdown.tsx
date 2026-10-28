'use client';

import { useEffect, useRef, useState } from 'react';

interface CountdownProps {
  expiresAt: string;
  onTimeUp(): void;
}

export function Countdown({ expiresAt, onTimeUp }: CountdownProps) {
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  const [remaining, setRemaining] = useState<number>(() => {
    const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
    return Math.max(0, diff);
  });
  const firedRef = useRef(false);

  useEffect(() => {
    const calculate = () => {
      const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
      return Math.max(0, diff);
    };

    const checkTime = () => {
      const left = calculate();
      setRemaining(left);
      if (left <= 0 && !firedRef.current) {
        firedRef.current = true;
        onTimeUpRef.current();
      }
    };

    checkTime();
    if (firedRef.current) return;

    const timer = setInterval(checkTime, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isUrgent = remaining <= 60 && remaining > 0;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-base font-semibold transition-colors ${
        isUrgent
          ? 'bg-amber-100 text-amber-700 animate-pulse'
          : 'bg-slate-100 text-slate-700'
      }`}
      aria-label={`Thời gian còn lại: ${formatted}`}
    >
      <span aria-hidden="true">⏱️</span>
      <span className="font-mono">{formatted}</span>
    </div>
  );
}
