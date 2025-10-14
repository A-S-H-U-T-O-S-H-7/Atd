"use client";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Toaster } from "react-hot-toast";

export default function CRMLayout({ children }) {
  return (
    <AdminLayout>
      {children}
      <Toaster
        reverseOrder={false}
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { background: "#333", color: "#fff" }
        }}
      />
    </AdminLayout>
  );
}
