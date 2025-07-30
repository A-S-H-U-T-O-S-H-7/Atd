"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Create context with default values
const AuthContext = createContext({
  user: null,
  loading: true,
  fetchUserData: () => {},
  login: () => {},
  logout: () => {},
  completeRegistration: () => {},
  isAuthenticated: () => false
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    setLoading(true);

    let token;
    try {
      token = localStorage.getItem("token");
    } catch (error) {
      console.warn("Could not access localStorage:", error);
      setLoading(false);
      return;
    }

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ATD_API}/api/user/me`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("🔍 API Response Status:", response.status);

      if (response.ok) {
        const result = await response.json();

        setUser(result.user || result.data || result);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
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

  const completeRegistration = async (token, userData) => {
    try {
      localStorage.setItem("token", token);
      setUser(userData);
      setLoading(false);
      console.log("Registration completed:", userData);
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
            method: "POST",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`
            }
          });
        } catch (apiError) {
          console.warn("Logout API call failed:", apiError);
        }
      }

      localStorage.removeItem("token");
      localStorage.removeItem("showCongratulations");
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

// Fixed useAuth hook with proper error handling
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
