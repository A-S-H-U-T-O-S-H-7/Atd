import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import CibilReportPage from '@/components/Admin/cibil-report/CibilReport'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="cibil_report">
      <CibilReportPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
