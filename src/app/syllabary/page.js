'use client'
import { useState } from 'react'
import { getSyllabaryGrid } from '@/lib/data'
import { useLang } from '@/lib/lang'
import SyllabaryGrid from '@/components/SyllabaryGrid'
import GlyphDetail from '@/components/GlyphDetail'

const syllabaryData = getSyllabaryGrid()

export default function SyllabaryPage() {
  const [selected, setSelected] = useState(null)
  const { t } = useLang()

  return (
    <div className="flex min-h-screen">
      {/* Main grid area */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-maya-gold">{t.syllabaryTitle}</h1>
            <p className="text-xs text-maya-muted">
              {t.selectGlyph}
            </p>
          </div>
        </div>

        <SyllabaryGrid
          syllabaryData={syllabaryData}
          selected={selected}
          onSelect={setSelected}
        />
      </div>

      {/* Detail panel — desktop */}
      <div className="hidden lg:block w-56 bg-maya-deep border-l border-maya-surface p-4 overflow-y-auto">
        <div className="text-sm text-maya-muted mb-3">{t.glyphDetail}</div>
        <GlyphDetail
          glyph={selected}
          logograms={syllabaryData.common_logograms}
        />
      </div>

      {/* Detail panel — mobile modal */}
      {selected && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40 flex items-end" onClick={() => setSelected(null)}>
          <div
            className="w-full bg-maya-deep rounded-t-2xl p-6 max-h-[60vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-maya-border rounded-full mx-auto mb-4" />
            <GlyphDetail
              glyph={selected}
              logograms={syllabaryData.common_logograms}
            />
          </div>
        </div>
      )}
    </div>
  )
}
