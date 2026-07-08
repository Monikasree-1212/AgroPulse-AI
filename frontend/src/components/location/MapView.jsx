import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'

/* Fix default icon paths broken by bundlers */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize:   [25, 41],
  iconAnchor: [12, 41],
  popupAnchor:[1, -34],
  shadowSize: [41, 41],
})

const bestIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize:   [25, 41],
  iconAnchor: [12, 41],
  popupAnchor:[1, -34],
  shadowSize: [41, 41],
})

/* Recenter map when location changes */
function Recenter({ lat, lng }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng], map.getZoom()) }, [lat, lng, map])
  return null
}

export default function MapView({ userLocation, mandis }) {
  if (!userLocation) return null

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
           style={{ height: '420px' }}>
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <Recenter lat={userLocation.lat} lng={userLocation.lng} />

          <TileLayer
            attribution='? <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User location */}
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-sm font-semibold">Location Your Location<br />
                <span className="text-xs text-gray-500">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
              </div>
            </Popup>
          </Marker>

          {/* Accuracy circle */}
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={5000}
            pathOptions={{ color: '#16a34a', fillColor: '#16a34a', fillOpacity: 0.08, weight: 1.5 }}
          />

          {/* Mandi markers */}
          {mandis.map((m, i) => (
            <Marker
              key={m._id || i}
              position={[m.latitude, m.longitude]}
              icon={i === 0 ? bestIcon : new L.Icon.Default()}
            >
              <Popup>
                <div className="text-sm min-w-[160px]">
                  <p className="font-extrabold text-gray-900 mb-1">{m.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{m.city}, {m.state}</p>
                  <div className="space-y-0.5 text-xs">
                    <p> <span className="font-semibold">{m.distance} km</span>  -  {m.travelTime}</p>
                    <p> Market Price: <span className="font-semibold text-green-600">Rs.{m.marketPrice}/kg</span></p>
                    <p> Transport: <span className="font-semibold text-orange-500">Rs.{m.transportCost.toLocaleString()}</span></p>
                    <p>? Profit: <span className={`font-semibold ${m.expectedProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      Rs.{m.expectedProfit.toLocaleString()}
                    </span></p>
                  </div>
                  {i === 0 && <p className="mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">Star Nearest</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  )
}
