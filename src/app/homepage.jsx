'use client';

import HeroBanner from "@/components/HeroBanner";
import FeatureCards from "@/components/FeatureCards";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Feature Cards */}
      <FeatureCards />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Stats Section */}
      <StatsSection />
      
    </div>
  );
}