import ManageAdvocatePage from '@/components/Admin/advocate-management/Manage-Advocate'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="manage_advocate">
      <ManageAdvocatePage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
