'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface VoiceAssistantContextType {
  isPaused: boolean;
  pauseBackground: () => void;
  resumeBackground: () => void;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextType | undefined>(undefined);

export function VoiceAssistantProvider({ children }: { children: React.ReactNode }) {
  const [isPaused, setIsPaused] = useState(false);

  const pauseBackground = useCallback(() => {
    console.log('[VA-CONTEXT] ⏸️ Pausing background voice assistant');
    setIsPaused(true);
  }, []);

  const resumeBackground = useCallback(() => {
    console.log('[VA-CONTEXT] ▶️ Resuming background voice assistant');
    setIsPaused(false);
  }, []);

  return (
    <VoiceAssistantContext.Provider
      value={{
        isPaused,
        pauseBackground,
        resumeBackground,
      }}
    >
      {children}
    </VoiceAssistantContext.Provider>
  );
}

export function useVoiceAssistantContext() {
  const context = useContext(VoiceAssistantContext);
  if (!context) {
    return {
      isPaused: false,
      pauseBackground: () => {},
      resumeBackground: () => {},
    };
  }
  return context;
}
