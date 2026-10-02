import { SITE_URL } from '@/lib/site'
import TransliteratorClient from './TransliteratorClient'

export const metadata = {
  title: 'Transliterador Maya — Convierte Texto a Glifos Silábicos',
  description: 'Transliterador fonético: convierte palabras al silabario maya. Aproximación fonética usando los 100 signos silábicos verificados de la escritura maya clásica.',
  alternates: { canonical: '/transliterator' },
  openGraph: { url: `${SITE_URL}/transliterator` },
}

export default function TransliteratorPage() {
  return (
    <>
      <article className="px-4 pt-6 pb-2 md:px-6 max-w-2xl mx-auto">
        <h2 className="text-base font-bold text-maya-text mb-2">Transliterador Fonético Maya</h2>
        <p className="text-sm text-maya-muted leading-relaxed">
          El transliterador convierte texto a glifos silábicos mayas usando el silabario fonético del período Clásico. La escritura maya es logosílabica: no traduce significados, sino que aproxima la pronunciación sílaba a sílaba mediante el sistema CV (<em>consonante-vocal</em>). Para las consonantes finales sin silabograma directo, la ortografía maya clásica utiliza una vocal de apoyo muda — por ejemplo, la sílaba "k" se escribe como <em>ka</em> con la /a/ muda en contexto. El resultado es una aproximación fonética, no una traducción semántica. El sistema maya clásico no está diseñado para escribir idiomas modernos arbitrarios, sino para las palabras y morfemas del Ch'olti'an. Nombres propios y palabras con estructura CVC son los casos de uso más precisos. Esta herramienta es educativa: muestra el mecanismo del silabario, no produce texto maya auténtico. Para vocabulario documentado, consulta el <a href="/dictionary" className="text-maya-gold hover:underline">diccionario</a>.
        </p>
      </article>
      <TransliteratorClient />
    </>
  )
}
