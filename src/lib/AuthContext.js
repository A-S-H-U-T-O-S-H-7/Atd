"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    console.log('🔄 fetchUserData started');
    setLoading(true);
    
    let token;
    let tempUserData = null;
    let justRegistered = false;
    
    try {
      token = localStorage.getItem('token');
      justRegistered = localStorage.getItem('justRegistered') === 'true';
      console.log('📋 Local storage check:', { token: !!token, justRegistered });

      
      // Check if we have temporary user data from registration
      const tempUserDataStr = localStorage.getItem('tempUserData');
      if (tempUserDataStr) {
        try {
          tempUserData = JSON.parse(tempUserDataStr);
          console.log('📦 tempUserData found:', tempUserData);

        } catch (error) {
          console.warn('Could not parse temp user data:', error);
        }
      }
    } catch (error) {
      console.warn('Could not access localStorage:', error);
      setLoading(false);
      return;
    }

    // If we have temp user data from registration, use it immediately
    if (tempUserData && justRegistered) {
      console.log('✅ Using temporary user data from registration');
      setUser(tempUserData);
      setLoading(false); 
      localStorage.setItem('showCongratulations', 'true');

      try {
        localStorage.removeItem('justRegistered');
        localStorage.removeItem('tempUserData'); 
      } catch (error) {
        console.warn('Could not remove flags:', error);
      }
      return;
    }

    if (!token) {
      console.log('❌ No token found');

      setUser(null);
      setLoading(false);
      return;
    }
    console.log('🌐 Making API call...');

    // Remove unnecessary delay for fresh registrations
    // if (justRegistered) {
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    // }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/user/me`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('ME API Response:', result);
        
        if (result.user) {
          setUser(result.user);
        } else if (result.data) {
          setUser(result.data);
        } else {
          setUser(result);
        }
        
        // Clean up registration flags on successful fetch
        try {
          localStorage.removeItem('justRegistered');
        } catch (error) {
          console.warn('Could not remove justRegistered flag:', error);
        }
      } else {
        console.error('Failed to fetch user data:', response.status, response.statusText);
        
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('justRegistered');
        } catch (error) {
          console.warn('Could not remove items from localStorage:', error);
        }
        
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('justRegistered');
      } catch (storageError) {
        console.warn('Could not remove items from localStorage:', storageError);
      }
      
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Direct login function (for login flow)
  const login = async (userData, token) => {
    try {
      // Store token safely
      try {
        localStorage.setItem("token", token);
      } catch (error) {
        console.warn("Could not store token in localStorage:", error);
      }

      // Set user data directly from login response
      setUser(userData);
      setLoading(false);

      console.log("User logged in successfully:", userData);
      // localStorage.setItem('showCongratulations', 'true');

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const completeRegistration = async (token, userData = null) => {
    try {
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("justRegistered", "true");
        
        // Store user data temporarily if provided
        if (userData) {
          localStorage.setItem("tempUserData", JSON.stringify(userData));
        }
      } catch (error) {
        console.warn("Could not store data in localStorage:", error);
      }

      if (userData) {
        setUser(userData);
        setLoading(false);
        console.log("Registration completed with user data:", userData);
        return true;
      }

      // Otherwise fetch user data immediately
      await fetchUserData();
      return true;
    } catch (error) {
      console.error("Registration completion error:", error);
      return false;
    }
  };

 // Logout function
const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    
    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/user/logout`, {
          method: 'POST', 
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (apiError) {
        console.warn("Logout API call failed:", apiError);
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("showCongratulations");
    localStorage.removeItem("justRegistered");
    localStorage.removeItem("tempUserData");
  } catch (error) {
    console.warn("Could not remove items from localStorage:", error);
  }
  
  setUser(null);
  setLoading(false);
};

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Initialize on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        fetchUserData,
        login,
        logout,
        completeRegistration,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);