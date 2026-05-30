'use client'
import { useState } from 'react'
import { useLang } from '@/lib/lang'
import ConfidenceBadge from './ConfidenceBadge'
import MayaGlyph from './MayaGlyph'
import SpeakButton from './SpeakButton'
import { getGlyphImage } from '@/lib/glyph-images'

export default function GlyphDetail({ glyph, logograms }) {
  const [showTechnical, setShowTechnical] = useState(false)
  const { t } = useLang()

  if (!glyph) {
    return (
      <div className="text-maya-muted text-sm text-center py-12">
        {t.selectToView}
      </div>
    )
  }

  const matchingLogo = logograms?.find(l =>
    glyph.thompson?.some(t => l.thompson === t)
  )

  return (
    <div>
      {/* Glyph display — large Tokovinine image if available, font fallback */}
      <div className="flex justify-center mb-4">
        {getGlyphImage(glyph.value) ? (
          <div className="text-center">
            <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center ring-2 ring-maya-gold p-3">
              <img
                src={getGlyphImage(glyph.value)}
                alt={`Glifo maya: ${glyph.value}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <span className="text-sm font-bold text-maya-gold mt-1 block">{glyph.value}</span>
          </div>
        ) : (
          <div className="w-20 h-20 bg-maya-surface rounded-xl flex flex-col items-center justify-center ring-2 ring-maya-gold">
            {glyph.thompson?.length > 0 ? (
              <>
                <MayaGlyph thompson={glyph.thompson} size="text-4xl" className="text-maya-gold" />
                <span className="text-xs text-maya-muted">{glyph.value}</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-maya-gold">{glyph.value}</span>
            )}
          </div>
        )}
      </div>

      {/* Basic info — all modes */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-maya-muted">{t.value}: </span>
          <span className="font-bold">{glyph.value}</span>
          <SpeakButton text={glyph.value} mode="syllable" size="small" />
        </div>
        <div>
          <span className="text-maya-muted">{t.confidence}: </span>
          <ConfidenceBadge level={glyph.confidence} />
        </div>

        {glyph.frequency && (
          <div>
            <span className="text-maya-muted">{t.frequency}: </span>
            <span>{glyph.frequency === 'very_high' ? t.veryHigh : glyph.frequency === 'high' ? t.high : glyph.frequency === 'medium' ? t.medium : t.low}</span>
          </div>
        )}
        {glyph.variants && (
          <div>
            <span className="text-maya-muted">{t.variants}: </span>
            <span>{glyph.variants}</span>
          </div>
        )}
        {glyph.notes && (
          <div>
            <span className="text-maya-muted">{t.notes}: </span>
            <span className="text-xs">{glyph.notes}</span>
          </div>
        )}

        {/* Thompson numbers — toggleable */}
        {showTechnical && glyph.thompson?.length > 0 && (
          <div>
            <span className="text-maya-muted">Thompson: </span>
            <span className="text-blue-400">{glyph.thompson.join(', ')}</span>
          </div>
        )}

        {/* Logogram match */}
        {matchingLogo && (
          <div className="border-t border-maya-border pt-3 mt-3">
            <div className="text-xs text-maya-muted mb-1">{t.alsoLogogram}:</div>
            <div className="font-bold">{matchingLogo.reading}</div>
            <div className="text-xs text-maya-muted">&ldquo;{matchingLogo.meaning}&rdquo;</div>
          </div>
        )}

        {/* Sources — toggleable */}
        {showTechnical && (
          <div className="border-t border-maya-border pt-3 mt-3">
            <div className="text-xs text-maya-muted mb-1">{t.sources}:</div>
            <div className="text-xs text-blue-400">Stuart 2013</div>
            <div className="text-xs text-blue-400">Thompson 1962</div>
          </div>
        )}

        {(glyph.thompson?.length > 0) && (
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="text-[10px] text-blue-400 hover:text-blue-300 mt-2"
          >
            {showTechnical ? '▼ Thompson' : '▶ Thompson'}
          </button>
        )}
      </div>
    </div>
  )
}
