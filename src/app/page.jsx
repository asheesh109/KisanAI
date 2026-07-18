'use client';

import dynamic from 'next/dynamic';
import HeroBanner from "@/components/HeroBanner";

// Lazy loaded components (below the fold)
const StatsSection = dynamic(() => import('@/components/StatsSection'), { ssr: true });
const FeatureCards = dynamic(() => import('@/components/FeatureCards'), { ssr: true });
const AboutSection = dynamic(() => import('@/components/AboutSection'), { ssr: true });
const FarmersExperienceCarousel = dynamic(() => import('@/components/FarmersExperienceCarousel').then(mod => mod.FarmersExperienceCarousel), { ssr: true });

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroBanner />
      <StatsSection />
      <FeatureCards />
      <AboutSection />
      <FarmersExperienceCarousel />
    </div>
  );
}