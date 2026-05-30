'use client'
import { useEffect, useState } from 'react'
import { useLang } from '@/lib/lang'
import SiteCard from './SiteCard'

export default function SiteMap({ sites }) {
  const [MapContainer, setMapContainer] = useState(null)
  const { lang } = useLang()

  useEffect(() => {
    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
    ]).then(([L, RL]) => {
      delete L.default.Icon.Default.prototype._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
      setMapContainer(() => RL)
    })
  }, [])

  if (!MapContainer) {
    return (
      <div className="w-full h-[500px] bg-maya-surface rounded-xl flex items-center justify-center border border-maya-border">
        <span className="text-maya-muted text-sm">Loading map...</span>
      </div>
    )
  }

  const { MapContainer: MC, TileLayer, Marker, Popup } = MapContainer

  const center = [17.5, -89.5]

  return (
    <div className="relative">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <MC
        center={center}
        zoom={6}
        className="w-full h-[500px] rounded-xl border border-maya-border z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sites.map(site => (
          <Marker
            key={site.id}
            position={[site.coordinates.lat, site.coordinates.lng]}
          >
            <Popup maxWidth={320} minWidth={280}>
              <SiteCard site={site} />
            </Popup>
          </Marker>
        ))}
      </MC>
    </div>
  )
}
