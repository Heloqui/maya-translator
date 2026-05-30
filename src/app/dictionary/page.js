'use client'
import { useState, useMemo } from 'react'
import { getDictionary, getWordGlyphMap } from '@/lib/data'
import { useMode } from '@/lib/modes'
import DictionaryEntry from '@/components/DictionaryEntry'
import DotBarNumeral from '@/components/DotBarNumeral'

const dict = getDictionary()
const glyphMap = getWordGlyphMap()

const TABS = [
  { key: 'titles_and_ranks', label: 'Títulos' },
  { key: 'verbs', label: 'Verbos' },
  { key: 'nouns', label: 'Sustantivos' },
  { key: 'adjectives_and_colors', label: 'Colores' },
  { key: 'directional_terms', label: 'Direcciones' },
  { key: 'numerals', label: 'Numerales' },
  { key: 'death_expressions', label: 'Muerte' },
  { key: 'war_expressions', label: 'Guerra' },
]

export default function DictionaryPage() {
  const [tab, setTab] = useState('titles_and_ranks')
  const [search, setSearch] = useState('')
  const { mode } = useMode()

  const entries = useMemo(() => {
    const items = dict[tab] || []
    if (!search.trim()) return items
    const q = search.toLowerCase()
    return items.filter(e =>
      e.maya?.toLowerCase().includes(q) ||
      e.spanish?.toLowerCase().includes(q) ||
      e.english?.toLowerCase().includes(q)
    )
  }, [tab, search])

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-maya-gold mb-1">Diccionario Maya</h1>
      <p className="text-xs text-maya-muted mb-4">Vocabulario del maya clásico (Ch&apos;olti&apos;an)</p>

      <input
        type="text"
        placeholder="Buscar por maya, español o inglés..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-maya-surface border border-maya-border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-maya-gold"
      />

      <div className="flex gap-1 overflow-x-auto pb-2 mb-4">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setSearch('') }}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
              tab === key ? 'bg-maya-gold text-maya-bg font-bold' : 'bg-maya-surface text-maya-muted hover:bg-maya-border'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'numerals' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {entries.map(n => (
            <div key={n.value} className="bg-maya-surface rounded-lg p-3 border border-maya-border text-center">
              <DotBarNumeral value={n.value} />
              <div className="font-bold text-maya-gold mt-2">{n.value}</div>
              <div className="text-sm">{n.maya}</div>
              {mode !== 'explorador' && (
                <div className="text-xs text-maya-muted mt-1">{n.glyph_system}</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {entries.length === 0 && (
            <p className="text-maya-muted text-sm text-center py-8">Sin resultados</p>
          )}
          {entries.map((entry, i) => (
            <DictionaryEntry key={i} entry={entry} mode={mode} glyphMap={glyphMap} />
          ))}
        </div>
      )}
    </div>
  )
}
