import { SITE_URL } from '@/lib/site'
import MathClient from './MathClient'

export const metadata = {
  title: 'Matemáticas Mayas — Sistema Vigesimal y Numeración de Puntos y Barras',
  description: 'El sistema numérico maya en base 20 (vigesimal): puntos, barras y el símbolo del cero. Convierte números decimales al sistema de numeración de los antiguos mayas.',
  alternates: { canonical: '/math' },
  openGraph: { url: `${SITE_URL}/math` },
}

export default function MathPage() {
  return <MathClient />
}
