// src/pages/Settings.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(true);

  // If no user yet (not logged in)
  if (!user) {
    return (
      <div className="min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <p className="text-gray-600">
          You are not logged in. Please log in to see your profile information.
        </p>
      </div>
    );
  }

  // Map DB fields to what the UI expects
  const displayUser = {
    name: `${user.first_name} ${user.last_name}`,
    villanovaId: user.university_id,
    email: user.email,
    permitType: user.vehicle?.permit_type || "Not set",
    vehicle: {
      make: user.vehicle?.make || "Unknown",
      model: user.vehicle?.model || "",
      year: "", // no year in DB, so leave blank or hardcode if needed
      plate: user.vehicle?.license_plate || "Not set",
    },
    // No ticket data yet, so placeholders
    ticketNumber: "N/A",
    ticketStatus: "N/A",
  };

  return (
    <div className="min-h-[60vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your profile, vehicles, and parking preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowProfile((prev) => !prev)}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          {showProfile ? "Hide Profile" : "View Profile"}
        </button>
      </div>

      {/* Profile Card */}
      {showProfile && (
        <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            {/* Avatar circle */}
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xl">
              {displayUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold">{displayUser.name}</h2>
              <p className="text-gray-600 text-sm">
                Villanova ID:{" "}
                <span className="font-mono">{displayUser.villanovaId}</span>
              </p>
              <p className="text-gray-600 text-sm">{displayUser.email}</p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {displayUser.permitType}
              </span>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
                onClick={() => alert("Profile editing coming soon")}
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ticket info (placeholder for now) */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Latest Ticket
              </h3>
              <p className="text-sm text-gray-600">
                Ticket #:{" "}
                <span className="font-mono">{displayUser.ticketNumber}</span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-50 text-gray-700">
                  {displayUser.ticketStatus}
                </span>
              </div>
              <button
                type="button"
                className="mt-3 text-sm text-blue-600 hover:underline"
                onClick={() => alert("Ticket history coming soon")}
              >
                View ticket history
              </button>
            </div>

            {/* Vehicle info */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Vehicle Information
              </h3>
              <p className="text-sm text-gray-600">
                {displayUser.vehicle.year
                  ? `${displayUser.vehicle.year} `
                  : ""}
                {displayUser.vehicle.make} {displayUser.vehicle.model}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                License Plate:{" "}
                <span className="font-mono">{displayUser.vehicle.plate}</span>
              </p>
              <button
                type="button"
                className="mt-3 text-sm text-blue-600 hover:underline"
                onClick={() => alert("Vehicle management coming soon")}
              >
                Manage vehicles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for future settings sections */}
      <div className="mt-8 space-y-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow p-4">


        </div>
      </div>
    </div>
  );
}
