'use client'
import { useState } from 'react'
import { useLang } from '@/lib/lang'
import MayaGlyph from './MayaGlyph'
import { getGlyphImage } from '@/lib/glyph-images'

export default function BlockReader({ blocks }) {
  const { t, lang } = useLang()
  const [detailed, setDetailed] = useState(false)
  const [activeBlock, setActiveBlock] = useState(null)

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setDetailed(!detailed)}
          className="text-xs px-3 py-1 rounded-lg bg-maya-surface border border-maya-border hover:border-maya-gold transition-colors"
        >
          {detailed ? t.simpleView : t.detailedView}
        </button>
      </div>

      <div className="space-y-2">
        {blocks.map((block, i) => {
          const isActive = activeBlock === i
          const translation = block.translation[lang] || block.translation.es
          const notes = block.notes?.[lang] || block.notes?.es

          return (
            <div
              key={i}
              onClick={() => setActiveBlock(isActive ? null : i)}
              className={`bg-maya-surface rounded-lg p-3 border cursor-pointer transition-colors ${
                isActive ? 'border-maya-gold' : 'border-maya-border hover:border-maya-gold/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-maya-muted font-mono w-8 flex-shrink-0">
                  {block.position}
                </span>

                <div className="flex gap-1 flex-shrink-0">
                  {block.glyphs.map((thompson, gi) => {
                    const imgPath = getGlyphImage(thompson)
                    return imgPath ? (
                      <div key={gi} className="w-10 h-10 bg-white rounded flex items-center justify-center p-0.5">
                        <img src={imgPath} alt={thompson} className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div key={gi} className="w-10 h-10 bg-maya-border rounded flex items-center justify-center">
                        <MayaGlyph thompson={[thompson]} size="text-xl" className="text-maya-gold" />
                      </div>
                    )
                  })}
                </div>

                <div className="flex-1 min-w-0">
                  {detailed ? (
                    <div className="space-y-0.5">
                      <div className="text-xs">
                        <span className="text-maya-muted">{t.transliterationLabel}: </span>
                        <span className="font-mono text-blue-400">{block.transliteration}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-maya-muted">{t.transcriptionLabel}: </span>
                        <span className="italic">{block.transcription}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-maya-muted">{t.translationLabel}: </span>
                        <span className="text-maya-gold">{translation}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-maya-gold">{translation}</span>
                  )}
                </div>
              </div>

              {isActive && notes && (
                <p className="text-[11px] text-maya-muted mt-2 ml-11 border-t border-maya-border pt-2">
                  {notes}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
