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
  return (
    <>
      <article className="px-4 pt-6 pb-2 md:px-6 max-w-2xl mx-auto">
        <h2 className="text-base font-bold text-maya-text mb-2">El Silabario Maya</h2>
        <p className="text-sm text-maya-muted leading-relaxed">
          El silabario maya es el conjunto de signos silábicos (<em>silabogramas</em>) que representan sílabas del tipo consonante-vocal (CV) en la escritura logosílabica del maya clásico. La lengua subyacente es el <strong className="text-maya-text">Ch'olti'an</strong>, ancestro del ch'orti' moderno y lengua de élite del período Clásico (250–900 d.C.). El inventario estándar, siguiendo Kettunen y Helmke (2020), incluye aproximadamente 100 signos silábicos confirmados, aunque existen variantes regionales adicionales. La escritura maya combina silabogramas con logograms (signos de palabras completas), y emplea el <em>complemento fonético</em> — uso de silabogramas para confirmar la lectura de un logogram — como rasgo ortográfico definitorio. Las únicas sílabas sin lectura confirmada hasta la fecha son <em>wu</em> y <em>xe</em>. Las imágenes de este silabario provienen del catálogo de Alexandre Tokovinine (Harvard University), limpias y optimizadas para uso educativo.
        </p>
      </article>
      <SyllabaryClient syllabaryData={syllabaryData} />
    </>
  )
}
