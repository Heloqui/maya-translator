'use client'
import { useMode } from '@/lib/modes'
import ConfidenceBadge from './ConfidenceBadge'
import MayaGlyph from './MayaGlyph'
import { getGlyphImage } from '@/lib/glyph-images'

export default function GlyphDetail({ glyph, logograms }) {
  const { mode } = useMode()

  if (!glyph) {
    return (
      <div className="text-maya-muted text-sm text-center py-12">
        Selecciona un glifo para ver detalles
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
        <div>
          <span className="text-maya-muted">Valor: </span>
          <span className="font-bold">{glyph.value}</span>
        </div>
        <div>
          <span className="text-maya-muted">Confianza: </span>
          <ConfidenceBadge level={glyph.confidence} />
        </div>

        {/* Estudiante + Investigador */}
        {mode !== 'explorador' && (
          <>
            {glyph.frequency && (
              <div>
                <span className="text-maya-muted">Frecuencia: </span>
                <span>{glyph.frequency === 'very_high' ? 'muy alta' : glyph.frequency === 'high' ? 'alta' : glyph.frequency === 'medium' ? 'media' : 'baja'}</span>
              </div>
            )}
            {glyph.variants && (
              <div>
                <span className="text-maya-muted">Variantes: </span>
                <span>{glyph.variants}</span>
              </div>
            )}
            {glyph.notes && (
              <div>
                <span className="text-maya-muted">Notas: </span>
                <span className="text-xs">{glyph.notes}</span>
              </div>
            )}
          </>
        )}

        {/* Investigador only */}
        {mode === 'investigador' && glyph.thompson?.length > 0 && (
          <div>
            <span className="text-maya-muted">Thompson: </span>
            <span className="text-blue-400">{glyph.thompson.join(', ')}</span>
          </div>
        )}

        {/* Logogram match */}
        {matchingLogo && (
          <div className="border-t border-maya-border pt-3 mt-3">
            <div className="text-xs text-maya-muted mb-1">También logograma:</div>
            <div className="font-bold">{matchingLogo.reading}</div>
            <div className="text-xs text-maya-muted">&ldquo;{matchingLogo.meaning}&rdquo;</div>
          </div>
        )}

        {/* Sources — Investigador only */}
        {mode === 'investigador' && (
          <div className="border-t border-maya-border pt-3 mt-3">
            <div className="text-xs text-maya-muted mb-1">Fuentes:</div>
            <div className="text-xs text-blue-400">Stuart 2013</div>
            <div className="text-xs text-blue-400">Thompson 1962</div>
          </div>
        )}
      </div>
    </div>
  )
}
