import ECollectionPage from '@/components/Admin/e-collection/ECollectionPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="auto_collection">
      <ECollectionPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
