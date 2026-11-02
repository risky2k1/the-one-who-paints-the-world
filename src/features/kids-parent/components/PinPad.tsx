'use client';

import { useEffect } from 'react';
import { appendPinDigit, backspacePin } from '../lib/pinPad';

export interface PinPadProps {
  pin: string;
  onChange: (pin: string) => void;
  onComplete?: (pin: string) => void;
  maxLength?: number;
  disabled?: boolean;
  error?: string | null;
}

interface UsePinKeyboardOpts {
  pin: string;
  onChange: (pin: string) => void;
  onComplete?: (pin: string) => void;
  maxLength: number;
  disabled: boolean;
}

function usePinKeyboard({ pin, onChange, onComplete, maxLength, disabled }: UsePinKeyboardOpts) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (disabled) return;
      if (e.key >= '0' && e.key <= '9') {
        const next = appendPinDigit(pin, e.key, maxLength);
        onChange(next);
        if (next.length === maxLength && onComplete) onComplete(next);
      } else if (e.key === 'Backspace') {
        onChange(backspacePin(pin));
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, disabled, maxLength, onChange, onComplete]);
}

export function PinPad({
  pin,
  onChange,
  onComplete,
  maxLength = 4,
  disabled = false,
  error = null,
}: PinPadProps) {
  usePinKeyboard({ pin, onChange, onComplete, maxLength, disabled });

  const handleDigit = (digit: string) => {
    if (disabled) return;
    const next = appendPinDigit(pin, digit, maxLength);
    onChange(next);
    if (next.length === maxLength && onComplete) onComplete(next);
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-xs mx-auto">
      <div className="flex items-center justify-center gap-3 my-6" aria-label="Độ dài PIN đã nhập">
        {Array.from({ length: maxLength }).map((_, i) => (
          <div
            key={i}
            className={`w-5 h-5 border-2 border-black rounded-sm transition-colors ${
              i < pin.length ? 'bg-black' : 'bg-white'
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="neo-box-sm bg-[#FF90E8] text-black font-bold text-xs uppercase tracking-wide text-center p-3 mb-4 w-full rounded-xl" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 w-full">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => handleDigit(digit)}
            className="neo-btn bg-white text-black h-16 min-h-[64px] text-2xl font-black rounded-xl disabled:opacity-50"
          >
            {digit}
          </button>
        ))}

        <button
          type="button"
          disabled={disabled || pin.length === 0}
          onClick={() => onChange('')}
          className="neo-btn bg-[#FAF7F2] text-black h-16 min-h-[64px] text-xs font-black uppercase rounded-xl disabled:opacity-40"
        >
          Xóa
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => handleDigit('0')}
          className="neo-btn bg-white text-black h-16 min-h-[64px] text-2xl font-black rounded-xl disabled:opacity-50"
        >
          0
        </button>

        <button
          type="button"
          disabled={disabled || pin.length === 0}
          onClick={() => onChange(backspacePin(pin))}
          className="neo-btn bg-[#FAF7F2] text-black h-16 min-h-[64px] text-xl font-black rounded-xl disabled:opacity-40 flex items-center justify-center"
          aria-label="Xóa một số"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
