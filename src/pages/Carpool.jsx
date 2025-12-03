// src/pages/Carpool.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateRideModal from "../components/CreateRideModal";
import RideCard from "../components/RideCard";
import RideDetailModal from "../components/RideDetailModal";

export default function Carpool() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [filter, setFilter] = useState("all"); // all, offering, requesting
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Mock ride data - in production this would come from a backend
  const [rides, setRides] = useState([
    {
      id: 1,
      type: "offering",
      driver: {
        name: "Sarah M.",
        rating: 4.8,
        trips: 12,
        avatar: null,
        verified: true,
      },
      origin: "Villanova University",
      destination: "Boston, MA",
      date: "2025-01-15",
      time: "08:00",
      seats: 3,
      seatsAvailable: 2,
      price: 45,
      notes: "Leaving right after my 8am final. Happy to make stops along I-95.",
      preferences: ["No smoking", "Music OK", "Luggage space"],
      passengers: [{ name: "Mike R.", avatar: null }],
    },
    {
      id: 2,
      type: "offering",
      driver: {
        name: "James K.",
        rating: 4.9,
        trips: 28,
        avatar: null,
        verified: true,
      },
      origin: "Villanova University",
      destination: "Philadelphia, PA",
      date: "2025-01-10",
      time: "17:30",
      seats: 4,
      seatsAvailable: 3,
      price: 10,
      notes: "Quick trip to Center City. Can drop off at 30th Street Station.",
      preferences: ["Quiet ride preferred"],
      passengers: [{ name: "Anna L.", avatar: null }],
    },
    {
      id: 3,
      type: "requesting",
      requester: {
        name: "Emily C.",
        rating: 4.7,
        trips: 5,
        avatar: null,
        verified: true,
      },
      origin: "Villanova University",
      destination: "New York City, NY",
      date: "2025-01-12",
      time: "10:00",
      passengers: 1,
      maxPrice: 50,
      notes: "Flexible on exact time. Can meet anywhere on campus.",
      preferences: ["Can help with gas"],
    },
    {
      id: 4,
      type: "offering",
      driver: {
        name: "David P.",
        rating: 5.0,
        trips: 8,
        avatar: null,
        verified: true,
      },
      origin: "Villanova University",
      destination: "Pittsburgh, PA",
      date: "2025-01-14",
      time: "14:00",
      seats: 2,
      seatsAvailable: 2,
      price: 35,
      notes: "Taking the turnpike. ETA around 6pm.",
      preferences: ["Pet-friendly", "Snacks provided"],
      passengers: [],
    },
    {
      id: 5,
      type: "requesting",
      requester: {
        name: "Lisa W.",
        rating: 4.6,
        trips: 3,
        avatar: null,
        verified: false,
      },
      origin: "Villanova University",
      destination: "Washington D.C.",
      date: "2025-01-16",
      time: "09:00",
      passengers: 2,
      maxPrice: 40,
      notes: "Me and my roommate need a ride for the long weekend.",
      preferences: ["Will split gas evenly"],
    },
  ]);

  // Filter and search logic
  const filteredRides = rides.filter((ride) => {
    if (filter !== "all" && ride.type !== filter) return false;
    if (
      searchQuery &&
      !ride.destination.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (selectedDate && ride.date !== selectedDate) return false;
    return true;
  });

  const handleCreateRide = (newRide) => {
    setRides([{ ...newRide, id: Date.now() }, ...rides]);
    setShowCreateModal(false);
  };

  const handleViewDetails = (ride) => {
    setSelectedRide(ride);
    setShowDetailModal(true);
  };

  const handleJoinRide = (rideId) => {
    setRides(
      rides.map((ride) => {
        if (ride.id === rideId && ride.type === "offering") {
          return {
            ...ride,
            seatsAvailable: ride.seatsAvailable - 1,
            passengers: [...ride.passengers, { name: "You", avatar: null }],
          };
        }
        return ride;
      })
    );
    setShowDetailModal(false);
  };

  const stats = {
    totalRides: rides.length,
    offering: rides.filter((r) => r.type === "offering").length,
    requesting: rides.filter((r) => r.type === "requesting").length,
    seatsAvailable: rides
      .filter((r) => r.type === "offering")
      .reduce((sum, r) => sum + r.seatsAvailable, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Carpool Connect
            </h1>
            <p className="text-gray-600">
              Share rides with fellow Villanova students
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Post a Ride</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Rides</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalRides}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Offering Rides</p>
                <p className="text-2xl font-bold text-gray-800">{stats.offering}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Requesting Rides</p>
                <p className="text-2xl font-bold text-gray-800">{stats.requesting}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Seats Available</p>
                <p className="text-2xl font-bold text-gray-800">{stats.seatsAvailable}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { value: "all", label: "All" },
                { value: "offering", label: "Offering" },
                { value: "requesting", label: "Requesting" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === option.value
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {(searchQuery || selectedDate || filter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDate("");
                  setFilter("all");
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Ride Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRides.length > 0 ? (
              filteredRides.map((ride, index) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  index={index}
                  onViewDetails={() => handleViewDetails(ride)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-gray-500 text-lg">No rides found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your filters or post a new ride
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <CreateRideModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateRide}
      />

      <RideDetailModal
        isOpen={showDetailModal}
        ride={selectedRide}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedRide(null);
        }}
        onJoin={handleJoinRide}
      />
    </div>
  );
}