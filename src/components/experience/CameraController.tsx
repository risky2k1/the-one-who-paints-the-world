import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { getDestinationById } from '../../data/portfolio';
import {
  getLandmarkTransform,
  sampleRouteAt,
} from '../../lib/navigation/routeController';
import { NavigationState } from '../../types/portfolio';

export interface CameraControllerProps {
  navState: NavigationState;
  isMobile: boolean;
}

/**
 * Automatic isometric-diorama camera controller.
 * No manual OrbitControls are exposed; camera framing is 100% coordinated with
 * the experience phase, vehicle route position, active landmark, and floating UI panel side.
 */
export const CameraController: React.FC<CameraControllerProps> = ({
  navState,
  isMobile,
}) => {
  const { camera, size } = useThree();
  const currentPosRef = useRef<THREE.Vector3>(new THREE.Vector3(36, 33, 36));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.5, 0));
  const currentZoomRef = useRef<number>(25);
  const initializedRef = useRef<boolean>(false);

  useFrame((_state, delta) => {
    const dt = Math.min(0.1, Math.max(0.001, delta));
    const carSample = sampleRouteAt(navState.currentU);
    const targetPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();
    let desiredZoom = 1.0;

    if (navState.phase === 'loading') {
      targetLookAt.set(0, 0.5, 0);
      targetPos.set(42, 39, 42);
      desiredZoom = isMobile ? 0.68 : 0.88;
    } else if (navState.phase === 'reveal') {
      targetLookAt.set(-4.8, 0.4, 3.8);
      targetPos.set(29, 31, 38);
      desiredZoom = isMobile ? 0.76 : 0.94;
    } else if (navState.isTravelling && navState.activeTravel) {
      const leadDistance = 2.8 * navState.direction;
      const leadX = carSample.position.x + carSample.tangent.x * leadDistance;
      const leadZ = carSample.position.z + carSample.tangent.z * leadDistance;

      const focusX = leadX * 0.62;
      const focusZ = leadZ * 0.62;

      targetLookAt.set(focusX, carSample.position.y + 0.5, focusZ);
      targetPos.set(focusX + 29, carSample.position.y + 25, focusZ + 29);
      desiredZoom = isMobile ? 0.92 : 1.12;
    } else {
      const activeId = navState.currentLandmark || navState.targetDestination;
      const dest = getDestinationById(activeId);
      const landmarkTf = getLandmarkTransform(activeId);
      const preset = dest.cameraPreset;

      if (activeId === 'intro') {
        const shift = isMobile ? preset.mobileLookAtShift : preset.lookAtShift;
        targetLookAt.set(shift.x, 0.4 + shift.y, shift.z);
        targetPos.set(
          shift.x + preset.cameraOffset.x,
          preset.cameraOffset.y,
          shift.z + preset.cameraOffset.z
        );
        desiredZoom = isMobile
          ? preset.mobileZoomMultiplier
          : preset.zoomMultiplier;
      } else {
        const midX =
          (carSample.position.x + landmarkTf.sculpturePosition.x) * 0.5;
        const midY =
          (carSample.position.y + landmarkTf.sculpturePosition.y) * 0.5;
        const midZ =
          (carSample.position.z + landmarkTf.sculpturePosition.z) * 0.5;

        const shift = isMobile ? preset.mobileLookAtShift : preset.lookAtShift;
        const rightAxisX = 0.707;
        const rightAxisZ = -0.707;
        const lateralWorldShift = isMobile ? 0 : shift.x;

        targetLookAt.set(
          midX + rightAxisX * lateralWorldShift,
          midY + (isMobile ? shift.y : 0.6),
          midZ + rightAxisZ * lateralWorldShift
        );

        targetPos.set(
          targetLookAt.x + preset.cameraOffset.x,
          targetLookAt.y + preset.cameraOffset.y,
          targetLookAt.z + preset.cameraOffset.z
        );

        desiredZoom = isMobile
          ? preset.mobileZoomMultiplier
          : preset.zoomMultiplier;
      }
    }

    const aspect = size.width / Math.max(1, size.height);
    const aspectScale = aspect < 1 ? Math.max(0.68, aspect * 0.95) : 1.0;
    const baseZoom = Math.max(1, size.height) / 32;
    const finalZoom = desiredZoom * aspectScale * baseZoom;

    if (!initializedRef.current || navState.reducedMotion) {
      const snapFactor = navState.reducedMotion ? Math.min(1, dt * 14) : 1;
      if (!initializedRef.current) {
        currentPosRef.current.copy(targetPos);
        currentLookAtRef.current.copy(targetLookAt);
        currentZoomRef.current = finalZoom;
        initializedRef.current = true;
      } else {
        currentPosRef.current.lerp(targetPos, snapFactor);
        currentLookAtRef.current.lerp(targetLookAt, snapFactor);
        currentZoomRef.current = THREE.MathUtils.lerp(
          currentZoomRef.current,
          finalZoom,
          snapFactor
        );
      }
    } else {
      const smoothSpeed = navState.isTravelling ? 4.2 : 3.2;
      const alpha = 1 - Math.exp(-smoothSpeed * dt);
      currentPosRef.current.lerp(targetPos, alpha);
      currentLookAtRef.current.lerp(targetLookAt, alpha);
      currentZoomRef.current = THREE.MathUtils.lerp(
        currentZoomRef.current,
        finalZoom,
        alpha
      );
    }

    camera.position.copy(currentPosRef.current);
    camera.lookAt(currentLookAtRef.current);
    if ('zoom' in camera) {
      (camera as THREE.OrthographicCamera).zoom = currentZoomRef.current;
      camera.updateProjectionMatrix();
    }
  });

  return null;
};
