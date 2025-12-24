import BusinessLoanEnquiry5l1crPage from '@/components/Admin/businessloan-above5l/BusinessLoanAbove5l'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'


function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="business_loan_enquiry">
      <BusinessLoanEnquiry5l1crPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
