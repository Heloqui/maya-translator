import { getDictionary } from '@/lib/data'
import { SITE_URL } from '@/lib/site'
import DictionaryClient from './DictionaryClient'
import JsonLd from '@/components/JsonLd'

export const metadata = {
  title: "Diccionario Maya — 300+ palabras Ch'olan",
  description: "Diccionario del maya clásico (Ch'olti'an) con 300+ palabras: títulos, verbos, sustantivos, astronomía, arquitectura y más. Etimología, cognados y referencias a inscripciones reales.",
  alternates: { canonical: '/dictionary' },
  openGraph: { url: `${SITE_URL}/dictionary` },
}

export default function DictionaryPage() {
  const dict = getDictionary()

  const dictSchema = {
    "@context": "https://schema.org",
    "@type": ["DefinedTermSet", "LearningResource"],
    "@id": "https://mayaglyphs.app/dictionary#termset",
    "name": "Diccionario Maya — vocabulario Ch'olan clásico",
    "description": "Diccionario de referencia del maya clásico (Ch'olti'an) con 300+ palabras: traducciones, etimología, cognados y referencias a inscripciones reales.",
    "url": "https://mayaglyphs.app/dictionary",
    "inLanguage": ["es", "en"],
    "about": {
      "@type": "Thing",
      "name": "Maya script",
      "sameAs": "https://en.wikipedia.org/wiki/Maya_script"
    },
    "teaches": "Maya hieroglyphic writing system vocabulary",
    "educationalLevel": "Beginner to Advanced",
    "provider": { "@id": "https://mayaglyphs.app/#organization" }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Maya Glyphs", "item": "https://mayaglyphs.app" },
      { "@type": "ListItem", "position": 2, "name": "Diccionario", "item": "https://mayaglyphs.app/dictionary" }
    ]
  }

  return (
    <>
      <JsonLd data={dictSchema} />
      <JsonLd data={breadcrumbSchema} />
      <DictionaryClient initialDict={dict} />
    </>
  )
}
