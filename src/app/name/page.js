'use client'
import { useState } from 'react'
import { useLang } from '@/lib/lang'
import { nameToMaya, getExampleNames } from '@/lib/name-writer'
import { getGlyphImage } from '@/lib/glyph-images'
import SpeakButton from '@/components/SpeakButton'

const examples = getExampleNames()

export default function NamePage() {
  const [name, setName] = useState('')
  const { lang, t } = useLang()

  const syllables = nameToMaya(name)

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-maya-gold mb-1">
        {lang === 'es' ? 'Escribe tu nombre en Maya' : 'Write your name in Maya'}
      </h1>
      <p className="text-xs text-maya-muted mb-6">
        {lang === 'es'
          ? 'Los mayas escribian nombres extranjeros usando silabas foneticas -- asi se veria el tuyo'
          : 'The Maya wrote foreign names using phonetic syllables -- this is how yours would look'}
      </p>

      {/* Input */}
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={lang === 'es' ? 'Escribe un nombre...' : 'Type a name...'}
        className="w-full bg-maya-surface border border-maya-border rounded-lg px-4 py-3 text-2xl text-center text-maya-gold font-bold focus:outline-none focus:border-maya-gold mb-2"
      />

      {/* Quick examples */}
      <div className="flex gap-2 flex-wrap justify-center mb-6">
        {examples.map(ex => (
          <button
            key={ex.name}
            onClick={() => setName(ex.name)}
            className="px-3 py-1 rounded-full text-xs bg-maya-surface text-maya-muted border border-maya-border hover:border-maya-gold hover:text-maya-gold transition-colors"
          >
            {ex.name}
          </button>
        ))}
      </div>

      {/* Result */}
      {syllables.length > 0 && (
        <div className="space-y-6">
          {/* Large glyph display */}
          <div className="bg-maya-surface rounded-xl p-6 border border-maya-border">
            <div className="text-xs text-maya-muted mb-3 text-center">
              {lang === 'es' ? 'En jeroglificos mayas:' : 'In Maya hieroglyphs:'}
            </div>
            <div className="flex gap-3 flex-wrap items-end justify-center">
              {syllables.map((s, i) => {
                const imgPath = getGlyphImage(s.maya)
                return (
                  <div key={i} className="text-center">
                    {imgPath ? (
                      <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-2 mx-auto">
                        <img src={imgPath} alt={s.maya} className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-maya-deep rounded-xl flex items-center justify-center mx-auto border border-maya-border">
                        <span className="text-3xl text-maya-gold font-bold">{s.maya}</span>
                      </div>
                    )}
                    <div className="text-sm font-bold text-maya-gold mt-1">{s.maya}</div>
                    <div className="text-[10px] text-maya-muted">{s.original}</div>
                  </div>
                )
              })}
            </div>

            {/* Phonetic reading + audio */}
            <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-maya-border">
              <span className="text-maya-muted text-xs">
                {lang === 'es' ? 'Lectura: ' : 'Reading: '}
              </span>
              <span className="text-maya-gold font-bold">
                {syllables.map(s => s.maya).join('-')}
              </span>
              <SpeakButton text={syllables.map(s => s.maya).join('')} mode="word" />
              <SpeakButton syllables={syllables.map(s => s.maya)} mode="sequence" size="small" />
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-maya-surface rounded-xl p-5 border border-maya-border">
            <div className="text-xs text-maya-muted mb-3">
              {lang === 'es' ? 'Como se descompone:' : 'How it breaks down:'}
            </div>
            <div className="space-y-2">
              {syllables.map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-8 text-maya-muted text-right">{i + 1}.</span>
                  <span className="w-16 font-bold text-maya-text">{s.original}</span>
                  <span className="text-maya-muted">&rarr;</span>
                  <span className="font-bold text-maya-gold">{s.maya}</span>
                  {s.original !== s.maya && (
                    <span className="text-xs text-maya-muted">
                      {s.original.includes('d') && (lang === 'es' ? '(d->t en maya)' : '(d->t in Maya)')}
                      {s.original.includes('r') && !s.original.includes('rr') && (lang === 'es' ? '(r->l en maya)' : '(r->l in Maya)')}
                      {s.original.includes('v') && (lang === 'es' ? '(v->w en maya)' : '(v->w in Maya)')}
                      {s.original.includes('g') && (lang === 'es' ? '(g->k en maya)' : '(g->k in Maya)')}
                      {s.original.includes('f') && (lang === 'es' ? '(f->p en maya)' : '(f->p in Maya)')}
                      {s.original.includes('z') && (lang === 'es' ? '(z->s en maya)' : '(z->s in Maya)')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="text-xs text-maya-muted bg-maya-deep rounded-lg p-3 text-center">
            {lang === 'es'
              ? 'Nota: Los mayas no tenian todos los sonidos del espanol. Los sonidos d, f, g, r, v, z se aproximan al sonido maya mas cercano. Esta es una representacion fonetica aproximada, no una traduccion historica.'
              : 'Note: The Maya didn\'t have all Spanish/English sounds. Sounds like d, f, g, r, v, z are approximated to the closest Maya sound. This is an approximate phonetic representation, not a historical translation.'}
          </div>
        </div>
      )}
    </div>
  )
}
