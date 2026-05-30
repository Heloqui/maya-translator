'use client'
import { useState, useMemo } from 'react'
import { getInscriptions, getSites } from '@/lib/data'
import { useLang } from '@/lib/lang'
import InscriptionCard from '@/components/InscriptionCard'

const inscriptions = getInscriptions()

export default function InscriptionsPage() {
  const { t } = useLang()
  const [typeFilter, setTypeFilter] = useState('all')
  const [siteFilter, setSiteFilter] = useState('all')
  const sites = getSites()

  const types = [...new Set(inscriptions.map(i => i.type))]
  const siteIds = [...new Set(inscriptions.map(i => i.site))]

  const filtered = useMemo(() => {
    return inscriptions.filter(i => {
      if (typeFilter !== 'all' && i.type !== typeFilter) return false
      if (siteFilter !== 'all' && i.site !== siteFilter) return false
      return true
    })
  }, [typeFilter, siteFilter])

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-maya-gold mb-1">{t.inscriptionsTitle}</h1>
      <p className="text-xs text-maya-muted mb-4">{t.inscriptionsSubtitle}</p>

      <div className="flex gap-2 flex-wrap mb-4">
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="bg-maya-surface border border-maya-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-maya-gold"
        >
          <option value="all">{t.allTypes}</option>
          {types.map(type => (
            <option key={type} value={type}>{t[type] || type}</option>
          ))}
        </select>

        <select
          value={siteFilter}
          onChange={e => setSiteFilter(e.target.value)}
          className="bg-maya-surface border border-maya-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-maya-gold"
        >
          <option value="all">{t.filterBySite}</option>
          {siteIds.map(id => {
            const site = sites.find(s => s.id === id)
            return <option key={id} value={id}>{site?.name?.es || id}</option>
          })}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(insc => (
          <InscriptionCard key={insc.id} inscription={insc} />
        ))}
        {filtered.length === 0 && (
          <p className="text-maya-muted text-sm text-center py-8">{t.noResults}</p>
        )}
      </div>
    </div>
  )
}
