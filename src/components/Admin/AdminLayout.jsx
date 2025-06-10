"use client"
import React from 'react';
import { useAdminAuth } from '../../lib/AdminAuthContext';
import AdminLogin from './AdminLogin';
import AdminHeader from './Header';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  const { isAuthenticated, loading, isDark } = useAdminAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className={isDark ? 'dark bg-gray-900' : 'bg-gray-50'}>
      <AdminHeader />
      <Sidebar />
      <main className="ml-16 lg:ml-64 pt-16">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;