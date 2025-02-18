import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavUser } from "./NavUser";
import { BookMarked, House } from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();

  if (location.pathname == "/auth" || location.pathname == "/") {
    return null;
  }

  return (
    <nav className="bg-gray-50 p-4 h-24 flex justify-center shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo ou titre */}
        <div className="text-white text-2xl font-bold">
          <Link to="/classroom">
            <img src="/BookingClassroom.webp" className="h-16" />
          </Link>
        </div>

        {/* Onglet réservations */}
        <div className="flex items-center space-x-6">
          <Link
            to="/classroom"
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <House className="h-4 mr-1" />
            Les salles
          </Link>
          <Link
            to="/my-reservations"
            className="flex items-center text-gray-700 hover:text-gray-900 pr-12"
          >
            <BookMarked className="h-4 mr-1" />
            Mes réservations
          </Link>
          <NavUser />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
