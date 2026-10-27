'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { ProjectItem } from '../../types/portfolio';

export interface ProjectDetailOverlayV2Props {
  activeProjectId: string | null;
  onClose: () => void;
}

export const ProjectDetailOverlayV2: React.FC<ProjectDetailOverlayV2Props> = ({
  activeProjectId,
  onClose,
}) => {
  const { portfolioData } = usePortfolioData();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const project: ProjectItem | undefined = portfolioData.projects.find(
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
      // Ignore clipboard write errors in restricted sandboxes
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
            className="w-full h-auto max-h-[148px]"
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
            className="w-full h-auto max-h-[148px]"
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
            className="w-full h-auto max-h-[148px]"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-md transition-all duration-300"
      data-testid="project-detail-overlay-v2"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative flex flex-col w-full max-w-2xl max-h-[calc(100dvh-2.5rem)] rounded-3xl border border-white/80 bg-white/95 shadow-2xl backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-overlay-title-v2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-800"
              style={{
                borderColor: project.accentColor,
                backgroundColor: `${project.accentColor}18`,
              }}
            >
              {project.category}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              Demonstration Architecture Case Study
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="rounded-full border border-slate-300 bg-white px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 active:scale-95 transition-all cursor-pointer"
            onClick={onClose}
            aria-label="Close project detail overlay"
            data-testid="close-project-overlay-btn"
          >
            ✕ Close (Esc)
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div
          className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5 text-slate-800 select-text"
          data-testid="project-overlay-scroll-area"
        >
          {/* Title & Metadata */}
          <div>
            <h2
              id="project-overlay-title-v2"
              className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight"
            >
              {project.title}
            </h2>
            <div className="flex items-center gap-2 pt-1.5 text-xs text-slate-500 flex-wrap">
              <span>
                <strong className="text-slate-700">Sample Role:</strong> {project.role}
              </span>
              <span>•</span>
              <span className="font-medium text-teal-700">{project.timeline}</span>
            </div>
          </div>

          {/* Architecture Illustration */}
          <div className="w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/80 p-2 shadow-inner">
            {renderArchitectureIllustration()}
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-white p-3 text-center shadow-xs"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {m.label}
                </span>
                <span className="text-sm font-extrabold text-teal-800 pt-0.5">
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Overview Paragraph */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {project.overview}
          </p>

          {/* Two-Column Details (Challenges & Outcomes) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Challenges */}
            <div className="flex flex-col gap-2 rounded-2xl border border-rose-100 bg-rose-50/30 p-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-800">
                Key Engineering Challenges
              </h3>
              <ul className="flex flex-col gap-2 pt-1">
                {project.challenges.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Outcomes */}
            <div className="flex flex-col gap-2 rounded-2xl border border-teal-100 bg-teal-50/30 p-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-800">
                Architectural Outcomes
              </h3>
              <ul className="flex flex-col gap-2 pt-1">
                {project.outcomes.map((o, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Demonstration Config Links */}
          <div className="flex flex-col gap-2.5 pt-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Configurable Demonstration Links
            </h3>
            <p className="text-[11px] text-slate-500">
              Retrieved directly from Botble CMS API. These endpoints represent safe configurable reference placeholders.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.links.map((link) => {
                const isCopied = copiedKey === link.configKey;
                return (
                  <div
                    key={link.configKey}
                    className="flex flex-col justify-between gap-2 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3 shadow-xs"
                  >
                    <div>
                      <span className="block text-[11px] font-bold text-slate-800">
                        {link.label}
                      </span>
                      <code className="block text-[10px] text-slate-500 font-mono break-all pt-0.5">
                        {link.displayTarget}
                      </code>
                    </div>
                    <button
                      type="button"
                      className={`self-start rounded-full px-3 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-teal-600 text-white'
                          : 'border border-slate-300 bg-white text-slate-700 hover:border-teal-500 hover:bg-teal-50'
                      }`}
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

