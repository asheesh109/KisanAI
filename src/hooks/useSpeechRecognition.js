'use client'

import { useState, useCallback, useRef } from 'react'

export const useSpeechRecognition = (options = {}) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState(null)
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef(null)

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setError(null)
      setTranscript('')
      setConfidence(0)
      try {
        recognitionRef.current.start()
      } catch {
        setError('Failed to start speech recognition')
      }
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.abort()
      } catch {
        // Ignore cleanup errors
      }
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setConfidence(0)
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