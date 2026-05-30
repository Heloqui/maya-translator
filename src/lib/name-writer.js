// Maps Spanish/English phonemes to Maya syllabic approximations
// Maya syllabary doesn't have: d, f, g, r, v, z, ñ
// Approximations: d→t, f→p, g→k, r→l, v→w, z→s, ñ→ni

const VOWELS = ['a', 'e', 'i', 'o', 'u']

const CONSONANT_MAP = {
  'b': 'b', 'c': 'k', 'ch': 'ch', 'd': 't', 'f': 'p',
  'g': 'k', 'h': 'h', 'j': 'h', 'k': 'k', 'l': 'l',
  'm': 'm', 'n': 'n', 'ñ': 'ni', 'p': 'p', 'q': 'k',
  'r': 'l', 's': 'sa', 't': 't', 'v': 'w', 'w': 'w',
  'x': 'x', 'y': 'y', 'z': 'sa',
}

// Full syllable overrides for common letter combinations
const SYLLABLE_OVERRIDES = {
  'ca': 'ka', 'ce': 'se', 'ci': 'si', 'co': 'ko', 'cu': 'ku',
  'ga': 'ka', 'ge': 'ke', 'gi': 'ki', 'go': 'ko', 'gu': 'ku',
  'que': 'ke', 'qui': 'ki',
  'za': 'sa', 'ze': 'se', 'zi': 'si', 'zo': 'so', 'zu': 'su',
  'ja': 'ha', 'je': 'he', 'ji': 'hi', 'jo': 'ho', 'ju': 'hu',
  'va': 'wa', 've': 'we', 'vi': 'wi', 'vo': 'wo',
  'da': 'ta', 'de': 'te', 'di': 'ti', 'do': 'to', 'du': 'tu',
  'fa': 'pa', 'fe': 'pe', 'fi': 'pi', 'fo': 'po', 'fu': 'pu',
  'ra': 'la', 're': 'le', 'ri': 'li', 'ro': 'lo', 'ru': 'lu',
  'lla': 'ya', 'lle': 'ye', 'lli': 'yi', 'llo': 'yo', 'llu': 'yu',
  'rra': 'la', 'rre': 'le', 'rri': 'li', 'rro': 'lo', 'rru': 'lu',
  'cha': 'cha', 'che': 'che', 'chi': 'chi', 'cho': 'cho', 'chu': 'chu',
}

/**
 * Convert a name/word to Maya syllables.
 * Returns array of { original, maya } objects.
 */
export function nameToMaya(name) {
  if (!name || !name.trim()) return []

  const clean = name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z]/g, '') // only letters

  if (!clean) return []

  const syllables = []
  let i = 0

  while (i < clean.length) {
    // Try 3-letter override first (cha, lle, rra, que, qui, etc.)
    if (i + 2 < clean.length) {
      const three = clean.slice(i, i + 3)
      if (SYLLABLE_OVERRIDES[three]) {
        syllables.push({ original: three, maya: SYLLABLE_OVERRIDES[three] })
        i += 3
        continue
      }
    }

    // Try 2-letter override (ca, ge, etc.)
    if (i + 1 < clean.length) {
      const two = clean.slice(i, i + 2)
      if (SYLLABLE_OVERRIDES[two]) {
        syllables.push({ original: two, maya: SYLLABLE_OVERRIDES[two] })
        i += 2
        continue
      }
    }

    const char = clean[i]

    // If it's a vowel, it stands alone
    if (VOWELS.includes(char)) {
      syllables.push({ original: char, maya: char })
      i++
      continue
    }

    // It's a consonant — try to pair with next vowel
    const consonant = CONSONANT_MAP[char] || char

    // Check for digraph consonants (ch)
    if (char === 'c' && i + 1 < clean.length && clean[i + 1] === 'h') {
      // ch + vowel
      if (i + 2 < clean.length && VOWELS.includes(clean[i + 2])) {
        const syl = 'ch' + clean[i + 2]
        syllables.push({ original: clean.slice(i, i + 3), maya: syl })
        i += 3
      } else {
        syllables.push({ original: 'ch', maya: 'chi' })
        i += 2
      }
      continue
    }

    if (i + 1 < clean.length && VOWELS.includes(clean[i + 1])) {
      // Consonant + vowel
      const syl = consonant + clean[i + 1]
      syllables.push({ original: clean.slice(i, i + 2), maya: syl })
      i += 2
    } else {
      // Consonant alone (end of word or consonant cluster)
      // Add with default vowel 'a' (most common in Maya)
      syllables.push({ original: char, maya: consonant + 'a' })
      i++
    }
  }

  return syllables
}

/**
 * Get some example names to show
 */
export function getExampleNames() {
  return [
    { name: 'Pakal', note: 'Real Maya name (shield)' },
    { name: 'Hector', note: '' },
    { name: 'Maria', note: '' },
    { name: 'Carlos', note: '' },
    { name: 'David', note: '' },
    { name: 'Sofia', note: '' },
    { name: 'Miguel', note: '' },
    { name: 'Luna', note: '' },
    { name: 'William', note: '' },
    { name: 'Sarah', note: '' },
  ]
}
