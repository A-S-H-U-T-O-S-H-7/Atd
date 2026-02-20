import OverdueApplicantList from '@/components/Admin/overdue-applicants-list/OverdueApplicantList'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

export const metadata = {
  title: 'Overdue Applications - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="overdue_applicants">
      <OverdueApplicantList/>
      </ProtectedRoute>
    </div>
  )
}

export default page
