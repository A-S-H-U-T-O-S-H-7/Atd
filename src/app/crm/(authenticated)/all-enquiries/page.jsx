import AllEnquiries from '@/components/Admin/all-enquiries/AllEnquiries'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="all_enquiries">
     <AllEnquiries/>
     </ProtectedRoute>
    </div>
  )
}

export default page
