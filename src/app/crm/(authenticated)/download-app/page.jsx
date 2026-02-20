import DownloadedAppPage from '@/components/Admin/download-app/DownloadApp'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

export const metadata = {
  title: 'Download App - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="download_app">
      <DownloadedAppPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
