import { SITE_URL } from '@/lib/site'
import NameClient from './NameClient'

export const metadata = {
  title: 'Escribe tu Nombre en Jeroglíficos Mayas',
  description: 'Escribe cualquier nombre en glifos mayas usando el silabario fonético maya clásico. Descarga tu nombre como imagen.',
  alternates: { canonical: '/name' },
  openGraph: { url: `${SITE_URL}/name` },
}

export default function NamePage() {
  return <NameClient />
}
