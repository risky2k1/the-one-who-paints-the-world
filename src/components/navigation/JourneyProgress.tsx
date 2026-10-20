import React from 'react';
import { DESTINATIONS, getDestinationById } from '../../data/portfolio';
import { DestinationId, NavigationState } from '../../types/portfolio';

export interface JourneyProgressProps {
  navState: NavigationState;
  onSelectDestination: (id: DestinationId) => void;
  compact?: boolean;
}

/**
 * Real-time Journey Progress Indicator.
 * Reflects:
 * 1. Exact physical vehicle position along the continuous road (currentU)
 * 2. Landmarks genuinely reached (visitedLandmarks)
 * 3. Currently parked landmark (currentLandmark)
 * 4. Selected target destination & pending approach state (targetDestination)
 * 5. Forward / Reverse travel direction
 */
export const JourneyProgress: React.FC<JourneyProgressProps> = ({
  navState,
  onSelectDestination,
  compact = false,
}) => {
  const firstU = DESTINATIONS[0].routeU;
  const lastU = DESTINATIONS[DESTINATIONS.length - 1].routeU;
  const spanU = Math.max(0.01, lastU - firstU);

  const toPercent = (u: number): number => {
    const pct = ((u - firstU) / spanU) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  const carPercent = toPercent(navState.currentU);
  const targetDest = getDestinationById(navState.targetDestination);
  const targetPercent = toPercent(targetDest.routeU);

  const segmentLeft = Math.min(carPercent, targetPercent);
  const segmentWidth = Math.abs(targetPercent - carPercent);

  const statusText = navState.isTravelling
    ? `Travelling ${navState.direction === 1 ? 'Forward →' : '← Reverse'} to ${
        targetDest.label
      } (${Math.round(navState.journeyProgress * 100)}%)`
    : `Parked at ${
        getDestinationById(navState.currentLandmark || 'intro').label
      } • ${navState.visitedLandmarks.length}/${DESTINATIONS.length} Visited`;

  return (
    <div
      className={`journey-progress ${compact ? 'is-compact' : ''}`}
      data-testid="journey-progress"
      aria-label="Continuous road journey progress"
    >
      <div className="journey-progress-meta">
        <span
          className="journey-status-pill"
          data-testid="journey-status-text"
        >
          <span
            className={`journey-status-dot ${
              navState.isTravelling ? 'is-moving' : 'is-parked'
            }`}
          />
          {statusText}
        </span>
        <span
          className="journey-route-readout"
          data-testid="journey-route-readout"
        >
          Route u={navState.currentU.toFixed(2)}
        </span>
      </div>

      <div className="journey-track-container">
        {/* Continuous road baseline track */}
        <div className="journey-track-bg" />

        {/* Active transit segment between physical vehicle position and selected target */}
        {navState.isTravelling && (
          <div
            className={`journey-track-active-span ${
              navState.direction === -1 ? 'is-reverse' : 'is-forward'
            }`}
            style={{
              left: `${segmentLeft}%`,
              width: `${segmentWidth}%`,
            }}
            data-testid="journey-active-span"
          />
        )}

        {/* Six landmark stop markers positioned at their exact routeU coordinates */}
        {DESTINATIONS.map((dest) => {
          const leftPct = toPercent(dest.routeU);
          const isVisited = navState.visitedLandmarks.includes(dest.id);
          const isCurrent =
            !navState.isTravelling && navState.currentLandmark === dest.id;
          const isTargetPending =
            navState.isTravelling && navState.targetDestination === dest.id;

          const nodeStateClass = isCurrent
            ? 'is-current'
            : isTargetPending
            ? 'is-target-pending'
            : isVisited
            ? 'is-visited'
            : 'is-unvisited';

          return (
            <button
              key={dest.id}
              type="button"
              className={`journey-node ${nodeStateClass}`}
              style={{ left: `${leftPct}%` }}
              onClick={() => onSelectDestination(dest.id)}
              title={`${dest.label} (${
                isCurrent
                  ? 'Current Landmark'
                  : isTargetPending
                  ? 'Approaching Target'
                  : isVisited
                  ? 'Visited'
                  : 'Unvisited'
              })`}
              aria-label={`Progress stop ${dest.label}: ${
                isCurrent
                  ? 'Currently parked here'
                  : isTargetPending
                  ? 'Target being approached'
                  : isVisited
                  ? 'Visited'
                  : 'Not yet visited'
              }`}
              data-testid={`journey-node-${dest.id}`}
              data-state={nodeStateClass}
            >
              <span
                className="journey-node-ring"
                style={{ borderColor: dest.accentColor }}
              />
            </button>
          );
        })}

        {/* Live physical car position indicator along the continuous curve */}
        <div
          className={`journey-car-indicator ${
            navState.isTravelling ? 'is-travelling' : 'is-parked'
          } ${navState.direction === -1 ? 'is-reverse' : 'is-forward'}`}
          style={{ left: `${carPercent}%` }}
          data-testid="journey-car-indicator"
          data-route-u={navState.currentU.toFixed(3)}
          aria-hidden="true"
        >
          <span className="journey-car-glyph">
            {navState.isTravelling
              ? navState.direction === 1
                ? '▸'
                : '◂'
              : '●'}
          </span>
        </div>
      </div>
    </div>
  );
};
