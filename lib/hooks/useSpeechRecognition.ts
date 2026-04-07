'use client'

import { useState, useEffect, useCallback } from 'react'

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const [recognition] = useState<SpeechRecognitionInstance | null>(() => {
    if (typeof window === 'undefined') return null
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return null
    const instance = new SR() as SpeechRecognitionInstance
    instance.continuous = false
    instance.interimResults = true
    instance.lang = 'pt-BR'
    return instance
  })

  const isSupported = recognition !== null

  useEffect(() => {
    if (!recognition) return

    const handleResult = (event: Event) => {
      const e = event as SpeechRecognitionEvent
      const text = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      setTranscript(text)
    }

    const handleEnd = () => {
      setIsListening(false)
    }

    const handleError = (event: Event) => {
      const e = event as SpeechRecognitionErrorEvent
      console.error('Speech recognition error:', e.error)
      setIsListening(false)
    }

    recognition.addEventListener('result', handleResult)
    recognition.addEventListener('end', handleEnd)
    recognition.addEventListener('error', handleError)

    return () => {
      recognition.removeEventListener('result', handleResult)
      recognition.removeEventListener('end', handleEnd)
      recognition.removeEventListener('error', handleError)
    }
  }, [recognition])

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      setTranscript('')
      recognition.start()
      setIsListening(true)
    }
  }, [recognition, isListening])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition, isListening])

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  }
}
