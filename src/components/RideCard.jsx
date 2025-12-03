// src/components/RideCard.jsx
import { motion } from "framer-motion";

export default function RideCard({ ride, index, onViewDetails }) {
  const isOffering = ride.type === "offering";
  const person = isOffering ? ride.driver : ride.requester;

  // Format date nicely
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Format time to 12-hour
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all"
    >
      {/* Type Banner */}
      <div
        className={`px-4 py-2 ${
          isOffering
            ? "bg-gradient-to-r from-green-500 to-emerald-500"
            : "bg-gradient-to-r from-orange-500 to-amber-500"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-semibold flex items-center">
            {isOffering ? (
              <>
                <svg
                  className="w-4 h-4 mr-1"
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
                Offering Ride
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Looking for Ride
              </>
            )}
          </span>
          {person.verified && (
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        {/* Driver/Requester Info */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {person.name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="font-semibold text-gray-800">{person.name}</p>
            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 text-yellow-400 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {person.rating} · {person.trips} trips
            </div>
          </div>
        </div>

        {/* Route */}
        <div className="mb-4">
          <div className="flex items-start">
            <div className="flex flex-col items-center mr-3">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <div className="w-0.5 h-8 bg-gray-300"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">From</p>
              <p className="font-medium text-gray-800 mb-2">{ride.origin}</p>
              <p className="text-sm text-gray-500">To</p>
              <p className="font-medium text-gray-800">{ride.destination}</p>
            </div>
          </div>
        </div>

        {/* Date, Time, Seats/Price */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm font-semibold text-gray-800">
              {formatDate(ride.date)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">Time</p>
            <p className="text-sm font-semibold text-gray-800">
              {formatTime(ride.time)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            {isOffering ? (
              <>
                <p className="text-xs text-gray-500">Seats</p>
                <p className="text-sm font-semibold text-gray-800">
                  {ride.seatsAvailable}/{ride.seats}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-500">Passengers</p>
                <p className="text-sm font-semibold text-gray-800">
                  {ride.passengers}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600 text-sm">
            {isOffering ? "Price per seat" : "Max budget"}
          </span>
          <span className="text-xl font-bold text-indigo-600">
            ${isOffering ? ride.price : ride.maxPrice}
          </span>
        </div>

        {/* Preferences Tags */}
        {ride.preferences && ride.preferences.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {ride.preferences.slice(0, 3).map((pref, idx) => (
              <span
                key={idx}
                className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full"
              >
                {pref}
              </span>
            ))}
          </div>
        )}

        {/* View Details Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewDetails}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            isOffering
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
              : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
          } shadow-lg hover:shadow-xl`}
        >
          {isOffering
            ? ride.seatsAvailable > 0
              ? "View & Join"
              : "View Details"
            : "View & Offer"}
        </motion.button>
      </div>
    </motion.div>
  );
}