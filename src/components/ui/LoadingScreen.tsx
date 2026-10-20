import React from 'react';
import { ExperiencePhase } from '../../types/portfolio';

export interface LoadingScreenProps {
  phase: ExperiencePhase;
  progress: number;
}

/**
 * Pastel & Dreamy loading state that transitions smoothly into the automatic cinematic reveal
 * without requiring the user to click an Enter button.
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  phase,
  progress,
}) => {
  if (phase !== 'loading') {
    return null;
  }

  return (
    <div
      className="loading-screen-overlay"
      data-testid="loading-screen"
      role="status"
      aria-live="polite"
    >
      <div className="loading-card glass-panel">
        <span className="loading-eyebrow">INITIALIZING 3D DIORAMA WORLD</span>
        <h2 className="loading-title">Pastel Odyssey • Platform Portfolio</h2>
        <p className="loading-subtitle">
          Generating continuous Catmull-Rom highway, six sculptural landmarks &amp;
          studio coupe…
        </p>
        <div className="loading-bar-track">
          <div
            className="loading-bar-fill"
            style={{ width: `${Math.max(8, Math.min(100, progress))}%` }}
          />
        </div>
        <span className="loading-percent">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};
