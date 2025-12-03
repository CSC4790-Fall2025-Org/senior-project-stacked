// Updated App.jsx - Add the carpool route
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import Carpool from "./pages/Carpool";
import NavBar from "./components/NavBar";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function Shell() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/maps" replace />;
  }
  
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

      {/* Protected routes with app shell */}
      <Route 
        element={
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/maps" replace />} />
        <Route path="/maps" element={<Dashboard />} />
        <Route path="/carpool" element={<Carpool />} />  {/* ROUTE */}
        <Route path="/resources" element={<Resources />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}