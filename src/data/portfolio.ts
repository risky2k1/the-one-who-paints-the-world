import { DestinationConfig, DestinationId, PortfolioData } from '../types/portfolio';

export const DESTINATION_ORDER: DestinationId[] = [
  'intro',
  'about',
  'skills',
  'projects',
  'experience',
  'contact',
];

export const DESTINATIONS: DestinationConfig[] = [
  {
    id: 'intro',
    order: 0,
    label: 'Intro',
    shortLabel: '01 Intro',
    subtitle: 'Welcome Gate & World Overview',
    tagline: 'Platform Architecture, Cloud Foundations & High-Reliability Systems',
    routeU: 0.05,
    lateralOffset: -4.2,
    panelSide: 'left',
    accentColor: '#5ec2b7',
    secondaryColor: '#a8d8ea',
    emissiveColor: '#7be3d8',
    sculptureType: 'aurora_arch',
    sculptureName: 'Aurora Portal Arch',
    cameraPreset: {
      cameraOffset: { x: 34, y: 31, z: 34 },
      lookAtShift: { x: -6.8, y: 0.2, z: 4.8 },
      mobileLookAtShift: { x: 0, y: -3.5, z: 0 },
      zoomMultiplier: 0.96,
      mobileZoomMultiplier: 0.78,
    },
  },
  {
    id: 'about',
    order: 1,
    label: 'About',
    shortLabel: '02 About',
    subtitle: 'Engineering Philosophy & Approach',
    tagline: 'Designing calm, resilient infrastructure for distributed engineering teams',
    routeU: 0.23,
    lateralOffset: 4.4,
    panelSide: 'right',
    accentColor: '#9b8ce8',
    secondaryColor: '#c3bef0',
    emissiveColor: '#b8acf6',
    sculptureType: 'harmonic_monoliths',
    sculptureName: 'Harmonic Twin Monoliths',
    cameraPreset: {
      cameraOffset: { x: 24, y: 21, z: 25 },
      lookAtShift: { x: 5.2, y: 0.6, z: -1.2 },
      mobileLookAtShift: { x: 0, y: -4.2, z: 0 },
      zoomMultiplier: 1.35,
      mobileZoomMultiplier: 1.05,
    },
  },
  {
    id: 'skills',
    order: 2,
    label: 'Skills',
    shortLabel: '03 Skills',
    subtitle: 'Systems, Cloud & Observability Stack',
    tagline: 'Production toolchains across Kubernetes, Rust/Go services, and GitOps automation',
    routeU: 0.41,
    lateralOffset: -4.5,
    panelSide: 'left',
    accentColor: '#6ab7e8',
    secondaryColor: '#b5deff',
    emissiveColor: '#8cd0ff',
    sculptureType: 'polyhedral_gyro',
    sculptureName: 'Orbital Polyhedral Sanctuary',
    cameraPreset: {
      cameraOffset: { x: 23, y: 20, z: 24 },
      lookAtShift: { x: -5.4, y: 0.6, z: 1.0 },
      mobileLookAtShift: { x: 0, y: -4.2, z: 0 },
      zoomMultiplier: 1.38,
      mobileZoomMultiplier: 1.08,
    },
  },
  {
    id: 'projects',
    order: 3,
    label: 'Projects',
    shortLabel: '04 Projects',
    subtitle: 'Featured Platform & Backend Architecture',
    tagline: 'Deep-dive reference architectures in API gateways, multi-region cloud, and CI/CD',
    routeU: 0.59,
    lateralOffset: 4.6,
    panelSide: 'right',
    accentColor: '#f29b8e',
    secondaryColor: '#f9c6bd',
    emissiveColor: '#ffb5a8',
    sculptureType: 'isometric_citadel',
    sculptureName: 'Modular Isometric Citadel',
    cameraPreset: {
      cameraOffset: { x: 24, y: 21, z: 24 },
      lookAtShift: { x: 5.5, y: 0.7, z: -1.0 },
      mobileLookAtShift: { x: 0, y: -4.2, z: 0 },
      zoomMultiplier: 1.36,
      mobileZoomMultiplier: 1.06,
    },
  },
  {
    id: 'experience',
    order: 4,
    label: 'Experience',
    shortLabel: '05 Experience',
    subtitle: 'Platform Engineering Progression',
    tagline: 'Sample career progression across distributed systems, SRE, and developer platforms',
    routeU: 0.77,
    lateralOffset: -4.4,
    panelSide: 'left',
    accentColor: '#b392f0',
    secondaryColor: '#dec9ff',
    emissiveColor: '#caaef8',
    sculptureType: 'chronos_obelisk',
    sculptureName: 'Chronos Stepped Obelisk',
    cameraPreset: {
      cameraOffset: { x: 24, y: 20, z: 25 },
      lookAtShift: { x: -5.2, y: 0.6, z: 1.2 },
      mobileLookAtShift: { x: 0, y: -4.2, z: 0 },
      zoomMultiplier: 1.36,
      mobileZoomMultiplier: 1.06,
    },
  },
  {
    id: 'contact',
    order: 5,
    label: 'Contact',
    shortLabel: '06 Contact',
    subtitle: 'Connect & Demonstration Channels',
    tagline: 'Configurable contact endpoints and quick journey controls',
    routeU: 0.95,
    lateralOffset: 4.2,
    panelSide: 'right',
    accentColor: '#67ccb8',
    secondaryColor: '#bceee3',
    emissiveColor: '#86e8d4',
    sculptureType: 'resonance_beacon',
    sculptureName: 'Resonance Crystalline Beacon',
    cameraPreset: {
      cameraOffset: { x: 24, y: 21, z: 24 },
      lookAtShift: { x: 5.2, y: 0.6, z: -1.0 },
      mobileLookAtShift: { x: 0, y: -4.2, z: 0 },
      zoomMultiplier: 1.35,
      mobileZoomMultiplier: 1.05,
    },
  },
];

export const PORTFOLIO_DATA: PortfolioData = {
  isDemonstrationContent: true,
  demonstrationNotice:
    'DEMONSTRATION PORTFOLIO: All profile details, metrics, organizations, and project endpoints are sample demonstration content for this interactive 3D architecture showcase.',
  persona: {
    name: 'Sora Lindqvist (Demo Persona)',
    role: 'Staff Platform & Cloud Infrastructure Engineer',
    specialization: 'Distributed Backend APIs • Kubernetes Fabric • GitOps CI/CD • OpenTelemetry',
    location: 'Stockholm / Remote (Sample Profile)',
    availabilityBadge: 'Demo Showcase • Interactive 3D World',
    introHeadline: 'Architecting calm, self-healing cloud platforms & low-latency API meshes.',
    introLead:
      'Drive the coral studio coupe along the continuous pastel highway—either by selecting a destination in the top dock or clicking directly on any of the six sculptural landmarks in the 3D world.',
    introHighlights: [
      { label: 'Focus Domain', value: 'Platform, Backend & DevOps' },
      { label: 'World Route', value: '6 Interactive Sculptural Stops' },
      { label: 'Core Stack', value: 'Go • Rust • K8s • Terraform' },
    ],
  },
  about: {
    headline: 'Infrastructure should feel invisible when it works—and unmistakable in its clarity when inspected.',
    narrative: [
      'This demonstration profile represents a Staff Platform & Backend Engineer specializing in high-throughput API gateways, multi-region Kubernetes topologies, and deterministic GitOps delivery pipelines.',
      'Rather than treating DevOps as reactive ticket resolution, this practice treats infrastructure as a versioned software product: declarative, observable by default, and engineered with paved-road developer ergonomics.',
    ],
    pillars: [
      {
        title: 'Deterministic Cloud Fabric',
        description:
          'Immutable infrastructure provisioned through modular Terraform and Crossplane control planes with automated drift remediation.',
        metric: '100% Declarative IaC (Sample Metric)',
      },
      {
        title: 'Resilient Backend Services',
        description:
          'Memory-safe edge proxies and gRPC microservices in Rust and Go with adaptive concurrency limits and graceful degradation.',
        metric: 'Sub-4ms P99 Gateway Overhead (Demo)',
      },
      {
        title: 'Deep System Observability',
        description:
          'Unified OpenTelemetry tracing, eBPF network telemetry, and SLO burn-rate alerting that surfaces root causes in seconds.',
        metric: 'Zero-Blindspot Telemetry Mesh',
      },
    ],
  },
  destinations: DESTINATIONS,
  skillGroups: [
    {
      id: 'cloud-k8s',
      title: 'Cloud & Kubernetes Platform',
      badge: 'Infrastructure',
      accentColor: '#5ec2b7',
      summary: 'Multi-cluster orchestration, eBPF networking, and declarative infrastructure provisioning.',
      skills: [
        { name: 'Kubernetes (EKS / GKE)', level: 'Architecture', context: 'Multi-region federation, custom operators, Karpenter autoscaling', highlight: true },
        { name: 'Terraform & OpenTofu', level: 'Architecture', context: 'Composable infrastructure modules, policy-as-code with OPA/Rego', highlight: true },
        { name: 'Cilium & eBPF', level: 'Production', context: 'Kube-proxy replacement, L7 network policy, Hubble flow telemetry' },
        { name: 'Crossplane', level: 'Production', context: 'Self-service cloud resource compositions via Kubernetes CRDs' },
      ],
    },
    {
      id: 'backend-api',
      title: 'Backend & Distributed Systems',
      badge: 'Services',
      accentColor: '#6ab7e8',
      summary: 'High-concurrency control planes, API gateways, and event-driven state engines.',
      skills: [
        { name: 'Go (Golang)', level: 'Architecture', context: 'Kubernetes controllers, gRPC microservices, distributed schedulers', highlight: true },
        { name: 'Rust', level: 'Production', context: 'Low-latency Envoy WASM filters, token-bucket rate limiters', highlight: true },
        { name: 'Envoy Proxy & gRPC', level: 'Architecture', context: 'xDS dynamic routing, mTLS service mesh, circuit breaking' },
        { name: 'PostgreSQL & Redis Cluster', level: 'Production', context: 'Partitioned telemetry metadata, Lua atomic rate-limit scripts' },
      ],
    },
    {
      id: 'cicd-gitops',
      title: 'CI/CD & Release Automation',
      badge: 'Delivery',
      accentColor: '#9b8ce8',
      summary: 'Supply-chain security, ephemeral preview environments, and progressive canary rollouts.',
      skills: [
        { name: 'ArgoCD & Argo Rollouts', level: 'Architecture', context: 'Multi-cluster GitOps sync, metric-gated canary promotion', highlight: true },
        { name: 'GitHub Actions & Tekton', level: 'Architecture', context: 'Hermetic container builds, distributed remote caching', highlight: true },
        { name: 'Docker BuildKit & Nix', level: 'Production', context: 'Reproducible multi-arch distroless images, SBOM generation' },
        { name: 'Sigstore Cosign & Kyverno', level: 'Production', context: 'Cryptographic image signing and admission verification' },
      ],
    },
    {
      id: 'observability-sre',
      title: 'Observability & Reliability',
      badge: 'SRE',
      accentColor: '#f29b8e',
      summary: 'End-to-end distributed tracing, high-cardinality metrics, and automated chaos validation.',
      skills: [
        { name: 'OpenTelemetry', level: 'Architecture', context: 'Unified collector pipelines, tail-based sampling, context propagation', highlight: true },
        { name: 'Prometheus & VictoriaMetrics', level: 'Architecture', context: 'High-cardinality time-series federation, SLO error budgets', highlight: true },
        { name: 'Grafana Tempo & Loki', level: 'Production', context: 'Exemplar-linked trace correlation and structured log indexing' },
        { name: 'Chaos Mesh & Litmus', level: 'Production', context: 'Automated region failover drills and latency injection suites' },
      ],
    },
  ],
  projects: [
    {
      id: 'aethergate-api-mesh',
      title: 'AetherGate Distributed API Gateway & Rate-Limiting Mesh',
      category: 'Backend API',
      shortSummary:
        'High-throughput edge API gateway control plane in Go & Rust with distributed token-bucket rate limiting and dynamic Envoy xDS routing.',
      overview:
        'AetherGate is a demonstration reference architecture for a multi-tenant API gateway designed to unify ingress routing, mTLS identity enforcement, and sub-millisecond quota coordination across regional microservice clusters without introducing a single point of failure.',
      role: 'Lead Systems Architect (Sample Demonstration Role)',
      timeline: 'Sample Architecture • 2025 Reference Design',
      accentColor: '#5ec2b7',
      secondaryColor: '#a8d8ea',
      architectureDiagramType: 'gateway_mesh',
      challenges: [
        'Coordinating tenant rate limits across 24 stateless edge proxy nodes without incurring cross-AZ synchronous Redis round-trip penalties on every request.',
        'Enabling zero-drop route table and TLS certificate hot-reloads via Envoy xDS streaming while maintaining strict schema validation.',
        'Preserving end-to-end W3C TraceContext propagation across HTTP/2, gRPC, and asynchronous Kafka event boundaries.',
      ],
      outcomes: [
        'Engineered a hybrid local-batch + asynchronous Redis CRDT token reservoir in Rust WASM, keeping median edge filter latency under 1.8 ms in benchmark simulations.',
        'Built a declarative Go xDS control plane that validates OpenAPI/Protobuf route specs in CI before streaming atomic snapshot updates.',
        'Integrated OpenTelemetry exemplars linking 99th-percentile latency spikes directly to trace spans in Grafana.',
      ],
      techStack: [
        'Rust (WASM)',
        'Go 1.22',
        'Envoy Proxy (xDS)',
        'gRPC / Protobuf',
        'Redis Cluster',
        'OpenTelemetry',
      ],
      metrics: [
        { label: 'Simulated P99 Overhead', value: '1.8 ms' },
        { label: 'Control Plane Sync', value: '< 250 ms' },
        { label: 'Architecture Type', value: 'Demo Reference' },
      ],
      links: [
        {
          label: 'Interactive Architecture Spec (Demo Placeholder)',
          configKey: 'PORTFOLIO_DEMO_AETHERGATE_SPEC',
          displayTarget: 'demo://aethergate-architecture-spec (Configurable Placeholder)',
          kind: 'architecture',
        },
        {
          label: 'Sample Repository Config (Demo Placeholder)',
          configKey: 'PORTFOLIO_DEMO_AETHERGATE_REPO',
          displayTarget: 'repo://sample-platform/aethergate-mesh (Configurable Placeholder)',
          kind: 'repository',
        },
      ],
    },
    {
      id: 'stratos-cloud-fabric',
      title: 'Stratos Multi-Region Kubernetes Platform & Terraform Fabric',
      category: 'Cloud Infrastructure',
      shortSummary:
        'Declarative multi-region Kubernetes platform utilizing Terraform modules, Cilium eBPF mesh, Karpenter node provisioning, and Crossplane.',
      overview:
        'Stratos is a demonstration cloud platform blueprint showing how engineering organizations can provision isolated, compliance-ready Kubernetes environments across multiple regions with automated cost-aware compute scaling and eBPF L7 security boundaries.',
      role: 'Principal Platform Engineer (Sample Demonstration Role)',
      timeline: 'Sample Architecture • 2024–2025 Reference Design',
      accentColor: '#6ab7e8',
      secondaryColor: '#c3bef0',
      architectureDiagramType: 'multi_region_k8s',
      challenges: [
        'Eliminating snowflake cluster drift across staging and multi-region production environments while allowing product teams self-service database and queue provisioning.',
        'Replacing legacy iptables kube-proxy rules that degraded pod-to-pod network throughput at high service counts.',
        'Right-sizing heterogeneous spot and on-demand compute pools automatically during diurnal traffic surges.',
      ],
      outcomes: [
        'Composed modular Terraform foundations paired with Crossplane XRDs so application teams request Postgres, Redis, and S3 buckets via standard Kubernetes YAML manifests.',
        'Adopted Cilium eBPF ClusterMesh for encrypted cross-region service discovery and identity-aware L7 network policies without sidecar memory overhead.',
        'Configured Karpenter consolidation policies with SLO-aware PodDisruptionBudgets for rapid node bin-packing.',
      ],
      techStack: [
        'Kubernetes (EKS)',
        'Terraform / OpenTofu',
        'Cilium eBPF',
        'Crossplane',
        'Karpenter',
        'OPA Gatekeeper',
      ],
      metrics: [
        { label: 'Cluster Provision Time', value: '14 mins (Demo)' },
        { label: 'Network Dataplane', value: 'Cilium eBPF' },
        { label: 'Architecture Type', value: 'Demo Blueprint' },
      ],
      links: [
        {
          label: 'Topology Blueprint Preview (Demo Placeholder)',
          configKey: 'PORTFOLIO_DEMO_STRATOS_BLUEPRINT',
          displayTarget: 'demo://stratos-multiregion-topology (Configurable Placeholder)',
          kind: 'demo',
        },
        {
          label: 'Terraform Module Layout (Demo Placeholder)',
          configKey: 'PORTFOLIO_DEMO_STRATOS_REPO',
          displayTarget: 'repo://sample-platform/stratos-iaC-fabric (Configurable Placeholder)',
          kind: 'repository',
        },
      ],
    },
    {
      id: 'pulseforge-cicd-engine',
      title: 'PulseForge Ephemeral Preview & Zero-Downtime Release Pipeline',
      category: 'CI/CD Automation',
      shortSummary:
        'Cryptographically signed GitOps delivery pipeline with per-PR ephemeral namespaces, BuildKit remote caching, and metric-gated Argo Rollouts.',
      overview:
        'PulseForge is a demonstration CI/CD and progressive delivery platform that turns every pull request into a full-stack, isolated preview environment within a shared Kubernetes cluster and automates canary verification using real-time Prometheus SLO queries.',
      role: 'Platform Automation Architect (Sample Demonstration Role)',
      timeline: 'Sample Architecture • 2024 Reference Design',
      accentColor: '#9b8ce8',
      secondaryColor: '#f9c6bd',
      architectureDiagramType: 'gitops_pipeline',
      challenges: [
        'Long container build queues and redundant dependency compilation slowing developer feedback loops on polyglot monorepos.',
        'Manual staging bottlenecks where multiple feature branches collided over shared integration databases.',
        'Ensuring unverified container images can never be scheduled into production namespaces.',
      ],
      outcomes: [
        'Orchestrated ArgoCD ApplicationSet Pull Request generators to spin up and garbage-collect isolated preview namespaces with seeded ephemeral state.',
        'Paired distributed BuildKit builders with Sigstore Cosign keyless OIDC signing and Kyverno admission policies.',
        'Automated 4-stage canary rollouts via Argo Rollouts that automatically abort and roll back if HTTP 5xx or P95 latency thresholds breach SLO budgets.',
      ],
      techStack: [
        'ArgoCD & Rollouts',
        'GitHub Actions',
        'Docker BuildKit',
        'Sigstore Cosign',
        'Kyverno',
        'Prometheus Analysis',
      ],
      metrics: [
        { label: 'Preview Spin-Up', value: '< 90 sec (Demo)' },
        { label: 'Canary Rollback', value: 'Automated SLO' },
        { label: 'Supply Chain', value: 'SLSA / Cosign' },
      ],
      links: [
        {
          label: 'Pipeline Workflow Visualizer (Demo Placeholder)',
          configKey: 'PORTFOLIO_DEMO_PULSEFORGE_DEMO',
          displayTarget: 'demo://pulseforge-gitops-visualizer (Configurable Placeholder)',
          kind: 'demo',
        },
        {
          label: 'Sample GitOps Manifests (Demo Placeholder)',
          configKey: 'PORTFOLIO_DEMO_PULSEFORGE_REPO',
          displayTarget: 'repo://sample-platform/pulseforge-gitops (Configurable Placeholder)',
          kind: 'repository',
        },
      ],
    },
  ],
  experiences: [
    {
      id: 'exp-staff-platform',
      period: '2023 — Present (Sample Timeline)',
      role: 'Staff Platform & Infrastructure Engineer',
      organization: 'NordicCloud Systems (Demonstration Organization)',
      organizationNote: 'Sample Enterprise Platform Team',
      location: 'Stockholm / Hybrid (Demo)',
      summary:
        'Leading internal developer platform architecture, multi-region Kubernetes reliability, and high-throughput API ingress engineering.',
      highlights: [
        'Architected unified Envoy + Rust WASM edge gateway patterns and standardized OpenTelemetry instrumentation across core services.',
        'Designed self-service Crossplane and Terraform compositions enabling product squads to provision compliant cloud resources autonomously.',
      ],
      technologies: ['Kubernetes', 'Go', 'Rust', 'Terraform', 'Cilium eBPF', 'OpenTelemetry'],
    },
    {
      id: 'exp-senior-devops',
      period: '2020 — 2023 (Sample Timeline)',
      role: 'Senior Site Reliability & DevOps Engineer',
      organization: 'Vespera FinTech Core (Demonstration Organization)',
      organizationNote: 'Sample Distributed Ledger Infrastructure',
      location: 'Remote / EU (Demo)',
      summary:
        'Owned CI/CD release automation, zero-downtime database migration workflows, and multi-AZ observability pipelines.',
      highlights: [
        'Transitioned 40+ microservices to declarative ArgoCD GitOps workflows with automated Prometheus canary analysis.',
        'Implemented hermetic container build pipelines with cryptographic image verification and automated chaos testing.',
      ],
      technologies: ['ArgoCD', 'GitHub Actions', 'AWS EKS', 'Prometheus', 'PostgreSQL', 'Grafana'],
    },
    {
      id: 'exp-backend-eng',
      period: '2018 — 2020 (Sample Timeline)',
      role: 'Distributed Systems Backend Engineer',
      organization: 'Kestrel Telemetry Labs (Demonstration Organization)',
      organizationNote: 'Sample Streaming Data Platform',
      location: 'Gothenburg (Demo)',
      summary:
        'Built high-concurrency gRPC ingestion services, stream processing workers, and low-latency caching layers.',
      highlights: [
        'Developed Go and gRPC telemetry collectors with bounded backpressure queues and partitioned time-series storage.',
        'Collaborated with infrastructure teams to containerize stateful workloads and automate cluster monitoring.',
      ],
      technologies: ['Go', 'gRPC', 'Redis Cluster', 'Kafka', 'Docker', 'Linux'],
    },
  ],
  contact: {
    headline: 'Ready to customize or connect?',
    subtitle:
      'All endpoints below are clearly marked demonstration placeholders configured in src/data/portfolio.ts so you can drop in your real links at any time.',
    availabilityNote:
      'Demonstration Mode Active — No external network requests or fabricated third-party profiles are triggered.',
    channels: [
      {
        id: 'email-placeholder',
        label: 'Engineering Contact (Configurable Placeholder)',
        value: 'platform.architect@example.invalid',
        note: 'Safe RFC 2606 placeholder — click to copy sample address',
        actionType: 'copy',
      },
      {
        id: 'git-placeholder',
        label: 'Git & Architecture Blueprints (Placeholder)',
        value: 'repo://configure-in-src-data-portfolio-ts',
        note: 'Customize in src/data/portfolio.ts -> PORTFOLIO_DATA.contact',
        actionType: 'copy',
      },
      {
        id: 'explore-projects',
        label: 'Inspect Architecture Case Studies',
        value: 'Navigate to 04 Projects Landmark',
        note: 'Drive the car to the Isometric Citadel to inspect detailed specs',
        actionType: 'jump_projects',
      },
      {
        id: 'return-intro',
        label: 'Return Car to Welcome Gate',
        value: 'Navigate back to 01 Intro Overview',
        note: 'Drives along the continuous road back to the wide diorama view',
        actionType: 'return_intro',
      },
    ],
  },
};

export function getDestinationById(id: DestinationId): DestinationConfig {
  const found = DESTINATIONS.find((d) => d.id === id);
  if (!found) {
    return DESTINATIONS[0];
  }
  return found;
}
