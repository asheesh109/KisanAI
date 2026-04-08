'use client';

/**
 * Voice Assistant Component
 * Always-listening Siri/Google Assistant style UI
 * Shows: Listening for wake word → Wake detected → Command listening → Success
 */

import React, { useEffect, useState } from 'react';
import { Mic, Volume2, CheckCircle, AlertCircle } from 'lucide-react';
import { useVoiceAssistant, type VoiceAssistantStage } from '@/hooks/useVoiceAssistant';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistantContext } from '@/contexts/VoiceAssistantContext';

interface VoiceAssistantProps {
  position?: 'fixed' | 'absolute';
  showTranscript?: boolean;
  autoHideDelay?: number; // ms to hide UI after success
  theme?: 'auto' | 'light' | 'dark';
  enabled?: boolean; // Enable/disable background listening
}

export function VoiceAssistant({
  position = 'fixed',
  showTranscript = true,
  autoHideDelay = 3000,
  theme = 'auto',
  enabled = true, // Default: enabled
}: VoiceAssistantProps) {
  const { language } = useLanguage?.() || { language: 'en' };
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const { isPaused } = useVoiceAssistantContext();

  // Status message translations
  const statusMessages: { [key: string]: { [key: string]: string } } = {
    'listening-wake': {
      en: 'Listening...',
      hi: 'सुन रहे हैं...',
      mr: 'ऐकत आहे...',
      gu: 'સાંભળી રહે છે...',
      ml: 'കേൾക്കുന്നു...',
    },
    'wake-detected': {
      en: '🎤 Ready',
      hi: '🎤 तैयार',
      mr: '🎤 तयार',
      gu: '🎤 તૈયાર',
      ml: '🎤 തയാറായി',
    },
    'listening-command': {
      en: 'Command...',
      hi: 'कमांड...',
      mr: 'आज्ञा...',
      gu: 'આદેશ...',
      ml: 'കമാൻഡ്...',
    },
    'processing': {
      en: 'Processing...',
      hi: 'प्रक्रिया जारी...',
      mr: 'प्रक्रिया चल रही है...',
      gu: 'પ્રક્રિયા...',
      ml: 'പ്രക്രിയ...',
    },
    'success': {
      en: '✓',
      hi: '✓',
      mr: '✓',
      gu: '✓',
      ml: '✓',
    },
    'error': {
      en: '✗',
      hi: '✗',
      mr: '✗',
      gu: '✗',
      ml: '✗',
    },
  };

  const getStatusMessage = (s: VoiceAssistantStage): string => {
    const messages = statusMessages[s];
    if (!messages) return 'Ready';
    return messages[language as keyof typeof messages] || messages['en'];
  };

  const {
    stage,
    wakeWordDetected,
    transcript,
    lastCommand,
    feedback,
    error,
    isListening,
    reset,
  } = useVoiceAssistant({
    onStageChange: (newStage) => {
      console.log('[VOICE-UI] 📊 Stage changed to:', newStage);
      // Show UI when stage changes, hide after success
      setShowUI(true);

      if (newStage === 'success') {
        setTimeout(() => {
          setShowUI(false);
        }, autoHideDelay);
      }
    },
  });

  // Theme detection
  useEffect(() => {
    if (theme === 'auto') {
      const isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    } else {
      setIsDarkMode(theme === 'dark');
    }
  }, [theme]);

  // Check if should render - AFTER all hooks are called
  if (!enabled || isPaused || !showUI) {
    return null;
  }

  // Determine colors based on stage
  const getStageColors = (s: VoiceAssistantStage) => {
    switch (s) {
      case 'listening-wake':
        return {
          bg: isDarkMode ? 'bg-gradient-to-r from-blue-900 to-blue-800' : 'bg-gradient-to-r from-blue-50 to-blue-100',
          text: isDarkMode ? 'text-blue-100' : 'text-blue-900',
          border: isDarkMode ? 'border-blue-700' : 'border-blue-300',
          icon: 'text-blue-500',
        };
      case 'wake-detected':
      case 'listening-command':
        return {
          bg: isDarkMode ? 'bg-gradient-to-r from-green-900 to-green-800' : 'bg-gradient-to-r from-green-50 to-green-100',
          text: isDarkMode ? 'text-green-100' : 'text-green-900',
          border: isDarkMode ? 'border-green-700' : 'border-green-300',
          icon: 'text-green-500',
        };
      case 'processing':
        return {
          bg: isDarkMode ? 'bg-gradient-to-r from-amber-900 to-amber-800' : 'bg-gradient-to-r from-amber-50 to-amber-100',
          text: isDarkMode ? 'text-amber-100' : 'text-amber-900',
          border: isDarkMode ? 'border-amber-700' : 'border-amber-300',
          icon: 'text-amber-500',
        };
      case 'success':
        return {
          bg: isDarkMode ? 'bg-gradient-to-r from-green-900 to-green-800' : 'bg-gradient-to-r from-green-50 to-green-100',
          text: isDarkMode ? 'text-green-100' : 'text-green-900',
          border: isDarkMode ? 'border-green-700' : 'border-green-300',
          icon: 'text-green-500',
        };
      case 'error':
        return {
          bg: isDarkMode ? 'bg-gradient-to-r from-red-900 to-red-800' : 'bg-gradient-to-r from-red-50 to-red-100',
          text: isDarkMode ? 'text-red-100' : 'text-red-900',
          border: isDarkMode ? 'border-red-700' : 'border-red-300',
          icon: 'text-red-500',
        };
      default:
        return {
          bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-100',
          text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
          border: isDarkMode ? 'border-gray-700' : 'border-gray-300',
          icon: 'text-gray-500',
        };
    }
  };

  const colors = getStageColors(stage);

  // Animated listening indicator
  const MicIndicator = () => {
    if (stage === 'listening-wake' || stage === 'listening-command') {
      return (
        <div className="flex gap-1 items-center justify-center">
          <div className="h-2 w-2 bg-current rounded-full animate-pulse"></div>
          <div className="h-2 w-2 bg-current rounded-full animate-pulse animation-delay-100"></div>
          <div className="h-2 w-2 bg-current rounded-full animate-pulse animation-delay-200"></div>
        </div>
      );
    }

    if (stage === 'success') {
      return <CheckCircle className="h-6 w-6" />;
    }

    if (stage === 'error') {
      return <AlertCircle className="h-6 w-6" />;
    }

    return <Mic className="h-6 w-6" />;
  };

  return (
    <div className={`${position} bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-full px-2 sm:px-0`}>
      {/* Main Panel - Compact Bottom Center */}
      <div className={`rounded-lg border shadow-lg ${colors.bg} ${colors.border} max-w-xs mx-auto`}>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .animate-pulse {
            animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .animation-delay-100 {
            animation-delay: 100ms;
          }
          .animation-delay-200 {
            animation-delay: 200ms;
          }
        `}</style>

        <div className="p-2 sm:p-3 text-center space-y-1">
          {/* Icon - Very Small */}
          <div className={`flex justify-center ${colors.icon}`}>
            <div className="h-3 w-3">
              <MicIndicator />
            </div>
          </div>

          {/* Status Text - Extra Small */}
          <div className={`text-xs font-semibold ${colors.text} leading-tight`}>
            {getStatusMessage(stage)}
          </div>

          {/* Transcript Display - Minimal */}
          {showTranscript && transcript && transcript.length > 0 && (
            <div className={`text-xs p-1 rounded ${isDarkMode ? 'bg-black/20' : 'bg-white/20'} ${colors.text} max-h-8 overflow-hidden`}>
              <div className="opacity-70 text-xs truncate">{transcript.substring(0, 40)}</div>
            </div>
          )}

          {/* Feedback - Minimal */}
          {feedback && (
            <div className={`text-xs font-medium ${colors.text}`}>
              {feedback}
            </div>
          )}

          {/* Last Command - Hidden */}

          {/* Confidence Indicator - Tiny */}
          {(stage === 'listening-command' || stage === 'wake-detected') && (
            <div className="flex justify-center gap-0.5 pt-0.5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 rounded-full transition-all ${
                    i === 0
                      ? 'w-1 bg-current'
                      : i === 1 && (stage === 'listening-command' || stage === 'wake-detected')
                      ? 'w-1 bg-current'
                      : 'w-0.5 bg-current/30'
                  }`}
                ></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Minimal Version - Just Show Mic Dot
 */
export function VoiceAssistantMinimal({ position = 'fixed', theme = 'auto' }: { position?: 'fixed' | 'absolute'; theme?: 'auto' | 'light' | 'dark' }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { stage, isListening } = useVoiceAssistant();

  useEffect(() => {
    if (theme === 'auto') {
      const isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    } else {
      setIsDarkMode(theme === 'dark');
    }
  }, [theme]);

  const getColor = () => {
    if (!isListening) return 'bg-gray-400';
    if (stage === 'listening-wake') return 'bg-blue-500 animate-pulse';
    if (stage === 'wake-detected') return 'bg-green-500';
    if (stage === 'listening-command') return 'bg-green-500 animate-pulse';
    if (stage === 'processing') return 'bg-amber-500';
    if (stage === 'success') return 'bg-green-500';
    if (stage === 'error') return 'bg-red-500';
    return 'bg-gray-400';
  };

  return (
    <div className={`${position} top-4 right-4 z-50`}>
      <div
        className={`h-3 w-3 rounded-full ${getColor()} shadow-lg ring-2 ring-offset-2 ${isDarkMode ? 'ring-gray-800 ring-offset-gray-900' : 'ring-white ring-offset-gray-100'}`}
        title={`Voice Assistant - Stage: ${stage}`}
      ></div>
    </div>
  );
}
