"use client"
import { AdminAuthProvider } from "@/lib/AdminAuthContext";

export default function Layout({ children }) {
  return (
    <AdminAuthProvider>
        {children}
    </AdminAuthProvider>
  );
}