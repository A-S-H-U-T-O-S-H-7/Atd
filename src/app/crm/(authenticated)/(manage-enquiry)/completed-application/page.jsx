import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import CompletedApplication from '@/components/Admin/completed-appliaction/CompletedApplication'
import React from 'react'

export const metadata = {
  title: 'Completed Applications - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="complete_application">
      <CompletedApplication/>
      </ProtectedRoute>
    </div>
  )
}

export default page
