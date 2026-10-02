import { SITE_URL } from '@/lib/site'
import SitesClient from './SitesClient'

export const metadata = {
  title: 'Sitios Arqueológicos Mayas — Mapa de 20 Ciudades Clásicas',
  description: 'Mapa interactivo de 20 sitios arqueológicos mayas: Palenque, Tikal, Copán, Calakmul, Yaxchilán, Quiriguá y más. Con coordenadas, dinastías y gobernantes históricos.',
  alternates: { canonical: '/sites' },
  openGraph: { url: `${SITE_URL}/sites` },
}

export default function SitesPage() {
  return (
    <>
      <article className="px-4 pt-6 pb-2 md:px-6 max-w-2xl mx-auto">
        <h2 className="text-base font-bold text-maya-text mb-2">Sitios Arqueológicos del Mundo Maya</h2>
        <p className="text-sm text-maya-muted leading-relaxed">
          El área cultural maya se extendió por los actuales México (Yucatán, Chiapas, Campeche, Tabasco, Quintana Roo), Guatemala, Belice, Honduras y El Salvador. Durante el período Clásico (250–900 d.C.) florecieron docenas de ciudades-estado con arquitectura monumental, sistemas de escritura jeroglífica y calendarios astronómicos. Los 20 sitios de este mapa representan los centros más documentados epigráficamente: <strong className="text-maya-text">Palenque</strong> (Chiapas, México), sede del ajaw K'inich Janaab' Pakal; <strong className="text-maya-text">Tikal</strong> (Petén, Guatemala), capital de la superpotencia del Clásico Temprano; <strong className="text-maya-text">Copán</strong> (Honduras), centro astronómico con la Escalera Jeroglífica más larga conocida; <strong className="text-maya-text">Calakmul</strong> (Campeche, México), rival político de Tikal durante el Clásico Tardío; y <strong className="text-maya-text">Quiriguá</strong> (Guatemala), con las estelas más altas del mundo maya. Los datos de gobernantes y dinastías siguen la historiografía epigráfica estándar (Martin &amp; Grube, 2000).
        </p>
      </article>
      <SitesClient />
    </>
  )
}
