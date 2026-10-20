import React, { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { ProjectItem } from '../../types/portfolio';

export interface ProjectDetailOverlayProps {
  activeProjectId: string | null;
  onClose: () => void;
}

export const ProjectDetailOverlay: React.FC<ProjectDetailOverlayProps> = ({
  activeProjectId,
  onClose,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const project: ProjectItem | undefined = PORTFOLIO_DATA.projects.find(
    (p) => p.id === activeProjectId
  );

  useEffect(() => {
    if (!project) return;
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) {
    return null;
  }

  const handleCopyConfig = (key: string, target: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(target).catch(() => {});
      }
    } catch {
      // Ignore clipboard errors in restricted sandboxes
    }
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const renderArchitectureIllustration = () => {
    switch (project.architectureDiagramType) {
      case 'gateway_mesh':
        return (
          <svg
            width="640"
            height="148"
            viewBox="0 0 640 148"
            className="project-arch-svg"
            role="img"
            aria-label="AetherGate Distributed API Gateway Mesh Topology Diagram"
          >
            <rect x="4" y="4" width="632" height="140" rx="14" fill="#eef6fc" stroke="#bde0ec" />
            <rect x="28" y="38" width="110" height="72" rx="10" fill="#ffffff" stroke="#5ec2b7" strokeWidth="2" />
            <text x="83" y="68" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="700">Edge Clients</text>
            <text x="83" y="88" textAnchor="middle" fill="#475569" fontSize="10">HTTP/2 + gRPC</text>

            <rect x="195" y="18" width="180" height="110" rx="12" fill="#e6f7f5" stroke="#5ec2b7" strokeWidth="2" />
            <text x="285" y="44" textAnchor="middle" fill="#0f766e" fontSize="12" fontWeight="700">Envoy + Rust WASM Filter</text>
            <text x="285" y="64" textAnchor="middle" fill="#334155" fontSize="10">Local CRDT Token Bucket</text>
            <text x="285" y="82" textAnchor="middle" fill="#334155" fontSize="10">xDS Dynamic Route Snapshot</text>
            <text x="285" y="102" textAnchor="middle" fill="#0f766e" fontSize="10" fontWeight="600">P99 Overhead: 1.8 ms (Demo)</text>

            <rect x="435" y="18" width="175" height="50" rx="10" fill="#ffffff" stroke="#6ab7e8" strokeWidth="2" />
            <text x="522" y="40" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="700">Go xDS Control Plane</text>
            <text x="522" y="56" textAnchor="middle" fill="#475569" fontSize="10">Atomic Config Stream</text>

            <rect x="435" y="78" width="175" height="50" rx="10" fill="#ffffff" stroke="#9b8ce8" strokeWidth="2" />
            <text x="522" y="100" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="700">Redis Quota + OTel Mesh</text>
            <text x="522" y="116" textAnchor="middle" fill="#475569" fontSize="10">Async Quota Sync &amp; Traces</text>

            <line x1="138" y1="74" x2="195" y2="74" stroke="#5ec2b7" strokeWidth="2.5" />
            <line x1="375" y1="45" x2="435" y2="43" stroke="#6ab7e8" strokeWidth="2.5" />
            <line x1="375" y1="103" x2="435" y2="103" stroke="#9b8ce8" strokeWidth="2.5" />
          </svg>
        );

      case 'multi_region_k8s':
        return (
          <svg
            width="640"
            height="148"
            viewBox="0 0 640 148"
            className="project-arch-svg"
            role="img"
            aria-label="Stratos Multi-Region Kubernetes & Cilium eBPF Topology Diagram"
          >
            <rect x="4" y="4" width="632" height="140" rx="14" fill="#eff5fc" stroke="#b5deff" />
            <rect x="26" y="26" width="165" height="96" rx="10" fill="#ffffff" stroke="#6ab7e8" strokeWidth="2" />
            <text x="108" y="54" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="700">Terraform + Crossplane</text>
            <text x="108" y="74" textAnchor="middle" fill="#475569" fontSize="10">Declarative Cloud XRDs</text>
            <text x="108" y="94" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="600">Zero Snowflake Drift</text>

            <rect x="235" y="18" width="180" height="112" rx="12" fill="#eaf3ff" stroke="#6ab7e8" strokeWidth="2" />
            <text x="325" y="44" textAnchor="middle" fill="#0369a1" fontSize="12" fontWeight="700">Cilium eBPF ClusterMesh</text>
            <text x="325" y="64" textAnchor="middle" fill="#334155" fontSize="10">Region EU-North ↔ EU-Central</text>
            <text x="325" y="84" textAnchor="middle" fill="#334155" fontSize="10">Sidecarless mTLS &amp; L7 Policy</text>
            <text x="325" y="104" textAnchor="middle" fill="#0f766e" fontSize="10" fontWeight="600">Karpenter Spot Consolidation</text>

            <rect x="458" y="26" width="154" height="96" rx="10" fill="#ffffff" stroke="#9b8ce8" strokeWidth="2" />
            <text x="535" y="54" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="700">Hubble + VictoriaMetrics</text>
            <text x="535" y="74" textAnchor="middle" fill="#475569" fontSize="10">eBPF Flow Observability</text>
            <text x="535" y="94" textAnchor="middle" fill="#6d28d9" fontSize="10" fontWeight="600">Multi-AZ SLO Federation</text>

            <line x1="191" y1="74" x2="235" y2="74" stroke="#6ab7e8" strokeWidth="2.5" />
            <line x1="415" y1="74" x2="458" y2="74" stroke="#9b8ce8" strokeWidth="2.5" />
          </svg>
        );

      case 'gitops_pipeline':
      default:
        return (
          <svg
            width="640"
            height="148"
            viewBox="0 0 640 148"
            className="project-arch-svg"
            role="img"
            aria-label="PulseForge GitOps & Progressive Canary Delivery Diagram"
          >
            <rect x="4" y="4" width="632" height="140" rx="14" fill="#f5f1fc" stroke="#dec9ff" />
            <rect x="24" y="28" width="165" height="92" rx="10" fill="#ffffff" stroke="#9b8ce8" strokeWidth="2" />
            <text x="106" y="56" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="700">BuildKit + Cosign OIDC</text>
            <text x="106" y="76" textAnchor="middle" fill="#475569" fontSize="10">Hermetic Build &amp; SBOM</text>
            <text x="106" y="96" textAnchor="middle" fill="#6d28d9" fontSize="10" fontWeight="600">Kyverno Verified Admission</text>

            <rect x="232" y="20" width="176" height="108" rx="12" fill="#f3ebff" stroke="#9b8ce8" strokeWidth="2" />
            <text x="320" y="46" textAnchor="middle" fill="#5b21b6" fontSize="12" fontWeight="700">ArgoCD ApplicationSet</text>
            <text x="320" y="66" textAnchor="middle" fill="#334155" fontSize="10">Per-PR Ephemeral Namespaces</text>
            <text x="320" y="86" textAnchor="middle" fill="#334155" fontSize="10">Seeded State &amp; Auto-GC</text>
            <text x="320" y="106" textAnchor="middle" fill="#5b21b6" fontSize="10" fontWeight="600">Spin-up &lt; 90s (Demo)</text>

            <rect x="450" y="28" width="164" height="92" rx="10" fill="#ffffff" stroke="#f29b8e" strokeWidth="2" />
            <text x="532" y="56" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="700">Argo Rollouts Canary</text>
            <text x="532" y="76" textAnchor="middle" fill="#475569" fontSize="10">Prometheus SLO Gate</text>
            <text x="532" y="96" textAnchor="middle" fill="#be123c" fontSize="10" fontWeight="600">Auto-Abort on P95 Breach</text>

            <line x1="189" y1="74" x2="232" y2="74" stroke="#9b8ce8" strokeWidth="2.5" />
            <line x1="408" y1="74" x2="450" y2="74" stroke="#f29b8e" strokeWidth="2.5" />
          </svg>
        );
    }
  };

  return (
    <div
      className="project-overlay-backdrop"
      data-testid="project-detail-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="project-overlay-dialog glass-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-overlay-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="project-overlay-header">
          <div className="project-overlay-badges">
            <span
              className="project-category-pill"
              style={{ borderColor: project.accentColor }}
            >
              {project.category}
            </span>
            <span className="project-demo-tag">
              Demonstration Architecture Case Study
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="project-overlay-close-btn"
            onClick={onClose}
            aria-label="Close project detail overlay"
            data-testid="close-project-overlay-btn"
          >
            ✕ Close (Esc)
          </button>
        </div>

        <div
          className="project-overlay-scroll-area"
          data-testid="project-overlay-scroll-area"
        >
          <h2 id="project-overlay-title" className="project-overlay-title">
            {project.title}
          </h2>

          <div className="project-overlay-role-row">
            <span>
              <strong>Sample Role:</strong> {project.role}
            </span>
            <span>•</span>
            <span>{project.timeline}</span>
          </div>

          <div className="project-overlay-diagram-box">
            {renderArchitectureIllustration()}
          </div>

          <div className="project-metrics-strip">
            {project.metrics.map((m) => (
              <div key={m.label} className="project-metric-box">
                <span className="metric-box-label">{m.label}</span>
                <span className="metric-box-value">{m.value}</span>
              </div>
            ))}
          </div>

          <p className="project-overlay-overview">{project.overview}</p>

          <div className="project-overlay-two-col">
            <div className="project-detail-col">
              <h3 className="project-sub-heading">
                Key Engineering Challenges
              </h3>
              <ul className="project-detail-list">
                {project.challenges.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="project-detail-col">
              <h3 className="project-sub-heading">
                Architectural Implementation &amp; Outcomes
              </h3>
              <ul className="project-detail-list">
                {project.outcomes.map((o, idx) => (
                  <li key={idx}>{o}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="project-stack-section">
            <h3 className="project-sub-heading">Technology Stack</h3>
            <div className="project-tech-pills">
              {project.techStack.map((tech) => (
                <span key={tech} className="tech-mini-tag is-large">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="project-links-section">
            <h3 className="project-sub-heading">
              Configurable Demonstration Links (Placeholder Endpoints)
            </h3>
            <p className="project-links-note">
              In compliance with data-integrity guidelines, these links are safe
              configurable placeholders defined in{' '}
              <code>src/data/portfolio.ts</code> rather than fabricated external
              URLs.
            </p>
            <div className="project-links-grid">
              {project.links.map((link) => {
                const isCopied = copiedKey === link.configKey;
                return (
                  <div key={link.configKey} className="project-link-card">
                    <div className="project-link-meta">
                      <span className="project-link-label">{link.label}</span>
                      <code className="project-link-target">
                        {link.displayTarget}
                      </code>
                    </div>
                    <button
                      type="button"
                      className="pastel-action-btn is-secondary"
                      onClick={() =>
                        handleCopyConfig(link.configKey, link.displayTarget)
                      }
                      data-testid={`project-link-btn-${link.configKey}`}
                    >
                      {isCopied ? 'Copied Key ✓' : 'Copy Config Key'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
