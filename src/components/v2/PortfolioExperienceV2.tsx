'use client';

import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  createInitialNavigationState,
  navigationReducer,
} from '../../lib/navigation/navigationState';
import { soundController } from '../../lib/performance/qualitySettings';
import { DestinationId } from '../../types/portfolio';
import { ExperienceCanvas } from '../experience/ExperienceCanvas';
import { CompactNavbar } from '../navigation/CompactNavbar';
import { DestinationDock } from '../navigation/DestinationDock';
import { ProjectDetailOverlayV2 } from './ProjectDetailOverlayV2';
import { ErrorFallback } from '../ui/ErrorFallback';
import { LoadingScreen } from '../ui/LoadingScreen';
import { FloatingContentPanelV2 } from './FloatingContentPanelV2';

export const PortfolioExperienceV2: React.FC = () => {
  const [navState, dispatch] = useReducer(
    navigationReducer,
    undefined,
    () => createInitialNavigationState()
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const lastTriggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const prevTravellingRef = useRef<boolean>(false);

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

  useEffect(() => {
    if (prevTravellingRef.current && !navState.isTravelling) {
      soundController.playArrivalCue();
    }
    prevTravellingRef.current = navState.isTravelling;
  }, [navState.isTravelling]);

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
      className="portfolio-viewport"
      data-testid="portfolio-experience-viewport-v2"
      data-destination={navState.currentLandmark || 'in-transit'}
      data-phase={navState.phase}
      data-is-travelling={String(navState.isTravelling)}
      data-route-u={navState.currentU.toFixed(3)}
    >
      <a href="#main-content" className="skip-to-content sr-only focus:not-sr-only">
        Skip to interactive navigation
      </a>

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

      {/* Initial Expanded Navigation Dock */}
      <DestinationDock
        navState={navState}
        onSelectDestination={handleSelectDestination}
        onToggleSound={handleToggleSound}
        onToggleReducedMotion={handleToggleReducedMotion}
      />

      {/* Compact Fixed Navbar */}
      <CompactNavbar
        navState={navState}
        onSelectDestination={handleSelectDestination}
        onToggleSound={handleToggleSound}
        onToggleReducedMotion={handleToggleReducedMotion}
      />

      {/* Tailwind v2 Adaptive Floating Content Panel */}
      <FloatingContentPanelV2
        navState={navState}
        onSelectDestination={handleSelectDestination}
        onOpenProjectDetail={handleOpenProjectDetail}
      />

      {/* Modal Detail Overlay */}
      <ProjectDetailOverlayV2
        activeProjectId={navState.activeProjectId}
        onClose={handleCloseProjectDetail}
      />

      {/* Loading Overlay */}
      <LoadingScreen
        phase={navState.phase}
        progress={navState.loadingProgress}
      />
    </main>
  );
};
