import React from 'react';
import { Canvas } from '@react-three/fiber';
import { getAdaptiveQualityConfig } from '../../lib/performance/qualitySettings';
import { DestinationId, NavigationState } from '../../types/portfolio';
import { WorldScene } from './WorldScene';

export interface ExperienceCanvasProps {
  navState: NavigationState;
  isMobile: boolean;
  onSelectDestination: (id: DestinationId) => void;
  onHoverLandmark: (id: DestinationId | null) => void;
  onStepTravel: (deltaSec: number) => void;
  onWebGLError: () => void;
}

/**
 * Hosts the single-viewport React Three Fiber orthographic diorama canvas.
 */
export const ExperienceCanvas: React.FC<ExperienceCanvasProps> = ({
  navState,
  isMobile,
  onSelectDestination,
  onHoverLandmark,
  onStepTravel,
  onWebGLError,
}) => {
  const quality = getAdaptiveQualityConfig(isMobile, navState.reducedMotion);

  return (
    <div
      className="experience-canvas-wrapper"
      data-testid="experience-canvas-wrapper"
      aria-label="Interactive 3D portfolio world canvas"
    >
      <Canvas
        orthographic
        dpr={quality.dpr}
        shadows={quality.enableShadows}
        camera={{
          position: [35, 31, 35],
          zoom: isMobile ? 20 : 25,
          near: -100,
          far: 250,
        }}
        onCreated={({ gl }) => {
          if (!gl) {
            onWebGLError();
          }
        }}
      >
        <WorldScene
          navState={navState}
          isMobile={isMobile}
          onSelectDestination={onSelectDestination}
          onHoverLandmark={onHoverLandmark}
          onStepTravel={onStepTravel}
        />
      </Canvas>
    </div>
  );
};
