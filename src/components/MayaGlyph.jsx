// src/components/MayaGlyph.jsx
import { getGlyphChar, thompsonToChar } from '@/lib/glyphs'

/**
 * Renders a Maya hieroglyph using the Maya font.
 * Accepts either a `thompson` array or a single `tNumber` string.
 * `size` controls the font-size class (default: "text-3xl").
 */
export default function MayaGlyph({ thompson, tNumber, size = 'text-3xl', className = '' }) {
  const char = tNumber ? thompsonToChar(tNumber) : getGlyphChar(thompson)
  if (!char) return null

  return (
    <span
      className={`${size} ${className}`}
      style={{ fontFamily: 'MayaGlyphs, serif' }}
      aria-hidden="true"
    >
      {char}
    </span>
  )
}
