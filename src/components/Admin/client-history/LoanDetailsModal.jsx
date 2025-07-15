
import { X, FileText, Calendar, IndianRupee, User, MapPin, CreditCard, Clock } from "lucide-react";

const LoanDetailsModal = ({ isOpen, onClose, loanData, isDark }) => {
  if (!isOpen || !loanData) return null;

  // Sample transaction data based on the screenshot
  const transactionData = [
    {
      date: "2025-07-11",
      particular: "Disburse Amount",
      debit: "2469",
      credit: "0",
      balance: "2469"
    },
    {
      date: "2025-07-11",
      particular: "Process Fee",
      debit: "531",
      credit: "0",
      balance: "3000"
    },
    {
      date: "2025-07-11",
      particular: "Total Interest",
      debit: "60.3",
      credit: "0",
      balance: "3060.3"
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 py-4 border-b-2 ${
          isDark
            ? "bg-gray-800 border-emerald-600/50"
            : "bg-emerald-50 border-emerald-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? "bg-emerald-600/20" : "bg-emerald-100"
              }`}>
                <FileText className={`w-6 h-6 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  Loan Account Details
                </h2>
                <p className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Account No: {loanData.loanNo}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            
            {/* Client Information Card */}
            <div className={`rounded-xl border-2 p-6 ${
              isDark
                ? "bg-gray-800 border-emerald-600/30"
                : "bg-white border-emerald-200"
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className={`w-4 h-4 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                    <span className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}>
                      Client Name
                    </span>
                  </div>
                  <p className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                    Anuj Pratap Singh
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className={`w-4 h-4 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                    <span className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}>
                      Address
                    </span>
                  </div>
                  <p className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Sector 71 Mohali, VTC: S.A.S.Nagar (Mohali), PO: Sector 71, Sub District: S.A.S.Nagar (mohali)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CreditCard className={`w-4 h-4 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                    <span className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}>
                      CRN No
                    </span>
                  </div>
                  <p className={`text-sm font-mono ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                    A25DI906
                  </p>
                </div>
              </div>
            </div>

            {/* Loan Summary Card */}
            <div className={`rounded-xl border-2 p-6 ${
              isDark
                ? "bg-gray-800 border-emerald-600/30"
                : "bg-white border-emerald-200"
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className={`w-4 h-4 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                    <span className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}>
                      Loan Account No
                    </span>
                  </div>
                  <p className={`text-lg font-mono font-semibold ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                    {loanData.loanNo}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <IndianRupee className={`w-4 h-4 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                    <span className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}>
                      Sanction Amount
                    </span>
                  </div>
                  <p className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                    ₹{loanData.sanctionAmount}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className={`w-4 h-4 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                    <span className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}>
                      Due Date
                    </span>
                  </div>
                  <p className={`text-lg font-semibold ${
                    isDark ? "text-red-400" : "text-red-600"
                  }`}>
                    {formatDate("2025-08-09")}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className={`w-4 h-4 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                    <span className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}>
                      Status
                    </span>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    loanData.status === 'Disbursed'
                      ? 'bg-orange-100 text-orange-800'
                      : loanData.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {loanData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className={`rounded-xl border-2 overflow-hidden ${
              isDark
                ? "bg-gray-800 border-emerald-600/30"
                : "bg-white border-emerald-200"
            }`}>
              <div className={`px-6 py-4 border-b ${
                isDark
                  ? "bg-gray-700 border-emerald-600/30"
                  : "bg-emerald-50 border-emerald-200"
              }`}>
                <h3 className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  Transaction History
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${
                    isDark ? "bg-red-900/50" : "bg-red-600"
                  }`}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white">
                        Particular
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white">
                        Amount Debit (INR)
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white">
                        Amount Credit (INR)
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white">
                        Balance (INR)
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    isDark ? "divide-gray-700" : "divide-gray-200"
                  }`}>
                    {transactionData.map((transaction, index) => (
                      <tr key={index} className={`${
                        index % 2 === 0
                          ? isDark ? "bg-gray-800" : "bg-white"
                          : isDark ? "bg-gray-700/50" : "bg-gray-50"
                      }`}>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDark ? "text-gray-300" : "text-gray-900"
                        }`}>
                          {formatDate(transaction.date)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}>
                          {transaction.particular}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-mono ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {transaction.debit}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-mono ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {transaction.credit}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-mono font-semibold ${
                          isDark ? "text-emerald-400" : "text-emerald-600"
                        }`}>
                          {transaction.balance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsModal