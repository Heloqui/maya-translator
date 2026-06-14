import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'Discover your Maya birthday'
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
          background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 16 }}>🎂</div>
        <div style={{ fontSize: 52, fontWeight: 800, color: '#d4af37', marginBottom: 12, textAlign: 'center' }}>
          What day were you born in the Maya calendar?
        </div>
        <div style={{ fontSize: 26, color: '#a0a0b0', textAlign: 'center', maxWidth: 800 }}>
          Discover your Tzolk'in day sign and its sacred meaning
        </div>
        <div style={{ fontSize: 20, color: '#6b6b80', marginTop: 40 }}>
          mayaglyphs.app/birthday
        </div>
      </div>
    ),
    { ...size }
  )
}
