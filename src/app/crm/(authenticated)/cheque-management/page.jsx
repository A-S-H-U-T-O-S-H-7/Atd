import ChequeDepositPage from "@/components/Admin/cash-cheque-management/cheque-management/ChequeDeposit"
import ProtectedRoute from "@/components/Admin/ProtectedRoute"

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="cheque_deposit">
      <ChequeDepositPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
