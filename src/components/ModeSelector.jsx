'use client'
import { useMode } from '@/lib/modes'

export default function ModeSelector() {
  const { mode, changeMode, modes } = useMode()

  return (
    <div className="flex gap-2 justify-center">
      {Object.entries(modes).map(([key, { label, icon }]) => (
        <button
          key={key}
          onClick={() => changeMode(key)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            mode === key
              ? 'bg-maya-gold text-maya-bg'
              : 'bg-maya-surface text-maya-muted border border-maya-border hover:border-maya-gold'
          }`}
        >
          {icon} {label}
        </button>
      ))}
    </div>
  )
}
