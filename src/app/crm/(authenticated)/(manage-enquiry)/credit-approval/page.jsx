import CreditApprovalPage from '@/components/Admin/credit-approval/CreditApprovalPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="credit_approval">
      <CreditApprovalPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
