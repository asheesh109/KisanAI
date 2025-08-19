'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

export const useSpeechRecognition = (options = {}) => {
  const {
    lang = 'hi-IN', // Hindi (India)
    continuous = false,
    interimResults = true,
  } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState(null)
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef(null)

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = 
      window.SpeechRecognition || 
      window.webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      
      const recognition = recognitionRef.current

      recognition.continuous = continuous
      recognition.interimResults = interimResults
      recognition.lang = lang

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
      }

      recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        let maxConfidence = 0

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcriptPart = result[0].transcript
          const confidenceScore = result[0].confidence || 0

          if (result.isFinal) {
            finalTranscript += transcriptPart
            maxConfidence = Math.max(maxConfidence, confidenceScore)
          } else {
            interimTranscript += transcriptPart
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript)
          setConfidence(maxConfidence)
        } else if (interimResults && interimTranscript) {
          setTranscript(interimTranscript)
        }
      }

      recognition.onerror = (event) => {
        setError(event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }
    } else {
      setIsSupported(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [lang, continuous, interimResults])

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
      recognitionRef.current.stop()
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setConfidence(0)
    setError(null)
  }, [])

  return {
    isListening,
    transcript,
    confidence,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  }
}