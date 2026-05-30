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

/**
 * Build a lookup map from Maya word → Thompson number
 * by matching dictionary entries against known logograms.
 */
export function getWordGlyphMap() {
  const map = {}
  const logograms = syllabaryData.common_logograms

  for (const logo of logograms) {
    // Map by reading (lowercase, without slashes)
    const readings = logo.reading.toLowerCase().split('/')
    for (const r of readings) {
      map[r.trim()] = logo.thompson
    }
  }

  // Also map specific dictionary words we know have logograms
  const knownMappings = {
    "ajaw": "T533",
    "k'uhul ajaw": "T740",
    "kaloomte'": "T688",
    "ch'ok": "T561",
    "chum": "T713",
    "hul": "T181",
    "och": "T684",
    "tz'ihb'": "T501",
    "ch'ak": "T668",
    "k'al": "T713",
    "tzak": "T699",
    "cham": "T510",
    "pul": "T586",
    "k'in": "T544",
    "ha'": "T503",
    "witz": "T757",
    "nah": "T606",
    "k'uh": "T528",
    "k'uhul": "T740",
    "b'aah": "T501",
    "b'ahlam": "T533",
    "way": "T713",
    "k'ahk'": "T563",
    "ek'": "T714",
    "tun": "T548",
    "nal": "T526",
    "ik'": "T109",
    "kab'": "T570",
    "chan": "T644",
    "pakal": "T573",
    "took'": "T527",
    "te'": "T584",
    "hix": "T535",
    "ajiin": "T168",
    "yax": "T553",
    "sak": "T501",
    "chak": "T668",
    "lak'in": "T544",
  }

  for (const [word, thompson] of Object.entries(knownMappings)) {
    if (!map[word]) map[word] = thompson
  }

  return map
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
