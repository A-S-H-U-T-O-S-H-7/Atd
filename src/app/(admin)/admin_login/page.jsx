import AdminLogin from "@/components/Admin/AdminLogin"
import { AdminAuthProvider } from '@/lib/AdminAuthContext'

export default function AdminLoginPage() {
  return (
    <AdminAuthProvider>
      <AdminLogin />
    </AdminAuthProvider>
  )
}