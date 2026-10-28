import React from 'react';
import type { PortfolioData } from '@/shared/api/portfolio';
import { NeoNavbar } from './components/NeoNavbar';
import { NeoHero } from './components/NeoHero';
import { NeoMarquee } from './components/NeoMarquee';
import { NeoProjects } from './components/NeoProjects';
import { NeoTechStack } from './components/NeoTechStack';
import { NeoAbout } from './components/NeoAbout';
import { NeoFooter } from './components/NeoFooter';

export interface HomeViewProps {
  data: PortfolioData;
  isLive: boolean;
}

export function HomeView({ data, isLive }: HomeViewProps) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] neo-grid-bg text-neutral-950 selection:bg-[#FFE600] selection:text-black font-sans antialiased">
      {/* Brutalist Sticky Header */}
      <NeoNavbar isLive={isLive} />

      {/* Main Content */}
      <main>
        {/* Hero Section with Quick-Hub Bento Cards */}
        <NeoHero persona={data.persona} />

        {/* Infinitely Scrolling Neobrutalist Ribbon */}
        <NeoMarquee />

        {/* Featured Case Studies / Projects */}
        <NeoProjects projects={data.projects} />

        {/* Platform Capabilities & Tech Stack Bento */}
        <NeoTechStack skillGroups={data.skillGroups} />

        {/* Architectural Creed & 3D Bridge Callout */}
        <NeoAbout about={data.about} />
      </main>

      {/* Retro Brutalist Footer */}
      <NeoFooter isLive={isLive} />
    </div>
  );
}
