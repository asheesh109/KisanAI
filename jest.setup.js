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

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
  SessionProvider: ({ children }) => children,
  signOut: jest.fn()
}))

// Mock Language Context
jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: jest.fn(() => ({
    language: 'hi',
    languages: {
      en: { name: 'English', code: 'en', flag: '🇺🇸' },
      hi: { name: 'हिंदी', code: 'hi', flag: '🇮🇳' }
    },
    t: (key) => {
      const texts = {
        'home': 'Home',
        'voiceAssistant': 'आवाज सहायक',
        'cropAnalysis': 'फसल विश्लेषण',
        'weather': 'मौसम',
        'marketPrices': 'मंडी भाव',
        'governmentSchemes': 'सरकारी योजनाएं',
        'kccApplication': 'KCC आवेदन'
      };
      return texts[key] || key;
    },
    changeLanguage: jest.fn()
  })),
  LanguageProvider: ({ children }) => children
}))

// Mock Theme Provider
jest.mock('@/components/theme-provider', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light',
    setTheme: jest.fn()
  })),
  ThemeProvider: ({ children }) => children
}))