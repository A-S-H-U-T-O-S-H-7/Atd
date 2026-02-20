import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import RbiGuidelinesPage from '@/components/Admin/rbi-guidelines/RbiGuidelinesManagement'
import React from 'react'

export const metadata = {
  title: 'RBI GuideLines - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="rbi_guidelines">
      <RbiGuidelinesPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
