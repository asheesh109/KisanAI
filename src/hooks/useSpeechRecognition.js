'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

export const useSpeechRecognition = (options = {}) => {
  const { lang = 'en-IN', continuous = false, interimResults = true } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState(null)
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef(null)
  const interimTranscriptRef = useRef('')

  // Initialize Speech Recognition on mount
  useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      setError('Speech Recognition not supported in this browser')
      return
    }

    setIsSupported(true)

    const recognition = new SpeechRecognition()
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

    recognition.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = ''
      let maxConfidence = 0

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        const confidence = event.results[i][0].confidence

        // Track highest confidence
        if (confidence > maxConfidence) {
          maxConfidence = confidence
        }

        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      interimTranscriptRef.current = interimTranscript
      setTranscript(finalTranscript || interimTranscript)
      setConfidence(maxConfidence)
    }

    recognition.onerror = (event) => {
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