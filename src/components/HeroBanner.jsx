'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { ChevronRight, Mic, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroBanner() {
  const { t } = useLanguage()

  return (
    <div className="relative min-h-[600px] sm:min-h-[650px] overflow-hidden bg-background">
      {/* Enhanced Animated Background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-accent/3 to-primary/3"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 to-transparent opacity-75 animate-gradient-shift"></div>
      
      {/* Floating Geometric Shapes with varied animations */}
      <div className="absolute top-16 sm:top-20 right-16 sm:right-20 w-64 sm:w-72 h-64 sm:h-72 bg-primary/8 dark:bg-primary/15 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-16 sm:bottom-20 left-16 sm:left-20 w-80 sm:w-96 h-80 sm:h-96 bg-accent/8 dark:bg-accent/15 rounded-full blur-3xl animate-drift"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 sm:w-120 h-96 sm:h-120 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl animate-pulse-slow opacity-30"></div>

      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,hsl(var(--primary)/0.02)_25%,hsl(var(--primary)/0.02)_50%,transparent_50%,transparent_75%,hsl(var(--primary)/0.02)_75%,hsl(var(--primary)/0.02)_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(-45deg,transparent_25%,hsl(var(--accent)/0.02)_25%,hsl(var(--accent)/0.02)_50%,transparent_50%,transparent_75%,hsl(var(--accent)/0.02)_75%,hsl(var(--accent)/0.02)_100%)] opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-center h-full px-4 sm:px-6 py-16 sm:py-24 z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Modern Badge with subtle glow and animation */}
          <div className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 mb-6 sm:mb-8 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 dark:from-primary/20 dark:via-accent/20 dark:to-primary/20 text-primary rounded-full text-sm sm:text-base font-semibold shadow-lg ring-1 ring-inset ring-primary/20 dark:ring-primary/30 backdrop-blur-sm animate-glow-subtle">
            <Sparkles className="h-5 w-5 animate-spin-slow" />
            <span className="tracking-wide">{t('transformingAgriculture')}</span>
          </div>

          {/* Hero Title with advanced gradient and staggered animation */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-fade-in-up-delayed">
            {t('heroWelcome')}
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed opacity-95 font-medium tracking-wide animate-fade-in-up-delayed-2">
            {t('heroTagline')}
          </p>

          {/* Centered Buttons with enhanced styling and stagger animation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16 animate-fade-in-up-delayed-3">
            <Link href="/schemes">
              <Button size="lg" className="px-8 sm:px-10 py-4 bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground font-bold text-base sm:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 min-w-[220px] sm:min-w-[240px] rounded-xl">
                <span className="tracking-wide">{t('exploreSchemes')}</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href="/voice-assistant">
              <Button variant="outline" size="lg" className="px-8 sm:px-10 py-4 border-2 border-border text-foreground font-bold text-base sm:text-lg transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 min-w-[220px] sm:min-w-[240px] rounded-xl backdrop-blur-sm">
                <Mic className="h-5 w-5" />
                <span className="tracking-wide">{t('voiceAssistant')}</span>
              </Button>
            </Link>
          </div>

          {/* Enhanced Stats with card-like design and hover effects */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto pt-8 sm:pt-10 border-t border-border/30 bg-card/30 dark:bg-card/50 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="group cursor-default hover:scale-105 transition-all duration-300 rounded-xl p-4 sm:p-6 border border-border/50">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-primary group-hover:text-accent tracking-tight">20+</div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium tracking-wide">{t('statsGovernmentSchemes')}</div>
            </div>
            <div className="group cursor-default hover:scale-105 transition-all duration-300 rounded-xl p-4 sm:p-6 border border-border/50">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-primary group-hover:text-accent tracking-tight">24/7</div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium tracking-wide">{t('statsSupportAvailable')}</div>
            </div>
            <div className="group cursor-default hover:scale-105 transition-all duration-300 rounded-xl p-4 sm:p-6 border border-border/50">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-primary group-hover:text-accent tracking-tight">1K+</div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium tracking-wide">{t('statsFarmersHelped')}</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        @keyframes fade-in-up-delayed {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up-delayed {
          animation: fade-in-up-delayed 0.9s ease-out 0.2s both;
        }
        @keyframes fade-in-up-delayed-2 {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up-delayed-2 {
          animation: fade-in-up-delayed-2 0.9s ease-out 0.4s both;
        }
        @keyframes fade-in-up-delayed-3 {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up-delayed-3 {
          animation: fade-in-up-delayed-3 0.9s ease-out 0.6s both;
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        @keyframes drift {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(10px); }
        }
        .animate-drift {
          animation: drift 8s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        @keyframes glow-subtle {
          0%, 100% { box-shadow: 0 0 20px hsl(var(--primary)/0.1); }
          50% { box-shadow: 0 0 30px hsl(var(--primary)/0.2); }
        }
        .animate-glow-subtle {
          animation: glow-subtle 3s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
}