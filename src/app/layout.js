import './globals.css'
import { LangProvider } from '@/lib/lang'
import Sidebar from '@/components/Sidebar'
import ServiceWorker from '@/components/ServiceWorker'

export const metadata = {
  title: 'Maya Glyphs — Traductor de Jeroglíficos Mayas',
  description: 'Silabario interactivo, diccionario y transliterador de jeroglíficos mayas basado en datos epigráficos verificados.',
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
