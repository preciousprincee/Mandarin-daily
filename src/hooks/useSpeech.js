import { useState, useCallback, useRef } from 'react'

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  const speak = useCallback((text, lang = 'zh-CN') => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const trySpeak = () => {
      const utt = new SpeechSynthesisUtterance(text)
      utt.lang = lang
      utt.rate = 0.85
      utt.pitch = 1
      utt.onstart = () => setIsSpeaking(true)
      utt.onend = () => setIsSpeaking(false)
      utt.onerror = () => setIsSpeaking(false)

      const voices = window.speechSynthesis.getVoices()
      const chineseVoice = voices.find(v => v.lang.startsWith('zh'))
      if (chineseVoice) utt.voice = chineseVoice

      window.speechSynthesis.speak(utt)
    }

    // iOS doesn't load voices until triggered — use silent utterance to unlock
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null
        trySpeak()
      }
      const silent = new SpeechSynthesisUtterance('')
      silent.volume = 0
      window.speechSynthesis.speak(silent)
    } else {
      trySpeak()
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return false

    const recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript('')
    }
    recognition.onresult = (e) => {
      setTranscript(e.results[0][0].transcript)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    return true
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const clearTranscript = useCallback(() => setTranscript(''), [])

  const hasTTS = typeof window !== 'undefined' && 'speechSynthesis' in window
  const hasSTT = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  return {
    speak, stopSpeaking, isSpeaking,
    startListening, stopListening, isListening,
    transcript, clearTranscript,
    hasTTS, hasSTT,
  }
}
