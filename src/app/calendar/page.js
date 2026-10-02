import { SITE_URL } from '@/lib/site'
import CalendarClient from './CalendarClient'

export const metadata = {
  title: "Calendario Maya — Long Count, Tzolk'in y Haab'",
  description: "Convierte cualquier fecha al calendario maya: Cuenta Larga, Tzolk'in (260 días) y Haab' (365 días). Basado en la correlación GMT estándar (584283).",
  alternates: { canonical: '/calendar' },
  openGraph: { url: `${SITE_URL}/calendar` },
}

export default function CalendarPage() {
  return <CalendarClient />
}
