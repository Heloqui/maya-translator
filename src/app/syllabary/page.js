import { getSyllabaryGrid } from '@/lib/data'
import { SITE_URL } from '@/lib/site'
import SyllabaryClient from './SyllabaryClient'

export const metadata = {
  title: 'Silabario Maya — 100 signos silábicos verificados',
  description: 'Silabario maya completo: 100 signos silábicos con imágenes Tokovinine, lecturas verificadas y ejemplos de inscripciones reales. Basado en datos epigráficos de Kettunen & Helmke.',
  alternates: { canonical: '/syllabary' },
  openGraph: { url: `${SITE_URL}/syllabary` },
}

export default function SyllabaryPage() {
  const syllabaryData = getSyllabaryGrid()
  return <SyllabaryClient syllabaryData={syllabaryData} />
}
