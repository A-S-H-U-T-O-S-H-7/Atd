"use client";
import AdminLayout from "@/components/Admin/AdminLayout";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { Toaster } from 'react-hot-toast';


export default function CRMLayout({ children }) {
  const { theme } = useThemeStore();
    const isDark = theme === "dark";
  return (
    <AdminLayout>
      {children}
      <Toaster 
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      background: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#f9fafb' : '#111827',
    },
  }}
/>
    </AdminLayout>
  );
}
