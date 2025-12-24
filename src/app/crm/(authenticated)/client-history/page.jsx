import ClientHistoryPage from '@/components/Admin/client-history/ClientHistoryPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="clients_history">
      <ClientHistoryPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
