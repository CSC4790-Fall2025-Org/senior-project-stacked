// src/components/ReservationPanel.jsx
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function ReservationPanel({ lot, reservedSpot, progress, setProgress, onCancel }) {
  if (!lot) return null

  const [floor] = useState(() => Math.ceil(Math.random() * 5))
  const [countdown, setCountdown] = useState(300) // 5 minutes (in seconds)
  const [arrived, setArrived] = useState(false)

  // Simulate "driving" toward the parking lot
  useEffect(() => {
    if (progress < 100) {
      const timer = setInterval(() => setProgress((p) => p + 5), 500)
      return () => clearInterval(timer)
    } else {
      setArrived(true)
    }
  }, [progress, setProgress])

  // Start hold countdown after arrival
  useEffect(() => {
    if (arrived && countdown > 0) {
      const interval = setInterval(() => setCountdown((c) => c - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [arrived, countdown])

  // prevent negative timer display
  const safeCountdown = countdown > 0 ? countdown : 0
  const minutes = Math.floor(safeCountdown / 60)
  const seconds = (safeCountdown % 60).toString().padStart(2, "0")

  return (
    <AnimatePresence>
      <motion.div
        key="panel"
        // Slide-up animation for navigation feel
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        // floating card styling
        className="fixed bottom-4 right-4 bg-white/95 rounded-xl shadow-2xl border border-gray-200 p-4 w-80 z-[9999]"
        style={{ pointerEvents: "auto" }}
      >
        <h2 className="font-bold text-lg mb-2">Navigation</h2>

        {/* basic lot info */}
        <p className="text-gray-700">
          <b>Lot:</b> {lot.name}
        </p>
        {reservedSpot ? (
          <>
            <p className="text-gray-700">
              <b>Reserved Spot:</b> {reservedSpot.number}
            </p>
            <p className="text-gray-700">
              <b>Level:</b> {reservedSpot.level}
            </p>
            <p className="text-gray-700">
              <b>Spot Type:</b> {reservedSpot.type}
            </p>
          </>
        ) : (
          <p className="text-gray-700">
            <b>Assigned Floor:</b> {floor}
          </p>
        )}

        {/* dynamic content based on arrival */}
        {!arrived ? (
          <>
            <p className="mt-2 text-gray-600">Driving to lot...</p>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Progress: {progress.toFixed(0)}%
            </p>
          </>
        ) : (
          <>
            <p className="mt-3 text-green-600 font-medium">Arrived!</p>
            <p className="text-sm text-gray-700 mt-1">
              Hold expires in {minutes}:{seconds}
            </p>
          </>
        )}

        {/* cancel button */}
        <button
          onClick={onCancel}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Cancel Hold
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
