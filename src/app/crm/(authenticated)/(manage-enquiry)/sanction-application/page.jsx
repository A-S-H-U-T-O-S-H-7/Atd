import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import SanctionPage from '@/components/Admin/sanction-application/SanctionPage'
import React from 'react'

export const metadata = {
  title: 'Sanction Applications - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="sanction_application">
      <SanctionPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
