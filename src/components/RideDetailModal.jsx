// src/components/RideDetailModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RideDetailModal({ isOpen, ride, onClose, onJoin }) {
  const [message, setMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen || !ride) return null;

  const isOffering = ride.type === "offering";
  const person = isOffering ? ride.driver : ride.requester;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleJoin = () => {
    setShowConfirmation(true);
  };

  const confirmJoin = () => {
    onJoin(ride.id);
    setShowConfirmation(false);
    setMessage("");
  };

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
          {/* Header with gradient */}
          <div
            className={`p-6 ${
              isOffering
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-orange-500 to-amber-500"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-white/80 text-sm font-medium">
                  {isOffering ? "Ride Offered" : "Ride Requested"}
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {ride.destination}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition"
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

          <div className="p-6">
            {/* Driver/Requester Info */}
            <div className="flex items-center p-4 bg-gray-50 rounded-xl mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {person.name.charAt(0)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center">
                  <p className="font-bold text-gray-800 text-lg">
                    {person.name}
                  </p>
                  {person.verified && (
                    <svg
                      className="w-5 h-5 text-blue-500 ml-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex items-center mt-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-yellow-400 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">{person.rating}</span>
                    <span className="mx-2">·</span>
                    <span>{person.trips} trips completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Details */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Trip Details</h3>
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                  <div className="w-0.5 h-12 bg-gray-300"></div>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Pickup
                    </p>
                    <p className="font-medium text-gray-800">{ride.origin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Destination
                    </p>
                    <p className="font-medium text-gray-800">
                      {ride.destination}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Date, Time, Price Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <svg
                  className="w-6 h-6 text-indigo-600 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-semibold text-gray-800 text-sm">
                  {formatDate(ride.date).split(",")[0]}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <svg
                  className="w-6 h-6 text-green-600 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-gray-500">Time</p>
                <p className="font-semibold text-gray-800 text-sm">
                  {formatTime(ride.time)}
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <svg
                  className="w-6 h-6 text-purple-600 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-gray-500">
                  {isOffering ? "Price" : "Budget"}
                </p>
                <p className="font-semibold text-gray-800 text-sm">
                  ${isOffering ? ride.price : ride.maxPrice}
                </p>
              </div>
            </div>

            {/* Seats Info (for offerings) */}
            {isOffering && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Seats Available
                </h3>
                <div className="flex items-center space-x-2">
                  {[...Array(ride.seats)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        idx < ride.seats - ride.seatsAvailable
                          ? "bg-indigo-100"
                          : "bg-gray-100 border-2 border-dashed border-gray-300"
                      }`}
                    >
                      {idx < ride.seats - ride.seatsAvailable ? (
                        <svg
                          className="w-6 h-6 text-indigo-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      )}
                    </div>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {ride.seatsAvailable} of {ride.seats} available
                  </span>
                </div>

                {/* Current Passengers */}
                {ride.passengers && ride.passengers.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Current passengers:
                    </p>
                    <div className="flex space-x-2">
                      {ride.passengers.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                        >
                          <div className="w-6 h-6 bg-indigo-400 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                            {p.name.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-700">{p.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Preferences */}
            {ride.preferences && ride.preferences.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {ride.preferences.map((pref, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {ride.notes && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Additional Notes
                </h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">
                  {ride.notes}
                </p>
              </div>
            )}

            {/* Message Input */}
            {isOffering && ride.seatsAvailable > 0 && (
              <div className="mb-6">
                <label className="block font-semibold text-gray-800 mb-2">
                  Send a message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself or ask a question..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>

              {isOffering && ride.seatsAvailable > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleJoin}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition flex items-center justify-center"
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Request to Join
                </motion.button>
              )}

              {isOffering && ride.seatsAvailable === 0 && (
                <button
                  disabled
                  className="flex-1 py-3 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
                >
                  Ride Full
                </button>
              )}

              {!isOffering && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition flex items-center justify-center"
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Contact Requester
                </motion.button>
              )}
            </div>
          </div>

          {/* Confirmation Modal */}
          <AnimatePresence>
            {showConfirmation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-white rounded-xl p-6 m-4 max-w-sm"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Confirm Request
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You're requesting to join this ride to{" "}
                      <strong>{ride.destination}</strong> for{" "}
                      <strong>${ride.price}</strong>.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="flex-1 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmJoin}
                        className="flex-1 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}