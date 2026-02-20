import ClientHistoryPage from '@/components/Admin/client-history/ClientHistoryPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

export const metadata = {
  title: 'Client History - ATD Money',
};

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
