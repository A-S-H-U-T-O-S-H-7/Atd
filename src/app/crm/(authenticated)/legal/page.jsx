import LegalPage from '@/components/Admin/legal/LegalPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

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
