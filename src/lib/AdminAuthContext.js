// lib/AdminAuthContext.js
"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [refreshTimer, setRefreshTimer] = useState(null);

  // Auto-refresh token before expiry
  const setupTokenRefresh = useCallback((authToken) => {
    // Clear existing timer
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }

    // Set up new timer - refresh every 50 minutes (assuming 60min token expiry)
    const timer = setTimeout(async () => {
      const success = await refreshToken();
      if (!success) {
        // If refresh fails, logout user
        await logout();
      }
    }, 50 * 60 * 1000); // 50 minutes

    setRefreshTimer(timer);
  }, [refreshTimer]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('authToken');
          const storedUser = localStorage.getItem('authUser');
          const storedTheme = localStorage.getItem('adminTheme');
          
          if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            
            // Verify token is still valid
            const isValid = await verifyToken(storedToken);
            if (isValid) {
              setupTokenRefresh(storedToken);
            } else {
              // Token expired, clear stored data
              localStorage.removeItem('authToken');
              localStorage.removeItem('authUser');
              setToken(null);
              setUser(null);
            }
          }
          
          if (storedTheme) {
            setIsDark(storedTheme === 'dark');
          } else {
            // Default to system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(prefersDark);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Cleanup timer on unmount
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, []);

  // System theme change listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const storedTheme = localStorage.getItem('adminTheme');
        if (!storedTheme) {
          setIsDark(e.matches);
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const verifyToken = async (authToken) => {
    try {
      const response = await fetch('https://api.atdmoney.in/api/crm/me', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.status === 401) {
        return false;
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  };

  const login = async (userData, authToken) => {
    try {
      setUser(userData);
      setToken(authToken);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('authUser', JSON.stringify(userData));
      }
      
      // Setup auto-refresh
      setupTokenRefresh(authToken);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear refresh timer
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        setRefreshTimer(null);
      }

      // Call logout API if token exists
      if (token) {
        await fetch('https://api.atdmoney.in/api/crm/logout', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear state regardless of API call success
      setUser(null);
      setToken(null);
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
  };

  const refreshToken = async () => {
    try {
      if (!token) return false;
      
      const response = await fetch('https://api.atdmoney.in/api/crm/refresh', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setToken(data.token);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', data.token);
        }
        
        // Setup next refresh
        setupTokenRefresh(data.token);
        
        // Fetch updated profile
        await fetchProfile(data.token);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const fetchProfile = async (authToken = token) => {
    try {
      if (!authToken) return false;
      
      const response = await fetch('https://api.atdmoney.in/api/crm/me', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setUser(data.admin);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('authUser', JSON.stringify(data.admin));
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return false;
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminTheme', newTheme ? 'dark' : 'light');
    }
  };

  // API call wrapper with automatic token refresh
  const apiCall = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        }
      });

      // If unauthorized, try to refresh token once
      if (response.status === 401) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry the original request with new token
          return fetch(url, {
            ...options,
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              ...options.headers
            }
          });
        } else {
          // Refresh failed, logout user
          await logout();
          return response;
        }
      }

      return response;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    isDark,
    login,
    logout,
    refreshToken,
    fetchProfile,
    toggleTheme,
    apiCall,
    isAuthenticated: !!user && !!token
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};