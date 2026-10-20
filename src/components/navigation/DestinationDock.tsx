import React from 'react';
import { DESTINATIONS } from '../../data/portfolio';
import { DestinationId, NavigationState } from '../../types/portfolio';
import { JourneyProgress } from './JourneyProgress';

export interface DestinationDockProps {
  navState: NavigationState;
  onSelectDestination: (id: DestinationId) => void;
  onToggleSound: () => void;
  onToggleReducedMotion: () => void;
}

/**
 * Initial Expanded Navigation Dock displayed near the top of the viewport
 * when the visitor is at the Welcome/Intro state (and restored on return to Intro).
 */
export const DestinationDock: React.FC<DestinationDockProps> = ({
  navState,
  onSelectDestination,
  onToggleSound,
  onToggleReducedMotion,
}) => {
  if (!navState.isDockExpanded) {
    return null;
  }

  const isInteractive =
    navState.phase !== 'loading' && navState.phase !== 'reveal';

  return (
    <header
      className="destination-dock-wrapper"
      data-testid="expanded-destination-dock"
      role="banner"
    >
      <div className="destination-dock glass-panel">
        <div className="destination-dock-top">
          <div className="dock-brand">
            <span className="dock-brand-badge">3D DIORAMA WORLD</span>
            <span className="dock-brand-title">
              Sora Lindqvist • Platform &amp; Cloud Architecture
            </span>
          </div>

          <div className="dock-utility-controls">
            <button
              type="button"
              className={`utility-chip ${
                navState.soundEnabled ? 'is-active' : ''
              }`}
              onClick={onToggleSound}
              aria-pressed={navState.soundEnabled}
              aria-label={
                navState.soundEnabled
                  ? 'Mute subtle sound effects'
                  : 'Enable subtle sound effects'
              }
              data-testid="dock-sound-toggle"
            >
              {navState.soundEnabled ? 'SFX: On' : 'SFX: Muted'}
            </button>

            <button
              type="button"
              className={`utility-chip ${
                navState.reducedMotion ? 'is-active' : ''
              }`}
              onClick={onToggleReducedMotion}
              aria-pressed={navState.reducedMotion}
              aria-label="Toggle reduced motion mode"
              data-testid="dock-motion-toggle"
            >
              {navState.reducedMotion ? 'Motion: Reduced' : 'Motion: Standard'}
            </button>
          </div>
        </div>

        <nav
          className="destination-dock-grid"
          aria-label="Portfolio world destinations"
        >
          {DESTINATIONS.map((dest) => {
            const isCurrent =
              !navState.isTravelling && navState.currentLandmark === dest.id;
            const isTarget = navState.targetDestination === dest.id;
            const isVisited = navState.visitedLandmarks.includes(dest.id);

            return (
              <button
                key={dest.id}
                type="button"
                disabled={!isInteractive}
                className={`dock-destination-card ${
                  isCurrent ? 'is-current' : ''
                } ${isTarget && navState.isTravelling ? 'is-target' : ''} ${
                  isVisited ? 'is-visited' : ''
                }`}
                onClick={() => onSelectDestination(dest.id)}
                aria-current={isCurrent ? 'page' : undefined}
                data-testid={`dock-btn-${dest.id}`}
              >
                <div className="dock-card-header">
                  <span
                    className="dock-card-index"
                    style={{ color: dest.accentColor }}
                  >
                    0{dest.order + 1}
                  </span>
                  <span
                    className="dock-card-status-dot"
                    style={{
                      backgroundColor: isCurrent
                        ? dest.accentColor
                        : isVisited
                        ? '#7ecfc0'
                        : 'rgba(148, 163, 184, 0.45)',
                    }}
                  />
                </div>
                <div className="dock-card-label">{dest.label}</div>
                <div className="dock-card-subtitle">{dest.sculptureName}</div>
              </button>
            );
          })}
        </nav>

        <JourneyProgress
          navState={navState}
          onSelectDestination={onSelectDestination}
        />
      </div>
    </header>
  );
};
