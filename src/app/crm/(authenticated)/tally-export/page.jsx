import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import TallyExport from '@/components/Admin/tally-export/TallyExport'
import React from 'react'

export const metadata = {
  title: 'Tally Export - ATD Money',
};

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="tally_export">
      <TallyExport/>
      </ProtectedRoute>
    </div>
  )
}

export default page
