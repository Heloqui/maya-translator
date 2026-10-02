import { SITE_URL } from '@/lib/site'
import QuizClient from './QuizClient'

export const metadata = {
  title: 'Quiz de Jeroglíficos Mayas — Pon a Prueba tu Conocimiento',
  description: 'Quiz interactivo de escritura maya: tres modos (silabario, vocabulario, inscripciones). Aprende a reconocer los glifos mayas más importantes.',
  alternates: { canonical: '/quiz' },
  openGraph: { url: `${SITE_URL}/quiz` },
}

export default function QuizPage() {
  return <QuizClient />
}
