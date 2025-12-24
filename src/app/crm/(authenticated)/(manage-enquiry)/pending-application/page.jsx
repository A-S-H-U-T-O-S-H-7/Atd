import React from 'react'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import PendingApplication from '@/components/Admin/pending-application/PendingApplication'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="pending_application">
      <PendingApplication/>
      </ProtectedRoute>
    </div>
  )
}

export default page
