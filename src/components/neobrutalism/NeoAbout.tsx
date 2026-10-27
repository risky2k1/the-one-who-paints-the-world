'use client';

import React from 'react';
import Link from 'next/link';
import { PortfolioData } from '../../types/portfolio';

interface NeoAboutProps {
  about: PortfolioData['about'];
}

const PILLAR_COLORS = ['bg-[#FFE600]', 'bg-[#A6FAFF]', 'bg-[#B8FF9F]'];

export const NeoAbout: React.FC<NeoAboutProps> = ({ about }) => {
  return (
    <section id="about" className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-12">
        <div className="neo-badge bg-[#B8FF9F] text-black rounded-md mb-3">
          {"//"} ENGINEERING PHILOSOPHY
        </div>
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 max-w-4xl leading-tight">
          &ldquo;{about.headline}&rdquo;
        </h2>
      </div>

      {/* Narrative & Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Left Narrative Box */}
        <div className="lg:col-span-5 neo-card bg-white p-6 sm:p-8 rounded-2xl">
          <div className="font-black text-sm uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
            <span>📝</span> ARCHITECTURAL CREED
          </div>
          <div className="space-y-4 text-sm sm:text-base text-neutral-800 font-medium leading-relaxed">
            {about.narrative.map((paragraph: string, idx: number) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Right 3 Pillars Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {about.pillars.map((pillar: { title: string; description: string; metric: string }, idx: number) => {
            const cardColor = PILLAR_COLORS[idx % PILLAR_COLORS.length];

            return (
              <div
                key={pillar.title}
                className="neo-card bg-white rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`${cardColor} border-2 border-black w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm mb-4 shadow-[2px_2px_0px_0px_#000]`}
                  >
                    0{idx + 1}
                  </div>
                  <h3 className="font-black text-base uppercase tracking-tight text-neutral-950 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-neutral-700 leading-relaxed font-medium mb-4">
                    {pillar.description}
                  </p>
                </div>

                <div className="border-t-2 border-black pt-3">
                  <span className="font-mono text-[10px] font-black uppercase bg-[#FAF7F2] border border-black px-2 py-1 rounded inline-block">
                    {pillar.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3D Odyssey Banner / Bridge Callout */}
      <div className="neo-box-lg bg-[#FFE600] rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-block bg-black text-white text-xs font-black uppercase px-3 py-1 rounded mb-2">
            Spatial 3D Odyssey Mode
          </div>
          <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            Want to see this world rendered in real-time 3D?
          </h3>
          <p className="text-sm sm:text-base font-semibold text-neutral-900 max-w-xl">
            Jump into the driver&apos;s seat of our coral coupe and cruise along the pastel road through six sculptural monoliths.
          </p>
        </div>

        <Link
          href="/portfolio"
          className="neo-btn inline-flex items-center gap-3 bg-[#FF90E8] text-black font-black uppercase text-base sm:text-lg px-8 py-4 rounded-xl shrink-0"
        >
          <span>🎮 Launch 3D World</span>
          <span className="font-mono text-xl">→</span>
        </Link>
      </div>
    </section>
  );
};
