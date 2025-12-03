// src/components/CreateRideModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateRideModal({ isOpen, onClose, onCreate }) {
  const [rideType, setRideType] = useState("offering");
  const [formData, setFormData] = useState({
    destination: "",
    date: "",
    time: "",
    seats: 3,
    passengers: 1,
    price: "",
    maxPrice: "",
    notes: "",
    preferences: [],
  });

  const preferenceOptions = [
    "No smoking",
    "Music OK",
    "Quiet ride preferred",
    "Pet-friendly",
    "Luggage space",
    "Can help with gas",
    "Flexible on time",
    "Highway route",
  ];

  const popularDestinations = [
    "Philadelphia, PA",
    "New York City, NY",
    "Boston, MA",
    "Washington D.C.",
    "Pittsburgh, PA",
    "Baltimore, MD",
    "Newark, NJ",
    "Harrisburg, PA",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRide = {
      type: rideType,
      origin: "Villanova University",
      destination: formData.destination,
      date: formData.date,
      time: formData.time,
      notes: formData.notes,
      preferences: formData.preferences,
      ...(rideType === "offering"
        ? {
            driver: {
              name: "You",
              rating: 5.0,
              trips: 0,
              avatar: null,
              verified: true,
            },
            seats: formData.seats,
            seatsAvailable: formData.seats,
            price: parseFloat(formData.price),
            passengers: [],
          }
        : {
            requester: {
              name: "You",
              rating: 5.0,
              trips: 0,
              avatar: null,
              verified: true,
            },
            passengers: formData.passengers,
            maxPrice: parseFloat(formData.maxPrice),
          }),
    };

    onCreate(newRide);
    
    // Reset form
    setFormData({
      destination: "",
      date: "",
      time: "",
      seats: 3,
      passengers: 1,
      price: "",
      maxPrice: "",
      notes: "",
      preferences: [],
    });
    setRideType("offering");
  };

  const togglePreference = (pref) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Post a Ride</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
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

            {/* Ride Type Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mt-4">
              <button
                onClick={() => setRideType("offering")}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center ${
                  rideType === "offering"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4"
                  />
                </svg>
                Offering a Ride
              </button>
              <button
                onClick={() => setRideType("requesting")}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center ${
                  rideType === "requesting"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 17l-4 4m0 0l-4-4m4 4V3"
                  />
                </svg>
                Looking for Ride
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                placeholder="Where are you heading?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                list="destinations"
              />
              <datalist id="destinations">
                {popularDestinations.map((dest) => (
                  <option key={dest} value={dest} />
                ))}
              </datalist>
              <div className="flex flex-wrap gap-2 mt-2">
                {popularDestinations.slice(0, 4).map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, destination: dest })
                    }
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition"
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Seats or Passengers */}
            {rideType === "offering" ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Seats
                  </label>
                  <select
                    value={formData.seats}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seats: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "seat" : "seats"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Seat ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="25"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Passengers
                  </label>
                  <select
                    value={formData.passengers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passengers: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "person" : "people"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Budget per Person ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.maxPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, maxPrice: e.target.value })
                    }
                    placeholder="30"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferences (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {preferenceOptions.map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePreference(pref)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.preferences.includes(pref)
                        ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-300"
                        : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional details? (pickup location, stops along the way, etc.)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
              >
                Post Ride
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}