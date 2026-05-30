'use client'
import Link from 'next/link'
import ModeSelector from '@/components/ModeSelector'
import MayaGlyph from '@/components/MayaGlyph'
import { getStats } from '@/lib/data'
import { useLang } from '@/lib/lang'

export default function Home() {
  const stats = getStats()
  const { t } = useLang()

  const CARDS = [
    { href: '/syllabary', icon: '𐊀', title: t.syllabary, desc: t.syllabaryDesc },
    { href: '/dictionary', icon: '📖', title: t.dictionary, desc: t.dictionaryDesc },
    { href: '/transliterator', icon: '✏️', title: t.transliterator, desc: t.transliteratorDesc },
    { href: '/calendar', icon: '📅', title: t.calendar, desc: t.calendarDesc },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <MayaGlyph tNumber="T533" size="text-6xl" className="text-maya-gold mb-2" />
      <h1 className="text-3xl md:text-4xl font-bold text-maya-gold tracking-[0.2em] mb-2">
        {t.siteTitle}
      </h1>
      <p className="text-maya-muted text-sm mb-8 text-center">
        {t.siteSubtitle}
      </p>

      <ModeSelector />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 max-w-lg w-full">
        {CARDS.map(({ href, icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-maya-surface rounded-xl p-5 text-center border border-maya-border hover:border-maya-gold transition-colors group"
          >
            <div className="text-3xl mb-2">{icon}</div>
            <div className="font-bold text-maya-text group-hover:text-maya-gold transition-colors">{title}</div>
            <div className="text-xs text-maya-muted mt-1">{desc}</div>
          </Link>
        ))}
      </div>

      <p className="text-maya-muted text-xs mt-8 text-center">
        {stats.confirmed} {t.confirmedReadings} · {stats.logograms} {t.logograms} · {stats.daySigns} {t.daySigns} · {t.fullVigesimal}
      </p>
    </div>
  )
}
