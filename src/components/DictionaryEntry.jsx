import ConfidenceBadge from './ConfidenceBadge'

export default function DictionaryEntry({ entry, mode }) {
  return (
    <div className="bg-maya-surface rounded-lg p-3 border border-maya-border">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-bold text-maya-gold">{entry.maya}</span>
          <span className="text-maya-muted mx-2">→</span>
          <span>{entry.spanish}</span>
          {mode !== 'explorador' && entry.english && (
            <span className="text-maya-muted text-sm ml-2">({entry.english})</span>
          )}
        </div>
        {mode !== 'explorador' && (
          <ConfidenceBadge level={entry.confidence} showLabel={false} />
        )}
      </div>
      {mode === 'investigador' && entry.notes && (
        <p className="text-xs text-maya-muted mt-1">{entry.notes}</p>
      )}
    </div>
  )
}
