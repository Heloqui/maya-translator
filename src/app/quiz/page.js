'use client'
import { useState } from 'react'
import { useLang } from '@/lib/lang'
import QuizEngine from '@/components/QuizEngine'

export default function QuizPage() {
  const { t } = useLang()
  const [mode, setMode] = useState('syllables')

  const MODES = [
    { key: 'syllables', label: t.syllableQuiz, icon: '𐊀' },
    { key: 'vocabulary', label: t.vocabularyQuiz, icon: '📖' },
    { key: 'inscriptions', label: t.inscriptionQuiz, icon: '🏛️' },
  ]

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-maya-gold mb-1">{t.quizTitle}</h1>
      <p className="text-xs text-maya-muted mb-4">{t.quizSubtitle}</p>

      <div className="flex gap-1 overflow-x-auto pb-2 mb-6">
        {MODES.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`px-4 py-2 rounded-lg text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              mode === key ? 'bg-maya-gold text-maya-bg font-bold' : 'bg-maya-surface text-maya-muted hover:bg-maya-border'
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <QuizEngine key={mode} mode={mode} />
    </div>
  )
}
