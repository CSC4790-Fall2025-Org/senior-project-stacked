// src/components/ParkingMap.jsx
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import { useEffect, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Car icon (small blue car)
const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743988.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

// helper to compute distance in miles (Haversine)
function haversineMiles([lat1, lon1], [lat2, lon2]) {
  const R = 3958.8 // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

// helper component to fly to a selected lot
function FlyToLot({ lot }) {
  const map = useMap()
  useEffect(() => {
    if (lot) {
      map.flyTo(lot.coords, 18, { duration: 1.5 })
    }
  }, [lot, map])
  return null
}

// New component to animate a moving car marker
function MovingCar({ start, end, progress }) {
  const [position, setPosition] = useState(start)

  useEffect(() => {
    if (!start || !end) return
    // Linear interpolation between start & end based on progress %
    const lat = start[0] + (end[0] - start[0]) * (progress / 100)
    const lon = start[1] + (end[1] - start[1]) * (progress / 100)
    setPosition([lat, lon])
  }, [progress, start, end])

  return <Marker position={position} icon={carIcon}></Marker>
}

export default function ParkingMap({ lots, selectedLot, progress = 0 }) {
  const [userLocation, setUserLocation] = useState([40.037, -75.339]) // default Villanova center

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude])
        },
        () => console.log("Geolocation blocked, using default Villanova coords")
      )
    }
  }, [])

  return (
    <div className="h-[500px] mt-6 rounded-lg overflow-hidden shadow-lg relative">
      <MapContainer
        center={userLocation}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }} // ensures overlays appear above map
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User marker */}
        <Marker position={userLocation}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Parking lot markers */}
        {lots.map((lot, idx) => {
          const distance = haversineMiles(userLocation, lot.coords).toFixed(2)
          const eta = ((distance / 3) * 60).toFixed(0) // walking ~3 mph

          return (
            <div key={idx}>
              <Marker position={lot.coords}>
                <Popup>
                  <b>{lot.name}</b> <br />
                  Distance: {distance} miles <br />
                  ETA: {eta} mins
                </Popup>
              </Marker>

              {/* Draw line from user to lot */}
              <Polyline positions={[userLocation, lot.coords]} color="blue" />
            </div>
          )
        })}

        {/* When a card is clicked, fly to that lot */}
        <FlyToLot lot={selectedLot} />

        {/* Moving car simulation */}
        {selectedLot && (
          <MovingCar
            start={userLocation}
            end={selectedLot.coords}
            progress={progress} // You can connect this dynamically
          />
        )}
      </MapContainer>
    </div>
  )
}
