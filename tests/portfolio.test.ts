import assert from 'assert';
import {
  DESTINATION_ORDER,
  DESTINATIONS,
  getDestinationById,
  PORTFOLIO_DATA,
} from '../src/data/portfolio';
import {
  createInitialNavigationState,
  navigationReducer,
} from '../src/lib/navigation/navigationState';
import {
  computeTravelPlan,
  evaluateTravelKinematics,
  getAllLandmarkTransforms,
  getRouteDistanceBetween,
  getTotalRouteLength,
  sampleRouteAt,
} from '../src/lib/navigation/routeController';

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

export function runPortfolioTestSuite(): TestResult[] {
  const results: TestResult[] = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err) {
      results.push({
        name,
        passed: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // 1. Data Integrity & Six Destinations Order
  test('Portfolio data defines 6 destinations in exact Intro -> About -> Skills -> Projects -> Experience -> Contact order', () => {
    assert.strictEqual(DESTINATIONS.length, 6);
    assert.deepStrictEqual(
      DESTINATIONS.map((d) => d.id),
      ['intro', 'about', 'skills', 'projects', 'experience', 'contact']
    );
    assert.deepStrictEqual(DESTINATION_ORDER, [
      'intro',
      'about',
      'skills',
      'projects',
      'experience',
      'contact',
    ]);
    // Verify strictly increasing routeU along the continuous road
    for (let i = 1; i < DESTINATIONS.length; i++) {
      assert.ok(
        DESTINATIONS[i].routeU > DESTINATIONS[i - 1].routeU,
        `Expected routeU of ${DESTINATIONS[i].id} to be greater than ${DESTINATIONS[i - 1].id}`
      );
    }
  });

  test('Portfolio data clearly identifies demonstration content and includes 3 featured project themes', () => {
    assert.strictEqual(PORTFOLIO_DATA.isDemonstrationContent, true);
    assert.ok(
      PORTFOLIO_DATA.demonstrationNotice.toLowerCase().includes('demonstration')
    );
    assert.strictEqual(PORTFOLIO_DATA.projects.length, 3);
    const categories = PORTFOLIO_DATA.projects.map((p) => p.category);
    assert.deepStrictEqual(categories, [
      'Backend API',
      'Cloud Infrastructure',
      'CI/CD Automation',
    ]);
  });

  // 2. Continuous Road & CatmullRomCurve3 Mathematics
  test('Continuous road CatmullRomCurve3 computes positive arc-length and smooth tangents', () => {
    const totalLen = getTotalRouteLength();
    assert.ok(totalLen > 60 && totalLen < 200, `Unexpected route length: ${totalLen}`);

    const s0 = sampleRouteAt(0);
    const sMid = sampleRouteAt(0.5);
    const s1 = sampleRouteAt(1);

    // Tangent should be normalized
    const tanLen = Math.hypot(sMid.tangent.x, sMid.tangent.y, sMid.tangent.z);
    assert.ok(Math.abs(tanLen - 1) < 1e-3);

    // Endpoints must be distinct
    const distEnds = Math.hypot(
      s1.position.x - s0.position.x,
      s1.position.z - s0.position.z
    );
    assert.ok(distEnds > 30);

    // All 6 landmark transforms must have valid distinct coordinates
    const transforms = getAllLandmarkTransforms();
    assert.strictEqual(Object.keys(transforms).length, 6);
  });

  test('Travel kinematics follow gentle departure, cruising, braking, and arrival settling', () => {
    const introU = getDestinationById('intro').routeU;
    const plan = computeTravelPlan(introU, 'projects', false, 0);
    assert.strictEqual(plan.direction, 1);
    assert.ok(plan.durationSec >= 1.15 && plan.durationSec <= 3.65);

    const kStart = evaluateTravelKinematics(plan, 0);
    assert.strictEqual(kStart.arrived, false);
    assert.ok(Math.abs(kStart.u - introU) < 1e-6);
    assert.strictEqual(kStart.normalizedSpeed, 0);

    const kMid = evaluateTravelKinematics(plan, plan.durationSec * 0.5);
    assert.ok(kMid.normalizedSpeed > 0.9);
    assert.ok(kMid.u > introU && kMid.u < plan.toU);

    const kBrake = evaluateTravelKinematics(plan, plan.durationSec * 0.78);
    assert.strictEqual(kBrake.isBraking, true);

    const kEnd = evaluateTravelKinematics(plan, plan.durationSec + 0.01);
    assert.strictEqual(kEnd.arrived, true);
    assert.ok(Math.abs(kEnd.u - plan.toU) < 1e-6);
  });

  // 3. Shared Navigation State Machine & Reducer Synchronization
  test('Initial loading and reveal transition into settled Welcome state at Intro', () => {
    let state = createInitialNavigationState();
    assert.strictEqual(state.phase, 'loading');
    assert.strictEqual(state.visiblePanel, null);

    state = navigationReducer(state, { type: 'COMPLETE_LOADING' });
    assert.strictEqual(state.phase, 'reveal');

    state = navigationReducer(state, { type: 'COMPLETE_REVEAL' });
    assert.strictEqual(state.phase, 'idle');
    assert.strictEqual(state.currentLandmark, 'intro');
    assert.strictEqual(state.visiblePanel, 'intro');
    assert.strictEqual(state.isDockExpanded, true);
    assert.strictEqual(state.isTravelling, false);
  });

  test('First destination selection collapses expanded dock, closes panel during travel, and opens target panel only on arrival', () => {
    let state = createInitialNavigationState({ skipLoading: true });
    assert.strictEqual(state.isDockExpanded, true);
    assert.strictEqual(state.visiblePanel, 'intro');

    // Select About
    state = navigationReducer(state, {
      type: 'SELECT_DESTINATION',
      destinationId: 'about',
    });

    assert.strictEqual(state.isDockExpanded, false, 'Dock must collapse on first selection');
    assert.strictEqual(state.isTravelling, true);
    assert.strictEqual(state.targetDestination, 'about');
    assert.strictEqual(state.currentLandmark, null, 'Must not claim arrival while in transit');
    assert.strictEqual(state.visiblePanel, null, 'Content panel must remain closed during travel');
    assert.ok(!state.visitedLandmarks.includes('about'), 'Must not mark visited before arrival');

    // Step travel halfway
    const halfSec = (state.activeTravel?.durationSec || 1.5) * 0.5;
    state = navigationReducer(state, { type: 'STEP_TRAVEL', deltaSec: halfSec });
    assert.strictEqual(state.isTravelling, true);
    assert.strictEqual(state.visiblePanel, null);
    assert.ok(state.currentU > getDestinationById('intro').routeU);
    assert.ok(state.currentU < getDestinationById('about').routeU);

    // Complete arrival
    state = navigationReducer(state, { type: 'STEP_TRAVEL', deltaSec: halfSec + 0.2 });
    assert.strictEqual(state.isTravelling, false);
    assert.strictEqual(state.currentLandmark, 'about');
    assert.strictEqual(state.visiblePanel, 'about');
    assert.ok(state.visitedLandmarks.includes('about'));
    assert.ok(
      Math.abs(state.currentU - getDestinationById('about').routeU) < 1e-5
    );
  });

  test('Latest-destination-wins rule: rapid mid-journey destination changes continue from currentU without teleporting or queuing', () => {
    let state = createInitialNavigationState({ skipLoading: true });

    // Start Intro -> About
    state = navigationReducer(state, {
      type: 'SELECT_DESTINATION',
      destinationId: 'about',
    });
    // Advance 0.5s along the road
    state = navigationReducer(state, { type: 'STEP_TRAVEL', deltaSec: 0.25 });
    state = navigationReducer(state, { type: 'STEP_TRAVEL', deltaSec: 0.25 });
    const midJourneyU = state.currentU;
    assert.ok(midJourneyU > getDestinationById('intro').routeU);

    // Rapidly select Skills, then Projects, then Contact while car is moving
    state = navigationReducer(state, {
      type: 'SELECT_DESTINATION',
      destinationId: 'skills',
    });
    assert.strictEqual(state.targetDestination, 'skills');
    assert.ok(Math.abs(state.currentU - midJourneyU) < 1e-6, 'Must not teleport on interruption');

    state = navigationReducer(state, {
      type: 'SELECT_DESTINATION',
      destinationId: 'projects',
    });
    state = navigationReducer(state, {
      type: 'SELECT_DESTINATION',
      destinationId: 'contact',
    });

    assert.strictEqual(state.targetDestination, 'contact');
    assert.strictEqual(state.activeTravel?.fromU, midJourneyU);
    assert.strictEqual(state.visiblePanel, null);
    assert.ok(!state.visitedLandmarks.includes('about'));
    assert.ok(!state.visitedLandmarks.includes('skills'));
    assert.ok(!state.visitedLandmarks.includes('projects'));

    // Drive all the way to Contact
    for (let i = 0; i < 30 && state.isTravelling; i++) {
      state = navigationReducer(state, { type: 'STEP_TRAVEL', deltaSec: 0.2 });
    }

    assert.strictEqual(state.isTravelling, false);
    assert.strictEqual(state.currentLandmark, 'contact');
    assert.strictEqual(state.visiblePanel, 'contact');
    assert.ok(state.visitedLandmarks.includes('contact'));
    // Abandoned intermediate targets must NOT have their panels opened or be falsely marked visited
    assert.ok(!state.visitedLandmarks.includes('about'));
  });

  test('Bidirectional travel and Returning to Intro restores expanded dock and Welcome panel', () => {
    let state = createInitialNavigationState({ skipLoading: true });

    // Travel forward to Experience
    state = navigationReducer(state, {
      type: 'SELECT_DESTINATION',
      destinationId: 'experience',
    });
    assert.strictEqual(state.direction, 1);
    for (let i = 0; i < 30 && state.isTravelling; i++) {
      state = navigationReducer(state, { type: 'STEP_TRAVEL', deltaSec: 0.2 });
    }
    assert.strictEqual(state.currentLandmark, 'experience');
    assert.strictEqual(state.isDockExpanded, false);

    // Travel backwards along the road to Intro
    state = navigationReducer(state, {
      type: 'SELECT_DESTINATION',
      destinationId: 'intro',
    });
    assert.strictEqual(state.direction, -1);
    assert.strictEqual(state.isTravelling, true);
    assert.strictEqual(state.visiblePanel, null);

    // Step partway in reverse and verify u decreases smoothly
    const startReverseU = state.currentU;
    state = navigationReducer(state, { type: 'STEP_TRAVEL', deltaSec: 0.25 });
    assert.ok(state.currentU < startReverseU, 'Expected currentU to decrease during reverse travel');

    // Finish reverse journey to Intro
    for (let i = 0; i < 30 && state.isTravelling; i++) {
      state = navigationReducer(state, { type: 'STEP_TRAVEL', deltaSec: 0.2 });
    }

    assert.strictEqual(state.isTravelling, false);
    assert.strictEqual(state.currentLandmark, 'intro');
    assert.strictEqual(state.visiblePanel, 'intro');
    assert.strictEqual(state.isDockExpanded, true, 'Expanded dock must restore upon arrival at Intro');
  });

  test('Project Detail Overlay opens at Projects, closes cleanly, and closes automatically if user selects another destination', () => {
    let state = createInitialNavigationState({ skipLoading: true });
    state = navigationReducer(state, {
      type: 'SELECT_DESTINATION',
      destinationId: 'projects',
    });
    for (let i = 0; i < 30 && state.isTravelling; i++) {
      state = navigationReducer(state, { type: 'STEP_TRAVEL', deltaSec: 0.2 });
    }
    assert.strictEqual(state.currentLandmark, 'projects');

    // Open project detail overlay
    state = navigationReducer(state, {
      type: 'OPEN_PROJECT_DETAIL',
      projectId: 'aethergate-api-mesh',
    });
    assert.strictEqual(state.phase, 'project_detail');
    assert.strictEqual(state.activeProjectId, 'aethergate-api-mesh');

    // Close overlay returns to Projects panel
    state = navigationReducer(state, { type: 'CLOSE_PROJECT_DETAIL' });
    assert.strictEqual(state.phase, 'idle');
    assert.strictEqual(state.activeProjectId, null);
    assert.strictEqual(state.visiblePanel, 'projects');

    // Reopen and then select Contact from navbar: overlay must close cleanly and travel must begin
    state = navigationReducer(state, {
      type: 'OPEN_PROJECT_DETAIL',
      projectId: 'stratos-cloud-fabric',
    });
    state = navigationReducer(state, {
      type: 'SELECT_DESTINATION',
      destinationId: 'contact',
    });
    assert.strictEqual(state.activeProjectId, null);
    assert.strictEqual(state.isTravelling, true);
    assert.strictEqual(state.targetDestination, 'contact');
  });

  test('Reduced-motion mode shortens travel duration while preserving route and state synchronization', () => {
    let state = createInitialNavigationState({
      skipLoading: true,
      reducedMotion: true,
    });
    const dist = getRouteDistanceBetween(0.05, 0.95);
    assert.ok(dist > 40);

    state = navigationReducer(state, {
      type: 'SELECT_DESTINATION',
      destinationId: 'contact',
    });
    assert.ok(
      (state.activeTravel?.durationSec || 99) <= 0.65,
      'Reduced motion duration should be <= 0.65s'
    );
  });

  return results;
}
