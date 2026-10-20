import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { getLandmarkTransform } from '../../lib/navigation/routeController';
import {
  DestinationConfig,
  DestinationId,
} from '../../types/portfolio';

export interface LandmarkProps {
  destination: DestinationConfig;
  isCurrent: boolean;
  isTarget: boolean;
  isVisited: boolean;
  isHovered: boolean;
  isTravelling: boolean;
  reducedMotion: boolean;
  onSelect: (id: DestinationId) => void;
  onHoverChange: (id: DestinationId | null) => void;
}

/**
 * Renders one of the six distinctive low-poly abstract sculptures along the road
 * with direct 3D raycast interaction, hover/active states, and a floating HTML badge.
 */
export const Landmark: React.FC<LandmarkProps> = ({
  destination,
  isCurrent,
  isTarget,
  isVisited,
  isHovered,
  isTravelling,
  reducedMotion,
  onSelect,
  onHoverChange,
}) => {
  const sculptureRef = useRef<THREE.Group>(null);
  const crownRef = useRef<THREE.Mesh>(null);
  const tf = getLandmarkTransform(destination.id);

  const isHighlighted = isCurrent || isTarget || isHovered;
  const emissiveBoost = isHovered
    ? 0.62
    : isCurrent
    ? 0.5
    : isTarget
    ? 0.44
    : isVisited
    ? 0.2
    : 0.1;

  useFrame((state, delta) => {
    if (!sculptureRef.current) return;
    const t = state.clock.getElapsedTime();
    const dt = Math.min(0.1, delta);

    // Subtle elevation and scale response on hover/active
    const targetScale = isHovered ? 1.09 : isCurrent || isTarget ? 1.04 : 1.0;
    const currentScale = sculptureRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(
      currentScale,
      targetScale,
      reducedMotion ? 1 : Math.min(1, dt * 8)
    );
    sculptureRef.current.scale.set(nextScale, nextScale, nextScale);

    if (crownRef.current && !reducedMotion) {
      const rate = isTravelling || isHovered ? 0.85 : 0.22;
      crownRef.current.rotation.y += dt * rate;
      crownRef.current.position.y =
        3.25 + Math.sin(t * 1.6 + destination.order) * (isHighlighted ? 0.12 : 0.04);
    }
  });

  const handlePointerOver = (e: { stopPropagation?: () => void }) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'pointer';
    }
    onHoverChange(destination.id);
  };

  const handlePointerOut = (e: { stopPropagation?: () => void }) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'default';
    }
    onHoverChange(null);
  };

  const handleClick = (e: { stopPropagation?: () => void }) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    onSelect(destination.id);
  };

  const renderSculptureGeometry = () => {
    switch (destination.sculptureType) {
      case 'aurora_arch':
        return (
          <group name="sculpture-aurora-arch">
            {/* Left & Right angled portal pillars */}
            <mesh position={[-1.15, 1.45, 0]} rotation={[0, 0, -0.14]} castShadow>
              <boxGeometry args={[0.55, 2.9, 0.55]} />
              <meshStandardMaterial
                color={destination.accentColor}
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost}
                roughness={0.35}
                flatShading
              />
            </mesh>
            <mesh position={[1.15, 1.45, 0]} rotation={[0, 0, 0.14]} castShadow>
              <boxGeometry args={[0.55, 2.9, 0.55]} />
              <meshStandardMaterial
                color={destination.accentColor}
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost}
                roughness={0.35}
                flatShading
              />
            </mesh>
            {/* Arch lintel beam */}
            <mesh position={[0, 2.75, 0]} castShadow>
              <boxGeometry args={[2.6, 0.45, 0.68]} />
              <meshStandardMaterial
                color={destination.secondaryColor}
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost * 0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Suspended welcome octahedron crystal */}
            <mesh ref={crownRef} position={[0, 3.25, 0]} castShadow>
              <octahedronGeometry args={[0.62, 0]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost + 0.25}
                roughness={0.2}
                flatShading
              />
            </mesh>
          </group>
        );

      case 'harmonic_monoliths':
        return (
          <group name="sculpture-harmonic-monoliths">
            <mesh position={[-0.75, 1.65, -0.2]} rotation={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.42, 0.62, 3.3, 6]} />
              <meshStandardMaterial
                color={destination.accentColor}
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost}
                roughness={0.38}
                flatShading
              />
            </mesh>
            <mesh position={[0.78, 1.25, 0.25]} rotation={[0, -0.4, 0]} castShadow>
              <cylinderGeometry args={[0.38, 0.54, 2.5, 6]} />
              <meshStandardMaterial
                color={destination.secondaryColor}
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost * 0.85}
                roughness={0.4}
                flatShading
              />
            </mesh>
            <mesh ref={crownRef} position={[0, 3.25, 0]} castShadow>
              <dodecahedronGeometry args={[0.58, 0]} />
              <meshStandardMaterial
                color="#f5f0ff"
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost + 0.2}
                flatShading
              />
            </mesh>
          </group>
        );

      case 'polyhedral_gyro':
        return (
          <group name="sculpture-polyhedral-gyro">
            {/* Base pedestal */}
            <mesh position={[0, 0.75, 0]} castShadow>
              <cylinderGeometry args={[0.7, 1.05, 1.5, 8]} />
              <meshStandardMaterial
                color={destination.secondaryColor}
                roughness={0.45}
                flatShading
              />
            </mesh>
            {/* Outer orbital ring */}
            <mesh position={[0, 2.25, 0]} rotation={[0.5, 0.3, 0]}>
              <torusGeometry args={[1.25, 0.14, 8, 20]} />
              <meshStandardMaterial
                color={destination.accentColor}
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost}
                roughness={0.3}
              />
            </mesh>
            {/* Inner orbital ring */}
            <mesh position={[0, 2.25, 0]} rotation={[-0.55, 0.8, 0.3]}>
              <torusGeometry args={[0.92, 0.11, 8, 18]} />
              <meshStandardMaterial
                color="#e4f3ff"
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost * 0.9}
              />
            </mesh>
            {/* Central polyhedral core */}
            <mesh ref={crownRef} position={[0, 2.25, 0]} castShadow>
              <icosahedronGeometry args={[0.56, 0]} />
              <meshStandardMaterial
                color={destination.accentColor}
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost + 0.25}
                flatShading
              />
            </mesh>
          </group>
        );

      case 'isometric_citadel':
        return (
          <group name="sculpture-isometric-citadel">
            {/* Three stepped architectural towers representing the 3 featured projects */}
            <mesh position={[-0.85, 1.15, 0.3]} castShadow>
              <boxGeometry args={[0.82, 2.3, 0.82]} />
              <meshStandardMaterial
                color={destination.secondaryColor}
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost * 0.75}
                roughness={0.4}
              />
            </mesh>
            <mesh position={[0, 1.65, -0.2]} castShadow>
              <boxGeometry args={[0.92, 3.3, 0.92]} />
              <meshStandardMaterial
                color={destination.accentColor}
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost}
                roughness={0.35}
              />
            </mesh>
            <mesh position={[0.88, 1.35, 0.35]} castShadow>
              <boxGeometry args={[0.78, 2.7, 0.78]} />
              <meshStandardMaterial
                color="#a8d8ea"
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost * 0.8}
                roughness={0.38}
              />
            </mesh>
            {/* Floating skybridge prism */}
            <mesh ref={crownRef} position={[0, 3.55, 0]} castShadow>
              <octahedronGeometry args={[0.55, 0]} />
              <meshStandardMaterial
                color="#fff5f2"
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost + 0.28}
                flatShading
              />
            </mesh>
          </group>
        );

      case 'chronos_obelisk':
        return (
          <group name="sculpture-chronos-obelisk">
            {[0, 1, 2, 3].map((tier) => {
              const y = 0.55 + tier * 0.68;
              const radius = 1.15 - tier * 0.18;
              return (
                <mesh
                  key={tier}
                  position={[0, y, 0]}
                  rotation={[0, tier * 0.35, 0]}
                  castShadow
                >
                  <cylinderGeometry args={[radius * 0.82, radius, 0.48, 6]} />
                  <meshStandardMaterial
                    color={
                      tier % 2 === 0
                        ? destination.accentColor
                        : destination.secondaryColor
                    }
                    emissive={destination.emissiveColor}
                    emissiveIntensity={emissiveBoost * (0.65 + tier * 0.1)}
                    flatShading
                  />
                </mesh>
              );
            })}
            <mesh ref={crownRef} position={[0, 3.35, 0]} castShadow>
              <coneGeometry args={[0.55, 1.1, 6]} />
              <meshStandardMaterial
                color="#f7f0ff"
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost + 0.24}
                flatShading
              />
            </mesh>
          </group>
        );

      case 'resonance_beacon':
      default:
        return (
          <group name="sculpture-resonance-beacon">
            <mesh position={[0, 1.35, 0]} castShadow>
              <cylinderGeometry args={[0.35, 0.95, 2.7, 8]} />
              <meshStandardMaterial
                color={destination.accentColor}
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost}
                flatShading
              />
            </mesh>
            <mesh position={[0, 2.35, 0]} rotation={[0.35, 0, 0]}>
              <torusGeometry args={[1.05, 0.12, 8, 20]} />
              <meshStandardMaterial
                color={destination.secondaryColor}
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost + 0.15}
              />
            </mesh>
            <mesh ref={crownRef} position={[0, 3.25, 0]} castShadow>
              <octahedronGeometry args={[0.65, 0]} />
              <meshStandardMaterial
                color="#eafffa"
                emissive={destination.emissiveColor}
                emissiveIntensity={emissiveBoost + 0.3}
                flatShading
              />
            </mesh>
          </group>
        );
    }
  };

  const statusText = isCurrent
    ? 'Parked Here'
    : isTarget && isTravelling
    ? 'Approaching…'
    : isVisited
    ? 'Visited'
    : 'Click to Travel';

  return (
    <group
      name={`landmark-${destination.id}`}
      position={[
        tf.sculpturePosition.x,
        tf.sculpturePosition.y,
        tf.sculpturePosition.z,
      ]}
      rotation={[0, tf.rotationY, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Stepped octagonal plinth base */}
      <mesh position={[0, 0.14, 0]} receiveShadow>
        <cylinderGeometry args={[1.85, 2.15, 0.28, 8]} />
        <meshStandardMaterial
          color="#edf4fb"
          emissive={destination.secondaryColor}
          emissiveIntensity={isHighlighted ? 0.35 : 0.08}
          roughness={0.6}
        />
      </mesh>

      {/* Glowing status ring around plinth */}
      <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.45, 1.72, 24]} />
        <meshStandardMaterial
          color={destination.accentColor}
          emissive={destination.emissiveColor}
          emissiveIntensity={isHighlighted ? 0.75 : isVisited ? 0.35 : 0.15}
        />
      </mesh>

      {/* Main sculptural installation */}
      <group ref={sculptureRef}>{renderSculptureGeometry()}</group>

      {/* Interactive 3D projected HTML label for clear destination identification */}
      <Html position={[0, 4.35, 0]} center>
        <button
          type="button"
          className={`landmark-world-badge ${
            isCurrent ? 'is-current' : ''
          } ${isTarget && isTravelling ? 'is-target' : ''} ${
            isVisited ? 'is-visited' : ''
          } ${isHovered ? 'is-hovered' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(destination.id);
          }}
          onMouseEnter={() => onHoverChange(destination.id)}
          onMouseLeave={() => onHoverChange(null)}
          aria-label={`Select destination ${destination.label} (${statusText})`}
          data-testid={`landmark-badge-${destination.id}`}
        >
          <span
            className="landmark-badge-dot"
            style={{ backgroundColor: destination.accentColor }}
          />
          <span className="landmark-badge-order">
            0{destination.order + 1}
          </span>
          <span className="landmark-badge-name">{destination.label}</span>
          {(isHovered || isCurrent || (isTarget && isTravelling)) && (
            <span className="landmark-badge-status">{statusText}</span>
          )}
        </button>
      </Html>
    </group>
  );
};
