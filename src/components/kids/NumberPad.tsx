'use client';

import { useEffect } from 'react';
import {
  keyFromKeyboard,
  type InputKind,
  type PadKey,
} from '@/lib/kids/answerInput';

export interface NumberPadProps {
  kind: InputKind;
  onKey(key: PadKey): void;
  onSubmit(): void;
  disabled?: boolean;
  canSubmit?: boolean;
}

export function NumberPad({
  kind,
  onKey,
  onSubmit,
  disabled = false,
  canSubmit = false,
}: NumberPadProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a real input/textarea or meta keys
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const action = keyFromKeyboard(e, kind);
      if (!action) return;

      e.preventDefault();
      if (action === 'submit') {
        if (!disabled && canSubmit) onSubmit();
      } else {
        if (!disabled) onKey(action);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [kind, disabled, canSubmit, onKey, onSubmit]);

  const digits: PadKey[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="mx-auto w-full max-w-xs flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {digits.map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => onKey(digit)}
            className="min-h-[56px] min-w-[56px] h-14 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-200 disabled:opacity-50 text-2xl font-bold text-slate-800 shadow-md border-2 border-slate-100 flex items-center justify-center transition-all select-none"
          >
            {digit}
          </button>
        ))}

        {/* Bottom row slot 10 */}
        {kind === 'decimal' ? (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onKey(',')}
            className="min-h-[56px] min-w-[56px] h-14 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-200 disabled:opacity-50 text-2xl font-bold text-slate-800 shadow-md border-2 border-slate-100 flex items-center justify-center transition-all select-none"
          >
            ,
          </button>
        ) : kind === 'fraction' ? (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onKey('/')}
            className="min-h-[56px] min-w-[56px] h-14 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-200 disabled:opacity-50 text-2xl font-bold text-slate-800 shadow-md border-2 border-slate-100 flex items-center justify-center transition-all select-none"
          >
            /
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onKey('clear')}
            aria-label="Xoá tất cả"
            className="min-h-[56px] min-w-[56px] h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-50 text-sm font-semibold text-slate-600 shadow-md border-2 border-slate-100 flex items-center justify-center transition-all select-none"
          >
            C
          </button>
        )}

        {/* Slot 11: 0 */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onKey('0')}
          className="min-h-[56px] min-w-[56px] h-14 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-200 disabled:opacity-50 text-2xl font-bold text-slate-800 shadow-md border-2 border-slate-100 flex items-center justify-center transition-all select-none"
        >
          0
        </button>

        {/* Slot 12: back */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onKey('back')}
          aria-label="Xoá một ký tự"
          className="min-h-[56px] min-w-[56px] h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-50 text-xl font-bold text-slate-700 shadow-md border-2 border-slate-200 flex items-center justify-center transition-all select-none"
        >
          ⌫
        </button>
      </div>

      <button
        type="button"
        disabled={disabled || !canSubmit}
        onClick={onSubmit}
        className="min-h-[56px] w-full mt-1 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:transform-none text-white text-xl font-extrabold shadow-lg transition-all flex items-center justify-center select-none"
      >
        Kiểm tra ➔
      </button>
    </div>
  );
}
