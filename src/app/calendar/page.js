import { SITE_URL } from '@/lib/site'
import CalendarClient from './CalendarClient'

export const metadata = {
  title: "Calendario Maya — Long Count, Tzolk'in y Haab'",
  description: "Convierte cualquier fecha al calendario maya: Cuenta Larga, Tzolk'in (260 días) y Haab' (365 días). Basado en la correlación GMT estándar (584283).",
  alternates: { canonical: '/calendar' },
  openGraph: { url: `${SITE_URL}/calendar` },
}

export default function CalendarPage() {
  return (
    <>
      <article className="px-4 pt-6 pb-2 md:px-6 max-w-2xl mx-auto">
        <h2 className="text-base font-bold text-maya-text mb-2">El Calendario Maya</h2>
        <p className="text-sm text-maya-muted leading-relaxed">
          El sistema calendárico maya integra tres ciclos distintos. El <strong className="text-maya-text">Tzolk'in</strong> es un calendario sagrado de 260 días, formado por la combinación de 13 números con 20 nombres de días — cada una de las 260 combinaciones únicas se repite en un ciclo perpetuo sin anclaje anual. El <strong className="text-maya-text">Haab'</strong> es el calendario solar de 365 días, dividido en 18 meses de 20 días más 5 días complementarios (<em>wayeb'</em>). Cuando ambos ciclos se sincronizan, producen la <strong className="text-maya-text">Rueda Calendárica</strong> de 52 años, unidad fundamental del registro histórico en las inscripciones del Clásico. La <strong className="text-maya-text">Cuenta Larga</strong> registra el tiempo desde una fecha de creación mítica equivalente al 11 de agosto de 3114 a.C. (gregoriano). La correlación GMT estándar (constante 584283, Goodman–Martínez–Thompson) es el método académico adoptado para convertir fechas mayas al calendario gregoriano (Kettunen &amp; Helmke, 2020).
        </p>
      </article>
      <CalendarClient />
    </>
  )
}
