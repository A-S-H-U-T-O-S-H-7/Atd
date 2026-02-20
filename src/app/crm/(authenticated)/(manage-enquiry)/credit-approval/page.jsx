import CreditApprovalPage from '@/components/Admin/credit-approval/CreditApprovalPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

export const metadata = {
  title: 'Credit Approval - ATD Money',
};

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
