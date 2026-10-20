import React, { useMemo } from 'react';
import * as THREE from 'three';
import { DESTINATIONS, getDestinationById } from '../../data/portfolio';
import {
  getLandmarkTransform,
  sampleRouteAt,
} from '../../lib/navigation/routeController';
import { DestinationId } from '../../types/portfolio';

export interface RoadProps {
  currentU: number;
  targetDestination: DestinationId;
  isTravelling: boolean;
  segments?: number;
}

/**
 * Generates a continuous physical low-poly road surface along the shared CatmullRomCurve3,
 * complete with raised curbs, subtle center luminous markers, and destination plaza connectors.
 */
export const Road: React.FC<RoadProps> = ({
  currentU,
  targetDestination,
  isTravelling,
  segments = 200,
}) => {
  const targetU = getDestinationById(targetDestination).routeU;
  const minActiveU = Math.min(currentU, targetU);
  const maxActiveU = Math.max(currentU, targetU);

  // Build continuous ribbon geometry for the road bed and curbs from the shared route curve
  const { roadGeometry, leftCurbGeometry, rightCurbGeometry, dashSamples } =
    useMemo(() => {
      const roadHalfWidth = 1.65;
      const curbWidth = 0.24;

      const roadPositions: number[] = [];
      const roadNormals: number[] = [];
      const roadIndices: number[] = [];

      const leftPositions: number[] = [];
      const leftNormals: number[] = [];
      const leftIndices: number[] = [];

      const rightPositions: number[] = [];
      const rightNormals: number[] = [];
      const rightIndices: number[] = [];

      const dashes: {
        u: number;
        pos: [number, number, number];
        rotY: number;
      }[] = [];

      for (let i = 0; i <= segments; i++) {
        const u = i / segments;
        const sample = sampleRouteAt(u);
        const px = sample.position.x;
        const py = sample.position.y;
        const pz = sample.position.z;
        const nx = sample.normal.x;
        const nz = sample.normal.z;

        // Road surface left & right vertices
        roadPositions.push(
          px - nx * roadHalfWidth,
          py + 0.02,
          pz - nz * roadHalfWidth,
          px + nx * roadHalfWidth,
          py + 0.02,
          pz + nz * roadHalfWidth
        );
        roadNormals.push(0, 1, 0, 0, 1, 0);

        // Left curb ribbon
        leftPositions.push(
          px - nx * (roadHalfWidth + curbWidth),
          py + 0.08,
          pz - nz * (roadHalfWidth + curbWidth),
          px - nx * roadHalfWidth,
          py + 0.08,
          pz - nz * roadHalfWidth
        );
        leftNormals.push(0, 1, 0, 0, 1, 0);

        // Right curb ribbon
        rightPositions.push(
          px + nx * roadHalfWidth,
          py + 0.08,
          pz + nz * roadHalfWidth,
          px + nx * (roadHalfWidth + curbWidth),
          py + 0.08,
          pz + nz * (roadHalfWidth + curbWidth)
        );
        rightNormals.push(0, 1, 0, 0, 1, 0);

        if (i < segments) {
          const base = i * 2;
          roadIndices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
          leftIndices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
          rightIndices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
        }

        if (i % 3 === 1 && i < segments - 1) {
          dashes.push({
            u,
            pos: [px, py + 0.055, pz],
            rotY: sample.headingRad,
          });
        }
      }

      const buildBuffer = (
        pos: number[],
        norm: number[],
        ind: number[]
      ): THREE.BufferGeometry => {
        const geom = new THREE.BufferGeometry();
        geom.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(pos, 3)
        );
        geom.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
        geom.setIndex(ind);
        geom.computeBoundingSphere();
        return geom;
      };

      return {
        roadGeometry: buildBuffer(roadPositions, roadNormals, roadIndices),
        leftCurbGeometry: buildBuffer(leftPositions, leftNormals, leftIndices),
        rightCurbGeometry: buildBuffer(
          rightPositions,
          rightNormals,
          rightIndices
        ),
        dashSamples: dashes,
      };
    }, [segments]);

  const landmarkPlazas = useMemo(
    () =>
      DESTINATIONS.map((dest) => {
        const tf = getLandmarkTransform(dest.id);
        return {
          dest,
          tf,
        };
      }),
    []
  );

  return (
    <group name="continuous-road-system">
      {/* Main continuous low-poly road surface */}
      <mesh geometry={roadGeometry} receiveShadow>
        <meshStandardMaterial
          color="#ccd9ea"
          roughness={0.72}
          metalness={0.12}
        />
      </mesh>

      {/* Soft silver-lavender raised curbs */}
      <mesh geometry={leftCurbGeometry}>
        <meshStandardMaterial
          color="#eef4fb"
          emissive="#a8d8ea"
          emissiveIntensity={isTravelling ? 0.22 : 0.08}
          roughness={0.5}
        />
      </mesh>
      <mesh geometry={rightCurbGeometry}>
        <meshStandardMaterial
          color="#eef4fb"
          emissive="#a8d8ea"
          emissiveIntensity={isTravelling ? 0.22 : 0.08}
          roughness={0.5}
        />
      </mesh>

      {/* Centerline luminous guide dashes that highlight the active route segment during travel */}
      <group name="road-guide-dashes">
        {dashSamples.map((dash, idx) => {
          const isInActiveSpan =
            isTravelling &&
            dash.u >= minActiveU - 0.01 &&
            dash.u <= maxActiveU + 0.01;
          const isPassed = dash.u <= currentU + 0.005;

          const color = isInActiveSpan
            ? '#7ce8dc'
            : isPassed
            ? '#92d1df'
            : '#dce7f3';
          const emissive = isInActiveSpan
            ? '#5ec2b7'
            : isPassed
            ? '#6ab7e8'
            : '#b8cbe0';
          const emissiveIntensity = isInActiveSpan
            ? 0.65
            : isPassed
            ? 0.22
            : 0.06;

          return (
            <mesh
              key={idx}
              position={dash.pos}
              rotation={[0, dash.rotY, 0]}
            >
              <boxGeometry args={[0.16, 0.025, 0.58]} />
              <meshStandardMaterial
                color={color}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
                roughness={0.4}
              />
            </mesh>
          );
        })}
      </group>

      {/* Landmark roadside stop markers & plaza connectors */}
      <group name="landmark-road-connectors">
        {landmarkPlazas.map(({ dest, tf }) => {
          const midX = (tf.roadPosition.x + tf.sculpturePosition.x) * 0.5;
          const midY = tf.roadPosition.y + 0.015;
          const midZ = (tf.roadPosition.z + tf.sculpturePosition.z) * 0.5;
          const isTarget = targetDestination === dest.id;

          return (
            <group key={dest.id}>
              {/* Road stop bay ring on the highway */}
              <mesh
                position={[
                  tf.roadPosition.x,
                  tf.roadPosition.y + 0.04,
                  tf.roadPosition.z,
                ]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <ringGeometry args={[0.75, 1.05, 16]} />
                <meshStandardMaterial
                  color={dest.accentColor}
                  emissive={dest.emissiveColor}
                  emissiveIntensity={isTarget ? 0.55 : 0.2}
                />
              </mesh>

              {/* Stepping bridge from road to sculpture plinth */}
              <mesh
                position={[midX, midY, midZ]}
                rotation={[0, tf.rotationY, 0]}
              >
                <boxGeometry args={[1.2, 0.05, Math.abs(dest.lateralOffset) * 0.65]} />
                <meshStandardMaterial
                  color="#e2edf8"
                  emissive={dest.secondaryColor}
                  emissiveIntensity={isTarget ? 0.22 : 0.06}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};
