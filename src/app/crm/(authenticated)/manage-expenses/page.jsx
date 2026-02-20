import ManageExpensesPage from '@/components/Admin/expenses/ManageExpenses'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

export const metadata = {
  title: 'Manage-Expense - ATD Money',
};

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
