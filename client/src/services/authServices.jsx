// client/src/services/authService.js
import axios from 'axios';

// Ensure your backend API URL is correctly configured.
// If your frontend and backend are on different ports during development,
// ensure you have the proxy setup in client/package.json (for CRA)
// or vite.config.js (for Vite) to avoid CORS issues.
// Example: "proxy": "http://localhost:5000" in package.json
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/auth/`; // This uses the proxy

const register = (username, email, password) => {
  return axios.post(API_URL + 'register', {
    username,
    email,
    password,
  }, {withCredentials: true});
};

const login = (email, password) => {
  return axios.post(API_URL + 'login', {
    email,
    password,
  }, {withCredentials: true});
};

const logout = () => {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('token');
  return axios.post(API_URL + 'logout', {}, {withCredentials: true});
};

// You might add other auth-related service calls here later

export default {
  register,
  login,
  logout,
};