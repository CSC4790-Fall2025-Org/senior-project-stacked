import { NavLink } from "react-router-dom";

export default function NavBar() {
  const base = "px-4 py-2 rounded-xl font-medium";
  const linkClass = ({ isActive }) =>
    isActive ? `${base} bg-blue-600 text-white` : `${base} text-gray-700 hover:bg-gray-100`;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="text-lg font-bold">Villanova Parking</div>
        <nav className="flex gap-2">
          <NavLink to="/resources" className={linkClass}>Resources</NavLink>
          <NavLink to="/settings" className={linkClass}>Settings</NavLink>
          <NavLink to="/maps" className={linkClass}>Maps</NavLink>
        </nav>
      </div>
    </header>
  );
}
