// File: src/App.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import NavBar from "./components/NavBar";

function Shell() {
  return (
    <>
      <NavBar />
      <main className="max-w-7xl mx-auto px-6 py-6">
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* App shell with top navigation */}
      <Route element={<Shell />}>
        <Route path="/" element={<Navigate to="/maps" replace />} />
        <Route path="/maps" element={<Dashboard />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/maps" replace />} />
    </Routes>
  );
}
