import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SpotReservationModal({ lot, isOpen, onClose, onReserve }) {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState(null);

  // --- helper to build spots for ONE level ---
  const generateSpotDataForLevel = (level) => {
    const spotsPerLevel = 20;
    const spots = [];
    for (let i = 1; i <= spotsPerLevel; i++) {
      const spotNumber = `${level}${i.toString().padStart(2, "0")}`;
      const isAvailable = Math.random() > 0.3; // 70% available

      spots.push({
        number: spotNumber,
        level,
        spot: i,
        available: isAvailable,
        type: i <= 5 ? "handicap" : i <= 10 ? "compact" : "regular",
      });
    }
    return spots;
  };

  // 🔒 generate ALL levels' spots ONCE per mount
  const [spotsByLevel] = useState(() => {
    const levels = {};
    for (let level = 1; level <= 5; level++) {
      levels[level] = generateSpotDataForLevel(level);
    }
    return levels;
  });

  const spotData = spotsByLevel[selectedLevel];

  const handleReserve = () => {
    if (selectedSpot) {
      onReserve(lot, selectedSpot);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Reserve Parking Spot
                </h2>
                <p className="text-gray-600">{lot.name}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Level Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Select Level</h3>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      setSelectedLevel(level);
                      setSelectedSpot(null);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedLevel === level
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Level {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Spot Grid */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">
                  Available Spots - Level {selectedLevel}
                </h3>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded" />
                    <span>Occupied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded" />
                    <span>Selected</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {spotData.map((spot) => (
                  <motion.button
                    key={spot.number}
                    whileHover={spot.available ? { scale: 1.1 } : {}}
                    whileTap={spot.available ? { scale: 0.95 } : {}}
                    onClick={() => spot.available && setSelectedSpot(spot)}
                    disabled={!spot.available}
                    className={`
                      aspect-square rounded-lg font-bold text-xs flex flex-col items-center justify-center p-1 transition-all
                      ${
                        spot.available
                          ? selectedSpot?.number === spot.number
                            ? "bg-blue-500 text-white shadow-lg border-2 border-blue-700"
                            : "bg-green-500 text-white hover:bg-green-600 hover:shadow-md"
                          : "bg-red-500 text-white cursor-not-allowed opacity-60"
                      }
                    `}
                  >
                    <span>{spot.number}</span>
                    {spot.type === "handicap" && (
                      <svg
                        className="w-3 h-3 mt-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected Spot Info */}
            {selectedSpot && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              >
                <h4 className="font-semibold text-blue-800 mb-2">
                  Selected Spot Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Spot Number:</span>
                    <span className="font-medium ml-2">
                      {selectedSpot.number}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Level:</span>
                    <span className="font-medium ml-2">
                      {selectedSpot.level}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium ml-2 capitalize">
                      {selectedSpot.type}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Position:</span>
                    <span className="font-medium ml-2">
                      Spot {selectedSpot.spot}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReserve}
                disabled={!selectedSpot}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedSpot
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {selectedSpot
                  ? `Reserve Spot ${selectedSpot.number}`
                  : "Select a spot"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
