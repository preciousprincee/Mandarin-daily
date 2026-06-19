import { useState, useCallback, useRef } from 'react'

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  const speak = useCallback((text, lang = 'zh-CN') => {
    if (!window.speechSynthesis) return

    // Cancel anything currently playing
    window.speechSynthesis.cancel()

    const utterThis = () => {
      const utt = new SpeechSynthesisUtterance(text)
      utt.lang = lang
      utt.rate = 0.8
      utt.pitch = 1
      utt.volume = 1

      utt.onstart = () => setIsSpeaking(true)
      utt.onend = () => setIsSpeaking(false)
      utt.onerror = (e) => {
        console.warn('TTS error', e)
        setIsSpeaking(false)
      }

      const voices = window.speechSynthesis.getVoices()
      const chineseVoice =
        voices.find(v => v.lang === 'zh-CN') ||
        voices.find(v => v.lang === 'zh-TW') ||
        voices.find(v => v.lang.startsWith('zh'))

      if (chineseVoice) utt.voice = chineseVoice

      // Small delay helps Chrome desktop avoid the "didn't start" bug
      setTimeout(() => {
        window.speechSynthesis.speak(utt)
      }, 50)
    }

    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      utterThis()
    } else {
      let fired = false
      window.speechSynthesis.onvoiceschanged = () => {
        if (fired) return
        fired = true
        window.speechSynthesis.onvoiceschanged = null
        utterThis()
      }
      // Fallback if onvoiceschanged never fires
      setTimeout(() => {
        if (!fired) {
          fired = true
          utterThis()
        }
      }, 500)
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
