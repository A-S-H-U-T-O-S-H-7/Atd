import CollectionPage from '@/components/Admin/collection-reporting/CollectionPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

export const metadata = {
  title: 'UPI Collection - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="auto_collection">
      <CollectionPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
