"use client"
import { AdminAuthProvider } from "@/lib/AdminAuthContext"
import AdminLayout from "@/components/Admin/AdminLayout"

export default function CRMLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AdminAuthProvider>
  )
}