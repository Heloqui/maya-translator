import { getStats } from '@/lib/data'
import HomeClient from './HomeClient'
import JsonLd from '@/components/JsonLd'

export const metadata = {
  title: 'Maya Glyphs — Traductor de Jeroglíficos Mayas',
  description: 'Traductor interactivo de jeroglíficos mayas con silabario, diccionario de 300+ palabras, 20 inscripciones reales, mapa arqueológico y quiz. Sin alucinaciones — datos epigráficos verificados.',
  alternates: { canonical: '/' },
}

export default function Home() {
  const stats = getStats()

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://mayaglyphs.app/#website",
    "name": "Maya Glyphs",
    "url": "https://mayaglyphs.app",
    "description": "Interactive Maya hieroglyphics educational tool with verified syllabary, Ch'olan dictionary, real inscriptions, and calendar tools.",
    "inLanguage": ["es", "en"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://mayaglyphs.app/dictionary?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": "https://mayaglyphs.app/#organization",
    "name": "Maya Glyphs",
    "url": "https://mayaglyphs.app",
    "description": "Educational web application dedicated to Maya hieroglyphics literacy, featuring an interactive syllabary, glyph dictionary, historical inscriptions, and the Maya calendar system.",
    "knowsAbout": ["Maya hieroglyphics", "Maya writing system", "Classic Maya inscriptions", "Maya calendar", "Mesoamerican archaeology"],
    "inLanguage": ["es", "en"],
    "sameAs": ["https://github.com/Heloqui/maya-translator"]
  }

  return (
    <>
      <JsonLd key="website" data={websiteSchema} />
      <JsonLd key="org" data={orgSchema} />
      <HomeClient stats={stats} />
    </>
  )
}
