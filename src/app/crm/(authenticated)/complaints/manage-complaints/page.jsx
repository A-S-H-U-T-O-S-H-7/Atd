import ComplaintPage from '@/components/Admin/complaints/ComplaintPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="complaints">
      <ComplaintPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
