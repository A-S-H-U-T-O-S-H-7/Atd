"use client"
import React, { useEffect } from 'react'
import AdminHeader from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useAdminAuthStore } from '@/lib/store/authAdminStore'
import { useThemeStore } from '@/lib/store/useThemeStore'
import { useRouter } from 'next/navigation'
import TitleManager from './TitleManager'

const AdminLayout = ({ children }) => {
  const { theme } = useThemeStore();
  const { isAuthenticated, loading } = useAdminAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/crm");
    }
  }, [isAuthenticated, loading, router]); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <AdminHeader />
      <Sidebar />
      <main className="ml:0 md:ml-20 pt-20 min-h-screen">
        <div className="p-4">
          <TitleManager />
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;