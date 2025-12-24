import BankLedgerPage from "@/components/Admin/bank-ledger/BankLedger"
import ProtectedRoute from "@/components/Admin/ProtectedRoute"

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="bank_ledger">
      <BankLedgerPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
