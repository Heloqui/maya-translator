'use client'
import Link from 'next/link'
import { useLang } from '@/lib/lang'

const TYPE_COLORS = {
  funerary: 'bg-purple-900/50 text-purple-300',
  dynastic: 'bg-blue-900/50 text-blue-300',
  warfare: 'bg-red-900/50 text-red-300',
  dedication: 'bg-green-900/50 text-green-300',
  mythological: 'bg-amber-900/50 text-amber-300',
  ritual: 'bg-teal-900/50 text-teal-300',
  astronomical: 'bg-indigo-900/50 text-indigo-300',
}

export default function InscriptionCard({ inscription }) {
  const { t, lang } = useLang()
  const name = inscription.name[lang] || inscription.name.es
  const desc = inscription.description[lang] || inscription.description.es

  return (
    <Link
      href={`/inscriptions/${inscription.id}`}
      className="block bg-maya-surface rounded-xl p-4 border border-maya-border hover:border-maya-gold transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-maya-text group-hover:text-maya-gold transition-colors text-sm">
          {name}
        </h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${TYPE_COLORS[inscription.type] || 'bg-maya-border text-maya-muted'}`}>
          {t[inscription.type] || inscription.type}
        </span>
      </div>
      <p className="text-xs text-maya-muted line-clamp-2 mb-2">{desc}</p>
      <div className="flex items-center justify-between text-[10px] text-maya-muted">
        <span>{inscription.site} · {inscription.date_gregorian}</span>
        <span>{inscription.blocks.length} {t.blocks}</span>
      </div>
    </Link>
  )
}
