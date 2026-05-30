import syllabaryData from '../../data/syllabary.json'
import dictionaryData from '../../data/dictionary.json'

export function getSyllabary() {
  const all = []

  for (const v of syllabaryData.vowels) {
    all.push({ value: v.value, onset: null, ...v })
  }

  for (const group of syllabaryData.syllabograms) {
    for (const s of group.syllables) {
      all.push({ ...s, onset: group.onset })
    }
  }

  return all
}

export function getSyllabaryGrid() {
  return syllabaryData
}

export function getDictionary() {
  return dictionaryData
}

export function getStats() {
  const sylls = getSyllabary()
  return {
    confirmed: sylls.filter(s => s.confidence === 'confirmed').length,
    logograms: syllabaryData.common_logograms.length,
    daySigns: syllabaryData.calendar_glyphs.day_signs.length,
    numerals: dictionaryData.numerals.length,
  }
}
