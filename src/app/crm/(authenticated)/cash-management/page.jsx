import CashManagementPage from '@/components/Admin/cash-cheque-management/cash-management/CashManagementpage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="cash_deposit">
      <CashManagementPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
