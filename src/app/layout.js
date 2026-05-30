import './globals.css'
import { ModeProvider } from '@/lib/modes'
import Sidebar from '@/components/Sidebar'

export const metadata = {
  title: 'Maya Glyphs — Traductor de Jeroglíficos Mayas',
  description: 'Silabario interactivo, diccionario y transliterador de jeroglíficos mayas basado en datos epigráficos verificados.',
  manifest: '/manifest.json',
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
        <ModeProvider>
          <Sidebar />
          <main className="md:ml-14 pb-16 md:pb-0">
            {children}
          </main>
        </ModeProvider>
      </body>
    </html>
  )
}
