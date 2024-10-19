import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import MyCalendar from './components/Calendar';
import Navbar from './components/Navbar';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {

          await axios.get('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);


  const ProtectedRoute = ({ element }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      { isAuthenticated && <Navbar /> }
      <div className="page-content"> 
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<ProtectedRoute element={<Logout setIsAuthenticated={setIsAuthenticated} />} />} />
          <Route path="/calendar" element={<ProtectedRoute element={<MyCalendar />} />} />
          <Route path="*" element={<Navigate to="/calendar" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

