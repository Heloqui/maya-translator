import { getInscription, getSite, getInscriptions } from '@/lib/data'
import { SITE_URL } from '@/lib/site'
import InscriptionDetailClient from './InscriptionDetailClient'
import JsonLd from '@/components/JsonLd'

export async function generateStaticParams() {
  const inscriptions = getInscriptions()
  return inscriptions.map(insc => ({ id: insc.id }))
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const inscription = getInscription(id)
  if (!inscription) return { title: 'Inscripción no encontrada' }

  const name = inscription.name.es
  const site = getSite(inscription.site)
  const siteName = site?.name?.es || ''

  return {
    title: `${name} — Inscripción Maya`,
    description: `${inscription.description?.es?.slice(0, 150) || `Inscripción maya de ${siteName}, ${inscription.date_gregorian}. Lectura epigráfica bloque a bloque.`}`,
    alternates: { canonical: `/inscriptions/${id}` },
    openGraph: { url: `${SITE_URL}/inscriptions/${id}` },
  }
}

export default async function InscriptionDetailPage({ params }) {
  const { id } = await params
  const inscription = getInscription(id)
  const site = inscription ? getSite(inscription.site) : null

  const artworkSchema = inscription ? {
    "@context": "https://schema.org",
    "@type": ["VisualArtwork", "LearningResource"],
    "@id": `https://mayaglyphs.app/inscriptions/${id}#artwork`,
    "name": inscription.name.es,
    "description": inscription.description?.es || `Inscripción maya de ${site?.name?.es || ''}, ${inscription.date_gregorian}.`,
    "url": `https://mayaglyphs.app/inscriptions/${id}`,
    "dateCreated": inscription.date_gregorian,
    "artMedium": "Carved stone",
    "about": {
      "@type": "Thing",
      "name": "Maya script",
      "sameAs": "https://en.wikipedia.org/wiki/Maya_script"
    },
    "locationCreated": site ? {
      "@type": "Place",
      "name": site.name.es
    } : undefined,
    "inLanguage": ["es", "en"],
    "educationalLevel": "Intermediate",
    "provider": { "@id": "https://mayaglyphs.app/#organization" }
  } : null

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Maya Glyphs", "item": "https://mayaglyphs.app" },
      { "@type": "ListItem", "position": 2, "name": "Inscripciones", "item": "https://mayaglyphs.app/inscriptions" },
      { "@type": "ListItem", "position": 3, "name": inscription?.name?.es || id, "item": `https://mayaglyphs.app/inscriptions/${id}` }
    ]
  }

  return (
    <>
      {artworkSchema && <JsonLd key="artwork" data={artworkSchema} />}
      <JsonLd key="breadcrumb" data={breadcrumbSchema} />
      <InscriptionDetailClient inscription={inscription} site={site} />
    </>
  )
}
