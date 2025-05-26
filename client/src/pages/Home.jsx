import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authServices from '../services/authServices';
const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate();

  // Function to check if the session is still valid
  const checkSession = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users/me", {
        withCredentials: true,
      });
      if (res.data.success && res.data.user) {
        setLoggedInUser(res.data.user.username);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Session check failed:", error);
      return false;
    }
  };

  // Run on initial mount to verify session
  useEffect(() => {
    const verify = async () => {
      const isValid = await checkSession();
      if (!isValid) {
        localStorage.removeItem('loggedInUser');
        setLoggedInUser('');
        navigate('/login');
      }
    };
    verify();
  }, [navigate]);

  // Logout handler
  const handleLogout = async () => {
    try {
      const res = await authServices.logout();

      const { success, message } = res.data;
      if (success) {
        toast.success(message);
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('token');
        setLoggedInUser('');
        navigate('/login');
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Welcome, {loggedInUser || 'Guest'}!
        </h1>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
