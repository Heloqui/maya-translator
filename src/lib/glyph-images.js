// Glyph image lookup from Tokovinine catalog
import imageMap from '../../data/glyph-images.json'

// Build a normalized lookup for flexible matching
const normalizedMap = {}
for (const [key, file] of Object.entries(imageMap)) {
  normalizedMap[key] = file
  // Also add without any apostrophes/glottal stops
  const stripped = key.replace(/[''ʼ]/g, '')
  if (stripped !== key) normalizedMap[stripped] = file
}

/**
 * Normalize a reading for lookup: lowercase, strip b' → b, handle apostrophe variants
 */
function normalize(reading) {
  return reading
    .toLowerCase()
    .trim()
    .replace(/[''ʼ]/g, "'") // standardize apostrophes
}

/**
 * Get the PNG image path for a syllable or logogram reading.
 * Tries multiple matching strategies.
 */
export function getGlyphImage(reading) {
  if (!reading) return null
  const key = normalize(reading)

  // Exact match
  if (normalizedMap[key]) return `/glyphs/${normalizedMap[key]}`

  // Without any apostrophes
  const noApos = key.replace(/'/g, '')
  if (normalizedMap[noApos]) return `/glyphs/${normalizedMap[noApos]}`

  // Without glottal b' → b, k' → k, etc.
  const simplified = key.replace(/([bcdghjklmnpqrstvwxyz])'/g, '$1')
  if (normalizedMap[simplified]) return `/glyphs/${normalizedMap[simplified]}`

  // For compound words, try first word only
  const firstWord = key.split(/[\s-]/)[0]
  if (firstWord !== key && normalizedMap[firstWord]) return `/glyphs/${normalizedMap[firstWord]}`

  // Without final apostrophe: ha' → ha, took' → took
  const noFinalApos = key.replace(/'$/, '')
  if (noFinalApos !== key && normalizedMap[noFinalApos]) return `/glyphs/${normalizedMap[noFinalApos]}`

  return null
}

/**
 * Check if we have a Tokovinine glyph image for a given reading.
 */
export function hasGlyphImage(reading) {
  return getGlyphImage(reading) !== null
}
