'use client';

import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  createInitialNavigationState,
  navigationReducer,
} from '../../lib/navigation/navigationState';
import { soundController } from '../../lib/performance/qualitySettings';
import { DestinationId } from '../../types/portfolio';
import { CompactNavbar } from '../navigation/CompactNavbar';
import { DestinationDock } from '../navigation/DestinationDock';
import { FloatingContentPanel } from '../panels/FloatingContentPanel';
import { ProjectDetailOverlay } from '../panels/ProjectDetailOverlay';
import { ErrorFallback } from '../ui/ErrorFallback';
import { LoadingScreen } from '../ui/LoadingScreen';
import { ExperienceCanvas } from './ExperienceCanvas';

export const PortfolioExperience: React.FC = () => {
  const [navState, dispatch] = useReducer(
    navigationReducer,
    undefined,
    () => createInitialNavigationState()
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const lastTriggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const prevTravellingRef = useRef<boolean>(false);

  // Detect viewport size and prefers-reduced-motion media query
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateViewport = () => {
      setIsMobile(window.innerWidth < 860);
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);

    const motionQuery = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    if (motionQuery && motionQuery.matches) {
      dispatch({ type: 'SET_REDUCED_MOTION', reducedMotion: true });
    }
    const handleMotionChange = (e: MediaQueryListEvent) => {
      dispatch({ type: 'SET_REDUCED_MOTION', reducedMotion: e.matches });
    };
    if (motionQuery && motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    }

    return () => {
      window.removeEventListener('resize', updateViewport);
      if (motionQuery && motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange);
      }
    };
  }, []);

  // Automatic loading progress and short cinematic reveal sequence
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let progress = 25;
    dispatch({ type: 'SET_LOADING_PROGRESS', progress });

    const progressTimer = window.setInterval(() => {
      progress = Math.min(100, progress + 38);
      dispatch({ type: 'SET_LOADING_PROGRESS', progress });
      if (progress >= 100) {
        window.clearInterval(progressTimer);
        dispatch({ type: 'COMPLETE_LOADING', nowMs: performance.now() });
      }
    }, 80);

    return () => {
      window.clearInterval(progressTimer);
    };
  }, []);

  useEffect(() => {
    if (navState.phase !== 'reveal') return;
    const revealDurationMs = navState.reducedMotion ? 50 : 420;
    const timer = window.setTimeout(() => {
      dispatch({ type: 'COMPLETE_REVEAL' });
    }, revealDurationMs);
    return () => {
      window.clearTimeout(timer);
    };
  }, [navState.phase, navState.reducedMotion]);

  // Sound effect synchronization on arrival
  useEffect(() => {
    if (prevTravellingRef.current && !navState.isTravelling) {
      soundController.playArrivalCue();
    }
    prevTravellingRef.current = navState.isTravelling;
  }, [navState.isTravelling]);

  // Fallback travel ticker when WebGL canvas is unavailable
  useEffect(() => {
    if (navState.webglAvailable || !navState.isTravelling) return;
    let lastTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      dispatch({ type: 'STEP_TRAVEL', deltaSec: dt, nowMs: now });
      frameId = window.requestAnimationFrame(tick);
    };
    frameId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [navState.webglAvailable, navState.isTravelling]);

  const handleSelectDestination = useCallback(
    (destinationId: DestinationId) => {
      soundController.playSelectCue();
      dispatch({
        type: 'SELECT_DESTINATION',
        destinationId,
        nowMs: typeof performance !== 'undefined' ? performance.now() : 0,
      });
    },
    []
  );

  const handleHoverLandmark = useCallback(
    (destinationId: DestinationId | null) => {
      dispatch({ type: 'HOVER_LANDMARK', destinationId });
    },
    []
  );

  const handleStepTravel = useCallback((deltaSec: number) => {
    dispatch({
      type: 'STEP_TRAVEL',
      deltaSec,
      nowMs: typeof performance !== 'undefined' ? performance.now() : 0,
    });
  }, []);

  const handleOpenProjectDetail = useCallback(
    (projectId: string, triggerElement: HTMLButtonElement | null) => {
      lastTriggerButtonRef.current = triggerElement;
      soundController.playSelectCue();
      dispatch({ type: 'OPEN_PROJECT_DETAIL', projectId });
    },
    []
  );

  const handleCloseProjectDetail = useCallback(() => {
    dispatch({ type: 'CLOSE_PROJECT_DETAIL' });
    window.setTimeout(() => {
      if (lastTriggerButtonRef.current) {
        lastTriggerButtonRef.current.focus();
      }
    }, 20);
  }, []);

  const handleToggleSound = useCallback(() => {
    const next = !navState.soundEnabled;
    soundController.setEnabled(next);
    dispatch({ type: 'TOGGLE_SOUND', enabled: next });
    if (next) {
      soundController.playSelectCue();
    }
  }, [navState.soundEnabled]);

  const handleToggleReducedMotion = useCallback(() => {
    dispatch({
      type: 'SET_REDUCED_MOTION',
      reducedMotion: !navState.reducedMotion,
    });
  }, [navState.reducedMotion]);

  const handleWebGLError = useCallback(() => {
    dispatch({ type: 'SET_WEBGL_AVAILABLE', available: false });
  }, []);

  return (
    <main
      className={`portfolio-viewport ${
        isMobile ? 'is-mobile-viewport' : 'is-desktop-viewport'
      } ${navState.reducedMotion ? 'is-reduced-motion' : ''}`}
      data-testid="portfolio-viewport"
      data-phase={navState.phase}
      data-current-landmark={navState.currentLandmark || 'none'}
      data-target-destination={navState.targetDestination}
      data-is-travelling={String(navState.isTravelling)}
      data-route-u={navState.currentU.toFixed(3)}
    >
      {/* 3D Interactive Diorama World or Resilient Fallback */}
      {navState.webglAvailable ? (
        <ExperienceCanvas
          navState={navState}
          isMobile={isMobile}
          onSelectDestination={handleSelectDestination}
          onHoverLandmark={handleHoverLandmark}
          onStepTravel={handleStepTravel}
          onWebGLError={handleWebGLError}
        />
      ) : (
        <ErrorFallback
          navState={navState}
          onSelectDestination={handleSelectDestination}
        />
      )}

      {/* Initial Expanded Navigation Dock (visible at Intro and restored on return to Intro) */}
      <DestinationDock
        navState={navState}
        onSelectDestination={handleSelectDestination}
        onToggleSound={handleToggleSound}
        onToggleReducedMotion={handleToggleReducedMotion}
      />

      {/* Compact Fixed Navbar (visible after first destination selection away from Intro) */}
      <CompactNavbar
        navState={navState}
        onSelectDestination={handleSelectDestination}
        onToggleSound={handleToggleSound}
        onToggleReducedMotion={handleToggleReducedMotion}
      />

      {/* Adaptive Floating Content Panel (opens on arrival, stays closed during travel) */}
      <FloatingContentPanel
        navState={navState}
        onSelectDestination={handleSelectDestination}
        onOpenProjectDetail={handleOpenProjectDetail}
      />

      {/* Rich Project Detail Overlay Modal */}
      <ProjectDetailOverlay
        activeProjectId={navState.activeProjectId}
        onClose={handleCloseProjectDetail}
      />

      {/* Pastel Loading Overlay */}
      <LoadingScreen
        phase={navState.phase}
        progress={navState.loadingProgress}
      />
    </main>
  );
};
