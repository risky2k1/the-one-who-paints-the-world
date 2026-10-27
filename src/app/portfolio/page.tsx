import React from 'react';
import { Metadata } from 'next';
import { PortfolioExperienceV2 } from '../../components/v2/PortfolioExperienceV2';
import { PortfolioDataProvider } from '../../context/PortfolioDataContext';
import { fetchPortfolioData } from '../../lib/api/portfolioApi';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Interactive 3D World • Sora Lindqvist Platform Portfolio',
  description:
    'Continuous pastel 3D highway with 6 sculptural architectural landmarks, spatial telemetry, and real-time audio.',
};

export default async function PortfolioPage() {
  const { data, isLive } = await fetchPortfolioData();

  return (
    <PortfolioDataProvider initialData={data} initialIsLive={isLive}>
      <PortfolioExperienceV2 />
    </PortfolioDataProvider>
  );
}
