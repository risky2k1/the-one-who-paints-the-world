import React from 'react';
import { DESTINATIONS } from '../../data/portfolio';
import { DestinationId, NavigationState } from '../../types/portfolio';
import { JourneyProgress } from './JourneyProgress';

export interface CompactNavbarProps {
  navState: NavigationState;
  onSelectDestination: (id: DestinationId) => void;
  onToggleSound: () => void;
  onToggleReducedMotion: () => void;
}

/**
 * Compact Fixed Navbar shown after the visitor selects their first destination away from Intro.
 * Collapses based on interaction state (never scroll), and restores the expanded dock when returning to Intro.
 */
export const CompactNavbar: React.FC<CompactNavbarProps> = ({
  navState,
  onSelectDestination,
  onToggleSound,
  onToggleReducedMotion,
}) => {
  if (navState.isDockExpanded) {
    return null;
  }

  return (
    <header
      className="compact-navbar-wrapper"
      data-testid="compact-navbar"
      role="banner"
    >
      <div className="compact-navbar glass-panel">
        <div className="compact-navbar-row">
          <nav
            className="compact-nav-items"
            aria-label="Compact destination navigation"
          >
            {DESTINATIONS.map((dest) => {
              const isCurrent =
                !navState.isTravelling && navState.currentLandmark === dest.id;
              const isTargetPending =
                navState.isTravelling && navState.targetDestination === dest.id;
              const isVisited = navState.visitedLandmarks.includes(dest.id);

              return (
                <button
                  key={dest.id}
                  type="button"
                  className={`compact-nav-btn ${
                    isCurrent ? 'is-current' : ''
                  } ${isTargetPending ? 'is-target-pending' : ''} ${
                    isVisited ? 'is-visited' : ''
                  }`}
                  onClick={() => onSelectDestination(dest.id)}
                  aria-current={isCurrent ? 'page' : undefined}
                  data-testid={`compact-nav-btn-${dest.id}`}
                >
                  <span
                    className="compact-nav-dot"
                    style={{ backgroundColor: dest.accentColor }}
                  />
                  <span className="compact-nav-order">0{dest.order + 1}</span>
                  <span className="compact-nav-label">{dest.label}</span>
                  {isTargetPending && (
                    <span className="compact-nav-badge">En Route</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="compact-utility-controls">
            <button
              type="button"
              className={`utility-chip is-small ${
                navState.soundEnabled ? 'is-active' : ''
              }`}
              onClick={onToggleSound}
              aria-pressed={navState.soundEnabled}
              aria-label={
                navState.soundEnabled ? 'Mute sound' : 'Enable sound'
              }
              data-testid="compact-sound-toggle"
            >
              {navState.soundEnabled ? 'SFX On' : 'Muted'}
            </button>
            <button
              type="button"
              className={`utility-chip is-small ${
                navState.reducedMotion ? 'is-active' : ''
              }`}
              onClick={onToggleReducedMotion}
              aria-pressed={navState.reducedMotion}
              aria-label="Toggle reduced motion"
              data-testid="compact-motion-toggle"
            >
              {navState.reducedMotion ? 'Reduced Motion' : 'Motion On'}
            </button>
          </div>
        </div>

        <JourneyProgress
          navState={navState}
          onSelectDestination={onSelectDestination}
          compact
        />
      </div>
    </header>
  );
};
