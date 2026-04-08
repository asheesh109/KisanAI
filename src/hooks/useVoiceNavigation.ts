/**
 * Voice Navigation Hook
 * Integrates voice command matching with Next.js routing
 */

'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { matchVoiceCommand, normalizeLanguageCode, type MatchResult } from '@/lib/matchVoiceCommand';
import { getCommandById } from '@/lib/voiceCommands';
import { useLanguage } from '@/contexts/LanguageContext';

export interface VoiceNavigationState {
  isListening: boolean;
  transcript: string;
  lastCommand: MatchResult | null;
  isProcessing: boolean;
  error: string | null;
  feedback: string;
}

export interface UseVoiceNavigationOptions {
  onCommandMatched?: (command: MatchResult) => void;
  onCommandFailed?: (transcript: string) => void;
  autoNavigate?: boolean;
  navigationDelay?: number; // ms delay before navigation for UX
}

/**
 * Main hook for voice navigation
 * Returns state and handlers
 */
export function useVoiceNavigation(options: UseVoiceNavigationOptions = {}) {
  const {
    onCommandMatched,
    onCommandFailed,
    autoNavigate = true,
    navigationDelay = 500,
  } = options;

  const router = useRouter();
  const { language } = useLanguage?.() || { language: 'en' };
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<VoiceNavigationState>({
    isListening: false,
    transcript: '',
    lastCommand: null,
    isProcessing: false,
    error: null,
    feedback: '',
  });

  /**
   * Handle new transcript from speech recognition
   */
  const handleTranscript = useCallback(
    (transcript: string, isFinal: boolean = true) => {
      if (!isFinal) {
        // Update interim transcript
        setState((prev) => ({
          ...prev,
          transcript,
        }));
        return;
      }

      // Final transcript received
      setState((prev) => ({
        ...prev,
        transcript,
        isProcessing: true,
        error: null,
    feedback: '',
      }));

      // Process command asynchronously to avoid blocking
      const processCommand = async () => {
        const normalizedLang = normalizeLanguageCode(language);
        const result = matchVoiceCommand(transcript, normalizedLang);

        setState((prev) => ({
          ...prev,
          lastCommand: result,
        }));

        if (result.matched && result.command) {
          // Command matched
          const feedback = `✓ ${result.command.label[normalizedLang as keyof typeof result.command.label] || 'Command matched'}`;

          setState((prev) => ({
            ...prev,
            feedback,
            isProcessing: false,
          }));

          // Call custom handler
          onCommandMatched?.(result);

          // Auto-navigate if enabled
          if (autoNavigate && result.command.action === 'navigate') {
            setTimeout(() => {
              router.push(result.command!.target);
            }, navigationDelay);
          } else if (result.command.action === 'action') {
            // Handle custom actions
            handleCustomAction(result.command.target, result);
          }

          // Clear feedback after 2s
          if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current);
          }
          feedbackTimeoutRef.current = setTimeout(() => {
            setState((prev) => ({
              ...prev,
              feedback: '',
            }));
          }, 2000);
        } else {
          // No matching command
          const errorMsg = `✗ Command not recognized`;

          setState((prev) => ({
            ...prev,
            error: errorMsg,
            feedback: errorMsg,
            isProcessing: false,
          }));

          onCommandFailed?.(transcript);

          // Clear error after 3s
          if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current);
          }
          feedbackTimeoutRef.current = setTimeout(() => {
            setState((prev) => ({
              ...prev,
              error: null,
              feedback: '',
            }));
          }, 3000);
        }
      };

      processCommand().catch((err) => {
        console.error('Voice command processing error:', err);
        setState((prev) => ({
          ...prev,
          error: 'Error processing command',
          isProcessing: false,
        }));
      });
    },
    [language, router, autoNavigate, navigationDelay, onCommandMatched, onCommandFailed]
  );

  /**
   * Handle custom actions
   */
  const handleCustomAction = useCallback((action: string, result: MatchResult) => {
    switch (action) {
      case 'showHelp':
        // Emit event or trigger help modal
        window.dispatchEvent(new CustomEvent('voiceNavigation:showHelp', { detail: result }));
        break;

      case 'toggleDarkMode':
        window.dispatchEvent(new CustomEvent('voiceNavigation:toggleDarkMode'));
        break;

      case 'goBack':
        window.history.back();
        break;

      default:
        console.warn(`Unknown action: ${action}`);
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      isListening: false,
      transcript: '',
      lastCommand: null,
      isProcessing: false,
      error: null,
      feedback: '',
    });

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
  }, []);

  /**
   * Set listening state
   */
  const setListening = useCallback((listening: boolean) => {
    setState((prev) => ({
      ...prev,
      isListening: listening,
      ...(listening
        ? { transcript: '', error: null, feedback: '' }
        : {}),
    }));
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    handleTranscript,
    reset,
    setListening,
  };
}

/**
 * Hook to get voice command feedback
 * Useful for displaying command confirmations
 */
export function useVoiceCommandFeedback() {
  const [feedback, setFeedback] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    timestamp: number;
  } | null>(null);

  useEffect(() => {
    const handleMatched = (
      event: Event & { detail?: MatchResult }
    ) => {
      const result = (event as CustomEvent).detail as MatchResult;
      if (result.command) {
        setFeedback({
          message: `${result.command.label.en}`,
          type: 'success',
          timestamp: Date.now(),
        });

        const timer = setTimeout(() => {
          setFeedback(null);
        }, 2000);

        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('voiceNavigation:commandMatched', handleMatched);
    return () => {
      window.removeEventListener('voiceNavigation:commandMatched', handleMatched);
    };
  }, []);

  return feedback;
}

/**
 * Hook to listen for custom voice actions
 */
export function useVoiceAction(action: string, callback: (detail?: any) => void) {
  useEffect(() => {
    const handler = (event: Event) => {
      callback((event as CustomEvent).detail);
    };

    window.addEventListener(`voiceNavigation:${action}`, handler);
    return () => {
      window.removeEventListener(`voiceNavigation:${action}`, handler);
    };
  }, [action, callback]);
}
