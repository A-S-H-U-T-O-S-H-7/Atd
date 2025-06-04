import { AuthProvider } from "@/lib/AuthContext"

function layout({children}) {
  return (
    <div>
      <AuthProvider>
      {children}
      </AuthProvider>
    </div>
  )
}

export default layout
