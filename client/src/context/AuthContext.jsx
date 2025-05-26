import React, { createContext, useState, useContext, useEffect } from "react";
import authServices from "../services/authServices";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (e.g., check localStorage or session)
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // You might want to fetch user data here
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      const res = await authServices.logout();

      const { success, message } = res.data;
      if (success) {
        toast.success(message);
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("token");
        // setLoggedInUser('');
        setUser(null);
        setIsAuthenticated(false);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    }
    // localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
