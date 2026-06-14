import { SITE_URL } from '@/lib/site'

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
  ]

  return staticRoutes.map(({ path, priority = 0.8, changeFrequency = 'monthly' }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
