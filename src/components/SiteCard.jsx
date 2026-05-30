'use client'
import Link from 'next/link'
import { useLang } from '@/lib/lang'

export default function SiteCard({ site }) {
  const { t, lang } = useLang()
  const name = site.name[lang] || site.name.es
  const desc = site.description[lang] || site.description.es
  const meaning = site.meaning[lang] || site.meaning.es

  return (
    <div className="bg-maya-surface rounded-lg p-4 border border-maya-border max-w-sm">
      <h3 className="font-bold text-maya-gold text-sm">{name}</h3>
      {site.ancient_name && (
        <div className="text-xs text-maya-muted mt-0.5">
          {t.ancientName}: <span className="text-blue-400">{site.ancient_name}</span>
          {meaning && <span className="ml-1">({meaning})</span>}
        </div>
      )}

      <p className="text-xs text-maya-muted mt-2 line-clamp-3">{desc}</p>

      <div className="mt-3 space-y-1 text-xs">
        <div>
          <span className="text-maya-muted">{t.period}: </span>
          <span>{site.period.from} — {site.period.to}</span>
          {site.period.peak && <span className="text-maya-gold ml-1">({t.peak}: {site.period.peak})</span>}
        </div>
        {site.dynasty && (
          <div>
            <span className="text-maya-muted">{t.dynastyLabel}: </span>
            <span>{site.dynasty}</span>
          </div>
        )}
      </div>

      {site.notable_rulers?.length > 0 && (
        <div className="mt-2">
          <span className="text-[10px] text-maya-muted">{t.rulers}:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {site.notable_rulers.map((r, i) => (
              <span key={i} className="text-[10px] bg-maya-border px-2 py-0.5 rounded-full">
                {r.name} <span className="text-maya-muted">({r.reign})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {site.inscriptions?.length > 0 && (
        <div className="mt-3 border-t border-maya-border pt-2">
          <Link
            href={`/inscriptions`}
            className="text-[10px] text-maya-gold hover:underline"
          >
            {t.viewInscriptions} ({site.inscriptions.length})
          </Link>
        </div>
      )}
    </div>
  )
}
