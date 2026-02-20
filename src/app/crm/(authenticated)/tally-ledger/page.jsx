import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import LedgerPage from '@/components/Admin/tally-ledger/LedgerPage'
import React from 'react'

export const metadata = {
  title: 'Tally Ledger - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="tally_ledger">
      <LedgerPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
