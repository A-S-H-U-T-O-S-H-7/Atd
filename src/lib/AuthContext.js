"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { TokenManager } from '@/utils/tokenManager';

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
    const tokenData = TokenManager.getToken();
    const token = tokenData.token;

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

      if (response.ok) {
        const result = await response.json();
        setUser(result.user || result.data || result);
      } else {
        TokenManager.clearAllTokens();
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      TokenManager.clearAllTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, token) => {
    try {
      TokenManager.setUserToken(token, userData);
      setUser(userData);
      setLoading(false);
      console.log("User logged in successfully:", userData);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const completeRegistration = async (token, userData) => {
    try {
      TokenManager.setUserToken(token, userData);
      setUser(userData);
      setLoading(false);
      console.log("Registration completed:", userData);
      return true;
    } catch (error) {
      console.error("Registration completion error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const tokenData = TokenManager.getToken();
      const token = tokenData.token;

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

      TokenManager.clearAllTokens();
    } catch (error) {
      console.warn("Error clearing tokens:", error);
    }

    setUser(null);
    setLoading(false);
  };

  const isAuthenticated = () => {
    return !!user;
  };

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};