// src/pages/Dashboard.jsx
import { useState } from "react"
import ParkingMap from "../components/ParkingMap"
import ReservationPanel from "../components/ReservationPanel"

function Dashboard() {
  const [selectedLot, setSelectedLot] = useState(null)
  const [activeReservation, setActiveReservation] = useState(null)

  // shared progress state for navigation + car marker
  const [progress, setProgress] = useState(0)

  // mock lot data
  const [lots, setLots] = useState([
    { id: 1, name: "I-1 Garage", spots: 12, coords: [40.032951, -75.340073] },
    { id: 2, name: "S-4 North Campus", spots: 5, coords: [40.038732, -75.340054] },
  ])

  // helper for color coding
  const getStatus = (spots) => {
    if (spots >= 7) return { color: "bg-green-500", label: "Guaranteed" }
    if (spots >= 1) return { color: "bg-yellow-400", label: "Likely" }
    return { color: "bg-red-500", label: "Full" }
  }

  // reserve handler: starts navigation + deducts 1 spot
  const handleReserve = (lot) => {
    setLots((prevLots) =>
      prevLots.map((l) =>
        l.id === lot.id && l.spots > 0 ? { ...l, spots: l.spots - 1 } : l
      )
    )
    setSelectedLot(lot)
    setActiveReservation(lot)
    setProgress(0) // reset progress for new reservation
  }

  // cancel handler: restores spot + stops navigation
  const handleCancelReservation = (lotId) => {
    setLots((prevLots) =>
      prevLots.map((lot) =>
        lot.id === lotId ? { ...lot, spots: lot.spots + 1 } : lot
      )
    )
    setActiveReservation(null)
    setProgress(0) // reset when cancelled
  } 
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Available Parking Lots</h1>

      {/* Lot cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lots.map((lot) => {
          const status = getStatus(lot.spots)
          return (
            <div
              key={lot.id}
              onClick={() => setSelectedLot(lot)}
              className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
            >
              <h2 className="text-xl font-bold mb-2">{lot.name}</h2>
              <p className="text-gray-600 mb-2">Open spots: {lot.spots}</p>
              <span
                className={`inline-block px-3 py-1 text-white text-sm font-semibold rounded ${status.color}`}
              >
                {status.label}
              </span>

              {/* Reserve button triggers navigation simulation */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleReserve(lot)
                }}
                disabled={lot.spots === 0}
                className={`mt-4 block w-full text-center py-2 rounded text-white font-semibold ${
                  lot.spots === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {lot.spots === 0 ? "Full" : "Reserve Spot"}
              </button>
            </div>
          )
        })}
      </div>

      {/* Interactive map with car animation */}
      <ParkingMap lots={lots} selectedLot={selectedLot} progress={progress} />

      {/* Navigation + countdown panel */}
      {activeReservation && (
        <ReservationPanel
          lot={activeReservation}
          progress={progress}
          setProgress={setProgress}
          onCancel={() => handleCancelReservation(activeReservation.id)}
        />
      )}
    </div>
  )
}

export default Dashboard
