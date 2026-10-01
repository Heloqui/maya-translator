import { SITE_URL } from '@/lib/site'
import { getInscriptions } from '@/lib/data'

export default function sitemap() {
  const staticRoutes = [
    { path: '', priority: 1, changeFrequency: 'weekly' },
    { path: '/syllabary', priority: 0.9 },
    { path: '/dictionary', priority: 0.9 },
    { path: '/transliterator', priority: 0.9 },
    { path: '/calendar', priority: 0.9 },
    { path: '/math', priority: 0.8 },
    { path: '/name', priority: 0.9 },
    { path: '/inscriptions', priority: 0.8 },
    { path: '/sites', priority: 0.8 },
    { path: '/quiz', priority: 0.7 },
    { path: '/birthday', priority: 0.9 },
    { path: '/about', priority: 0.6 },
    { path: '/sources', priority: 0.5 },
  ]

  const inscriptions = getInscriptions()
  const inscriptionRoutes = inscriptions.map(insc => ({
    url: `${SITE_URL}/inscriptions/${insc.id}`,
    lastModified: new Date('2026-06-14'),
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const staticEntries = staticRoutes.map(({ path, priority = 0.8, changeFrequency = 'monthly' }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date('2026-06-14'),
    changeFrequency,
    priority,
  }))

  return [...staticEntries, ...inscriptionRoutes]
}
