import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import VoiceAssistant from '@/app/voice-assistant/page'

// Mock the speech hooks
jest.mock('../../hooks/useSpeechRecognition', () => ({
  useSpeechRecognition: () => ({
    isListening: false,
    transcript: '',
    startListening: jest.fn(),
    stopListening: jest.fn(),
    resetTranscript: jest.fn(),
    browserSupportsSpeechRecognition: true
  })
}))

jest.mock('../../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: () => ({
    speak: jest.fn(),
    speaking: false,
    supported: true,
    voices: []
  })
}))

describe('Voice Assistant Page', () => {
  it('renders voice assistant interface', () => {
    render(<VoiceAssistant />)
    
    expect(screen.getByText('आवाज सहायक')).toBeInTheDocument()
    expect(screen.getByText(/हिंदी में अपने खेती संबंधी सवाल पूछें/)).toBeInTheDocument()
  })

  it('displays microphone button', () => {
    render(<VoiceAssistant />)
    
    const micButton = screen.getByRole('button', { name: /बोलना शुरू करें/i })
    expect(micButton).toBeInTheDocument()
  })

  it('shows text input area', () => {
    render(<VoiceAssistant />)
    
    expect(screen.getByPlaceholderText(/टाइप करें/)).toBeInTheDocument()
  })

  it('displays common questions section', () => {
    render(<VoiceAssistant />)
    
    expect(screen.getByText(/आम सवाल/)).toBeInTheDocument()
  })

  it('handles mic button click', async () => {
    render(<VoiceAssistant />)
    
    const micButton = screen.getByRole('button', { name: /बोलना शुरू करें/i })
    fireEvent.click(micButton)
    
    // Should handle the click without errors
    await waitFor(() => {
      expect(micButton).toBeInTheDocument()
    })
  })

  it('displays quick question examples', () => {
    render(<VoiceAssistant />)
    
    expect(screen.getByText(/गेहूं की फसल में पीले पत्ते/)).toBeInTheDocument()
    expect(screen.getByText(/कौन सी फसल बोनी चाहिए/)).toBeInTheDocument()
    expect(screen.getByText(/जैविक खेती कैसे करें/)).toBeInTheDocument()
  })
})
