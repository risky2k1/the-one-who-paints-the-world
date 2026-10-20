import React from 'react';
import { useFrame } from '@react-three/fiber';
import { DESTINATIONS } from '../../data/portfolio';
import { getAdaptiveQualityConfig } from '../../lib/performance/qualitySettings';
import { DestinationId, NavigationState } from '../../types/portfolio';
import { CameraController } from './CameraController';
import { Landmark } from './Landmark';
import { Landscape } from './Landscape';
import { Road } from './Road';
import { Vehicle } from './Vehicle';

export interface WorldSceneProps {
  navState: NavigationState;
  isMobile: boolean;
  onSelectDestination: (id: DestinationId) => void;
  onHoverLandmark: (id: DestinationId | null) => void;
  onStepTravel: (deltaSec: number) => void;
}

/**
 * Orchestrates the complete 3D pastel diorama world:
 * - Soft directional + hemisphere lighting and atmospheric fog
 * - Automatic isometric CameraController
 * - Minimal Geometric Landscape
 * - Continuous CatmullRomCurve3 Road
 * - Six interactive sculptural Landmarks
 * - Signature coral/peach Vehicle
 */
export const WorldScene: React.FC<WorldSceneProps> = ({
  navState,
  isMobile,
  onSelectDestination,
  onHoverLandmark,
  onStepTravel,
}) => {
  const quality = getAdaptiveQualityConfig(isMobile, navState.reducedMotion);
  const isActiveMotion =
    navState.phase === 'reveal' || navState.isTravelling;

  // Step vehicle route travel on every rendered frame using real frame delta
  useFrame((_state, delta) => {
    if (navState.isTravelling) {
      onStepTravel(delta);
    }
  });

  return (
    <group name="pastel-diorama-world">
      {/* Soft pastel sky & hemisphere illumination */}
      <ambientLight intensity={0.72} color="#f4f8ff" />
      <hemisphereLight
        args={['#e3f2ff', '#c9d7ec', 0.65]}
        position={[0, 35, 0]}
      />
      <directionalLight
        position={[28, 42, 24]}
        intensity={1.08}
        color="#fff9f2"
        castShadow={quality.enableShadows}
      />
      <directionalLight
        position={[-24, 22, -20]}
        intensity={0.42}
        color="#b8d8f8"
      />

      {/* Automatic isometric camera controller (no manual OrbitControls) */}
      <CameraController navState={navState} isMobile={isMobile} />

      {/* Minimal Geometric Landscape */}
      <Landscape
        isActiveMotion={isActiveMotion}
        reducedMotion={navState.reducedMotion}
        crystalCount={quality.crystalCount}
      />

      {/* Continuous bidirectional road */}
      <Road
        currentU={navState.currentU}
        targetDestination={navState.targetDestination}
        isTravelling={navState.isTravelling}
        segments={quality.roadSegments}
      />

      {/* Six sculptural portfolio landmarks */}
      <group name="six-portfolio-landmarks">
        {DESTINATIONS.map((dest) => (
          <Landmark
            key={dest.id}
            destination={dest}
            isCurrent={navState.currentLandmark === dest.id}
            isTarget={navState.targetDestination === dest.id}
            isVisited={navState.visitedLandmarks.includes(dest.id)}
            isHovered={navState.hoveredLandmark === dest.id}
            isTravelling={navState.isTravelling}
            reducedMotion={navState.reducedMotion}
            onSelect={onSelectDestination}
            onHoverChange={onHoverLandmark}
          />
        ))}
      </group>

      {/* Signature coral/peach low-poly vehicle */}
      <Vehicle navState={navState} />
    </group>
  );
};
