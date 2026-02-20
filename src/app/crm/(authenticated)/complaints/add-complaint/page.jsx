import AddComplaintPage from '@/components/Admin/complaints/AddComplaintPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

export const metadata = {
  title: 'Add Complaint - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="complaints">
      <AddComplaintPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
