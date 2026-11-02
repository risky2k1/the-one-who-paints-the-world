import { describe, expect, it } from 'vitest';
import { formatAccuracy, formatDuration, getAccuracyLevel } from './resultsView';

describe('resultsView formatting', () => {
  it('formats accuracy percentage', () => {
    expect(formatAccuracy(0.55)).toBe('55%');
    expect(formatAccuracy(0.8)).toBe('80%');
    expect(formatAccuracy(1)).toBe('100%');
    expect(formatAccuracy(0)).toBe('0%');
  });

  it('determines accuracy severity level', () => {
    expect(getAccuracyLevel(0.4)).toBe('critical');
    expect(getAccuracyLevel(0.55)).toBe('warning');
    expect(getAccuracyLevel(0.69)).toBe('warning');
    expect(getAccuracyLevel(0.7)).toBe('good');
    expect(getAccuracyLevel(0.95)).toBe('good');
  });

  it('formats duration into readable text', () => {
    expect(formatDuration(45)).toBe('45 giây');
    expect(formatDuration(120)).toBe('2 phút');
    expect(formatDuration(145)).toBe('2 phút 25 giây');
    expect(formatDuration(0)).toBe('0 giây');
  });
});
