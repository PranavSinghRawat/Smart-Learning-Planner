import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudyPlanner from './pages/StudyPlanner';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sp_token');
    const userData = localStorage.getItem('sp_user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('sp_token', token);
    localStorage.setItem('sp_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('sp_token');
    localStorage.removeItem('sp_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0F766E, #06B6D4)' }}>
        <div className="w-10 h-10 rounded-full border-4 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login"    element={!isAuthenticated ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" replace />} />
        <Route path="/*"        element={isAuthenticated ? <StudyPlanner user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
