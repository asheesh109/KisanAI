'use client';

/**
 * Voice Navigation Panel Component
 * Provides UI for voice command recognition and feedback
 */

import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, AlertCircle, CheckCircle } from 'lucide-react';
import { useVoiceNavigation } from '@/hooks/useVoiceNavigation';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useLanguage } from '@/contexts/LanguageContext';
import { VOICE_COMMANDS, getCommandLabels } from '@/lib/voiceCommands';

interface VoiceNavigationPanelProps {
  position?: 'fixed' | 'absolute';
  layout?: 'compact' | 'expanded';
  showCommands?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

export function VoiceNavigationPanel({
  position = 'fixed',
  layout = 'compact',
  showCommands = true,
  theme = 'auto',
}: VoiceNavigationPanelProps) {
  const { language } = useLanguage?.() || { language: 'en' };
  const [isOpen, setIsOpen] = useState(false);
  const [showCommandsList, setShowCommandsList] = useState(showCommands);
  const speechRef = useRef<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Voice recognition hook
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  // Voice navigation hook
  const {
    lastCommand,
    feedback,
    isProcessing,
    error,
    handleTranscript,
    reset,
    setListening,
  } = useVoiceNavigation({
    autoNavigate: true,
    navigationDelay: 600,
  });

  // Handle theme detection
  useEffect(() => {
    if (theme === 'auto') {
      const isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    } else {
      setIsDarkMode(theme === 'dark');
    }
  }, [theme]);

  // Handle speech recognition events
  useEffect(() => {
    if (!isListening) return;

    const handleInterim = () => {
      // Interim transcript shown in UI
    };

    const handleFinal = () => {
      if (transcript) {
        handleTranscript(transcript, true);
      }
    };

    // Give speech recognition a moment to settle, then process
    const timer = setTimeout(() => {
      if (transcript) {
        handleTranscript(transcript, true);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [transcript, isListening, handleTranscript]);


  // Sync listening state with voice navigation
  useEffect(() => {
    setListening(isListening);
  }, [isListening, setListening]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      reset();
    }
  };

  const handleClose = () => {
    if (isListening) {
      stopListening();
    }
    setIsOpen(false);
    reset();
  };

  const commandLabels = getCommandLabels(language);
  const themeClasses = isDarkMode
    ? 'bg-gray-900 border-gray-700 text-white'
    : 'bg-white border-gray-200 text-gray-900';

  const buttonThemeClasses = isDarkMode
    ? 'bg-gray-800 hover:bg-gray-700 border-gray-600'
    : 'bg-gray-100 hover:bg-gray-200 border-gray-300';

  // Compact Layout
  if (layout === 'compact') {
    return (
      <div
        className={`${position} bottom-4 right-4 z-50`}
      >
        {isOpen && (
          <div
            className={`mb-3 rounded-lg border shadow-lg p-4 w-80 max-h-96 overflow-y-auto ${themeClasses}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Voice Commands
              </h3>
              <button
                onClick={handleClose}
                className="text-xs opacity-50 hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>

            {/* Listening Indicator */}
            {isListening && (
              <div className="mb-3 p-2 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded text-xs text-green-800 dark:text-green-100">
                🎤 Listening...
              </div>
            )}

            {/* Transcript Display */}
            {transcript && (
              <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded text-sm">
                <div className="opacity-70 text-xs mb-1">Transcript:</div>
                <div className="font-medium">
                  {transcript}
                </div>
              </div>
            )}

            {/* Feedback */}
            {feedback && !isProcessing && (
              <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 rounded text-sm flex items-start gap-2">
                <span className="text-lg flex-shrink-0">⏳</span>
                <span>{feedback}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-3 p-2 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <span className="text-red-700 dark:text-red-200">{error}</span>
              </div>
            )}

            {/* Commands List */}
            {showCommandsList && (
              <div className="mb-3">
              <div className="text-xs font-semibold opacity-60 mb-2">
                  Available Commands:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {commandLabels.slice(0, 8).map((cmd) => (
                    <div
                      key={cmd.id}
                      className={`text-xs p-2 rounded border ${buttonThemeClasses} truncate`}
                    >
                      {cmd.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mic Button */}
            <button
              onClick={toggleListening}
              className={`w-full py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Start Listening
                </>
              )}
            </button>
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-full p-3 shadow-lg transition transform hover:scale-110 ${
            isOpen
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : isListening
              ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          title={isListening ? 'Listening...' : 'Open voice commands'}
        >
          {isListening ? (
            <MicOff className="h-5 w-5 animate-bounce" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </button>
      </div>
    );
  }

  // Expanded Layout
  return (
    <div
      className={`${position} bottom-4 right-4 z-50 w-96 rounded-lg border shadow-2xl ${themeClasses}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Navigation
        </h2>
        <button
          onClick={handleClose}
          className="text-xl opacity-50 hover:opacity-100 transition"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {/* Status */}
        <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="text-xs font-semibold opacity-60 mb-1">Status</div>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}
            />
            <span className="text-sm font-medium">
              {isListening ? 'Listening...' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700">
            <div className="text-xs font-semibold mb-2 text-blue-900 dark:text-blue-100">
              Transcript
            </div>
            <div className="text-sm text-blue-900 dark:text-blue-100">
              {transcript}
            </div>
          </div>
        )}

        {/* Last Command */}
        {lastCommand?.matched && lastCommand.command && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 flex items-start gap-2">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-green-900 dark:text-green-100">
                Command Matched
              </div>
              <div className="text-sm font-medium text-green-800 dark:text-green-200">
                {lastCommand.command.label[language as keyof typeof lastCommand.command.label]}
              </div>
              <div className="text-xs opacity-70 text-green-700 dark:text-green-300">
                Confidence: {(lastCommand.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-red-900 dark:text-red-100">
                No Match
              </div>
              <div className="text-sm text-red-800 dark:text-red-200">{error}</div>
            </div>
          </div>
        )}

        {/* Commands Grid */}
        <div className="mb-4">
          <div className="text-xs font-semibold opacity-60 mb-2">
            Quick Commands
          </div>
          <div className="grid grid-cols-2 gap-2">
            {commandLabels.map((cmd) => (
              <div
                key={cmd.id}
                className={`text-xs p-2 rounded border text-center ${buttonThemeClasses}`}
              >
                {cmd.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Control Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleListening}
          className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="h-5 w-5" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              Start Listening
            </>
          )}
        </button>
      </div>
    </div>
  );
}
