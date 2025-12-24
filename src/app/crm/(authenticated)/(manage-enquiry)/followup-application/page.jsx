import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import FollowUpApplication from '@/components/Admin/followup-application/FollowupApplication'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="followup_application">
      <FollowUpApplication/>
      </ProtectedRoute>
    </div>
  )
}

export default page
