import LedgerPage from '@/components/Admin/ledger/Ledger'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

export const metadata = {
  title: 'Ledger - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="ledger">
      <LedgerPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
