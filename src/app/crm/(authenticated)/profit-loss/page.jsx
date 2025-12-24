import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import ProfitLossPage from '@/components/Admin/profit-loss/ProfitLoss'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="profit_and_loss">
      <ProfitLossPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
