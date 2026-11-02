'use client';

import { useEffect } from 'react';
import {
  keyFromKeyboard,
  type InputKind,
  type PadKey,
} from '../lib/answerInput';

export interface NumberPadProps {
  kind: InputKind;
  onKey(key: PadKey): void;
  onSubmit(): void;
  disabled?: boolean;
  canSubmit?: boolean;
}

interface UseNumberPadKeyboardOptions {
  kind: InputKind;
  onKey: (key: PadKey) => void;
  onSubmit: () => void;
  disabled: boolean;
  canSubmit: boolean;
}

function useNumberPadKeyboard({
  kind,
  onKey,
  onSubmit,
  disabled,
  canSubmit,
}: UseNumberPadKeyboardOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
}

interface KeySlotProps {
  kind: InputKind;
  disabled: boolean;
  onKey: (k: PadKey) => void;
}

function SpecialKeySlot({ kind, disabled, onKey }: KeySlotProps) {
  if (kind === 'decimal') {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onKey(',')}
        className="min-h-[56px] min-w-[56px] neo-btn bg-white disabled:opacity-50 text-2xl font-black text-black rounded-xl select-none"
      >
        ,
      </button>
    );
  }
  if (kind === 'fraction') {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onKey('/')}
        className="min-h-[56px] min-w-[56px] neo-btn bg-white disabled:opacity-50 text-2xl font-black text-black rounded-xl select-none"
      >
        /
      </button>
    );
  }
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onKey('clear')}
      aria-label="Xoá tất cả"
      className="min-h-[56px] min-w-[56px] neo-btn bg-[#FAF7F2] disabled:opacity-50 text-lg font-black text-black rounded-xl select-none"
    >
      C
    </button>
  );
}

const DIGITS: PadKey[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function NumberPad({
  kind,
  onKey,
  onSubmit,
  disabled = false,
  canSubmit = false,
}: NumberPadProps) {
  useNumberPadKeyboard({ kind, onKey, onSubmit, disabled, canSubmit });

  return (
    <div className="mx-auto w-full max-w-xs flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {DIGITS.map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => onKey(digit)}
            className="min-h-[56px] min-w-[56px] neo-btn bg-white disabled:opacity-50 text-2xl font-black text-black rounded-xl select-none"
          >
            {digit}
          </button>
        ))}

        <SpecialKeySlot kind={kind} disabled={disabled} onKey={onKey} />

        <button
          type="button"
          disabled={disabled}
          onClick={() => onKey('0')}
          className="min-h-[56px] min-w-[56px] neo-btn bg-white disabled:opacity-50 text-2xl font-black text-black rounded-xl select-none"
        >
          0
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onKey('back')}
          aria-label="Xoá một ký tự"
          className="min-h-[56px] min-w-[56px] neo-btn bg-[#FAF7F2] disabled:opacity-50 text-xl font-black text-black rounded-xl select-none"
        >
          ⌫
        </button>
      </div>

      <button
        type="button"
        disabled={disabled || !canSubmit}
        onClick={onSubmit}
        className="min-h-[56px] w-full mt-1 rounded-xl neo-btn bg-[#FFE600] disabled:opacity-50 disabled:cursor-not-allowed text-black text-xl font-black select-none"
      >
        Kiểm tra ➔
      </button>
    </div>
  );
}
