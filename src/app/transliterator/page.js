import { SITE_URL } from '@/lib/site'
import TransliteratorClient from './TransliteratorClient'

export const metadata = {
  title: 'Transliterador Maya — Convierte Texto a Glifos Silábicos',
  description: 'Transliterador fonético: convierte palabras al silabario maya. Aproximación fonética usando los 100 signos silábicos verificados de la escritura maya clásica.',
  alternates: { canonical: '/transliterator' },
  openGraph: { url: `${SITE_URL}/transliterator` },
}

export default function TransliteratorPage() {
  return <TransliteratorClient />
}
