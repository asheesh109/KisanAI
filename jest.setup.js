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
    abort: jest.fn(),
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

// Mock Language Context
jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => {
    const { getTranslations } = require('./src/lib/i18n');
    return {
      language: 'en',
      languages: {
        en: { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
        hi: { code: 'hi', name: 'Hindi', nativeName: '??????', dir: 'ltr' }
      },
      t: (key, params = {}) => {
        const trans = getTranslations('en');
        let translation = trans[key] || key;
        if (params.returnObjects) return translation;
        translation = String(translation);
        Object.keys(params).forEach((param) => {
          if (param !== 'returnObjects') {
            const placeholder = new RegExp('{{(?:param)}}'.replace('(?:param)', param), 'g');
            translation = translation.replace(placeholder, String(params[param]));
          }
        });
        return translation;
      },
      changeLanguage: jest.fn()
    };
  }
}));
