import { DESTINATION_ORDER, getDestinationById } from '../../data/portfolio';
import {
  DestinationId,
  NavigationState,
} from '../../types/portfolio';
import {
  clampU,
  computeTravelPlan,
  evaluateTravelKinematics,
} from './routeController';

export type NavigationAction =
  | { type: 'SET_LOADING_PROGRESS'; progress: number }
  | { type: 'COMPLETE_LOADING'; nowMs?: number }
  | { type: 'COMPLETE_REVEAL' }
  | { type: 'SELECT_DESTINATION'; destinationId: DestinationId; nowMs?: number }
  | { type: 'STEP_TRAVEL'; deltaSec: number; nowMs?: number }
  | { type: 'HOVER_LANDMARK'; destinationId: DestinationId | null }
  | { type: 'OPEN_PROJECT_DETAIL'; projectId: string }
  | { type: 'CLOSE_PROJECT_DETAIL' }
  | { type: 'SET_REDUCED_MOTION'; reducedMotion: boolean }
  | { type: 'TOGGLE_SOUND'; enabled?: boolean }
  | { type: 'SET_WEBGL_AVAILABLE'; available: boolean };

export function isValidDestinationId(value: unknown): value is DestinationId {
  return (
    typeof value === 'string' &&
    (DESTINATION_ORDER as string[]).includes(value)
  );
}

export function createInitialNavigationState(
  options?: Partial<{
    reducedMotion: boolean;
    webglAvailable: boolean;
    skipLoading: boolean;
  }>
): NavigationState {
  const intro = getDestinationById('intro');
  const skipLoading = options?.skipLoading ?? false;

  return {
    phase: skipLoading ? 'idle' : 'loading',
    currentU: intro.routeU,
    velocityU: 0,
    journeyProgress: 0,
    currentLandmark: 'intro',
    lastArrivedLandmark: 'intro',
    targetDestination: 'intro',
    isTravelling: false,
    direction: 1,
    activeTravel: null,
    visitedLandmarks: ['intro'],
    isDockExpanded: true,
    visiblePanel: skipLoading ? 'intro' : null,
    activeProjectId: null,
    hoveredLandmark: null,
    reducedMotion: options?.reducedMotion ?? false,
    soundEnabled: false,
    loadingProgress: skipLoading ? 100 : 0,
    webglAvailable: options?.webglAvailable ?? true,
  };
}

/**
 * Authoritative navigation reducer synchronizing:
 * - Destination dock & compact navbar
 * - Direct 3D landmark clicks
 * - Continuous road vehicle movement & latest-destination-wins interruption
 * - Arrival state & visited landmarks
 * - Floating content panels & project detail overlay
 */
export function navigationReducer(
  state: NavigationState,
  action: NavigationAction
): NavigationState {
  switch (action.type) {
    case 'SET_LOADING_PROGRESS': {
      const clamped = Math.max(0, Math.min(100, action.progress));
      return {
        ...state,
        loadingProgress: clamped,
      };
    }

    case 'COMPLETE_LOADING': {
      if (state.phase !== 'loading') {
        return state;
      }
      if (state.reducedMotion) {
        return {
          ...state,
          loadingProgress: 100,
          phase: 'idle',
          currentLandmark: 'intro',
          visiblePanel: 'intro',
          isDockExpanded: true,
        };
      }
      return {
        ...state,
        loadingProgress: 100,
        phase: 'reveal',
        visiblePanel: null,
      };
    }

    case 'COMPLETE_REVEAL': {
      if (state.phase !== 'reveal' && state.phase !== 'loading') {
        return state;
      }
      return {
        ...state,
        phase: 'idle',
        currentLandmark: 'intro',
        lastArrivedLandmark: 'intro',
        targetDestination: 'intro',
        isTravelling: false,
        activeTravel: null,
        isDockExpanded: true,
        visiblePanel: 'intro',
      };
    }

    case 'SELECT_DESTINATION': {
      // Guard against invalid destination IDs or input during initial loading/reveal
      if (!isValidDestinationId(action.destinationId)) {
        return state;
      }
      if (state.phase === 'loading' || state.phase === 'reveal') {
        return state;
      }

      const targetId = action.destinationId;
      const targetDest = getDestinationById(targetId);
      const distanceToTargetU = Math.abs(state.currentU - targetDest.routeU);

      // Case 1: Vehicle is already physically parked at this landmark
      if (
        !state.isTravelling &&
        state.currentLandmark === targetId &&
        distanceToTargetU < 0.002
      ) {
        return {
          ...state,
          phase: 'idle',
          targetDestination: targetId,
          currentLandmark: targetId,
          visiblePanel: targetId,
          activeProjectId: null,
          isDockExpanded: targetId === 'intro',
        };
      }

      // Case 2: Vehicle needs to travel from its exact current physical route position (currentU)
      // If already travelling towards an older target, Latest-Destination-Wins immediately overrides it
      const nowMs = action.nowMs ?? 0;
      const plan = computeTravelPlan(
        state.currentU,
        targetId,
        state.reducedMotion,
        nowMs
      );

      // Edge case: vehicle happened to be mid-transit at almost the exact routeU of the newly clicked landmark
      if (plan.durationSec <= 0.0001 || Math.abs(plan.arcDelta) < 0.0005) {
        const nextVisited = state.visitedLandmarks.includes(targetId)
          ? state.visitedLandmarks
          : [...state.visitedLandmarks, targetId];
        return {
          ...state,
          phase: 'idle',
          currentU: targetDest.routeU,
          velocityU: 0,
          journeyProgress: 1,
          currentLandmark: targetId,
          lastArrivedLandmark: targetId,
          targetDestination: targetId,
          isTravelling: false,
          activeTravel: null,
          visitedLandmarks: nextVisited,
          isDockExpanded: targetId === 'intro',
          visiblePanel: targetId,
          activeProjectId: null,
        };
      }

      return {
        ...state,
        phase: 'travelling',
        // Physical currentLandmark is null while in transit—never mark arrived prematurely!
        currentLandmark: null,
        targetDestination: targetId,
        isTravelling: true,
        direction: plan.direction,
        activeTravel: plan,
        journeyProgress: 0,
        // Collapse expanded dock on the first destination selection away from Intro
        isDockExpanded: false,
        // Close any open content panel or project overlay during travel
        visiblePanel: null,
        activeProjectId: null,
      };
    }

    case 'STEP_TRAVEL': {
      if (!state.isTravelling || !state.activeTravel) {
        return state;
      }

      const dt = Math.max(0, action.deltaSec);
      const plan = state.activeTravel;
      const nextElapsed = (plan.elapsedSec || 0) + dt;
      const updatedPlan = {
        ...plan,
        elapsedSec: nextElapsed,
      };

      const kinematics = evaluateTravelKinematics(updatedPlan, nextElapsed);

      if (kinematics.arrived) {
        const arrivedId = plan.targetId;
        const nextVisited = state.visitedLandmarks.includes(arrivedId)
          ? state.visitedLandmarks
          : [...state.visitedLandmarks, arrivedId];

        return {
          ...state,
          phase: 'idle',
          currentU: clampU(plan.toU),
          velocityU: 0,
          journeyProgress: 1,
          currentLandmark: arrivedId,
          lastArrivedLandmark: arrivedId,
          targetDestination: arrivedId,
          isTravelling: false,
          activeTravel: null,
          visitedLandmarks: nextVisited,
          // Returning to Intro restores the expanded navigation dock and Welcome state
          isDockExpanded: arrivedId === 'intro',
          visiblePanel: arrivedId,
          activeProjectId: null,
        };
      }

      const velocityU =
        dt > 1e-5 ? (kinematics.u - state.currentU) / dt : 0;

      return {
        ...state,
        phase: 'travelling',
        currentU: kinematics.u,
        velocityU,
        journeyProgress: kinematics.progress,
        currentLandmark: null,
        activeTravel: updatedPlan,
        visiblePanel: null,
      };
    }

    case 'HOVER_LANDMARK': {
      if (state.hoveredLandmark === action.destinationId) {
        return state;
      }
      return {
        ...state,
        hoveredLandmark: action.destinationId,
      };
    }

    case 'OPEN_PROJECT_DETAIL': {
      // Only open project details when parked at Projects and not travelling
      if (state.isTravelling || state.currentLandmark !== 'projects') {
        return state;
      }
      return {
        ...state,
        phase: 'project_detail',
        activeProjectId: action.projectId,
      };
    }

    case 'CLOSE_PROJECT_DETAIL': {
      if (!state.activeProjectId) {
        return state;
      }
      return {
        ...state,
        phase: state.isTravelling ? 'travelling' : 'idle',
        activeProjectId: null,
        visiblePanel: state.isTravelling ? null : state.currentLandmark,
      };
    }

    case 'SET_REDUCED_MOTION': {
      return {
        ...state,
        reducedMotion: action.reducedMotion,
      };
    }

    case 'TOGGLE_SOUND': {
      const nextSound =
        typeof action.enabled === 'boolean'
          ? action.enabled
          : !state.soundEnabled;
      return {
        ...state,
        soundEnabled: nextSound,
      };
    }

    case 'SET_WEBGL_AVAILABLE': {
      return {
        ...state,
        webglAvailable: action.available,
      };
    }

    default:
      return state;
  }
}
