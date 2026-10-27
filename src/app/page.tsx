import React from 'react';
import { Metadata } from 'next';
import { fetchPortfolioData } from '../lib/api/portfolioApi';
import { NeoNavbar } from '../components/neobrutalism/NeoNavbar';
import { NeoHero } from '../components/neobrutalism/NeoHero';
import { NeoMarquee } from '../components/neobrutalism/NeoMarquee';
import { NeoProjects } from '../components/neobrutalism/NeoProjects';
import { NeoTechStack } from '../components/neobrutalism/NeoTechStack';
import { NeoAbout } from '../components/neobrutalism/NeoAbout';
import { NeoFooter } from '../components/neobrutalism/NeoFooter';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Sora Lindqvist • Staff Platform Architect | Neobrutalism Hub',
  description:
    'Staff Platform & Cloud Infrastructure Architect showcase designed with Neobrutalism. Featuring distributed API meshes, multi-region Kubernetes fabrics, and an interactive 3D spatial odyssey.',
};

export default async function HomePage() {
  const { data, isLive } = await fetchPortfolioData();

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
