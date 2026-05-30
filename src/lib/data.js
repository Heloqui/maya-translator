import syllabaryData from '../../data/syllabary.json'
import dictionaryData from '../../data/dictionary.json'
import inscriptionsData from '../../data/inscriptions.json'
import sitesData from '../../data/sites.json'

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

export function getInscriptions() {
  return inscriptionsData.inscriptions
}

export function getInscription(id) {
  return inscriptionsData.inscriptions.find(i => i.id === id) || null
}

export function getInscriptionsByType(type) {
  return inscriptionsData.inscriptions.filter(i => i.type === type)
}

export function getInscriptionsBySite(siteId) {
  return inscriptionsData.inscriptions.filter(i => i.site === siteId)
}

export function getSites() {
  return sitesData.sites
}

export function getSite(id) {
  return sitesData.sites.find(s => s.id === id) || null
}

export function getRegions() {
  return sitesData.regions
}

export function getSitesByRegion(region) {
  return sitesData.sites.filter(s => s.region === region)
}

export function getQuizQuestions(mode = 'syllables', count = 10) {
  if (mode === 'syllables') return generateSyllableQuestions(count)
  if (mode === 'vocabulary') return generateVocabularyQuestions(count)
  if (mode === 'inscriptions') return generateInscriptionQuestions(count)
  return []
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateSyllableQuestions(count) {
  const all = getSyllabary().filter(s => s.confidence === 'confirmed')
  const selected = shuffle(all).slice(0, count)
  return selected.map(glyph => {
    const wrong = shuffle(all.filter(g => g.value !== glyph.value)).slice(0, 3)
    const options = shuffle([glyph.value, ...wrong.map(w => w.value)])
    return {
      type: 'syllable',
      prompt: glyph.value,
      promptThompson: glyph.thompson,
      options,
      correct: glyph.value,
      explanation: { es: `Este glifo se lee "${glyph.value}"`, en: `This glyph reads "${glyph.value}"` }
    }
  })
}

function generateVocabularyQuestions(count) {
  const dict = getDictionary()
  const allEntries = []
  for (const [cat, entries] of Object.entries(dict)) {
    if (cat === 'metadata' || cat === 'numerals') continue
    if (Array.isArray(entries)) entries.forEach(e => allEntries.push(e))
  }
  const selected = shuffle(allEntries.filter(e => e.confidence === 'confirmed')).slice(0, count)
  return selected.map(entry => {
    const wrong = shuffle(allEntries.filter(e => e.maya !== entry.maya && e.spanish)).slice(0, 3)
    const options = shuffle([entry.spanish, ...wrong.map(w => w.spanish)])
    return {
      type: 'vocabulary',
      prompt: entry.maya,
      options,
      correct: entry.spanish,
      explanation: {
        es: `"${entry.maya}" significa "${entry.spanish}"`,
        en: `"${entry.maya}" means "${entry.english}"`
      }
    }
  })
}

function generateInscriptionQuestions(count) {
  const inscriptions = getInscriptions()
  const allBlocks = []
  for (const insc of inscriptions) {
    for (const block of insc.blocks) {
      allBlocks.push({ ...block, inscriptionId: insc.id, inscriptionName: insc.name })
    }
  }
  const selected = shuffle(allBlocks).slice(0, count)
  return selected.map(block => {
    const wrong = shuffle(allBlocks.filter(b => b.transcription !== block.transcription)).slice(0, 3)
    const options = shuffle([block.translation.es, ...wrong.map(w => w.translation.es)])
    return {
      type: 'inscription',
      prompt: block.transliteration,
      promptGlyphs: block.glyphs,
      options,
      correct: block.translation.es,
      explanation: {
        es: `"${block.transliteration}" se lee "${block.transcription}" y significa "${block.translation.es}"`,
        en: `"${block.transliteration}" reads "${block.transcription}" and means "${block.translation.en}"`
      }
    }
  })
}

/**
 * Find inscriptions that reference a given Thompson code.
 */
export function getInscriptionsForThompson(thompson) {
  return inscriptionsData.inscriptions.filter(insc =>
    insc.blocks.some(block =>
      block.glyphs.includes(thompson)
    )
  )
}

/**
 * Extended Thompson → image-key map for codes not in the syllabary/logogram tables.
 * Maps Thompson codes to readings that exist in glyph-images.json.
 */
const EXTRA_THOMPSON_MAP = {
  // Date/calendar signs
  "T504": "k'an",      // K'AN yellow/ripe/precious
  "T178": "o",         // numeral head variant (closest match)
  "T60":  "k'in",      // K'IN sun/day variant
  // Deity and title signs
  "T1016": "itzam",    // ITZAM(NAAJ) deity head
  "T743": "bahlam",    // B'AHLAM jaguar
  "T86":  "hul",       // HUL-i arrive variant
  // Common logographic signs with known image keys
  "T740": "k'uhul",    // K'UHUL holy/sacred
  "T533": "ajaw",      // AJAW lord
  "T544": "k'in",      // K'IN sun/day
  "T528": "k'uh",      // K'UH god
  "T510": "cham",      // CHAM death
  "T548": "tun",       // TUN stone/year
  "T573": "pakal",     // PAKAL shield
  "T563": "k'ahk'",    // K'AHK' fire
  "T757": "witz",      // WITZ mountain
  "T606": "nah",       // NAH house
  "T526": "nal",       // NAL maize
  "T553": "yax",       // YAX green/first
  "T668": "chak",      // CHAK red/great
  "T644": "chan",       // CHAN sky/serpent
  "T503": "ha'",       // HA' water
  "T109": "ik'",       // IK' wind
  "T570": "kab'",      // KAB' earth
  "T714": "ek'",       // EK' star/black
  "T584": "te'",       // TE' tree/wood
  "T535": "hix",       // HIX jaguar
  "T168": "ajiin",     // AJIIN crocodile
  "T181": "hul",       // HUL arrive
  "T561": "ch'ok",     // CH'OK youth
  "T586": "pul",       // PUL burn/incense
  "T699": "tzak",      // TZAK conjure
  "T713": "chum",      // CHUM seat/sit
  "T684": "och",       // OCH enter
  "T501": "ba",        // BA head/first (also syllabic ba)
  "T527": "took'",     // TOOK' flint
}

/**
 * Find a syllable/reading value for a Thompson code so we can show glyph images.
 * Checks: syllabary → logograms → extended map.
 */
export function getSyllableByThompson(thompson) {
  const all = getSyllabary()
  for (const s of all) {
    if (s.thompson?.includes(thompson)) return s.value
  }
  // Check logograms
  const logo = syllabaryData.common_logograms.find(l => l.thompson === thompson)
  if (logo) return logo.reading.toLowerCase()
  // Check extended map
  if (EXTRA_THOMPSON_MAP[thompson]) return EXTRA_THOMPSON_MAP[thompson]
  return null
}

export function getStats() {
  const sylls = getSyllabary()
  const dict = getDictionary()
  let dictTotal = 0
  for (const [k, v] of Object.entries(dict)) {
    if (k !== 'metadata' && Array.isArray(v)) dictTotal += v.length
  }
  return {
    confirmed: sylls.filter(s => s.confidence === 'confirmed').length,
    logograms: syllabaryData.common_logograms.length,
    daySigns: syllabaryData.calendar_glyphs.day_signs.length,
    numerals: dictionaryData.numerals.length,
    inscriptions: inscriptionsData.inscriptions.length,
    sites: sitesData.sites.length,
    dictEntries: dictTotal,
  }
}
