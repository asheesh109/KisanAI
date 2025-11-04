'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { languages, defaultLanguage, getTranslations } from '@/lib/i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(defaultLanguage);
  const [translations, setTranslations] = useState(getTranslations(defaultLanguage));

  useEffect(() => {
    // Load language from localStorage on client side
    const savedLanguage = localStorage.getItem('kisanai-language');
    if (savedLanguage && languages[savedLanguage]) {
      setLanguage(savedLanguage);
      setTranslations(getTranslations(savedLanguage));
    }
  }, []);

  const changeLanguage = (langCode) => {
    if (languages[langCode]) {
      setLanguage(langCode);
      setTranslations(getTranslations(langCode));
      localStorage.setItem('kisanai-language', langCode);
      
      // Update HTML lang attribute
      document.documentElement.lang = langCode;
      document.documentElement.dir = languages[langCode].dir;
    }
  };

 const t = (key, params = {}) => {
  let translation = translations[key] || key;
  console.log(`[DEBUG] Key: ${key}, Translation:`, translation, `Type: ${typeof translation}`);
  console.log(`[DEBUG] Params:`, params);
  
  // Handle raw object/array return (e.g., for lists)
  if (params.returnObjects) {
    console.log('[DEBUG] Returning raw translation (object mode)');
    return translation;
  }
  
  console.log('[DEBUG] Processing as string');
  translation = String(translation);
  console.log(`[DEBUG] After String(): Type: ${typeof translation}`);
  
  // Replace parameters...
  Object.keys(params).forEach((param) => {
    console.log(`[DEBUG] Replacing param: ${param}`);
    if (param !== 'returnObjects') {
      const placeholder = new RegExp(`{{${param}}}`, 'g');
      translation = translation.replace(placeholder, String(params[param]));
    }
  });
  
  return translation;
};

  return (
    <LanguageContext.Provider value={{
      language,
      languages,
      translations,
      t,
      changeLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};