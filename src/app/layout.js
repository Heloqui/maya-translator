import './globals.css'
import { LangProvider } from '@/lib/lang'
import Sidebar from '@/components/Sidebar'
import ServiceWorker from '@/components/ServiceWorker'

export const metadata = {
  title: {
    default: 'Maya Glyphs — Traductor de Jeroglíficos Mayas',
    template: '%s | Maya Glyphs',
  },
  description: 'Traductor interactivo de jeroglíficos mayas con silabario, diccionario de 300+ palabras, 20 inscripciones reales, mapa arqueológico y quiz. Basado en datos epigráficos verificados.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Maya Glyphs',
  },
  openGraph: {
    title: 'Maya Glyphs — Traductor de Jeroglíficos Mayas',
    description: 'Silabario interactivo, diccionario, inscripciones con lectura bloque a bloque, mapa arqueológico y quiz. Sin alucinaciones — datos epigráficos verificados.',
    url: 'https://maya-translator.vercel.app',
    siteName: 'Maya Glyphs',
    locale: 'es_MX',
    type: 'website',
    images: [
      {
        url: '/icons/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Maya Glyphs',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Maya Glyphs — Traductor de Jeroglíficos Mayas',
    description: 'Traductor interactivo de jeroglíficos mayas. Silabario, diccionario, inscripciones y mapa arqueológico.',
    images: ['/icons/icon-512.png'],
  },
  keywords: ['maya', 'hieroglyphs', 'translator', 'syllabary', 'dictionary', 'inscriptions', 'archaeology', 'mesoamerica', 'palenque', 'tikal', 'copan', 'jeroglíficos mayas', 'traductor maya', 'silabario maya', 'escritura maya'],
  authors: [{ name: 'Maya Glyphs' }],
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  themeColor: '#0f0f1e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-maya-bg text-maya-text antialiased">
        <LangProvider>
          <ServiceWorker />
          <Sidebar />
          <main className="md:ml-14 pb-16 md:pb-0">
            {children}
          </main>
        </LangProvider>
      </body>
    </html>
  )
}
