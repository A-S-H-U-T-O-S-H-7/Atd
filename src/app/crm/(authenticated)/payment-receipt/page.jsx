import PaymentReceiptPage from '@/components/Admin/payment-recepit/PaymentReceipt'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="payment_receipt">
      <PaymentReceiptPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
