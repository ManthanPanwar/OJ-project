import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Problems from './pages/Problems';
import CreateProblem from './pages/CreateProblem';
import Profile from './pages/Profile';
import Compiler from './pages/Compiler';
import Register from './pages/Register';
import Login from './pages/Login';
import Problem from './pages/Problem';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto py-4">
            <Routes>
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              {/* <Route path="/" element={<Problems />} /> */}
              <Route path="/problems" element={<Problems />} />
              <Route path="/problems/:id" element={<Problem />} />
              <Route path="/create-problem" element={<CreateProblem />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/compiler" element={<Compiler />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
