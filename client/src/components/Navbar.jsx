import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="text-xl font-bold">
            OJ Platform
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/problems"
                  className="hover:text-gray-300 px-3 py-2 rounded-md"
                >
                  Problems
                </Link>
                <Link
                  to="/create-problem"
                  className="hover:text-gray-300 px-3 py-2 rounded-md"
                >
                  Create Problem
                </Link>
                <Link
                  to="/compiler"
                  className="hover:text-gray-300 px-3 py-2 rounded-md"
                >
                  Compiler
                </Link>
                <Link
                  to="/profile"
                  className="hover:text-gray-300 px-3 py-2 rounded-md"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-gray-300 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 