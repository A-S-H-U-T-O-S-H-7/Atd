import ECollectionPage from '@/components/Admin/e-collection/ECollectionPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

export const metadata = {
  title: 'E-Collection - ATD Money',
};

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
