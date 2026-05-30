const COLORS = {
  confirmed: 'text-confidence-confirmed',
  probable: 'text-confidence-probable',
  tentative: 'text-confidence-tentative',
  unknown: 'text-confidence-unknown',
}

const LABELS = {
  confirmed: 'confirmado',
  probable: 'probable',
  tentative: 'tentativo',
  unknown: 'desconocido',
}

export default function ConfidenceBadge({ level, showLabel = true }) {
  return (
    <span className={`inline-flex items-center gap-1 ${COLORS[level] || COLORS.unknown}`}>
      <span className="text-xs">●</span>
      {showLabel && <span className="text-xs">{LABELS[level] || level}</span>}
    </span>
  )
}
