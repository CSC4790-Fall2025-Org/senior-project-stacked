import { useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    navigate("/dashboard") // redirect after login
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Villanova Parking Portal
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Villanova ID"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
