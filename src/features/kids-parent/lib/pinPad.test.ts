import { describe, expect, it } from 'vitest';
import { appendPinDigit, backspacePin } from './pinPad';

describe('pinPad logic', () => {
  it('appends digits up to max length', () => {
    let pin = '';
    pin = appendPinDigit(pin, '1', 4);
    expect(pin).toBe('1');
    pin = appendPinDigit(pin, '2', 4);
    expect(pin).toBe('12');
    pin = appendPinDigit(pin, '3', 4);
    expect(pin).toBe('123');
    pin = appendPinDigit(pin, '4', 4);
    expect(pin).toBe('1234');
    // Cannot exceed max length
    pin = appendPinDigit(pin, '5', 4);
    expect(pin).toBe('1234');
  });

  it('rejects non-digit characters', () => {
    let pin = '12';
    pin = appendPinDigit(pin, 'a', 4);
    expect(pin).toBe('12');
    pin = appendPinDigit(pin, ' ', 4);
    expect(pin).toBe('12');
  });

  it('handles backspace correctly', () => {
    expect(backspacePin('1234')).toBe('123');
    expect(backspacePin('1')).toBe('');
    expect(backspacePin('')).toBe('');
  });
});
