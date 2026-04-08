'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface MicrophoneContextType {
  isMicInUse: boolean;
  requestMic: (requesterId: string) => boolean;
  releaseMic: (requesterId: string) => void;
  getCurrentUser: () => string | null;
}

const MicrophoneContext = createContext<MicrophoneContextType | undefined>(undefined);

export function MicrophoneProvider({ children }: { children: React.ReactNode }) {
  const [micOwner, setMicOwner] = useState<string | null>(null);

  const requestMic = useCallback((requesterId: string): boolean => {
    setMicOwner(current => {
      if (current === null || current === requesterId) {
        console.log(`[MIC] 🎤 Mic requested by ${requesterId}:`, current === requesterId ? 'ALREADY OWNER' : 'GRANTED');
        return requesterId;
      }
      console.log(`[MIC] ❌ Mic denied to ${requesterId} (currently owned by ${current})`);
      return current;
    });
    return micOwner === null || micOwner === requesterId;
  }, [micOwner]);

  const releaseMic = useCallback((requesterId: string) => {
    setMicOwner(current => {
      if (current === requesterId) {
        console.log(`[MIC] 🎤 Mic released by ${requesterId}`);
        return null;
      }
      return current;
    });
  }, []);

  const getCurrentUser = useCallback(() => micOwner, [micOwner]);

  return (
    <MicrophoneContext.Provider
      value={{
        isMicInUse: micOwner !== null,
        requestMic,
        releaseMic,
        getCurrentUser,
      }}
    >
      {children}
    </MicrophoneContext.Provider>
  );
}

export function useMicrophone() {
  const context = useContext(MicrophoneContext);
  if (!context) {
    throw new Error('useMicrophone must be used within MicrophoneProvider');
  }
  return context;
}
