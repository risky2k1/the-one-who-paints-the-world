import { describe, expect, it } from 'vitest';
import { toggleTopicId, validateChildInput } from './childrenManager';

describe('childrenManager logic', () => {
  it('validates child name', () => {
    const res = validateChildInput({ name: '', grade: 2, avatar: 'fox', textbook: 'ket_noi' });
    expect(res.valid).toBe(false);
    expect(res.errors.name).toBeDefined();
  });

  it('validates grade between 1 and 5', () => {
    const resUnder = validateChildInput({ name: 'Bo', grade: 0, avatar: 'fox', textbook: 'ket_noi' });
    expect(resUnder.valid).toBe(false);
    expect(resUnder.errors.grade).toBeDefined();

    const resOver = validateChildInput({ name: 'Bo', grade: 6, avatar: 'fox', textbook: 'ket_noi' });
    expect(resOver.valid).toBe(false);
    expect(resOver.errors.grade).toBeDefined();
  });

  it('validates avatar is among valid keys', () => {
    const res = validateChildInput({ name: 'Bo', grade: 2, avatar: 'invalid_animal', textbook: 'ket_noi' });
    expect(res.valid).toBe(false);
    expect(res.errors.avatar).toBeDefined();
  });

  it('passes valid child input', () => {
    const res = validateChildInput({
      name: 'Bo',
      grade: 2,
      avatar: 'fox',
      textbook: 'ket_noi',
      disabled_topic_ids: [],
      assigned_first: false,
    });
    expect(res.valid).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });

  it('toggles disabled topic id properly', () => {
    // If not disabled, adding it to disabled list
    expect(toggleTopicId([], 5)).toEqual([5]);
    // If already disabled, remove it
    expect(toggleTopicId([1, 5, 9], 5)).toEqual([1, 9]);
  });
});
