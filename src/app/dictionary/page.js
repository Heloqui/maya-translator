import { getDictionary } from '@/lib/data'
import { SITE_URL } from '@/lib/site'
import DictionaryClient from './DictionaryClient'

export const metadata = {
  title: "Diccionario Maya — 300+ palabras Ch'olan",
  description: "Diccionario del maya clásico (Ch'olti'an) con 300+ palabras: títulos, verbos, sustantivos, astronomía, arquitectura y más. Etimología, cognados y referencias a inscripciones reales.",
  alternates: { canonical: '/dictionary' },
  openGraph: { url: `${SITE_URL}/dictionary` },
}

export default function DictionaryPage() {
  const dict = getDictionary()
  return <DictionaryClient initialDict={dict} />
}
