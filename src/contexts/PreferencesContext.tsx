import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Preferences {
  language: string;
  region: string;
  savedCrops: string[];
}

interface PreferencesContextType {
  preferences: Preferences;
  setPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
  updateLanguage: (lang: string) => void;
}

const defaultPreferences: Preferences = {
  language: 'hi', // Default to Hindi
  region: '',
  savedCrops: [],
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useLocalStorage<Preferences>(
    'kisanai_user_preferences',
    defaultPreferences
  );

  const updateLanguage = (language: string) => {
    setPreferences((prev) => ({ ...prev, language }));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences, updateLanguage }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};