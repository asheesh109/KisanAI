import { renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'

// Mock Speech Synthesis API (already in jest.setup.js but adding specific test mocks)
const mockSpeak = jest.fn()
const mockCancel = jest.fn()

const mockSpeechSynthesis = {
  speak: mockSpeak,
  cancel: mockCancel,
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => []),
  speaking: false,
  pending: false,
  paused: false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.speechSynthesis = mockSpeechSynthesis

describe('useSpeechSynthesis Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSpeechSynthesis())
    
    expect(result.current.speaking).toBe(false)
    expect(result.current.isSupported).toBe(true)
    expect(typeof result.current.speak).toBe('function')
    expect(typeof result.current.cancel).toBe('function')
  })

  it('should speak text when speak function is called', () => {
    const { result } = renderHook(() => useSpeechSynthesis())
    
    act(() => {
      result.current.speak('Hello World')
    })
    
    expect(mockSpeak).toHaveBeenCalled()
    expect(mockSpeak).toHaveBeenCalledWith(expect.any(SpeechSynthesisUtterance))
  })

  it('should cancel speech when cancel function is called', () => {
    const { result } = renderHook(() => useSpeechSynthesis())
    
    act(() => {
      result.current.cancel()
    })
    
    expect(mockCancel).toHaveBeenCalled()
  })

  it('should handle speech with custom options', () => {
    const { result } = renderHook(() => useSpeechSynthesis({
      rate: 0.8,
      pitch: 1.2,
      volume: 0.9
    }))
    
    act(() => {
      result.current.speak('Test message')
    })
    
    expect(mockSpeak).toHaveBeenCalled()
  })

  it('should update speaking state correctly', () => {
    const { result } = renderHook(() => useSpeechSynthesis())
    
    act(() => {
      result.current.speak('Test')
    })
    
    // Initially speaking should be false, will be updated by utterance events
    expect(result.current.speaking).toBe(false)
  })

  it('should handle empty text input', () => {
    const { result } = renderHook(() => useSpeechSynthesis())
    
    act(() => {
      result.current.speak('')
    })
    
    // Should not call speak for empty text
    expect(mockSpeak).not.toHaveBeenCalled()
  })
})
