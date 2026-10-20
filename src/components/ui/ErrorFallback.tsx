import React from 'react';
import { DESTINATIONS } from '../../data/portfolio';
import { DestinationId, NavigationState } from '../../types/portfolio';

export interface ErrorFallbackProps {
  navState: NavigationState;
  onSelectDestination: (id: DestinationId) => void;
}

/**
 * Resilient fallback banner/scene if WebGL is unavailable in the browser environment.
 * Preserves complete access to all six destinations, route state, and portfolio content.
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  navState,
  onSelectDestination,
}) => {
  return (
    <div
      className="webgl-fallback-world"
      data-testid="webgl-fallback"
      role="region"
      aria-label="Interactive Fallback Map (WebGL Unavailable)"
    >
      <div className="fallback-map-notice glass-panel">
        <span className="demo-notice-pill">RESILIENT 2D DIORAMA FALLBACK</span>
        <p>
          WebGL hardware rendering is unavailable in this browser context. All
          six portfolio destinations, route progress, and project specifications
          remain fully interactive below.
        </p>
        <div className="fallback-Destination-buttons">
          {DESTINATIONS.map((dest) => (
            <button
              key={dest.id}
              type="button"
              className={`pastel-action-btn ${
                navState.targetDestination === dest.id
                  ? 'is-primary'
                  : 'is-secondary'
              }`}
              onClick={() => onSelectDestination(dest.id)}
            >
              0{dest.order + 1} {dest.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
