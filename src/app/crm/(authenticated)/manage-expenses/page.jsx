import ManageExpensesPage from '@/components/Admin/expenses/ManageExpenses'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="profit_and_loss">
      <ManageExpensesPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
