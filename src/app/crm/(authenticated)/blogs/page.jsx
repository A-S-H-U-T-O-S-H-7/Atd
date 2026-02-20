import BlogPage from '@/components/Admin/blog/Blogs'
import ProtectedRoute from '@/components/Admin/ProtectedRoute'
import React from 'react'

export const metadata = {
  title: 'Blogs - ATD Money',
};

function page() {
  return (
    <>
    <ProtectedRoute requiredPermission="blogs">
      <BlogPage />
    </ProtectedRoute>
    
    </>
    
  )
}

export default page
