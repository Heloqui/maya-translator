import { getInscription, getSite, getInscriptions } from '@/lib/data'
import { SITE_URL } from '@/lib/site'
import InscriptionDetailClient from './InscriptionDetailClient'

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

  return <InscriptionDetailClient inscription={inscription} site={site} />
}
