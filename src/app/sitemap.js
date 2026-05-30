export default function sitemap() {
  const baseUrl = 'https://maya-translator.vercel.app'

  const staticRoutes = [
    '',
    '/syllabary',
    '/dictionary',
    '/transliterator',
    '/calendar',
    '/math',
    '/name',
    '/inscriptions',
    '/sites',
    '/quiz',
    '/birthday',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))

  return staticRoutes
}
