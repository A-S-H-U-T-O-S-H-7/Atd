import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import ReferFriends from '@/components/Admin/refer-friends/ReferFriends'
import React from 'react'

export const metadata = {
  title: 'References - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="references">
      <ReferFriends/>
      </ProtectedRoute>
    </div>
  )
}

export default page
