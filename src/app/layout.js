import './globals.css'

export const metadata = {
  title: 'Maya Glyphs — Traductor de Jeroglíficos Mayas',
  description: 'Silabario interactivo, diccionario y transliterador de jeroglíficos mayas basado en datos epigráficos verificados.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-maya-bg text-maya-text antialiased">
        {children}
      </body>
    </html>
  )
}
