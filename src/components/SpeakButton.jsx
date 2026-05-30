'use client'
import { useState, useEffect } from 'react'
import { speak, speakSequence, speakWord, isSpeechAvailable } from '@/lib/speech'

/**
 * Button that speaks Maya text when clicked.
 * Modes:
 * - syllable: speaks a single syllable slowly
 * - word: speaks a full word at normal speed
 * - sequence: speaks array of syllables one by one with pauses
 */
export default function SpeakButton({ text, syllables, mode = 'word', size = 'normal', className = '' }) {
  const [available, setAvailable] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    setAvailable(isSpeechAvailable())
    // Load voices (some browsers need this)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.getVoices()
      speechSynthesis.onvoiceschanged = () => setAvailable(true)
    }
  }, [])

  if (!available) return null

  function handleClick(e) {
    e.stopPropagation()
    setSpeaking(true)

    if (mode === 'sequence' && syllables?.length > 0) {
      speakSequence(syllables)
      setTimeout(() => setSpeaking(false), syllables.length * 800)
    } else if (mode === 'syllable') {
      speak(text, 0.6)
      setTimeout(() => setSpeaking(false), 1000)
    } else {
      speakWord(text)
      setTimeout(() => setSpeaking(false), 1500)
    }
  }

  const sizeClasses = size === 'small'
    ? 'w-6 h-6 text-xs'
    : size === 'large'
    ? 'w-10 h-10 text-lg'
    : 'w-8 h-8 text-sm'

  return (
    <button
      onClick={handleClick}
      title={mode === 'sequence' ? 'Hear syllables' : 'Hear pronunciation'}
      className={`${sizeClasses} rounded-full flex items-center justify-center transition-colors ${
        speaking
          ? 'bg-maya-gold text-maya-bg'
          : 'bg-maya-surface text-maya-muted hover:bg-maya-border hover:text-maya-gold border border-maya-border'
      } ${className}`}
    >
      {speaking ? '🔊' : '🔈'}
    </button>
  )
}
