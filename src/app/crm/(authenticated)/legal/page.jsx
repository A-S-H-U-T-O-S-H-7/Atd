import LegalPage from '@/components/Admin/legal/LegalPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

export const metadata = {
  title: 'Legal - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="legal">
     <LegalPage/>
     </ProtectedRoute>
    </div>
  )
}

export default page
