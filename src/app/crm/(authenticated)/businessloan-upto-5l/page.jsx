import BusinessLoanEnquiry5lPage from '@/components/Admin/businessloan-upto5l/BusinessLoan5l'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="business_loan_enquiry">
     <BusinessLoanEnquiry5lPage/>
     </ProtectedRoute>
    </div>
  )
}

export default page
