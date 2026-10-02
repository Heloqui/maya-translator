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
      <JsonLd key="dict" data={dictSchema} />
      <JsonLd key="breadcrumb" data={breadcrumbSchema} />
      <article className="px-4 pt-6 pb-2 md:px-6 max-w-3xl mx-auto">
        <h2 className="text-base font-bold text-maya-text mb-2">Vocabulario del Maya Clásico</h2>
        <p className="text-sm text-maya-muted leading-relaxed">
          El diccionario de Maya Glyphs reúne más de 300 palabras del <strong className="text-maya-text">Ch'olti'an</strong>, la variedad del maya clásico usada en inscripciones del período 250–900 d.C. El corpus abarca 16 campos semánticos: títulos y rangos políticos, verbos rituales, sustantivos, adjetivos y colores, términos astronómicos, arquitectónicos, de parentesco, flora y fauna, entre otros. Cada entrada incluye la forma maya transliterada, su equivalente en español e inglés, y — donde está documentado — etimología, cognados modernos y referencias a inscripciones reales donde aparece el término. Las entradas numéricas se presentan con la notación de puntos y barras del sistema vigesimal maya. La fuente principal es el <em>Dictionary of Maya Hieroglyphs</em> de Montgomery (2002), complementado con el <em>Text Database and Dictionary of Classic Mayan</em> de la Universidad de Bonn (Prager et al.) y el catálogo de glifos de FAMSI (Foundation for the Advancement of Mesoamerican Studies).
        </p>
      </article>
      <DictionaryClient initialDict={dict} />
    </>
  )
}
