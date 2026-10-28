export type DestinationId =
  | 'intro'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'contact';

export type ExperiencePhase =
  | 'loading'
  | 'reveal'
  | 'idle'
  | 'travelling'
  | 'project_detail';

export type PanelSide = 'left' | 'right';

export type LandmarkSculptureType =
  | 'aurora_arch'
  | 'harmonic_monoliths'
  | 'polyhedral_gyro'
  | 'isometric_citadel'
  | 'chronos_obelisk'
  | 'resonance_beacon';

export interface Vector3Tuple {
  x: number;
  y: number;
  z: number;
}

export interface CameraFramingPreset {
  /** Camera position offset relative to focus target */
  cameraOffset: Vector3Tuple;
  /** World-space shift applied to camera lookAt target so the panel never obscures car or landmark */
  lookAtShift: Vector3Tuple;
  /** Mobile lookAt shift so bottom sheet never obscures car or landmark */
  mobileLookAtShift: Vector3Tuple;
  /** Orthographic zoom multiplier relative to base overview zoom */
  zoomMultiplier: number;
  /** Mobile zoom multiplier */
  mobileZoomMultiplier: number;
}

export interface DestinationConfig {
  id: DestinationId;
  order: number;
  label: string;
  shortLabel: string;
  subtitle: string;
  tagline: string;
  /** Normalized arc-length parameter u along the continuous road [0, 1] */
  routeU: number;
  /** Offset from road centerline for landmark placement (perpendicular to tangent) */
  lateralOffset: number;
  /** Preferred floating content panel side on desktop */
  panelSide: PanelSide;
  /** Primary pastel hex color for sculpture and UI accents */
  accentColor: string;
  /** Secondary pastel hex color */
  secondaryColor: string;
  /** Emissive highlight hex color */
  emissiveColor: string;
  /** Sculpture archetype identifier */
  sculptureType: LandmarkSculptureType;
  /** Sculpture title shown in subtle caption */
  sculptureName: string;
  /** Camera framing preset for arrival state */
  cameraPreset: CameraFramingPreset;
}

export interface SkillItem {
  name: string;
  level: string;
  context: string;
  highlight?: boolean;
}

export interface SkillGroup {
  id: string;
  title: string;
  badge: string;
  accentColor: string;
  summary: string;
  skills: SkillItem[];
}

export type ProjectCategory =
  | 'Backend API'
  | 'Cloud Infrastructure'
  | 'CI/CD Automation';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectLink {
  label: string;
  /** Configurable demonstration reference identifier (not a fabricated external URL) */
  configKey: string;
  displayTarget: string;
  kind: 'demo' | 'repository' | 'architecture';
}

export interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  shortSummary: string;
  overview: string;
  role: string;
  timeline: string;
  accentColor: string;
  secondaryColor: string;
  architectureDiagramType: 'gateway_mesh' | 'multi_region_k8s' | 'gitops_pipeline';
  challenges: string[];
  outcomes: string[];
  techStack: string[];
  metrics: ProjectMetric[];
  links: ProjectLink[];
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  organizationNote: string;
  location: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  note: string;
  actionType: 'copy' | 'jump_projects' | 'return_intro';
}

export interface PortfolioData {
  isDemonstrationContent: true;
  demonstrationNotice: string;
  persona: {
    name: string;
    role: string;
    specialization: string;
    location: string;
    availabilityBadge: string;
    introHeadline: string;
    introLead: string;
    introHighlights: { label: string; value: string }[];
  };
  about: {
    headline: string;
    narrative: string[];
    pillars: {
      title: string;
      description: string;
      metric: string;
    }[];
  };
  destinations: DestinationConfig[];
  skillGroups: SkillGroup[];
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  contact: {
    headline: string;
    subtitle: string;
    availabilityNote: string;
    channels: ContactChannel[];
  };
}

export interface RouteSample {
  u: number;
  position: Vector3Tuple;
  tangent: Vector3Tuple;
  normal: Vector3Tuple;
  curvature: number;
  headingRad: number;
}

export interface TravelPlan {
  fromU: number;
  toU: number;
  targetId: DestinationId;
  distanceUnits: number;
  arcDelta: number;
  direction: 1 | -1;
  durationSec: number;
  elapsedSec: number;
  startedAtMs: number;
}

export interface NavigationState {
  phase: ExperiencePhase;
  /** Vehicle physical position along the continuous road [0, 1] */
  currentU: number;
  /** Current velocity along u per second */
  velocityU: number;
  /** Normalized progress within current active journey [0, 1] */
  journeyProgress: number;
  /** Only non-null when vehicle is physically parked at a landmark */
  currentLandmark: DestinationId | null;
  /** Most recently arrived landmark */
  lastArrivedLandmark: DestinationId;
  /** Currently selected target destination */
  targetDestination: DestinationId;
  /** Whether the vehicle is physically moving along the road */
  isTravelling: boolean;
  /** Direction of movement along the road: 1 = forward (Intro -> Contact), -1 = reverse */
  direction: 1 | -1;
  /** Active travel plan when isTravelling is true */
  activeTravel: TravelPlan | null;
  /** Landmarks that the vehicle has physically arrived at */
  visitedLandmarks: DestinationId[];
  /** True initially at Intro and when returning to Intro; collapses on first selection away from Intro */
  isDockExpanded: boolean;
  /** Content panel currently open (null during travel) */
  visiblePanel: DestinationId | null;
  /** Project ID currently open in ProjectDetailOverlay, or null */
  activeProjectId: string | null;
  /** Hovered landmark in 3D scene */
  hoveredLandmark: DestinationId | null;
  /** User reduced motion preference or toggle */
  reducedMotion: boolean;
  /** Sound effects toggle (opt-in, default false until user interaction or toggle) */
  soundEnabled: boolean;
  /** Loading progress [0, 100] */
  loadingProgress: number;
  /** WebGL availability flag */
  webglAvailable: boolean;
}
