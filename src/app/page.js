import { getStats } from '@/lib/data'
import HomeClient from './HomeClient'

export const metadata = {
  title: 'Maya Glyphs — Traductor de Jeroglíficos Mayas',
  description: 'Traductor interactivo de jeroglíficos mayas con silabario, diccionario de 300+ palabras, 20 inscripciones reales, mapa arqueológico y quiz. Sin alucinaciones — datos epigráficos verificados.',
  alternates: { canonical: '/' },
}

export default function Home() {
  const stats = getStats()
  return <HomeClient stats={stats} />
}
