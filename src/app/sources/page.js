import { SITE_URL } from '@/lib/site'
import Link from 'next/link'

export const metadata = {
  title: 'Fuentes Bibliográficas — Maya Glyphs',
  description: 'Fuentes académicas y epigráficas detrás de Maya Glyphs: diccionarios, manuales de jeroglíficos mayas y corpus de inscripciones utilizados como referencia.',
  alternates: { canonical: '/sources' },
  openGraph: { url: `${SITE_URL}/sources` },
}

const SOURCES = [
  {
    category: 'Manuales y referencias generales',
    items: [
      {
        citation: 'Kettunen, H. & Helmke, C. (2020). Introduction to Maya Hieroglyphs. Workshop Handbook, 25th edition. Wayeb & Leiden University.',
        note: 'Referencia principal para el silabario, sistema de escritura y estructura glífica.',
        url: 'https://www.wayeb.org/download/resources/wh2020english.pdf',
      },
      {
        citation: 'Montgomery, J. (2002). Dictionary of Maya Hieroglyphs. Hippocrene Books.',
        note: 'Fuente principal para entradas del diccionario y significados de logograms.',
      },
      {
        citation: 'Coe, M. D. & Van Stone, M. (2005). Reading the Maya Glyphs. Thames & Hudson.',
        note: 'Introducción al sistema logosílabico y estructuras glíficas.',
      },
    ],
  },
  {
    category: 'Bases de datos y corpus epigráficos',
    items: [
      {
        citation: 'FAMSI — Foundation for the Advancement of Mesoamerican Studies. Glyph Catalog online.',
        note: 'Catálogo de glifos y diccionario de jeroglíficos mayas en línea.',
        url: 'https://www.famsi.org/mayawriting/dictionary/montgomery/index.html',
      },
      {
        citation: 'Prager, C. et al. Text Database and Dictionary of Classic Mayan (TDDM). University of Bonn.',
        note: "Base de datos de referencia para vocabulario Ch'olti'an y corpus de inscripciones.",
        url: 'https://classicmayan.org/',
      },
      {
        citation: 'Mesoweb — Encyclopedia of Mesoamerica.',
        note: 'Publicaciones y recursos epigráficos sobre sitios y inscripciones específicas.',
        url: 'https://www.mesoweb.com/',
      },
    ],
  },
  {
    category: 'Imágenes de glifos',
    items: [
      {
        citation: 'Tokovinine, A. Syllabic Sign Catalog. Harvard University.',
        note: '612 imágenes de signos silábicos utilizadas en el silabario de Maya Glyphs (limpiadas y optimizadas).',
      },
      {
        citation: 'Douros, G. Fonts for the Ancient World: UFAS (Unicode Font for Ancient Scripts). George Douros.',
        note: 'Fuente Thompson de respaldo para signos sin imagen Tokovinine disponible. Licencia libre.',
        url: 'https://dn-works.com/ufas/',
      },
    ],
  },
  {
    category: 'Calendarios y matemáticas mayas',
    items: [
      {
        citation: 'Thompson, J. E. S. (1927). A Correlation of the Mayan and European Calendars. Field Museum.',
        note: 'Base de la correlación GMT (constante 584283) usada en el conversor de calendario.',
      },
      {
        citation: 'Lounsbury, F. G. (1978). Maya Numeration, Computation, and Calendrical Astronomy. Dictionary of Scientific Biography.',
        note: 'Referencia para el sistema vigesimal y la astronomía calendárica.',
      },
    ],
  },
]

export default function SourcesPage() {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-maya-gold mb-2">Fuentes Bibliográficas</h1>
      <p className="text-xs text-maya-muted mb-8">
        Referencias académicas que sustentan los datos de Maya Glyphs
      </p>

      {SOURCES.map(({ category, items }) => (
        <section key={category} className="mb-8">
          <h2 className="text-base font-bold text-maya-text mb-4 border-b border-maya-border pb-2">
            {category}
          </h2>
          <ul className="space-y-4">
            {items.map(({ citation, note, url }) => (
              <li key={citation} className="bg-maya-surface rounded-lg p-4 border border-maya-border">
                <p className="text-sm text-maya-text mb-1 leading-relaxed">
                  {url ? (
                    <a href={url} className="hover:text-maya-gold transition-colors" target="_blank" rel="noopener noreferrer">
                      {citation}
                    </a>
                  ) : citation}
                </p>
                {note && <p className="text-xs text-maya-muted">{note}</p>}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="mt-8 pt-6 border-t border-maya-border flex gap-4 text-xs text-maya-muted">
        <Link href="/about" className="text-maya-gold hover:underline">← Acerca del proyecto</Link>
        <Link href="/" className="hover:text-maya-text">← Inicio</Link>
      </div>
    </div>
  )
}
