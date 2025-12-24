import CreateMSBAccountAccount from '@/components/Admin/msb/MsbPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="create_myastro_account">
      <CreateMSBAccountAccount/>
      </ProtectedRoute>
    </div>
  )
}

export default page
