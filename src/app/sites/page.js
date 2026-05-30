'use client'
import { useState, useMemo } from 'react'
import { getSites, getRegions } from '@/lib/data'
import { useLang } from '@/lib/lang'
import SiteMap from '@/components/SiteMap'
import SiteCard from '@/components/SiteCard'

const sites = getSites()
const regions = getRegions()

export default function SitesPage() {
  const { t, lang } = useLang()
  const [regionFilter, setRegionFilter] = useState('all')

  const filtered = useMemo(() => {
    if (regionFilter === 'all') return sites
    return sites.filter(s => s.region === regionFilter)
  }, [regionFilter])

  const regionKeys = [...new Set(sites.map(s => s.region))]

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-maya-gold mb-1">{t.sitesTitle}</h1>
      <p className="text-xs text-maya-muted mb-4">{t.sitesSubtitle}</p>

      <div className="mb-4">
        <select
          value={regionFilter}
          onChange={e => setRegionFilter(e.target.value)}
          className="bg-maya-surface border border-maya-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-maya-gold"
        >
          <option value="all">{t.allRegions}</option>
          {regionKeys.map(key => (
            <option key={key} value={key}>
              {regions[key]?.[lang] || regions[key]?.es || key}
            </option>
          ))}
        </select>
      </div>

      <SiteMap sites={filtered} />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(site => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>
    </div>
  )
}
