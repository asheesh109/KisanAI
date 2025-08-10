import { renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'

// Simple mock for testing speech recognition hook
const mockStart = jest.fn()
const mockStop = jest.fn()

const MockSpeechRecognition = jest.fn().mockImplementation(() => ({
  start: mockStart,
  stop: mockStop,
  abort: jest.fn(),
  continuous: false,
  interimResults: false,
  lang: 'hi-IN',
  onstart: null,
  onend: null,
  onresult: null,
  onerror: null
}))

// Override globals for testing
beforeAll(() => {
  Object.defineProperty(global, 'SpeechRecognition', {
    writable: true,
    value: MockSpeechRecognition
  })
  Object.defineProperty(global, 'webkitSpeechRecognition', {
    writable: true,
    value: MockSpeechRecognition
  })
})

describe('useSpeechRecognition Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSpeechRecognition())
    
    expect(result.current.isListening).toBe(false)
    expect(result.current.transcript).toBe('')
    expect(result.current.error).toBe('')
    expect(result.current.isSupported).toBe(true)
    expect(typeof result.current.startListening).toBe('function')
    expect(typeof result.current.stopListening).toBe('function')
  })

  it('should start listening when startListening is called', () => {
    const { result } = renderHook(() => useSpeechRecognition())
    
    act(() => {
      result.current.startListening()
    })
    
    expect(MockSpeechRecognition).toHaveBeenCalled()
    expect(mockStart).toHaveBeenCalled()
  })

  it('should stop listening when stopListening is called', () => {
    const { result } = renderHook(() => useSpeechRecognition())
    
    act(() => {
      result.current.startListening()
    })
    
    act(() => {
      result.current.stopListening()
    })
    
    expect(mockStop).toHaveBeenCalled()
  })

  it('should reset transcript', () => {
    const { result } = renderHook(() => useSpeechRecognition())
    
    act(() => {
      result.current.resetTranscript()
    })
    
    expect(result.current.transcript).toBe('')
  })

  it('should handle custom options', () => {
    const { result } = renderHook(() => useSpeechRecognition({
      lang: 'en-US',
      continuous: true
    }))
    
    expect(result.current.isSupported).toBe(true)
  })
})
