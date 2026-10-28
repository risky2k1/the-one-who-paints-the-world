import { describe, expect, it } from 'vitest';
import { stickerVisual, ALL_STICKER_KEYS } from '@/lib/kids/stickers';

describe('stickers catalog and visual', () => {
  const REQUIRED_24_KEYS = [
    'star-gold',
    'star-silver',
    'star-bronze',
    'rocket',
    'planet',
    'astronaut',
    'trophy-gold',
    'medal-first',
    'crown',
    'gem-diamond',
    'gem-ruby',
    'gem-emerald',
    'wizard-hat',
    'magic-wand',
    'shield',
    'sword',
    'treasure-chest',
    'compass',
    'super-cape',
    'lightning',
    'rainbow',
    'fire',
    'heart-badge',
    'cool-glasses',
  ] as const;

  it('contains exactly the 24 required keys', () => {
    expect(ALL_STICKER_KEYS).toHaveLength(24);
    for (const key of REQUIRED_24_KEYS) {
      expect(ALL_STICKER_KEYS).toContain(key);
    }
  });

  it('provides unique labels and valid hex colors for all 24 keys', () => {
    const labels = new Set<string>();

    for (const key of REQUIRED_24_KEYS) {
      const v = stickerVisual(key);
      expect(v.label).toBeTruthy();
      expect(v.label).not.toBe('Quà bí mật');
      expect(v.color).toMatch(/^#[0-9a-f]{6}$/i);
      labels.add(v.label);
    }

    expect(labels.size).toBe(24);
  });

  it('falls back gracefully on unknown key', () => {
    const fallback = stickerVisual('unknown-sticker');
    expect(fallback.label).toBe('Quà bí mật');
    expect(fallback.shape).toBe('sphere');
    expect(fallback.color).toBe('#a78bfa');
  });
});

