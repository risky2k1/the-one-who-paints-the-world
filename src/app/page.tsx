import React from 'react';
import { Metadata } from 'next';
import { fetchPortfolioData } from '@/shared/api/portfolio';
import { HomeView } from '@/features/home';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Sora Lindqvist • Staff Platform Architect | Neobrutalism Hub',
  description:
    'Staff Platform & Cloud Infrastructure Architect showcase designed with Neobrutalism. Featuring distributed API meshes, multi-region Kubernetes fabrics, and an interactive 3D spatial odyssey.',
};

export default async function HomePage() {
  const { data, isLive } = await fetchPortfolioData();

  return <HomeView data={data} isLive={isLive} />;
}
