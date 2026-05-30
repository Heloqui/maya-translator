'use client'
import { getGlyphChar } from '@/lib/glyphs'
import { getGlyphImage } from '@/lib/glyph-images'

const CONFIDENCE_BG = {
  confirmed: 'bg-green-900/50 hover:bg-green-900/70',
  probable: 'bg-yellow-900/50 hover:bg-yellow-900/70',
  tentative: 'bg-red-900/50 hover:bg-red-900/70',
  unknown: 'bg-gray-800/50',
}

const VOWELS = ['a', 'e', 'i', 'o', 'u']

function GlyphCell({ value, thompson, confidence, isSelected, onClick }) {
  const imgPath = getGlyphImage(value)
  const fontChar = thompson?.length > 0 ? getGlyphChar(thompson) : null
  const isUnknown = confidence === 'unknown'

  return (
    <button
      onClick={isUnknown ? null : onClick}
      className={`p-1.5 rounded-lg text-center transition-colors flex flex-col items-center justify-center min-h-[90px] ${
        isUnknown ? 'cursor-default opacity-30' : 'cursor-pointer'
      } ${CONFIDENCE_BG[confidence]} ${
        isSelected ? 'ring-2 ring-maya-gold ring-offset-1 ring-offset-maya-bg' : ''
      }`}
    >
      {imgPath ? (
        <div className="w-14 h-14 flex items-center justify-center bg-white/90 rounded-md p-1">
          <img
            src={imgPath}
            alt={value}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ) : fontChar ? (
        <span style={{ fontFamily: 'MayaGlyphs, serif' }} className="text-3xl leading-none text-maya-gold">{fontChar}</span>
      ) : null}
      <span className="text-xs text-maya-text font-medium mt-1">{value}</span>
    </button>
  )
}

export default function SyllabaryGrid({ syllabaryData, selected, onSelect }) {
  const { vowels, syllabograms } = syllabaryData

  return (
    <div className="overflow-x-auto">
      {/* Column headers */}
      <div className="grid grid-cols-[50px_repeat(5,1fr)] gap-1.5 mb-1 min-w-[520px]">
        <div />
        {VOWELS.map(v => (
          <div key={v} className="text-center text-sm font-bold text-maya-gold">{v}</div>
        ))}
      </div>

      {/* Pure vowels row */}
      <div className="grid grid-cols-[50px_repeat(5,1fr)] gap-1.5 mb-1.5 min-w-[520px]">
        <div className="flex items-center text-xs font-bold text-maya-gold">V</div>
        {vowels.map(v => (
          <GlyphCell
            key={v.value}
            value={v.value}
            thompson={v.thompson}
            confidence={v.confidence}
            isSelected={selected?.value === v.value}
            onClick={() => onSelect(v)}
          />
        ))}
      </div>

      {/* Consonant rows */}
      {syllabograms.map(group => (
        <div key={group.onset} className="grid grid-cols-[50px_repeat(5,1fr)] gap-1.5 mb-1.5 min-w-[520px]">
          <div className="flex items-center text-xs font-bold text-maya-gold">{group.onset}</div>
          {group.syllables.map(s => (
            <GlyphCell
              key={s.value}
              value={s.value}
              thompson={s.thompson}
              confidence={s.confidence}
              isSelected={selected?.value === s.value}
              onClick={() => onSelect(s)}
            />
          ))}
        </div>
      ))}

      {/* Legend */}
      <div className="flex gap-4 text-xs mt-4 p-2 bg-maya-surface rounded-lg min-w-[520px]">
        <span><span className="text-confidence-confirmed">■</span> confirmado</span>
        <span><span className="text-confidence-probable">■</span> probable</span>
        <span><span className="text-confidence-tentative">■</span> tentativo</span>
        <span><span className="text-confidence-unknown">■</span> desconocido</span>
      </div>
    </div>
  )
}
