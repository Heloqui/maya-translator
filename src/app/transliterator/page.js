'use client'
import { useState, useMemo } from 'react'
import { useMode } from '@/lib/modes'
import { transliterate, reverseLookup } from '@/lib/transliterate'
import ConfidenceBadge from '@/components/ConfidenceBadge'
import { getGlyphChar } from '@/lib/glyphs'

export default function TransliteratorPage() {
  const [input, setInput] = useState('')
  const [reverse, setReverse] = useState(false)
  const [reverseQuery, setReverseQuery] = useState('')
  const { mode } = useMode()

  const result = useMemo(() => transliterate(input), [input])
  const reverseResults = useMemo(() => reverseLookup(reverseQuery), [reverseQuery])

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-maya-gold mb-1">Transliterador</h1>
      <p className="text-xs text-maya-muted mb-4">Convierte secuencias de glifos a fonética maya clásica</p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setReverse(false)}
          className={`px-3 py-1.5 rounded-lg text-xs ${!reverse ? 'bg-maya-gold text-maya-bg font-bold' : 'bg-maya-surface text-maya-muted'}`}
        >
          Glifos → Maya
        </button>
        <button
          onClick={() => setReverse(true)}
          className={`px-3 py-1.5 rounded-lg text-xs ${reverse ? 'bg-maya-gold text-maya-bg font-bold' : 'bg-maya-surface text-maya-muted'}`}
        >
          Español → Maya
        </button>
      </div>

      {!reverse ? (
        <>
          <div className="mb-6">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Escribe sílabas separadas por guión: ba-la-ma"
              className="w-full bg-maya-surface border border-maya-border rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-maya-gold"
            />
            {input && (
              <button onClick={() => setInput('')} className="text-xs text-maya-muted mt-1 hover:text-maya-gold">
                Limpiar
              </button>
            )}
          </div>

          {result && (
            <div className="bg-maya-surface rounded-xl p-5 border border-maya-border space-y-4">
              <div>
                <div className="text-xs text-maya-muted mb-1">Lectura fonética:</div>
                <div className="text-2xl font-bold text-maya-gold">{result.phonetic}</div>
              </div>

              {result.syllables.some(s => s.thompson.length > 0) && (
                <div className="flex gap-1 flex-wrap items-center">
                  {result.syllables.map((s, i) => {
                    const glyph = getGlyphChar(s.thompson)
                    return glyph ? (
                      <span key={i} style={{ fontFamily: 'MayaGlyphs, serif' }} className="text-5xl text-maya-gold">{glyph}</span>
                    ) : null
                  })}
                </div>
              )}

              <div>
                <div className="text-xs text-maya-muted mb-2">Sílabas:</div>
                <div className="flex gap-2 flex-wrap">
                  {result.syllables.map((s, i) => (
                    <div key={i} className={`bg-maya-deep rounded-lg px-3 py-2 text-center ${!s.found ? 'border border-red-500/50' : ''}`}>
                      <div className="font-bold">{s.value}</div>
                      <ConfidenceBadge level={s.confidence} showLabel={false} />
                      {mode === 'investigador' && s.thompson.length > 0 && (
                        <div className="text-[10px] text-blue-400 mt-1">{s.thompson.join(', ')}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {mode !== 'explorador' && result.synharmony && (
                <div className="text-xs text-maya-muted bg-maya-deep rounded-lg p-3">
                  <span className="text-maya-gold">Regla CVC:</span> La vocal final se descarta (sinharmonía vocálica)
                </div>
              )}

              {result.dictMatch && (
                <div className="border-t border-maya-border pt-3">
                  <div className="text-xs text-confidence-confirmed mb-1">● Coincidencia en diccionario:</div>
                  <div>
                    <span className="font-bold text-maya-gold">{result.dictMatch.maya}</span>
                    <span className="text-maya-muted mx-2">→</span>
                    <span>{result.dictMatch.spanish}</span>
                    {mode !== 'explorador' && result.dictMatch.english && (
                      <span className="text-maya-muted text-sm ml-2">({result.dictMatch.english})</span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <span className="text-maya-muted">Confianza general:</span>
                <ConfidenceBadge level={result.overallConfidence} />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <input
            type="text"
            value={reverseQuery}
            onChange={e => setReverseQuery(e.target.value)}
            placeholder="Buscar palabra en español o inglés..."
            className="w-full bg-maya-surface border border-maya-border rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-maya-gold"
          />
          <div className="space-y-2">
            {reverseResults.map((entry, i) => (
              <div key={i} className="bg-maya-surface rounded-lg p-3 border border-maya-border">
                <span className="font-bold text-maya-gold">{entry.maya}</span>
                <span className="text-maya-muted mx-2">→</span>
                <span>{entry.spanish}</span>
                {entry.english && <span className="text-maya-muted text-sm ml-2">({entry.english})</span>}
              </div>
            ))}
            {reverseQuery && reverseResults.length === 0 && (
              <p className="text-maya-muted text-sm text-center py-8">Sin resultados</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
