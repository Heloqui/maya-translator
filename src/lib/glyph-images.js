// Glyph image lookup from Tokovinine catalog
import imageMap from '../../data/glyph-images.json'

/**
 * Get the PNG image path for a syllable or logogram reading.
 * Returns the path relative to /glyphs/ or null if not found.
 */
export function getGlyphImage(reading) {
  if (!reading) return null
  const key = reading.toLowerCase().trim()
  // Try exact match
  if (imageMap[key]) return `/glyphs/${imageMap[key]}`
  // Try without glottal stop variations
  const alt = key.replace(/'/g, "'")
  if (imageMap[alt]) return `/glyphs/${imageMap[alt]}`
  return null
}

/**
 * Check if we have a Tokovinine glyph image for a given reading.
 */
export function hasGlyphImage(reading) {
  return getGlyphImage(reading) !== null
}
