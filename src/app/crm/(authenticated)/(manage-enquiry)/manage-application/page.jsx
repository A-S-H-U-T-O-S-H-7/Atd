import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import ManageApplication from '@/components/Admin/manage-application/ManageApplication'
import React from 'react'

export const metadata = {
  title: 'Manage Applications - ATD Money',
};

function page() {
  return (
    <div>
    <ProtectedRoute requiredPermission="manage_application">
      <ManageApplication/>
      </ProtectedRoute>
    </div>
  )
}

export default page
