import CollectionPage from '@/components/Admin/collection-reporting/CollectionPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

export const metadata = {
  title: 'Collection Reporting - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="collection_reporting">
      <CollectionPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
