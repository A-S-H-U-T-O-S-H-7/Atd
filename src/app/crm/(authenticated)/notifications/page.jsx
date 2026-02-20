import NotificationForm from '@/components/Admin/notification/Notification'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

export const metadata = {
  title: 'Notifications - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="notification">
      <NotificationForm/>
      </ProtectedRoute>
    </div>
  )
}

export default page
