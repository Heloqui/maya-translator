import { SITE_URL } from '@/lib/site'
import BirthdayClient from './BirthdayClient'

export const metadata = {
  title: "Tu Cumpleaños Maya — Día Tzolk'in y Signo Solar",
  description: "Descubre tu día Tzolk'in maya: tu signo solar, número del destino y su significado según el calendario sagrado de 260 días.",
  alternates: { canonical: '/birthday' },
  openGraph: { url: `${SITE_URL}/birthday` },
}

export default function BirthdayPage() {
  return <BirthdayClient />
}
