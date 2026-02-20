import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import ManageBankPage from '@/components/Admin/bank-management/Manage-Bank'
import React from 'react'

export const metadata = {
  title: 'Manage Bank - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="manage_bank">
      <ManageBankPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
