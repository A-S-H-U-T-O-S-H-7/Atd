import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import RegisteredFromAppPage from '@/components/Admin/registered-from-app/RegisteredfromApp'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="register_from_app">
      <RegisteredFromAppPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
