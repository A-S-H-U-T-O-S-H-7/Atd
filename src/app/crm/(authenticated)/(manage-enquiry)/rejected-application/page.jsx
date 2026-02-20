import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import RejectedApplication from '@/components/Admin/rejected-appliaction/RejectedAppliaction'
import React from 'react'

export const metadata = {
  title: 'Rejected Applications - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="rejected_application">
      <RejectedApplication/>
      </ProtectedRoute>
    </div>
  )
}

export default page
