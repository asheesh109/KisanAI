'use client';

import HeroBanner from "@/components/HeroBanner";
import FeatureCards from "@/components/FeatureCards";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroBanner />
      <StatsSection />
      <FeatureCards />
      <AboutSection />
    </div>
  );
}