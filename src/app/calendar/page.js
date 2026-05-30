'use client'
import { useState, useMemo } from 'react'
import { useLang } from '@/lib/lang'
import { convertGregorianToMaya, convertLongCountToGregorian } from '@/lib/calendar'
import CalendarDisplay from '@/components/CalendarDisplay'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function CalendarPage() {
  const [dateInput, setDateInput] = useState(todayStr())
  const [lcInput, setLcInput] = useState('')
  const [direction, setDirection] = useState('gregorian')
  const { t } = useLang()

  const result = useMemo(() => {
    if (direction === 'gregorian') {
      const [y, m, d] = dateInput.split('-').map(Number)
      if (!y || !m || !d) return null
      return convertGregorianToMaya(y, m, d)
    } else {
      if (!lcInput.trim()) return null
      return convertLongCountToGregorian(lcInput.trim())
    }
  }, [dateInput, lcInput, direction])

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-maya-gold mb-1">{t.calendarTitle}</h1>
      <p className="text-xs text-maya-muted mb-4">{t.calendarSubtitle}</p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setDirection('gregorian')}
          className={`px-3 py-1.5 rounded-lg text-xs ${direction === 'gregorian' ? 'bg-maya-gold text-maya-bg font-bold' : 'bg-maya-surface text-maya-muted'}`}
        >
          {t.gregorianToMaya}
        </button>
        <button
          onClick={() => setDirection('longcount')}
          className={`px-3 py-1.5 rounded-lg text-xs ${direction === 'longcount' ? 'bg-maya-gold text-maya-bg font-bold' : 'bg-maya-surface text-maya-muted'}`}
        >
          {t.longCountToGregorian}
        </button>
      </div>

      {direction === 'gregorian' ? (
        <div className="flex gap-2 mb-6">
          <input
            type="date"
            value={dateInput}
            onChange={e => setDateInput(e.target.value)}
            className="flex-1 bg-maya-surface border border-maya-border rounded-lg px-4 py-3 focus:outline-none focus:border-maya-gold [color-scheme:dark]"
          />
          <button
            onClick={() => setDateInput(todayStr())}
            className="px-4 py-2 bg-maya-gold text-maya-bg rounded-lg text-sm font-bold hover:bg-maya-gold-dim"
          >
            {t.today}
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <input
            type="text"
            value={lcInput}
            onChange={e => setLcInput(e.target.value)}
            placeholder="Ej: 13.0.11.7.5"
            className="w-full bg-maya-surface border border-maya-border rounded-lg px-4 py-3 focus:outline-none focus:border-maya-gold"
          />
          {result?.gregorian && (
            <div className="text-sm text-maya-muted mt-2">
              {t.gregorianDate}: <span className="text-maya-text font-bold">
                {result.gregorian.day}/{result.gregorian.month}/{result.gregorian.year}
              </span>
            </div>
          )}
        </div>
      )}

      <CalendarDisplay result={result} />
    </div>
  )
}
