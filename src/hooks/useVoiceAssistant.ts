'use client';

/**
 * Two-Stage Voice Recognition Hook
 * Stage 1: Listen for wake word (Hey KisanAI)
 * Stage 2: Listen for command (Open weather, Open schemes, etc)
 * Using advanced NLP-based keyword matching
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSpeechRecognition } from './useSpeechRecognition';
import { WAKE_WORDS } from '@/lib/wakeWordDetection';
import { matchVoiceCommand, type CommandAction, type MatchResult } from '@/lib/voiceCommandMatcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMicrophone } from '@/contexts/MicrophoneContext';
import { useVoiceAssistantContext } from '@/contexts/VoiceAssistantContext';

export type VoiceAssistantStage = 'idle' | 'listening-wake' | 'wake-detected' | 'listening-command' | 'processing' | 'success' | 'error';

export interface UseVoiceAssistantOptions {
  onStageChange?: (stage: VoiceAssistantStage) => void;
  autoNavigate?: boolean;
}

/**
 * Main hook for always-listening voice assistant
 */
export function useVoiceAssistant(options: UseVoiceAssistantOptions = {}) {
  const { onStageChange, autoNavigate = true } = options;
  const router = useRouter();
  const languageContext = useLanguage?.();
  const language = languageContext?.language || 'en';
  const { requestMic, releaseMic, getCurrentUser } = useMicrophone();
  const { isPaused } = useVoiceAssistantContext();
  
  // Map language code to speech recognition language
  const speechLangMap: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    ml: 'ml-IN',
  };
  const speechLang = speechLangMap[language] || 'hi-IN';
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
  } = useSpeechRecognition({ lang: speechLang, continuous: true, interimResults: true });

  const [stage, setStage] = useState<VoiceAssistantStage>('idle');
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [hasMicAccess, setHasMicAccess] = useState(true);
  const stageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const listeningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const micRequestIdRef = useRef<string>('voice-assistant-' + Math.random().toString(36).slice(2));

  // Update stage and call callback
  const updateStage = useCallback(
    (newStage: VoiceAssistantStage) => {
      setStage(newStage);
      onStageChange?.(newStage);
    },
    [onStageChange]
  );

  // Start listening for wake word on mount
  useEffect(() => {
    // Request mic on mount
    const micGranted = requestMic(micRequestIdRef.current);
    setHasMicAccess(micGranted);
    
    console.log('[VOICE] 🎙️ Mounting - Requesting mic access:', micGranted);
    
    if (micGranted && !isListening) {
      console.log('[VOICE] 🎙️ Mounting - Starting initial listening for wake word. Language:', language, 'Speech Lang:', speechLang);
      startListening();
      updateStage('listening-wake');
    }
  }, []);

  // Check mic status periodically and stop if lost
  useEffect(() => {
    const micCheckInterval = setInterval(() => {
      const currentOwner = getCurrentUser();
      if (currentOwner && currentOwner !== micRequestIdRef.current) {
        console.log('[VOICE] ⚠️ MIC LOST - Another component is using mic:', currentOwner);
        setHasMicAccess(false);
        stopListening();
        updateStage('idle');
      } else if (!currentOwner) {
        console.log('[VOICE] ℹ️ Mic released by someone');
        setHasMicAccess(false);
      }
    }, 100);

    return () => clearInterval(micCheckInterval);
  }, [getCurrentUser, stopListening, updateStage]);

  // Handle language changes
  useEffect(() => {
    if (currentLanguage !== language) {
      console.log('[VOICE] 🌐 LANGUAGE CHANGED!', { from: currentLanguage, to: language, speechLang });
      setCurrentLanguage(language);
      setWakeWordDetected(false);
      setFeedback('');
      setError('');
      
      // Restart listening with new language
      stopListening();
      setTimeout(() => {
        startListening();
        updateStage('listening-wake');
      }, 500);
    }
  }, [language, currentLanguage, speechLang, startListening, stopListening, updateStage]);

  // Handle pause/resume from voice assistant context
  useEffect(() => {
    if (isPaused) {
      console.log('[VOICE] ⏸️ PAUSED - Stopping background listening');
      stopListening();
      updateStage('idle');
    } else if (!isPaused && stage === 'idle') {
      console.log('[VOICE] ▶️ RESUMED - Starting background listening');
      startListening();
      updateStage('listening-wake');
    }
  }, [isPaused, stage, stopListening, startListening, updateStage]);

  // Continuous listening loop
  useEffect(() => {
    // If not listening and not processing, restart
    if (!isListening && stage !== 'processing' && stage !== 'idle') {
      setWakeWordDetected(false);
      startListening();
      updateStage('listening-wake');
    }
  }, [isListening, stage, startListening, updateStage]);

  // Handle transcript updates
  useEffect(() => {
    const currentTranscript = transcript;
    if (!currentTranscript) return;

    const normalizeSimple = (text: string) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[.,!?;:\-'"()[\]{}]/g, '')
        .replace(/\s+/g, ' ');

    const normalized = normalizeSimple(currentTranscript);
    const lang = (language as keyof typeof WAKE_WORDS) || 'en';
    
    console.log('[VOICE] 📝 Transcript received:', {
      raw: currentTranscript,
      normalized,
      stage,
      language: lang,
      wakeWordDetected,
    });

    // Stage 1: Listening for wake word
    if (stage === 'listening-wake' && !wakeWordDetected) {
      const wakeWords = WAKE_WORDS[lang] || [];
      const normalizeSimple = (text: string) =>
        text
          .toLowerCase()
          .trim()
          .replace(/[.,!?;:\-'"()[\]{}]/g, '')
          .replace(/\s+/g, ' ');

      const wakeWordsNormalized = wakeWords.map((w) => normalizeSimple(w));
      const normalizedTranscript = normalizeSimple(currentTranscript);

      console.log('[VOICE] 🔍 Wake word detection:', { wakeWordsNormalized, normalizedTranscript });

      // Check for wake word match
      const foundWakeWord = wakeWordsNormalized.some(
        (ww) =>
          normalizedTranscript === ww ||
          normalizedTranscript.includes(ww) ||
          ww.includes(normalizedTranscript)
      );

      if (foundWakeWord) {
        console.log('[VOICE] ✅ WAKE WORD DETECTED!');
        setWakeWordDetected(true);
        setFeedback('🎤 Listening for command...');
        setError('');
        updateStage('wake-detected');

        // Transition to command listening after short delay
        if (stageTimeoutRef.current) clearTimeout(stageTimeoutRef.current);
        stageTimeoutRef.current = setTimeout(() => {
          updateStage('listening-command');
        }, 800);
      }
    }

    // Stage 2: Listening for command - Use advanced NLP matching
    if (stage === 'listening-command' && wakeWordDetected && transcript) {
      console.log('[VOICE] 👂 Stage 2 - Advanced NLP matching starting');
      
      // CRITICAL: Remove wake words from transcript before command matching
      let commandText = transcript;
      const wakeWords = WAKE_WORDS[lang] || [];
      const normalizeSimple = (text: string) =>
        text
          .toLowerCase()
          .trim()
          .replace(/[.,!?;:\-'"()[\]{}]/g, '')
          .replace(/\s+/g, ' ');

      // Remove all wake words from transcript
      for (const wakeWord of wakeWords) {
        const normalizedWakeWord = normalizeSimple(wakeWord);
        const normalizedTranscript = normalizeSimple(commandText);
        
        if (normalizedTranscript.includes(normalizedWakeWord)) {
          commandText = commandText.replace(new RegExp(wakeWord, 'gi'), '').trim();
          console.log('[VOICE] ✂️ Removed wake word from transcript:', { wakeWord });
        }
      }

      console.log('[VOICE] 📝 Command text after wake word removal:', { original: transcript, cleaned: commandText });

      // If empty after removing wake words, ignore (user just said wake word)
      if (!commandText.trim()) {
        console.log('[VOICE] ⏭️ Skipping - transcript is empty after wake word removal');
        return;
      }
      
      // Use the production-grade matcher with cleaned text
      const matchResult: MatchResult = matchVoiceCommand(commandText, lang);
      
      // Route mapping for different actions
      const actionRouteMap: { [key in CommandAction]: string } = {
        'GO_TO_HOME': '/',
        'OPEN_WEATHER': '/weather',
        'OPEN_MARKET': '/market-prices',
        'OPEN_SCHEMES': '/schemes',
        'OPEN_CROP_ANALYSIS': '/crop-analysis',
        'OPEN_KCC_APPLICATION': '/kcc-application',
        'OPEN_VOICE_ASSISTANT': '/voice-assistant',
        'OPEN_ELIGIBILITY': '/schemes/eligibility-checker',
        'UNKNOWN': '',
      };

      if (matchResult.action !== 'UNKNOWN' && matchResult.confidence > 0.3) {
        const route = actionRouteMap[matchResult.action];
        console.log('[VOICE] 🎯 COMMAND MATCHED!', { 
          action: matchResult.action, 
          route,
          confidence: (matchResult.confidence * 100).toFixed(1) + '%'
        });
        
        updateStage('processing');
        setFeedback('✓'); // Don't show action name, just checkmark
        setLastCommand(matchResult.action);
        setError('');

        // Navigate
        if (autoNavigate && route) {
          if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);
          listeningTimeoutRef.current = setTimeout(() => {
            console.log('[VOICE] 🚀 Executing navigation to:', route);
            stopListening();
            router.push(route);
            updateStage('success');

            // Reset after success
            if (stageTimeoutRef.current) clearTimeout(stageTimeoutRef.current);
            stageTimeoutRef.current = setTimeout(() => {
              console.log('[VOICE] 🔄 Resetting to listen for next command');
              setWakeWordDetected(false);
              setFeedback('');
              updateStage('listening-wake');
              startListening();
            }, 2000);
          }, 600);
        }
      } else {
        console.log('[VOICE] ❌ No match or low confidence:', { 
          action: matchResult.action, 
          confidence: (matchResult.confidence * 100).toFixed(1) + '%'
        });
      }
    }
  }, [transcript, language, stage, wakeWordDetected, autoNavigate, router, startListening, stopListening, updateStage]);

  /**
   * Manual reset
   */
  const reset = useCallback(() => {
    setWakeWordDetected(false);
    setStage('listening-wake');
    setFeedback('');
    setError('');
    setLastCommand('');

    if (stageTimeoutRef.current) clearTimeout(stageTimeoutRef.current);
    if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);

    if (!isListening) {
      startListening();
    }
  }, [isListening, startListening]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (stageTimeoutRef.current) clearTimeout(stageTimeoutRef.current);
      if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);
      stopListening();
      releaseMic(micRequestIdRef.current);
      console.log('[VOICE] 🎙️ Unmounting - Mic released:', micRequestIdRef.current);
    };
  }, [stopListening, releaseMic]);

  return {
    stage,
    wakeWordDetected,
    transcript,
    lastCommand,
    feedback,
    error,
    isListening,
    reset,
  };
}

/**
 * Hook to get displayed feedback message
 */
export function useVoiceAssistantFeedback(stage: VoiceAssistantStage) {
  const getMessage = useCallback(() => {
    const messages: Record<VoiceAssistantStage, string> = {
      idle: 'Ready',
      'listening-wake': 'Listening for Hey KisanAI...',
      'wake-detected': '🎤 Wake word detected! Listening for command...',
      'listening-command': '🎤 Listening for command...',
      processing: 'Processing...',
      success: '✓ Command executed',
      error: '✗ Error occurred',
    };

    return messages[stage] || 'Ready';
  }, []);

  return getMessage();
}
