import ConfidenceBadge from './ConfidenceBadge'
import { thompsonToChar } from '@/lib/glyphs'
import { getGlyphImage } from '@/lib/glyph-images'

export default function DictionaryEntry({ entry, mode, glyphMap }) {
  const thompson = glyphMap?.[entry.maya?.toLowerCase()]
  const glyphChar = thompson ? thompsonToChar(thompson) : null

  // Try Tokovinine image by maya word directly
  const imgPath = getGlyphImage(entry.maya?.toLowerCase())

  return (
    <div className="bg-maya-surface rounded-lg p-3 border border-maya-border">
      <div className="flex items-center gap-3">
        {(imgPath || glyphChar) && (
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
            {imgPath ? (
              <img
                src={imgPath}
                alt={entry.maya}
                className="w-11 h-11 object-contain invert brightness-200 sepia saturate-[3] hue-rotate-[10deg]"
              />
            ) : (
              <span
                style={{ fontFamily: 'MayaGlyphs, serif' }}
                className="text-3xl text-maya-gold"
              >
                {glyphChar}
              </span>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-bold text-maya-gold">{entry.maya}</span>
              <span className="text-maya-muted mx-2">→</span>
              <span>{entry.spanish}</span>
              {mode !== 'explorador' && entry.english && (
                <span className="text-maya-muted text-sm ml-2">({entry.english})</span>
              )}
            </div>
            {mode !== 'explorador' && (
              <ConfidenceBadge level={entry.confidence} showLabel={false} />
            )}
          </div>
          {mode === 'investigador' && thompson && (
            <p className="text-xs text-blue-400 mt-0.5">{thompson}</p>
          )}
          {mode === 'investigador' && entry.notes && (
            <p className="text-xs text-maya-muted mt-1">{entry.notes}</p>
          )}
        </div>
      </div>
    </div>
  )
}
