'use client'
import { useLang } from '@/lib/lang'

const COLORS = {
  confirmed: 'text-confidence-confirmed',
  probable: 'text-confidence-probable',
  tentative: 'text-confidence-tentative',
  unknown: 'text-confidence-unknown',
}

export default function ConfidenceBadge({ level, showLabel = true }) {
  const { t } = useLang()

  return (
    <span className={`inline-flex items-center gap-1 ${COLORS[level] || COLORS.unknown}`}>
      <span className="text-xs">●</span>
      {showLabel && <span className="text-xs">{t[level] || level}</span>}
    </span>
  )
}
