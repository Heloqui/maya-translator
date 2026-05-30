'use client'
import Link from 'next/link'
import ConfidenceBadge from './ConfidenceBadge'
import SpeakButton from './SpeakButton'
import { getGlyphImage } from '@/lib/glyph-images'

export default function DictionaryEntry({ entry }) {
  const imgPath = getGlyphImage(entry.maya)

  return (
    <div className="bg-maya-surface rounded-lg p-3 border border-maya-border">
      <div className="flex items-center gap-3">
        {imgPath && (
          <div className="flex-shrink-0 w-14 h-14 bg-white rounded-lg flex items-center justify-center p-1.5">
            <img
              src={imgPath}
              alt={entry.maya}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <span className="font-bold text-maya-gold">{entry.maya}</span>
              <span className="text-maya-muted mx-2">→</span>
              <span>{entry.spanish}</span>
              {entry.english && (
                <span className="text-maya-muted text-sm ml-2">({entry.english})</span>
              )}
            </div>
            <SpeakButton text={entry.maya} mode="word" size="small" />
            <ConfidenceBadge level={entry.confidence} showLabel={false} />
          </div>
          {entry.notes && (
            <p className="text-xs text-maya-muted mt-1">{entry.notes}</p>
          )}
          {entry.etymology && (
            <p className="text-[10px] text-blue-400 mt-1">{entry.etymology}</p>
          )}
          {entry.cognates && Object.keys(entry.cognates).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(entry.cognates).map(([lang, word]) => (
                <span key={lang} className="text-[10px] bg-maya-border px-1.5 py-0.5 rounded">
                  {lang}: {word}
                </span>
              ))}
            </div>
          )}
          {entry.inscriptions?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {entry.inscriptions.map(id => (
                <Link
                  key={id}
                  href={`/inscriptions/${id}`}
                  className="text-[10px] text-maya-gold hover:underline"
                >
                  {id}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
