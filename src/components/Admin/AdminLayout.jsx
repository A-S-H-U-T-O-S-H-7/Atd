"use client"
import React from 'react'
import { useAdminAuth } from '@/lib/AdminAuthContext'
import AdminLogin from './AdminLogin'
import AdminHeader from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

const AdminLayout = ({ children }) => {
  const { isAuthenticated, loading, isDark } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <AdminHeader />
      <Sidebar />
      <main className=" ml:0 md:ml-20 pt-20 min-h-screen">
        <div className="p-4">
          {children}
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default AdminLayout