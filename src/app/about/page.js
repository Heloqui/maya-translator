import { SITE_URL } from '@/lib/site'
import Link from 'next/link'

export const metadata = {
  title: 'Acerca de Maya Glyphs — El Proyecto',
  description: 'Conoce el proyecto Maya Glyphs: un traductor interactivo de jeroglíficos mayas construido sobre datos epigráficos verificados, sin alucinaciones de inteligencia artificial.',
  alternates: { canonical: '/about' },
  openGraph: { url: `${SITE_URL}/about` },
}

export default function AboutPage() {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-maya-gold mb-2">Acerca de Maya Glyphs</h1>
      <p className="text-xs text-maya-muted mb-8">About this project</p>

      <section className="mb-8">
        <h2 className="text-base font-bold text-maya-text mb-3">¿Qué es Maya Glyphs?</h2>
        <p className="text-sm text-maya-muted leading-relaxed mb-3">
          Maya Glyphs es una herramienta educativa interactiva para explorar la escritura jeroglífica de los mayas clásicos. El proyecto nació de la convicción de que el conocimiento epigráfico — construido durante décadas por investigadores de todo el mundo — merece ser accesible a estudiantes, entusiastas y académicos sin barreras.
        </p>
        <p className="text-sm text-maya-muted leading-relaxed">
          A diferencia de los &quot;traductores mayas&quot; impulsados por inteligencia artificial que generan resultados inventados, Maya Glyphs trabaja exclusivamente con lecturas verificadas por la comunidad epigráfica. El sistema de escritura maya es logosílabico y no puede traducir oraciones arbitrarias; lo que sí puede hacer es ofrecer aproximaciones fonéticas de nombres, vocabulario Ch&apos;olti&apos;an documentado y lecturas reales de inscripciones monumentales.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-maya-text mb-3">El autor</h2>
        <p className="text-sm text-maya-muted leading-relaxed mb-3">
          Maya Glyphs fue creado por <strong className="text-maya-text">Hector</strong>, desarrollador independiente con interés en la lingüística mesoamericana y las humanidades digitales. El proyecto es de código abierto y está disponible en{' '}
          <a href="https://github.com/Heloqui/maya-translator" className="text-maya-gold hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>.
        </p>
        <p className="text-sm text-maya-muted leading-relaxed">
          Los datos del silabario, diccionario e inscripciones fueron compilados a partir de las fuentes académicas de referencia listadas en la página de{' '}
          <Link href="/sources" className="text-maya-gold hover:underline">fuentes</Link>.
          Toda lectura incluida en la herramienta corresponde a un consenso epigráfico documentado — no a especulación ni a generación automática.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-maya-text mb-3">Alcance y limitaciones</h2>
        <ul className="text-sm text-maya-muted space-y-2 list-disc list-inside leading-relaxed">
          <li>El silabario cubre los ~100 signos silábicos del maya clásico con consenso académico.</li>
          <li>El diccionario incluye vocabulario Ch&apos;olti&apos;an (maya clásico) documentado — no maya yucateco moderno ni otras variantes.</li>
          <li>El transliterador produce aproximaciones fonéticas, no traducciones semánticas.</li>
          <li>Las inscripciones incluidas corresponden a monumentos reales con lecturas publicadas.</li>
          <li>Faltan los signos <em>wu</em> y <em>xe</em> del silabario — no tienen lectura confirmada hasta la fecha.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-maya-text mb-3">Metodología</h2>
        <p className="text-sm text-maya-muted leading-relaxed mb-3">
          Cada entrada del diccionario fue verificada contra al menos una fuente primaria de referencia. Las lecturas de inscripciones se basan en publicaciones epigráficas especializadas. El número de Thompson (T###) se incluye donde corresponde para trazabilidad académica.
        </p>
        <p className="text-sm text-maya-muted leading-relaxed">
          El calendario maya utiliza la correlación GMT estándar (constante 584283) adoptada por la mayoría de los epigrafistas para la correspondencia con el calendario gregoriano.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-maya-text mb-3">Contacto y contribuciones</h2>
        <p className="text-sm text-maya-muted leading-relaxed">
          Errores, sugerencias o contribuciones: abre un issue en{' '}
          <a href="https://github.com/Heloqui/maya-translator/issues" className="text-maya-gold hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>.
          Las correcciones epigráficas son especialmente bienvenidas.
        </p>
      </section>

      <div className="mt-8 pt-6 border-t border-maya-border flex gap-4 text-xs text-maya-muted">
        <Link href="/sources" className="text-maya-gold hover:underline">Ver fuentes bibliográficas →</Link>
        <Link href="/" className="hover:text-maya-text">← Volver al inicio</Link>
      </div>
    </div>
  )
}
