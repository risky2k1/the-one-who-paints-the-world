'use client';

import React from 'react';
import { SkillGroup } from '../../types/portfolio';

interface NeoTechStackProps {
  skillGroups: SkillGroup[];
}

const GROUP_COLORS: Record<string, { headerBg: string; badgeBg: string }> = {
  'cloud-k8s': { headerBg: 'bg-[#A6FAFF]', badgeBg: 'bg-black text-white' },
  'backend-api': { headerBg: 'bg-[#FFE600]', badgeBg: 'bg-black text-white' },
  'cicd-gitops': { headerBg: 'bg-[#FF90E8]', badgeBg: 'bg-black text-white' },
  'observability-sre': { headerBg: 'bg-[#B8FF9F]', badgeBg: 'bg-black text-white' },
};

export const NeoTechStack: React.FC<NeoTechStackProps> = ({ skillGroups }) => {
  return (
    <section id="tech-stack" className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <div className="neo-badge bg-[#A6FAFF] text-black rounded-md mb-3">
            {"//"} PLATFORM CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950">
            Systems &amp; Platform Stack
          </h2>
        </div>
        <p className="text-sm sm:text-base text-neutral-700 max-w-md font-medium">
          Battle-tested cloud primitives and language runtimes applied across multi-region production topologies.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skillGroups.map((group) => {
          const styling = GROUP_COLORS[group.id] || {
            headerBg: 'bg-[#FFE600]',
            badgeBg: 'bg-black text-white',
          };

          return (
            <div
              key={group.id}
              className="neo-card bg-white rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div>
                <div
                  className={`${styling.headerBg} border-b-2 border-black p-4 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`neo-badge ${styling.badgeBg} text-[11px] font-black uppercase rounded`}
                    >
                      {group.badge}
                    </span>
                    <span className="font-black text-base uppercase tracking-tight text-neutral-950">
                      {group.title}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed mb-6">
                    {group.summary}
                  </p>

                  {/* Skills List */}
                  <div className="space-y-3">
                    {group.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="border-2 border-black bg-[#FAF7F2] p-3 rounded-xl shadow-[2px_2px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full border border-black ${
                              skill.highlight ? 'bg-amber-400' : 'bg-neutral-400'
                            }`}
                          />
                          <span className="font-black text-sm text-neutral-950 font-mono">
                            {skill.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className="border border-black bg-white text-[10px] font-bold uppercase text-neutral-800 px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                            {skill.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="p-4 bg-neutral-50 border-t border-neutral-200 text-[11px] font-mono text-neutral-600 flex items-center justify-between">
                <span>Production Verified</span>
                <span className="font-bold text-neutral-900 uppercase">99.99% Reliability</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
