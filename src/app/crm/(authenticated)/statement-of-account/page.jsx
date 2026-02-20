import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import SoaPage from '@/components/Admin/soa/SoaPage'
import React from 'react'

export const metadata = {
  title: 'SOA - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="statement_of_account">
      <SoaPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
