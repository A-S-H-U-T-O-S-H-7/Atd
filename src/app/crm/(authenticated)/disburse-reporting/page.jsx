import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import DisbursementPage from '@/components/Admin/disburse-reporting/DisbursementPage'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="disburse_reporting">
      <DisbursementPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
