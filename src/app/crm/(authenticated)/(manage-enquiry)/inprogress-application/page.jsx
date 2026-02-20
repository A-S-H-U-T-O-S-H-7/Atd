import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import InprogressApplication from '@/components/Admin/inprogress-application/InprogressAppliaction'
import React from 'react'

export const metadata = {
  title: 'InProgress Applications - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="inprocess_application">
      <InprogressApplication/>
      </ProtectedRoute>
    </div>
  )
}

export default page
