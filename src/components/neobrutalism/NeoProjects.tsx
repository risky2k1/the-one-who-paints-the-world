'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProjectItem, ProjectMetric } from '../../types/portfolio';

interface NeoProjectsProps {
  projects: ProjectItem[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Backend API': 'bg-[#A6FAFF]',
  'Cloud Infrastructure': 'bg-[#FFE600]',
  'CI/CD Automation': 'bg-[#FF90E8]',
};

export const NeoProjects: React.FC<NeoProjectsProps> = ({ projects }) => {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="projects" className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <div className="neo-badge bg-[#FF90E8] text-black rounded-md mb-3">
            {"//"} PRODUCTION CASE STUDIES
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950">
            Featured Architectures
          </h2>
        </div>
        <p className="text-sm sm:text-base text-neutral-700 max-w-md font-medium">
          Production reference architectures engineered for sub-millisecond edge latency, multi-region resilience, and zero blindspots.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {projects.map((proj: ProjectItem, idx: number) => {
          const headerBg = CATEGORY_COLORS[proj.category] || (idx % 2 === 0 ? 'bg-[#A6FAFF]' : 'bg-[#FFE600]');
          const isExpanded = expandedProjectId === proj.id;

          return (
            <article
              key={proj.id}
              className="neo-card bg-white rounded-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Card Header */}
              <div>
                <div className={`${headerBg} border-b-2 border-black p-4 flex items-center justify-between`}>
                  <span className="neo-badge bg-black text-white text-[11px] font-black uppercase rounded">
                    {proj.category}
                  </span>
                  <span className="text-xs font-black uppercase tracking-wide text-neutral-900 border border-black bg-white px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                    {proj.timeline || '2025'}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-black text-xl text-neutral-950 uppercase tracking-tight mb-3 leading-snug">
                    {proj.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed mb-6">
                    {proj.shortSummary}
                  </p>

                  {/* Metrics Badges */}
                  {proj.metrics && proj.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {proj.metrics.slice(0, 2).map((m: ProjectMetric, mIdx: number) => (
                        <div
                          key={mIdx}
                          className="border-2 border-black bg-[#FAF7F2] p-2.5 rounded-lg shadow-[2px_2px_0px_0px_#000]"
                        >
                          <div className="font-black text-sm text-neutral-950">{m.value}</div>
                          <div className="text-[10px] font-bold uppercase text-neutral-600 truncate">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech Stack Chips */}
                  <div className="mb-6">
                    <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">
                      Core Technology Stack
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techStack.map((tech: string) => (
                        <span
                          key={tech}
                          className="border border-black bg-neutral-100 text-[11px] font-mono font-bold px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expandable Engineering Challenges & Outcomes */}
                  {isExpanded && (
                    <div className="border-t-2 border-black pt-4 mt-4 space-y-4 text-xs">
                      <div>
                        <div className="font-black uppercase text-neutral-900 mb-1.5 flex items-center gap-1.5">
                          <span>⚠️</span> Architectural Challenges
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-neutral-700 pl-1 font-medium">
                          {proj.challenges.map((c: string, cIdx: number) => (
                            <li key={cIdx}>{c}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="font-black uppercase text-neutral-900 mb-1.5 flex items-center gap-1.5">
                          <span>🎯</span> Key Outcomes
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-neutral-700 pl-1 font-medium">
                          {proj.outcomes.map((o: string, oIdx: number) => (
                            <li key={oIdx}>{o}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 border-t border-neutral-200 mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleExpand(proj.id)}
                  className="neo-btn-sm flex-1 inline-flex items-center justify-center gap-1 bg-white text-black text-xs font-bold uppercase py-2.5 rounded-lg"
                >
                  <span>{isExpanded ? 'Hide Specs' : 'Inspect Specs'}</span>
                  <span className="font-mono">{isExpanded ? '↑' : '↓'}</span>
                </button>

                <Link
                  href="/portfolio"
                  className="neo-btn-sm inline-flex items-center justify-center gap-1.5 bg-[#FFE600] text-black text-xs font-black uppercase px-3.5 py-2.5 rounded-lg"
                  title="View this architectural landmark in 3D"
                >
                  <span>🚀 In 3D</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
