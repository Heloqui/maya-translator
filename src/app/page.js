'use client'
import Link from 'next/link'
import { getStats } from '@/lib/data'
import { useLang } from '@/lib/lang'

export default function Home() {
  const stats = getStats()
  const { t, lang } = useLang()

  const CARDS = [
    { href: '/syllabary', icon: '𐊀', title: t.syllabary, desc: t.syllabaryDesc },
    { href: '/dictionary', icon: '📖', title: t.dictionary, desc: t.dictionaryDesc },
    { href: '/transliterator', icon: '✏️', title: t.transliterator, desc: t.transliteratorDesc },
    { href: '/calendar', icon: '📅', title: t.calendar, desc: t.calendarDesc },
    { href: '/math', icon: '🔢', title: t.math, desc: t.mathDesc },
    { href: '/name', icon: '✍️', title: t.yourName, desc: lang === 'es' ? 'Escribe tu nombre en glifos' : 'Write your name in glyphs' },
    { href: '/inscriptions', icon: '🏛️', title: t.inscriptions, desc: t.inscriptionsDesc },
    { href: '/sites', icon: '🗺️', title: t.sites, desc: t.sitesDesc },
    { href: '/quiz', icon: '❓', title: t.quiz, desc: t.quizDesc },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Header with MA-YA in hieroglyphs */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-3 shadow-lg shadow-maya-gold/10">
          <img src="/glyphs/084_ma.png" alt="ma" className="max-w-full max-h-full object-contain" />
        </div>
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-3 shadow-lg shadow-maya-gold/10">
          <img src="/glyphs/047_ya.png" alt="ya" className="max-w-full max-h-full object-contain" />
        </div>
      </div>
      <div className="text-xs text-maya-muted mb-2 tracking-widest">ma — ya</div>
      <h1 className="text-3xl md:text-4xl font-bold text-maya-gold tracking-[0.2em] mb-2">
        {t.siteTitle}
      </h1>
      <p className="text-maya-muted text-sm mb-8 text-center">
        {t.siteSubtitle}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 max-w-2xl w-full">
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
        {stats.confirmed} {t.confirmedReadings} · {stats.dictEntries} {t.dictionary.toLowerCase()} · {stats.inscriptions} {t.inscriptions.toLowerCase()} · {stats.sites} {t.sites.toLowerCase()}
      </p>
    </div>
  )
}
