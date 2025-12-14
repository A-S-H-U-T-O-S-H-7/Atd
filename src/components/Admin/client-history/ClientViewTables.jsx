import { useState } from "react";
import { Eye, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import LoanDetailsModal from "./LoanDetailsModal";
import { getStatusName } from "@/utils/applicationStatus";
import { clientService } from "@/lib/services/ClientHistoryService";

const ClientTables = ({ clientData, isDark }) => {
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLoanId, setLoadingLoanId] = useState(null);
  const [isReferenceExpanded, setIsReferenceExpanded] = useState(false); 

  // Transform references data from API
  const transformReferences = (references, verifiedReferences) => {
    if (references && Array.isArray(references) && references.length > 0) {
      return references.map((ref, index) => ({
        id: index + 1,
        name: ref.name || "N/A",
        email: ref.email || "Not Available",
        mobile: ref.mobile || ref.phone || "Not Available"
      }));
    }
    
    // Fallback to verified_references if simple references not available
    if (verifiedReferences && verifiedReferences.length > 0) {
      const refData = verifiedReferences[0];
      const transformed = [];
      
      for (let i = 1; i <= 6; i++) {
        const refName = refData[`refName${i}`];
        const refPhone = refData[`refPhone${i}`];
        const refEmail = refData[`refEmail${i}`];
        
        if (refName && refPhone) {
          transformed.push({
            id: i,
            name: refName,
            email: refEmail || "Not Available",
            mobile: refPhone
          });
        }
      }
      
      return transformed;
    }
    
    return [];
  };

  // Transform loan 
  const transformLoans = (loans) => {
    if (!loans || loans.length === 0) return [];
    
    return loans.map((loan, index) => ({
      application_id: loan.application_id, 
      loanNo: loan.loan_no || `LOAN-${index + 1}`,
      sanctionAmount: loan.approved_amount || loan.sanction_amount,
      transactionDate: loan.transaction_date,
      dueDate: loan.duedate || loan.due_date,
      collectionDate: loan.collection_date || "-",
      status: getStatusName(loan.loan_status),
      statusCode: loan.loan_status,
      disburseAmount: loan.disburse_amount,
      collectionAmount: loan.collection_amount
    }));
  };

  // Get status badge color based on status
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Disbursed":
      case "Completed":
      case "Closed":
        return "bg-green-100 text-green-800";
      case "Pending":
      case "Processing":
      case "Ready To Verify":
      case "Ready To Disbursed":
        return "bg-orange-100 text-orange-800";
      case "Rejected":
      case "Cancelled":
      case "Closed By Admin":
        return "bg-red-100 text-red-800";
      case "Follow Up":
      case "Sanction":
      case "Transaction":
      case "Collection":
      case "Re-Collection":
        return "bg-blue-100 text-blue-800";
      case "Defaulter":
        return "bg-purple-100 text-purple-800";
      case "Return":
      case "Renewal":
      case "EMI":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const referenceData = transformReferences(clientData.references, clientData.verified_references);
  const loanHistoryData = transformLoans(clientData.loans);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "Not Available";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleViewLoan = async (loan) => {
    try {
      setLoading(true);
      setLoadingLoanId(loan.application_id);
      
      const response = await clientService.getLoanDetails(loan.application_id);
      
      let transactions = [];
      
      // Directly handle the API response structure
      if (response && response.ledger && Array.isArray(response.ledger)) {
        transactions = response.ledger.map((transaction, index) => ({
          id: transaction.id || index,
          date: formatDate(transaction.create_date),
          particular: transaction.particular || "Transaction",
          debit: transaction.trx_type === 'debit' ? parseFloat(transaction.trx_amount) || 0 : 0,
          credit: transaction.trx_type === 'credit' ? parseFloat(transaction.trx_amount) || 0 : 0,
          balance: 0
        }));
        
        // Calculate running balance
        let runningBalance = 0;
        transactions.forEach(transaction => {
          runningBalance = runningBalance + transaction.debit - transaction.credit;
          transaction.balance = runningBalance;
        });
      }
          
      const loanWithDetails = {
        ...loan,
        transactions: transactions,
        clientName: clientData.name || clientData.fullname,
        address: clientData.location || clientData.address,
        crnno: clientData.crnNo || clientData.crnno,
        loanNo: loan.loanNo,
        sanctionAmount: loan.sanctionAmount || loan.approved_amount,
        dueDate: loan.dueDate || loan.duedate,
        status: loan.status
      };
      
      setSelectedLoan(loanWithDetails);
      setIsLoanModalOpen(true);
      
    } catch (error) {
      console.error("Error fetching loan details:", error);
      // Fallback with basic data
      const loanWithClientInfo = {
        ...loan,
        clientName: clientData.name || clientData.fullname,
        address: clientData.location || clientData.address, 
        crnno: clientData.crnNo || clientData.crnno,
        transactions: []
      };
      setSelectedLoan(loanWithClientInfo);
      setIsLoanModalOpen(true);
    } finally {
      setLoading(false);
      setLoadingLoanId(null);
    }
  };

  return (
    <>
      {/* Reference Details Section - Collapsible */}
      <div className={`rounded-xl border-2 overflow-hidden transition-all duration-300 ${
        isDark
          ? "bg-gray-800 border-emerald-600/30"
          : "bg-white border-emerald-200"
      }`}>
        {/* Header - Clickable for toggle */}
        <button 
          onClick={() => setIsReferenceExpanded(!isReferenceExpanded)}
          className={`w-full px-6 py-4 border-b text-left transition-all duration-200 hover:opacity-90 ${
            isDark
              ? "bg-emerald-700 border-emerald-600/30 hover:bg-emerald-600/80"
              : "bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Reference Details
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                isDark 
                  ? "bg-emerald-800/50 text-emerald-300" 
                  : "bg-emerald-100 text-emerald-800"
              }`}>
                {referenceData.length} {referenceData.length === 1 ? 'reference' : 'references'}
              </span>
            </div>
            <div className={`transform transition-transform duration-300 ${
              isReferenceExpanded ? 'rotate-180' : ''
            }`}>
              {isReferenceExpanded ? (
                <ChevronUp className={`w-5 h-5 ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`} />
              ) : (
                <ChevronDown className={`w-5 h-5 ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`} />
              )}
            </div>
          </div>
        </button>
        
        {/* Collapsible Content */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isReferenceExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
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
                {referenceData.length > 0 ? (
                  referenceData.map((ref, index) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className={`px-6 py-4 text-center text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}>
                      No reference data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Loan History Section */}
      <div className={`rounded-xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-emerald-600/30"
          : "bg-white border-emerald-200"
      }`}>
        <div className={`px-6 py-3 border-b ${
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
              {loanHistoryData.length > 0 ? (
                loanHistoryData.map((loan, index) => (
                  <tr key={`${loan.loanNo}-${index}-${loan.transactionDate}-${loan.collectionAmount}`} className={`${
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
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => handleViewLoan(loan)}
                        disabled={loading && loadingLoanId === loan.application_id}
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center ${
                          loading && loadingLoanId === loan.application_id
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : isDark
                              ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                      >
                        {loading && loadingLoanId === loan.application_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={`px-6 py-4 text-center text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>
                    No loan history available
                  </td>
                </tr>
              )}
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
        clientData={clientData}
      />
    </>
  );
};

export default ClientTables;