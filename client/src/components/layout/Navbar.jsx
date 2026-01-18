import React, { useState } from 'react';
import { Link2, LogOut, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-90 transition"
          >
            <Link2 className="w-8 h-8" />
            <span className="text-2xl font-bold">ShortURL</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 hover:bg-white/20 rounded-lg transition"
                >
                  Dashboard
                </Link>
                <span className="text-sm">Welcome, {user.userName}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 hover:bg-white/20 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/registration"
                  className="px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 rounded-lg transition font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-white/20 rounded-lg transition"
                >
                  Dashboard
                </Link>
                <div className="px-4 py-2 text-sm">Welcome, {user.userName}</div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-white/20 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-white/20 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/registration"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-white/20 rounded-lg transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar