'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { ChevronRight, Mic, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroBanner() {
  const { t } = useLanguage()
  
  return (
    <div className="relative min-h-[700px] sm:min-h-[750px] overflow-hidden bg-background">
      {/* Dynamic gradient background with multiple layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-primary/5 animate-gradient"></div>
      </div>
      
      {/* Animated orbs with glow effect */}
      <div className="absolute top-20 right-10 sm:top-24 sm:right-20 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-br from-primary/30 to-accent/30 dark:from-primary/20 dark:to-accent/20 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-20 left-10 sm:bottom-24 sm:left-20 w-80 sm:w-[28rem] h-80 sm:h-[28rem] bg-gradient-to-tr from-accent/25 to-primary/25 dark:from-accent/15 dark:to-primary/15 rounded-full blur-[100px] animate-float-delayed"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Radial glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 dark:bg-accent/5 rounded-full blur-3xl animate-pulse-slower"></div>
      
      {/* Content */}
      <div className="relative flex items-center justify-center min-h-[700px] sm:min-h-[750px] px-4 sm:px-6 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto text-center">
          {/* Animated badge with premium styling */}
          <div className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 mb-8 sm:mb-10 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 dark:from-primary/30 dark:via-accent/30 dark:to-primary/30 backdrop-blur-sm rounded-full text-sm sm:text-base font-bold shadow-2xl border border-primary/30 dark:border-primary/40 animate-fade-in-down">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-primary dark:text-primary animate-pulse" />
              <Zap className="h-3 w-3 text-accent absolute -top-1 -right-1 animate-ping" />
            </div>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-extrabold">
              {t('transformingAgriculture')}
            </span>
          </div>
          
          {/* Hero title with advanced gradient */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 sm:mb-8 leading-[1.1] animate-fade-in-up">
            <span className="block bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-2">
              {t('heroWelcome')}
            </span>
          </h1>
          
          {/* Subtitle with better contrast */}
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground/90 dark:text-muted-foreground mb-10 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in-up animation-delay-200">
            {t('heroTagline')}
          </p>
          
          {/* CTA Buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16 sm:mb-20 animate-fade-in-up animation-delay-400">
            <Link href="/schemes">
              <Button 
                size="lg" 
                className="group relative px-8 sm:px-10 py-6 sm:py-7 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground font-bold text-lg sm:text-xl transition-all duration-500 shadow-2xl hover:shadow-primary/50 dark:hover:shadow-primary/30 hover:scale-105 flex items-center justify-center space-x-3 min-w-[240px] sm:min-w-[260px] rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative z-10">{t('exploreSchemes')}</span>
                <ChevronRight className="relative z-10 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            
            <Link href="/voice-assistant">
              <Button 
                variant="outline" 
                size="lg" 
                className="group px-8 sm:px-10 py-6 sm:py-7 border-2 border-primary/50 dark:border-primary/40 bg-background/80 dark:bg-background/50 backdrop-blur-sm hover:bg-primary/10 dark:hover:bg-primary/20 text-foreground font-bold text-lg sm:text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center space-x-3 min-w-[240px] sm:min-w-[260px] rounded-2xl"
              >
                <Mic className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>{t('voiceAssistant')}</span>
              </Button>
            </Link>
          </div>
          
          {/* Enhanced stats with glass morphism */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto pt-8 sm:pt-10 animate-fade-in-up animation-delay-600">
            <div className="group relative overflow-hidden rounded-3xl bg-card/50 dark:bg-card/30 backdrop-blur-md border border-border/50 dark:border-border/30 p-6 sm:p-8 hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  20+
                </div>
                <div className="text-sm sm:text-base font-semibold text-muted-foreground">
                  {t('statsGovernmentSchemes')}
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-3xl bg-card/50 dark:bg-card/30 backdrop-blur-md border border-border/50 dark:border-border/30 p-6 sm:p-8 hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 dark:from-accent/10 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-sm sm:text-base font-semibold text-muted-foreground">
                  {t('statsSupportAvailable')}
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-3xl bg-card/50 dark:bg-card/30 backdrop-blur-md border border-border/50 dark:border-border/30 p-6 sm:p-8 hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  1K+
                </div>
                <div className="text-sm sm:text-base font-semibold text-muted-foreground">
                  {t('statsFarmersHelped')}
                </div>
              </div>
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
        
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
          }
          33% { 
            transform: translate(30px, -30px) scale(1.1);
          }
          66% { 
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes gradient {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 25s ease-in-out infinite;
          animation-delay: -10s;
        }
        
        .animate-gradient {
          animation: gradient 8s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}