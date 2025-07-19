import Link from 'next/link'
import React from 'react'

function BasicProfile() {
  return (
    <div className='bg-cyan-100  min-h-screen'>
        <h1 className='flex justify-center font-semibold pt-10'>Profile</h1>
        <div className='flex justify-center'>

        <Link href="/loan-registration">
      <button className='flex cursor-pointer justify-center mt-10 border rounded-md px-4 py-3 bg-blue-500 text-white font-semibold'>Apply Loan</button>
      </Link>
      </div>
    </div>
  )
}

export default BasicProfile
