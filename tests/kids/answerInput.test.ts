import { describe, expect, it } from 'vitest';
import {
  applyKey,
  inputKindOf,
  keyFromKeyboard,
  padKeysFor,
  type InputKind,
  type PadKey,
} from '@/lib/kids/answerInput';
import type { Prompt } from '@/lib/kids/types';

describe('answerInput', () => {
  describe('applyKey table', () => {
    const cases: Array<{
      draft: string;
      key: PadKey;
      kind: InputKind;
      expected: string;
    }> = [
      { draft: '', key: '7', kind: 'number', expected: '7' },
      { draft: '0', key: '7', kind: 'number', expected: '7' },
      { draft: '12', key: ',', kind: 'number', expected: '12' },
      { draft: '', key: ',', kind: 'decimal', expected: '0,' },
      { draft: '2,5', key: ',', kind: 'decimal', expected: '2,5' },
      { draft: '2,', key: '0', kind: 'decimal', expected: '2,0' },
      { draft: '', key: '/', kind: 'fraction', expected: '' },
      { draft: '3/', key: '/', kind: 'fraction', expected: '3/' },
      { draft: '3/4', key: 'back', kind: 'fraction', expected: '3/' },
      { draft: '123456789', key: '1', kind: 'number', expected: '123456789' },
    ];

    for (const c of cases) {
      it(`applyKey('${c.draft}', '${c.key}', '${c.kind}') -> '${c.expected}'`, () => {
        expect(applyKey(c.draft, c.key, c.kind)).toBe(c.expected);
      });
    }

    it('handles clear', () => {
      expect(applyKey('123', 'clear', 'number')).toBe('');
      expect(applyKey('4,5', 'clear', 'decimal')).toBe('');
    });

    it('handles back on empty draft', () => {
      expect(applyKey('', 'back', 'number')).toBe('');
    });

    it('rejects / in number or decimal mode', () => {
      expect(applyKey('5', '/', 'number')).toBe('5');
      expect(applyKey('5', '/', 'decimal')).toBe('5');
    });

    it('preserves leading 0 before comma or slash', () => {
      expect(applyKey('0,', '5', 'decimal')).toBe('0,5');
    });
  });

  describe('keyFromKeyboard', () => {
    it('maps digits', () => {
      expect(keyFromKeyboard({ key: '0' }, 'number')).toBe('0');
      expect(keyFromKeyboard({ key: '9' }, 'fraction')).toBe('9');
    });

    it('maps dot and comma to comma only in decimal', () => {
      expect(keyFromKeyboard({ key: '.' }, 'decimal')).toBe(',');
      expect(keyFromKeyboard({ key: ',' }, 'decimal')).toBe(',');
      expect(keyFromKeyboard({ key: '.' }, 'number')).toBeNull();
      expect(keyFromKeyboard({ key: ',' }, 'fraction')).toBeNull();
    });

    it('maps slash only in fraction', () => {
      expect(keyFromKeyboard({ key: '/' }, 'fraction')).toBe('/');
      expect(keyFromKeyboard({ key: '/' }, 'number')).toBeNull();
      expect(keyFromKeyboard({ key: '/' }, 'decimal')).toBeNull();
    });

    it('maps control keys', () => {
      expect(keyFromKeyboard({ key: 'Backspace' }, 'number')).toBe('back');
      expect(keyFromKeyboard({ key: 'Escape' }, 'number')).toBe('clear');
      expect(keyFromKeyboard({ key: 'Enter' }, 'number')).toBe('submit');
    });

    it('returns null for unrelated keys', () => {
      expect(keyFromKeyboard({ key: 'a' }, 'number')).toBeNull();
      expect(keyFromKeyboard({ key: ' ' }, 'number')).toBeNull();
    });
  });

  describe('inputKindOf', () => {
    it('extracts input kind from prompt types', () => {
      const arithmeticNum: Prompt = { type: 'arithmetic', text: '1 + 1', input: 'number' };
      const arithmeticDec: Prompt = { type: 'arithmetic', text: '0.5 + 0.5', input: 'decimal' };
      const arithmeticFrac: Prompt = { type: 'arithmetic', text: '1/2 + 1/2', input: 'fraction' };
      const wordProblem: Prompt = { type: 'word_problem', text: 'Có 3 quả', unit: 'quả', input: 'number' };
      const cubeCount: Prompt = { type: 'cube_count', heights: [[1, 2]] };
      const comparison: Prompt = { type: 'comparison', left: '1', right: '2', choices: ['<', '>', '='] };

      expect(inputKindOf(arithmeticNum)).toBe('number');
      expect(inputKindOf(arithmeticDec)).toBe('decimal');
      expect(inputKindOf(arithmeticFrac)).toBe('fraction');
      expect(inputKindOf(wordProblem)).toBe('number');
      expect(inputKindOf(cubeCount)).toBe('number');
      expect(inputKindOf(comparison)).toBeNull();
    });
  });

  describe('padKeysFor', () => {
    it('returns digits and back for number', () => {
      const keys = padKeysFor('number');
      expect(keys).toContain('0');
      expect(keys).toContain('9');
      expect(keys).toContain('back');
      expect(keys).not.toContain(',');
      expect(keys).not.toContain('/');
    });

    it('adds comma for decimal', () => {
      const keys = padKeysFor('decimal');
      expect(keys).toContain(',');
      expect(keys).not.toContain('/');
    });

    it('adds slash for fraction', () => {
      const keys = padKeysFor('fraction');
      expect(keys).toContain('/');
      expect(keys).not.toContain(',');
    });
  });
});
