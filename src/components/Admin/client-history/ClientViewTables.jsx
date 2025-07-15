import { useState } from "react";
import { Eye, } from "lucide-react";
import LoanDetailsModal from "./LoanDetailsModal";

const ClientTables = ({ clientData, isDark }) => {
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Sample reference data
  const referenceData = [
    {
      id: 1,
      name: "Sapna",
      email: "daisysapna96@gmail.com",
      mobile: "8808008322"
    },
    {
      id: 2,
      name: "Ajit",
      email: "ajit.spet201212@gmail.com",
      mobile: "7474120028"
    },
    {
      id: 3,
      name: "Dinesh",
      email: "dinesh199023@gmail.com",
      mobile: "9415843578"
    },
    {
      id: 4,
      name: "Rohit",
      email: "singh.rohit1345@gmail.com",
      mobile: "8850871736"
    },
    {
      id: 5,
      name: "Tarun",
      email: "tarun.jamwal@gmail.com",
      mobile: "9165253608"
    }
  ];

  // Sample loan history data
  const loanHistoryData = [
    {
      loanNo: "ATDAM36428",
      sanctionAmount: "3,000.00",
      transactionDate: "2025-07-11",
      dueDate: "2025-08-09",
      collectionDate: "-",
      status: "Disbursed"
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleViewLoan = (loan) => {
    setSelectedLoan(loan);
    setIsLoanModalOpen(true);
  };

  return (
    <>
      {/* Reference Details Section */}
      <div className={`rounded-xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/30"
          : "bg-white border-emerald-200"
      }`}>
        <div className={`px-6 py-4 border-b ${
          isDark
            ? "bg-emerald-700 border-emerald-600/30"
            : "bg-emerald-50 border-emerald-200"
        }`}>
          <div className="flex  items-center space-x-2">
           
            <h3 className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Reference Details
            </h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${
              isDark ? "bg-gray-700" : "bg-gray-50"
            }`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  SN
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Reference Name
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Reference Email
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Reference Mobile
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isDark ? "divide-gray-700" : "divide-gray-200"
            }`}>
              {referenceData.map((ref, index) => (
                <tr key={ref.id} className={`${
                  index % 2 === 0
                    ? isDark ? "bg-gray-800" : "bg-white"
                    : isDark ? "bg-gray-700/50" : "bg-gray-50"
                }`}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}>
                    {ref.id}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                    {ref.name}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {ref.email}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {ref.mobile}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loan History Section */}
      <div className={`rounded-xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/30"
          : "bg-white border-emerald-200"
      }`}>
        <div className={`px-6  py-4 border-b ${
          isDark
            ? "bg-indigo-400 border-emerald-600/30"
            : "bg-emerald-50 border-emerald-200"
        }`}>
          <div className="flex items-center space-x-2">
           
            <h3 className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Loan History
            </h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${
              isDark ? "bg-gray-700" : "bg-gray-50"
            }`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Loan No
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Sanction Amount
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Transaction Date
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Due Date
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Collection Date
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isDark ? "divide-gray-700" : "divide-gray-200"
            }`}>
              {loanHistoryData.map((loan, index) => (
                <tr key={loan.loanNo} className={`${
                  index % 2 === 0
                    ? isDark ? "bg-gray-800" : "bg-white"
                    : isDark ? "bg-gray-700/50" : "bg-gray-50"
                }`}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                    {loan.loanNo}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                    ₹{loan.sanctionAmount}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {formatDate(loan.transactionDate)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {formatDate(loan.dueDate)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {loan.collectionDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      loan.status === 'Disbursed'
                        ? 'bg-orange-100 text-orange-800'
                        : loan.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button 
                      onClick={() => handleViewLoan(loan)}
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                        isDark
                          ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loan Details Modal */}
      <LoanDetailsModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        loanData={selectedLoan}
        isDark={isDark}
      />
    </>
  );
};

export default ClientTables;