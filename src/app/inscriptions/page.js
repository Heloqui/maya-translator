import { getInscriptions, getSites } from '@/lib/data'
import { SITE_URL } from '@/lib/site'
import InscriptionsClient from './InscriptionsClient'

export const metadata = {
  title: 'Inscripciones Mayas — 20 monumentos con lectura bloque a bloque',
  description: '20 inscripciones mayas icónicas con lectura epigráfica bloque a bloque: Lápida de Pakal, Tableros de Palenque, Estelas de Copán, Quiriguá, Tikal y más.',
  alternates: { canonical: '/inscriptions' },
  openGraph: { url: `${SITE_URL}/inscriptions` },
}

export default function InscriptionsPage() {
  const initialInscriptions = getInscriptions()
  const initialSites = getSites()
  return <InscriptionsClient initialInscriptions={initialInscriptions} initialSites={initialSites} />
}
