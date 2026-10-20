export interface QualityConfig {
  dpr: [number, number];
  ambientParticleCount: number;
  enableShadows: boolean;
  roadSegments: number;
  crystalCount: number;
}

export function getAdaptiveQualityConfig(
  isMobile: boolean,
  reducedMotion: boolean
): QualityConfig {
  if (reducedMotion) {
    return {
      dpr: [1, 1.5],
      ambientParticleCount: 0,
      enableShadows: !isMobile,
      roadSegments: 140,
      crystalCount: isMobile ? 10 : 16,
    };
  }

  if (isMobile) {
    return {
      dpr: [1, 1.5],
      ambientParticleCount: 16,
      enableShadows: false,
      roadSegments: 140,
      crystalCount: 14,
    };
  }

  return {
    dpr: [1, 2],
    ambientParticleCount: 36,
    enableShadows: true,
    roadSegments: 220,
    crystalCount: 24,
  };
}

/**
 * Subtle Web Audio API synthesizer for UI and vehicle cues.
 * Respects browser autoplay rules and user mute state; no external audio files or background music.
 */
class SoundEffectController {
  private ctx: AudioContext | null = null;
  private enabled = false;

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (enabled && typeof window !== 'undefined') {
      this.ensureContext();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private ensureContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public playSelectCue(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Ignore audio policy errors
    }
  }

  public playDepartureCue(direction: 1 | -1): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const startFreq = direction === 1 ? 330 : 410;
      const endFreq = direction === 1 ? 495 : 310;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.18);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.03, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch {
      // Ignore audio policy errors
    }
  }

  public playArrivalCue(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25]; // Soft C5 -> E5 harmonic chime
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = now + idx * 0.055;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.032, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch {
      // Ignore audio policy errors
    }
  }
}

export const soundController = new SoundEffectController();
