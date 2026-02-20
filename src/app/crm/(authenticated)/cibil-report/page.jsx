import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import CibilReportPage from '@/components/Admin/cibil-report/CibilReport'
import React from 'react'

export const metadata = {
  title: 'CIBIL Report - ATD Money',
};

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
