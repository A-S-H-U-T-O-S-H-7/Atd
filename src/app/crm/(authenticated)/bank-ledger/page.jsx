import BankLedgerPage from "@/components/Admin/bank-ledger/BankLedger"
import ProtectedRoute from "@/components/Admin/ProtectedRoute"

export const metadata = {
  title: 'Bank Ledger - ATD Money',
};

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
