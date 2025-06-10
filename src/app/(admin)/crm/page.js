"use client"
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved theme
    const savedTheme = JSON.parse(localStorage.getItem('theme') || 'false');
    setIsDark(savedTheme);

    // Check for saved auth
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', JSON.stringify(newTheme));
  };

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      {user ? (
        <Dashboard 
          user={user}
          token={token}
          isDark={isDark}
          toggleTheme={toggleTheme}
          onLogout={handleLogout}
        />
      ) : (
        <LoginForm 
          isDark={isDark}
          toggleTheme={toggleTheme}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default App;