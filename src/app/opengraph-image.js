import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'Maya Glyphs — Traductor de Jeroglíficos Mayas'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f0f1e',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: '#c9a84c',
            letterSpacing: '0.08em',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          MAYA GLYPHS
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#8888aa',
            textAlign: 'center',
            marginBottom: 28,
            letterSpacing: '0.02em',
          }}
        >
          Traductor de Jeroglíficos Mayas
        </div>
        <div
          style={{
            fontSize: 20,
            color: '#5a5a7a',
            textAlign: 'center',
            letterSpacing: '0.06em',
          }}
        >
          Silabario · Diccionario · Inscripciones · Calendario
        </div>
      </div>
    ),
    { ...size }
  )
}
