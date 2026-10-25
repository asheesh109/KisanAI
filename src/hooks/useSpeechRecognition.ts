'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface SpeechRecognitionOptions {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
}

// Extend global window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}) => {
  const { lang = 'en-IN', continuous = false, interimResults = true } = options

  const [isListening, setIsListening] = useState<boolean>(false)
  const [transcript, setTranscript] = useState<string>('')
  const [confidence, setConfidence] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState<boolean>(false)

  const recognitionRef = useRef<any>(null)
  const interimTranscriptRef = useRef<string>('')

  // Initialize Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      setIsSupported(false)
      setError('Speech Recognition not supported in this browser')
      return
    }

    setIsSupported(true)

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = lang

    // Set up event listeners
    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      setTranscript('')
      interimTranscriptRef.current = ''
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''
      let maxConfidence = 0

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const currentTranscript = event.results[i][0].transcript
        const currentConfidence = event.results[i][0].confidence

        // Track highest confidence
        if (currentConfidence > maxConfidence) {
          maxConfidence = currentConfidence
        }

        if (event.results[i].isFinal) {
          finalTranscript += currentTranscript + ' '
        } else {
          interimTranscript += currentTranscript
        }
      }

      interimTranscriptRef.current = interimTranscript
      setTranscript(finalTranscript || interimTranscript)
      setConfidence(maxConfidence)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setError(event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [continuous, interimResults, lang])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && isSupported) {
      setError(null)
      setTranscript('')
      setConfidence(0)
      interimTranscriptRef.current = ''
      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error('Error starting recognition:', err)
        setError('Failed to start speech recognition')
      }
    }
  }, [isListening, isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.error('Error stopping recognition:', err)
      }
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setConfidence(0)
    interimTranscriptRef.current = ''
  }, [])

  return {
    transcript,
    isListening,
    isSupported,
    error,
    confidence,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition: isSupported,
  }
}