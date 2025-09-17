// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<Login />} />

        {/* Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App