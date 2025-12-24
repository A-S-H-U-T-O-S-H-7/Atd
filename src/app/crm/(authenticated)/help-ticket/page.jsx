import HelpTicketPage from '@/components/Admin/help-ticket/HelpTicketPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="help_ticket">
      <HelpTicketPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
