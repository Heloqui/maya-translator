'use client'
import Link from 'next/link'
import ModeSelector from '@/components/ModeSelector'
import MayaGlyph from '@/components/MayaGlyph'
import { getStats } from '@/lib/data'

const CARDS = [
  { href: '/syllabary', icon: '𐊀', title: 'Silabario', desc: '100 signos silábicos' },
  { href: '/dictionary', icon: '📖', title: 'Diccionario', desc: '120+ palabras en Ch\'olan' },
  { href: '/transliterator', icon: '✏️', title: 'Transliterador', desc: 'Escribe en maya clásico' },
  { href: '/calendar', icon: '📅', title: 'Calendario', desc: 'Cuenta Larga · Tzolk\'in · Haab\'' },
]

export default function Home() {
  const stats = getStats()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <MayaGlyph tNumber="T533" size="text-6xl" className="text-maya-gold mb-2" />
      <h1 className="text-3xl md:text-4xl font-bold text-maya-gold tracking-[0.2em] mb-2">
        MAYA GLYPHS
      </h1>
      <p className="text-maya-muted text-sm mb-8 text-center">
        Traductor de Jeroglíficos Mayas — Datos verificados, sin alucinaciones
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
        {stats.confirmed} lecturas confirmadas · {stats.logograms} logogramas · {stats.daySigns} signos de día · Sistema vigesimal completo
      </p>
    </div>
  )
}
