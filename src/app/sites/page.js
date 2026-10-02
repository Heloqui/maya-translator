import { SITE_URL } from '@/lib/site'
import SitesClient from './SitesClient'

export const metadata = {
  title: 'Sitios Arqueológicos Mayas — Mapa de 20 Ciudades Clásicas',
  description: 'Mapa interactivo de 20 sitios arqueológicos mayas: Palenque, Tikal, Copán, Calakmul, Yaxchilán, Quiriguá y más. Con coordenadas, dinastías y gobernantes históricos.',
  alternates: { canonical: '/sites' },
  openGraph: { url: `${SITE_URL}/sites` },
}

export default function SitesPage() {
  return <SitesClient />
}
