// src/lib/glyphs.js
const BASE = 0xF6200

/**
 * Convert a Thompson T-number string (e.g., "T501", "T23", "T590b") to a
 * Unicode character that renders in the Maya font.
 * Returns the character for the numeric part of the T-number.
 * Suffixed variants (T590b, T679c, etc.) map to the base number.
 */
export function thompsonToChar(tNumber) {
  if (!tNumber) return null
  const num = parseInt(tNumber.replace(/^T/i, '').replace(/[a-z]+$/i, ''), 10)
  if (isNaN(num) || num < 1 || num > 862) return null
  return String.fromCodePoint(BASE + num - 1)
}

/**
 * Get the first available glyph character from an array of Thompson numbers.
 */
export function getGlyphChar(thompsonArray) {
  if (!thompsonArray || thompsonArray.length === 0) return null
  for (const t of thompsonArray) {
    const char = thompsonToChar(t)
    if (char) return char
  }
  return null
}
