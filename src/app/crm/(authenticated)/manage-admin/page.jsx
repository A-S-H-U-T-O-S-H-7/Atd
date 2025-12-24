import ManageAdminPage from '@/components/Admin/manage-admin/Manage-Admin'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <div>
      {/* <ProtectedRoute requiredPermission="manage_admin"> */}
      <ManageAdminPage/>
      {/* </ProtectedRoute> */}
    </div>
  )
}

export default page
