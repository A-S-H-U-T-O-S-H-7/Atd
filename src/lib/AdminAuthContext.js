"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'

const AdminAuthContext = createContext()

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)
  
  // Initialize on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('adminToken')
          const storedUser = localStorage.getItem('adminUser')
          const storedTheme = localStorage.getItem('adminTheme')
          
          if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
          }
          
          setIsDark(storedTheme === 'dark')
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (userData, authToken) => {
    try {
      setUser(userData)
      setToken(authToken)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', authToken)
        localStorage.setItem('adminUser', JSON.stringify(userData))
      }
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await fetch('https://live.atdmoney.com/api/crm/logout', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      forceLogout()
    }
  }

  // Force logout without API call (used by interceptor)
  const forceLogout = () => {
    setUser(null)
    setToken(null)
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminTheme', newTheme ? 'dark' : 'light')
    }
  }

  // Update token (used by interceptor after successful refresh)
  const updateToken = (newToken) => {
    setToken(newToken)
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', newToken)
    }
  }

  const value = {
    user,
    token,
    loading,
    isDark,
    login,
    logout,
    forceLogout,
    toggleTheme,
    updateToken,
    isAuthenticated: !!user && !!token
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}