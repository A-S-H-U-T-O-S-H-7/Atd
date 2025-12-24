import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import ReferFriends from '@/components/Admin/refer-friends/ReferFriends'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="reference">
      <ReferFriends/>
      </ProtectedRoute>
    </div>
  )
}

export default page
