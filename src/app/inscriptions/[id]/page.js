'use client'
import { use } from 'react'
import Link from 'next/link'
import { getInscription, getSite } from '@/lib/data'
import { useLang } from '@/lib/lang'
import BlockReader from '@/components/BlockReader'

export default function InscriptionDetailPage({ params }) {
  const { id } = use(params)
  const { t, lang } = useLang()
  const inscription = getInscription(id)

  if (!inscription) {
    return (
      <div className="p-6 text-center">
        <p className="text-maya-muted">Inscription not found</p>
        <Link href="/inscriptions" className="text-maya-gold text-sm mt-2 inline-block">{t.backToList}</Link>
      </div>
    )
  }

  const site = getSite(inscription.site)
  const name = inscription.name[lang] || inscription.name.es
  const desc = inscription.description[lang] || inscription.description.es
  const context = inscription.historical_context[lang] || inscription.historical_context.es

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <Link href="/inscriptions" className="text-xs text-maya-muted hover:text-maya-gold mb-4 inline-block">
        {t.backToList}
      </Link>

      <h1 className="text-xl font-bold text-maya-gold mb-1">{name}</h1>

      <div className="flex flex-wrap gap-2 text-xs text-maya-muted mb-3">
        {site && (
          <Link href="/sites" className="hover:text-maya-gold">
            {site.name[lang] || site.name.es}
          </Link>
        )}
        <span>·</span>
        <span>{inscription.date_gregorian}</span>
        <span>·</span>
        <span>{t[inscription.type] || inscription.type}</span>
      </div>

      <p className="text-sm text-maya-muted mb-4">{desc}</p>

      <BlockReader blocks={inscription.blocks} />

      <div className="mt-6 bg-maya-surface rounded-lg p-4 border border-maya-border">
        <h2 className="text-sm font-bold text-maya-gold mb-2">{t.historicalContext}</h2>
        <p className="text-xs text-maya-muted">{context}</p>
      </div>

      <div className="mt-4 text-[10px] text-maya-muted">
        <p>{t.sources}: {inscription.source}</p>
        {inscription.image_credit && <p>Image: {inscription.image_credit}</p>}
      </div>
    </div>
  )
}
