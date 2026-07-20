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

// Mock useLanguage context globally for all tests
jest.mock('@/contexts/LanguageContext', () => {
  const { getTranslations } = require('@/lib/i18n');
  const translations = getTranslations('hi');
  
  return {
    useLanguage: () => ({
      language: 'hi', // default to 'hi' so tests looking for Hindi strings pass
      languages: {
        en: { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
        hi: { code: 'hi', name: 'हिंदी', flag: '🇮🇳', dir: 'ltr' },
        mr: { code: 'mr', name: 'मराठी', flag: '🇮🇳', dir: 'ltr' },
        gu: { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳', dir: 'ltr' },
        ml: { code: 'ml', name: 'മലയാളം', flag: '🇮🇳', dir: 'ltr' },
      },
      translations,
      t: (key, params = {}) => {
        let translation = translations[key] || key;
        if (params.returnObjects) return translation;
        translation = String(translation);
        Object.keys(params).forEach((param) => {
          if (param !== 'returnObjects') {
            const placeholder = new RegExp(`{{${param}}}`, 'g');
            translation = translation.replace(placeholder, String(params[param]));
          }
        });
        return translation;
      },
      changeLanguage: jest.fn(),
    }),
    LanguageProvider: ({ children }) => <>{children}</>,
  };
});
