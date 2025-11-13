import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  
  const base = "px-4 py-2 rounded-xl font-medium transition-all duration-200";
  const linkClass = ({ isActive }) =>
    isActive 
      ? `${base} bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg` 
      : `${base} text-gray-700 hover:bg-gray-100 hover:shadow-md`;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4v4H3V7z" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Villanova Parking
            </div>
            {user && (
              <div className="text-xs text-gray-500">
                {user.isGuest ? 'Guest Mode' : `Welcome, ${user.name || user.universityId}`}
              </div>
            )}
          </div>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          <nav className="flex gap-2">
            <NavLink to="/maps" className={linkClass}>Maps</NavLink>
            <NavLink to="/resources" className={linkClass}>Resources</NavLink>
            <NavLink to="/settings" className={linkClass}>Settings</NavLink>
          </nav>
          
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
