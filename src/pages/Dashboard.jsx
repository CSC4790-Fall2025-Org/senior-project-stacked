import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParkingMap from "../components/ParkingMap";
import ReservationPanel from "../components/ReservationPanel";
import SpotReservationModal from "../components/SpotReservationModal";
import LeavingSpotModal from "../components/LeavingSpotModal";

function Dashboard() {
  const [selectedLot, setSelectedLot] = useState(null);
  const [activeReservation, setActiveReservation] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showLeavingModal, setShowLeavingModal] = useState(false);
  const [reservationLot, setReservationLot] = useState(null);
  const [reservedSpot, setReservedSpot] = useState(null);

  // shared progress state for navigation + car marker
  const [progress, setProgress] = useState(0);

  // mock lot data with more spots
  const [lots, setLots] = useState([
    { id: 1, name: "I-1 Garage", spots: 45, coords: [40.032951, -75.340073] },
    { id: 2, name: "S-4 North Campus", spots: 23, coords: [40.038732, -75.340054] },
  ]);

  // helper for color coding
  const getStatus = (spots) => {
    if (spots >= 15) return { color: "bg-green-500", label: "Guaranteed" };
    if (spots >= 5) return { color: "bg-yellow-400", label: "Likely" };
    if (spots >= 1) return { color: "bg-orange-400", label: "Limited" };
    return { color: "bg-red-500", label: "Full" };
  };

  const openReservationModal = (lot) => {
    setReservationLot(lot);
    setShowReservationModal(true);
  };

  // reserve handler with specific spot
  const handleReserveSpot = (lot, spot) => {
    setLots((prevLots) =>
      prevLots.map((l) =>
        l.id === lot.id && l.spots > 0 ? { ...l, spots: l.spots - 1 } : l
      )
    );
    setSelectedLot(lot);
    setReservedSpot(spot);
    setActiveReservation({ ...lot, reservedSpot: spot });
    setProgress(0);
  };

  // cancel handler: restores spot + stops navigation
  const handleCancelReservation = (lotId) => {
    setLots((prevLots) =>
      prevLots.map((lot) =>
        lot.id === lotId ? { ...lot, spots: lot.spots + 1 } : lot
      )
    );
    setActiveReservation(null);
    setReservedSpot(null);
    setProgress(0);
  };

  // handle posting available spot
  const handlePostSpot = (lotId, spotNumber) => {
    setLots((prevLots) =>
      prevLots.map((lot) =>
        lot.id === parseInt(lotId) ? { ...lot, spots: lot.spots + 1 } : lot
      )
    );
    // You could also show a success message here
  }; 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-8">
        {/* Header with Post Navigation Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Available Parking Lots</h1>
            <p className="text-gray-600">Find and reserve your perfect parking spot</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLeavingModal(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Leaving? Post Your Spot</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Available</p>
                <p className="text-2xl font-bold text-gray-800">{lots.reduce((sum, lot) => sum + lot.spots, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Lots</p>
                <p className="text-2xl font-bold text-gray-800">{lots.filter(lot => lot.spots > 0).length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reserved</p>
                <p className="text-2xl font-bold text-gray-800">{activeReservation ? '1' : '0'}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Lot cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {lots.map((lot, index) => {
              const status = getStatus(lot.spots);
              return (
                <motion.div
                  key={lot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  onClick={() => setSelectedLot(lot)}
                  className="bg-white p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl transition-all border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-1">{lot.name}</h2>
                      <p className="text-gray-600 text-sm">Available spots: {lot.spots}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 text-white text-xs font-semibold rounded-full ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      On Campus
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      24/7 Access
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className={`h-2 rounded-full transition-all ${status.color}`}
                      style={{ width: `${Math.max((lot.spots / 50) * 100, 5)}%` }}
                    ></div>
                  </div>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      openReservationModal(lot);
                    }}
                    disabled={lot.spots === 0}
                    whileHover={lot.spots > 0 ? { scale: 1.02 } : {}}
                    whileTap={lot.spots > 0 ? { scale: 0.98 } : {}}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      lot.spots === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {lot.spots === 0 ? "Full" : "Reserve Specific Spot"}
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Interactive map with car animation */}
        <ParkingMap lots={lots} selectedLot={selectedLot} progress={progress} />
      </div>

      {/* Modals */}
      <SpotReservationModal
        lot={reservationLot}
        isOpen={showReservationModal}
        onClose={() => {
          setShowReservationModal(false);
          setReservationLot(null);
        }}
        onReserve={handleReserveSpot}
      />

      <LeavingSpotModal
        isOpen={showLeavingModal}
        onClose={() => setShowLeavingModal(false)}
        onPost={handlePostSpot}
        lots={lots}
      />

      {/* Navigation + countdown panel */}
      {activeReservation && (
        <ReservationPanel
          lot={activeReservation}
          reservedSpot={reservedSpot}
          progress={progress}
          setProgress={setProgress}
          onCancel={() => handleCancelReservation(activeReservation.id)}
        />
      )}
    </div>
  );
}

export default Dashboard
