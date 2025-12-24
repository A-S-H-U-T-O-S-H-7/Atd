import EamandateDepositPage from '@/components/Admin/cash-cheque-management/e-mandate-management/E-MandateDeposit'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="emandate_deposit">
      <EamandateDepositPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
