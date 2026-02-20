import HelpTicketPage from '@/components/Admin/help-ticket/HelpTicketPage'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

export const metadata = {
  title: 'Help Ticket - ATD Money',
};

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
