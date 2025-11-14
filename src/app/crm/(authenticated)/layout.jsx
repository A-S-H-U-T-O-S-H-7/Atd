"use client";
import AdminLayout from "@/components/Admin/AdminLayout";

export default function CRMLayout({ children }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
