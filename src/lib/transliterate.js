import { getSyllabary, getDictionary } from './data'

const syllabaryLookup = new Map()
for (const s of getSyllabary()) {
  syllabaryLookup.set(s.value, s)
}

export function transliterate(input) {
  if (!input.trim()) return null

  const syllables = input.toLowerCase().trim().split('-').map(s => s.trim()).filter(Boolean)

  const parsed = syllables.map(val => {
    const match = syllabaryLookup.get(val)
    return {
      value: val,
      found: !!match,
      confidence: match?.confidence || 'unknown',
      thompson: match?.thompson || [],
    }
  })

  // Apply synharmony: for CVC pattern, drop the final vowel of the last syllable
  let phonetic = ''
  for (let i = 0; i < parsed.length; i++) {
    const val = parsed[i].value
    if (i < parsed.length - 1) {
      phonetic += val
    } else {
      if (parsed.length > 1) {
        const consonant = val.replace(/[aeiou]$/, '')
        if (consonant !== val) {
          phonetic += consonant
        } else {
          phonetic += val
        }
      } else {
        phonetic += val
      }
    }
  }

  const dict = getDictionary()
  const allEntries = [
    ...(dict.titles_and_ranks || []),
    ...(dict.verbs || []),
    ...(dict.nouns || []),
    ...(dict.adjectives_and_colors || []),
    ...(dict.directional_terms || []),
    ...(dict.death_expressions || []),
    ...(dict.war_expressions || []),
  ]

  const dictMatch = allEntries.find(e =>
    e.maya.toLowerCase().replace(/['\s]/g, '') === phonetic.replace(/['\s]/g, '')
  )

  const allFound = parsed.every(p => p.found)
  const minConfidence = parsed.reduce((min, p) => {
    const order = { confirmed: 3, probable: 2, tentative: 1, unknown: 0 }
    return order[p.confidence] < order[min] ? p.confidence : min
  }, 'confirmed')

  return {
    input: syllables.join('-'),
    syllables: parsed,
    phonetic: phonetic.toUpperCase(),
    synharmony: parsed.length > 1,
    dictMatch,
    allFound,
    overallConfidence: allFound ? minConfidence : 'unknown',
  }
}

export function reverseLookup(query) {
  if (!query.trim()) return []

  const dict = getDictionary()
  const allEntries = [
    ...(dict.titles_and_ranks || []),
    ...(dict.verbs || []),
    ...(dict.nouns || []),
    ...(dict.adjectives_and_colors || []),
    ...(dict.directional_terms || []),
    ...(dict.death_expressions || []),
    ...(dict.war_expressions || []),
  ]

  const q = query.toLowerCase()
  return allEntries.filter(e =>
    e.spanish?.toLowerCase().includes(q) ||
    e.english?.toLowerCase().includes(q)
  ).slice(0, 10)
}
