import type { Prompt } from './types';

export type InputKind = 'number' | 'decimal' | 'fraction';
export type PadKey =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | ','
  | '/'
  | 'back'
  | 'clear';

export function inputKindOf(prompt: Prompt): InputKind | null {
  switch (prompt.type) {
    case 'arithmetic':
      return prompt.input;
    case 'word_problem':
      return prompt.input;
    case 'cube_count':
      return 'number';
    case 'comparison':
      return null;
  }
}

export function applyKey(draft: string, key: PadKey, kind: InputKind): string {
  if (key === 'clear') {
    return '';
  }

  if (key === 'back') {
    return draft.slice(0, -1);
  }

  if (key === ',') {
    if (kind !== 'decimal') return draft;
    if (draft.includes(',')) return draft;
    if (draft === '') return '0,';
    if (draft.length >= 9) return draft;
    return `${draft},`;
  }

  if (key === '/') {
    if (kind !== 'fraction') return draft;
    if (draft.includes('/')) return draft;
    if (draft === '') return '';
    if (draft.length >= 9) return draft;
    return `${draft}/`;
  }

  if (key >= '0' && key <= '9') {
    if (draft === '0') {
      return key === '0' ? '0' : key;
    }
    if (draft.length >= 9) {
      return draft;
    }
    return `${draft}${key}`;
  }

  return draft;
}

export function keyFromKeyboard(
  e: { key: string },
  kind: InputKind,
): PadKey | 'submit' | null {
  if (e.key >= '0' && e.key <= '9') {
    return e.key as PadKey;
  }
  if (e.key === '.' || e.key === ',') {
    return kind === 'decimal' ? ',' : null;
  }
  if (e.key === '/') {
    return kind === 'fraction' ? '/' : null;
  }
  if (e.key === 'Backspace') {
    return 'back';
  }
  if (e.key === 'Escape') {
    return 'clear';
  }
  if (e.key === 'Enter') {
    return 'submit';
  }
  return null;
}

export function padKeysFor(kind: InputKind): PadKey[] {
  const digits: PadKey[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  if (kind === 'decimal') {
    return [...digits, ',', '0', 'back'];
  }
  if (kind === 'fraction') {
    return [...digits, '/', '0', 'back'];
  }
  return [...digits, '0', 'back'];
}

