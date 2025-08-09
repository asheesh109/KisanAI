'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseSpeechRecognitionOptions {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
}

interface UseSpeechRecognitionReturn {
  isListening: boolean
  transcript: string
  confidence: number
  error: string | null
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn => {
  const {
    lang = 'hi-IN', // Hindi (India)
    continuous = false,
    interimResults = true,
  } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef<unknown>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = 
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition || 
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new (SpeechRecognition as new () => {
        continuous: boolean
        interimResults: boolean
        lang: string
        start: () => void
        stop: () => void
        abort: () => void
        onstart: ((event: Event) => void) | null
        onresult: ((event: unknown) => void) | null
        onerror: ((event: unknown) => void) | null
        onend: (() => void) | null
      })()
      
      const recognition = recognitionRef.current as {
        continuous: boolean
        interimResults: boolean
        lang: string
        start: () => void
        stop: () => void
        abort: () => void
        onstart: ((event: Event) => void) | null
        onresult: ((event: unknown) => void) | null
        onerror: ((event: unknown) => void) | null
        onend: (() => void) | null
      }

      recognition.continuous = continuous
      recognition.interimResults = interimResults
      recognition.lang = lang

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
      }

      recognition.onresult = (event: unknown) => {
        const speechEvent = event as {
          resultIndex: number
          results: {
            length: number
            [index: number]: {
              isFinal: boolean
              [index: number]: {
                transcript: string
                confidence: number
              }
            }
          }
        }

        let finalTranscript = ''
        let interimTranscript = ''
        let maxConfidence = 0

        for (let i = speechEvent.resultIndex; i < speechEvent.results.length; i++) {
          const result = speechEvent.results[i]
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

      recognition.onerror = (event: unknown) => {
        const errorEvent = event as { error: string }
        setError(errorEvent.error)
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
        (recognitionRef.current as { abort: () => void }).abort()
      }
    }
  }, [lang, continuous, interimResults])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setError(null)
      setTranscript('')
      setConfidence(0)
      try {
        (recognitionRef.current as { start: () => void }).start()
      } catch {
        setError('Failed to start speech recognition')
      }
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      (recognitionRef.current as { stop: () => void }).stop()
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
