'use client'

import { useState, useCallback, useRef } from 'react'

interface UseSpeechSynthesisOptions {
  lang?: string
  rate?: number
  pitch?: number
  volume?: number
}

interface UseSpeechSynthesisReturn {
  speaking: boolean
  paused: boolean
  error: string | null
  isSupported: boolean
  speak: (text: string) => void
  pause: () => void
  resume: () => void
  cancel: () => void
}

export const useSpeechSynthesis = (
  options: UseSpeechSynthesisOptions = {}
): UseSpeechSynthesisReturn => {
  const {
    lang = 'hi-IN', // Hindi (India)
    rate = 1,
    pitch = 1,
    volume = 1,
  } = options

  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize speech synthesis
  if (typeof window !== 'undefined' && !synthRef.current) {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    } else {
      setIsSupported(false)
    }
  }

  const speak = useCallback(
    (text: string) => {
      if (!synthRef.current || !isSupported) {
        setError('Speech synthesis not supported')
        return
      }

      // Cancel any ongoing speech
      synthRef.current.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume

      utterance.onstart = () => {
        setSpeaking(true)
        setPaused(false)
        setError(null)
      }

      utterance.onend = () => {
        setSpeaking(false)
        setPaused(false)
      }

      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        setError(event.error)
        setSpeaking(false)
        setPaused(false)
      }

      utterance.onpause = () => {
        setPaused(true)
      }

      utterance.onresume = () => {
        setPaused(false)
      }

      utteranceRef.current = utterance

      try {
        synthRef.current.speak(utterance)
      } catch {
        setError('Failed to speak text')
      }
    },
    [lang, rate, pitch, volume, isSupported]
  )

  const pause = useCallback(() => {
    if (synthRef.current && speaking && !paused) {
      synthRef.current.pause()
    }
  }, [speaking, paused])

  const resume = useCallback(() => {
    if (synthRef.current && speaking && paused) {
      synthRef.current.resume()
    }
  }, [speaking, paused])

  const cancel = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setSpeaking(false)
      setPaused(false)
    }
  }, [])

  return {
    speaking,
    paused,
    error,
    isSupported,
    speak,
    pause,
    resume,
    cancel,
  }
}
