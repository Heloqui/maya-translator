'use client'

/**
 * Maya phoneme pronunciation using Web Speech API.
 * Maya Classic phonology maps closely to Spanish:
 * - Same 5 vowels (a, e, i, o, u)
 * - Most consonants identical to Spanish
 * - Ejectives (k', ch', tz') approximated without glottal pop
 * - 'x' = English 'sh' (like in Nahuatl 'Mexico')
 */

// Check if speech synthesis is available
export function isSpeechAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

// Get the best Spanish voice available
function getSpanishVoice() {
  const voices = speechSynthesis.getVoices()
  // Prefer Latin American Spanish, then any Spanish
  return (
    voices.find(v => v.lang === 'es-MX') ||
    voices.find(v => v.lang === 'es-CO') ||
    voices.find(v => v.lang === 'es-419') ||
    voices.find(v => v.lang.startsWith('es')) ||
    voices[0]
  )
}

/**
 * Prepare text for pronunciation.
 * Adjusts Maya orthography to be readable by Spanish TTS.
 */
function mayaToSpeakable(text) {
  return text
    .replace(/'/g, '') // remove glottal stops (ejectives)
    .replace(/'/g, '')
    .replace(/tz/g, 'ts') // tz → ts (closer to actual Maya sound)
    .replace(/x/g, 'sh') // x = /ʃ/ (sh sound)
    .replace(/b'/g, 'b')
    .replace(/k'uhul/g, 'kújul')
    .replace(/aa/g, 'a') // long vowels → single (TTS handles duration poorly)
    .replace(/ee/g, 'e')
    .replace(/oo/g, 'o')
    .replace(/ii/g, 'i')
    .replace(/uu/g, 'u')
}

/**
 * Speak a Maya syllable or word.
 * @param {string} text - The Maya text to pronounce
 * @param {number} rate - Speech rate (0.5 = slow, 1 = normal)
 */
export function speak(text, rate = 0.8) {
  if (!isSpeechAvailable()) return

  // Cancel any current speech
  speechSynthesis.cancel()

  const speakable = mayaToSpeakable(text.toLowerCase())
  const utterance = new SpeechSynthesisUtterance(speakable)

  const voice = getSpanishVoice()
  if (voice) utterance.voice = voice

  utterance.lang = 'es'
  utterance.rate = rate
  utterance.pitch = 1.0
  utterance.volume = 1.0

  speechSynthesis.speak(utterance)
}

/**
 * Speak a sequence of syllables with pauses between them.
 * @param {string[]} syllables - Array of syllable strings
 * @param {number} pauseMs - Pause between syllables in ms
 */
export function speakSequence(syllables, pauseMs = 400) {
  if (!isSpeechAvailable() || syllables.length === 0) return

  speechSynthesis.cancel()

  let index = 0

  function speakNext() {
    if (index >= syllables.length) return

    const speakable = mayaToSpeakable(syllables[index].toLowerCase())
    const utterance = new SpeechSynthesisUtterance(speakable)

    const voice = getSpanishVoice()
    if (voice) utterance.voice = voice

    utterance.lang = 'es'
    utterance.rate = 0.7
    utterance.pitch = 1.0

    utterance.onend = () => {
      index++
      if (index < syllables.length) {
        setTimeout(speakNext, pauseMs)
      }
    }

    speechSynthesis.speak(utterance)
  }

  speakNext()
}

/**
 * Speak a full word (all syllables together, normal speed).
 */
export function speakWord(word) {
  speak(word, 0.9)
}
