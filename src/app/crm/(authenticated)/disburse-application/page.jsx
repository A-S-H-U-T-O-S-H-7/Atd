import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import DisburseApplication from '@/components/Admin/disburse-application/DisburseApplication'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="disburse_application">
      <DisburseApplication/>
      </ProtectedRoute>
    </div>
  )
}

export default page
