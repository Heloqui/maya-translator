'use client'

const CONFIDENCE_BG = {
  confirmed: 'bg-green-900/40 hover:bg-green-900/60',
  probable: 'bg-yellow-900/40 hover:bg-yellow-900/60',
  tentative: 'bg-red-900/40 hover:bg-red-900/60',
  unknown: 'bg-gray-800/40',
}

const VOWELS = ['a', 'e', 'i', 'o', 'u']

export default function SyllabaryGrid({ syllabaryData, selected, onSelect }) {
  const { vowels, syllabograms } = syllabaryData

  return (
    <div className="overflow-x-auto">
      {/* Column headers */}
      <div className="grid grid-cols-[48px_repeat(5,1fr)] gap-1 mb-1 min-w-[340px]">
        <div />
        {VOWELS.map(v => (
          <div key={v} className="text-center text-sm font-bold text-maya-gold">{v}</div>
        ))}
      </div>

      {/* Pure vowels row */}
      <div className="grid grid-cols-[48px_repeat(5,1fr)] gap-1 mb-1 min-w-[340px]">
        <div className="flex items-center text-xs font-bold text-maya-gold">V</div>
        {vowels.map(v => (
          <button
            key={v.value}
            onClick={() => onSelect(v)}
            className={`p-2 rounded text-center text-sm transition-colors cursor-pointer ${CONFIDENCE_BG[v.confidence]} ${
              selected?.value === v.value ? 'ring-2 ring-maya-gold' : ''
            }`}
          >
            {v.value}
          </button>
        ))}
      </div>

      {/* Consonant rows */}
      {syllabograms.map(group => (
        <div key={group.onset} className="grid grid-cols-[48px_repeat(5,1fr)] gap-1 mb-1 min-w-[340px]">
          <div className="flex items-center text-xs font-bold text-maya-gold">{group.onset}</div>
          {group.syllables.map(s => (
            <button
              key={s.value}
              onClick={() => s.confidence !== 'unknown' ? onSelect(s) : null}
              className={`p-2 rounded text-center text-sm transition-colors ${
                s.confidence === 'unknown' ? 'cursor-default opacity-40' : 'cursor-pointer'
              } ${CONFIDENCE_BG[s.confidence]} ${
                selected?.value === s.value ? 'ring-2 ring-maya-gold' : ''
              }`}
            >
              {s.value}
            </button>
          ))}
        </div>
      ))}

      {/* Legend */}
      <div className="flex gap-4 text-xs mt-4 p-2 bg-maya-surface rounded-lg min-w-[340px]">
        <span><span className="text-confidence-confirmed">■</span> confirmado</span>
        <span><span className="text-confidence-probable">■</span> probable</span>
        <span><span className="text-confidence-tentative">■</span> tentativo</span>
        <span><span className="text-confidence-unknown">■</span> desconocido</span>
      </div>
    </div>
  )
}
