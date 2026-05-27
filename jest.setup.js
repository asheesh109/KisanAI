import '@testing-library/jest-dom'

// Mock Web APIs that are not available in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
})

// Mock Speech Recognition
global.SpeechRecognition = jest.fn(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}))

global.webkitSpeechRecognition = global.SpeechRecognition

// Mock Speech Synthesis
global.speechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => []),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}

// Mock FileReader
global.FileReader = class {
  readAsDataURL = jest.fn()
  onload = null
  result = null
}

// Global mock for LanguageContext
jest.mock('@/contexts/LanguageContext', () => {
  const React = require('react');
  const { languages, defaultLanguage, getTranslations } = require('./src/lib/i18n.js');
  
  // Use 'hi' (Hindi) as the mock language to match the expectations of the tests, 
  // since the test assertions expect Hindi texts (e.g. 'सरकारी योजनाएं')
  const mockTranslations = {
    ...getTranslations('hi'),
    'search.placeholder': 'योजना खोजें...',
    'card.started': 'शुरुआत वर्ष'
  };
  
  const mockT = (key, params = {}) => {
    let translation = mockTranslations[key] || key;
    if (params && params.returnObjects) {
      return translation;
    }
    translation = String(translation);
    Object.keys(params).forEach((param) => {
      if (param !== 'returnObjects') {
        const placeholder = new RegExp(`{{${param}}}`, 'g');
        translation = translation.replace(placeholder, String(params[param]));
      }
    });
    return translation;
  };

  return {
    useLanguage: () => ({
      language: 'hi',
      languages,
      translations: mockTranslations,
      t: mockT,
      changeLanguage: jest.fn(),
    }),
    LanguageProvider: ({ children }) => <>{children}</>,
  };
});

