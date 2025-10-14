"use client";
import React, { useEffect, useState } from 'react'
import { User, Lock, RefreshCw, Sun, Moon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useThemeStore } from '@/lib/store/useThemeStore'
import { useAdminAuthStore } from '@/lib/store/authAdminStore'


const AdminLogin = () => {

  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, loading, error, login } = useAdminAuthStore();
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/crm/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleLogin = (e) => {
    e.preventDefault();
    login({
      provider: 1,
      username: formData.username,
      password: formData.password
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${theme === "dark" ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full transition-colors duration-200 ${theme === "dark"
          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
          : 'bg-white hover:bg-gray-100 text-gray-600 shadow-lg border border-white/20'
          }`}
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-sm transition-colors duration-300 ${theme === "dark"
        ? 'bg-gray-800/90 border border-gray-700'
        : 'bg-white/90 border border-white/20'
        }`}>
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${theme === "dark" ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}>
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className={`mt-2 text-sm ${theme === "dark" ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to your CRM dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Username
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === "dark" ? 'text-gray-400' : 'text-gray-400'
                }`} />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${theme === "dark"
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === "dark" ? 'text-gray-400' : 'text-gray-400'
                }`} />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${theme === "dark"
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin