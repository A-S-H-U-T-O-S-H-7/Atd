import Link from "next/link"

function page() {
  return (
    <div className="flex items-center pt-50 justify-center">
    <Link href="/login">
    <button className="px-8 py-4 bg-green-500 font-bold text-white rounded-md">
        Login
    </button>
    </Link>

    </div>
  )
}

export default page
