// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:4000";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [universityId, setUniversityId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ universityId }),
      });

      if (!res.ok) {
        let msg = "Login failed";
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch (_) {}
        setError(msg);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Logged in user from backend:", data.user);

      // 🔥 Save user in global auth context
      login(data.user);

      // Go to maps after login
      navigate("/maps");
    } catch (err) {
      console.error("Network error:", err);
      setError("Could not reach the server. Is it running on port 4000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Villanova Parking Portal
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              University ID
            </label>
            <input
              type="text"
              value={universityId}
              onChange={(e) => setUniversityId(e.target.value)}
              placeholder="e.g. 02501362"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password (not validated yet)
            </label>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded p-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
}
