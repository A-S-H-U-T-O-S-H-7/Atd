import { useState, useEffect, useRef } from "react";
import { X, FileText, Calendar, IndianRupee, User, MapPin, CreditCard, Clock, Mail, Phone } from "lucide-react";

const LoanDetailsModal = ({ isOpen, onClose, loanData, isDark, clientData }) => {
  const modalRef = useRef(null);

  // Outside click and escape key functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !loanData) return null;

  // Format transaction data from API or use empty array if not available
  const transactionData = loanData.transactions || [];

  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get client name from clientData or loanData
  const getClientName = () => {
    if (clientData?.name) return clientData.name;
    if (clientData?.fullname) return clientData.fullname;
    return "N/A";
  };

  // Get client address from clientData
  const getClientAddress = () => {
    if (clientData?.location) return clientData.location;
    if (clientData?.address) return clientData.address;
    return "N/A";
  };

  // Get CRN from clientData or loanData
  const getCRN = () => {
    if (clientData?.crnNo) return clientData.crnNo;
    if (loanData?.crnno) return loanData.crnno;
    return "N/A";
  };

  // Get due date from loanData
  const getDueDate = () => {
    if (loanData?.dueDate) return loanData.dueDate;
    if (loanData?.collection_date) return loanData.collection_date;
    return "N/A";
  };

  // Get contact information
  const getContactInfo = () => {
    if (clientData?.contact) return clientData.contact;
    if (clientData?.phone) return clientData.phone;
    if (clientData?.email) return clientData.email;
    return "N/A";
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        ref={modalRef}
        className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
          isDark ? "bg-gray-900" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 py-4 border-b ${
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
                  Complete account information and transaction history
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
            
            {/* Combined Client & Loan Information Card */}
            <div className={`rounded-xl border p-4 ${
              isDark
                ? "bg-gray-800 border-emerald-600/30"
                : "bg-white border-emerald-200"
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Client Information Section */}
                <div className="space-y-6">
                  
                  
                  <div className="space-y-4 grid grid-cols-2">
                    <div className="flex  items-start space-x-3">
                      <User className={`w-4 h-4 mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <p className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Client Name
                        </p>
                        <p className={`text-base font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}>
                          {getClientName()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className={`w-4 h-4 mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <p className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Address
                        </p>
                        <p className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {getClientAddress()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CreditCard className={`w-4 h-4 mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <p className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                          CRN No
                        </p>
                        <p className={`text-sm font-mono font-semibold ${
                          isDark ? "text-emerald-400" : "text-emerald-600"
                        }`}>
                          {getCRN()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone className={`w-4 h-4 mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <p className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Contact
                        </p>
                        <p className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {getContactInfo()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loan Information Section */}
                <div className="space-y-6 ">
                                   
                  <div className="space-y-4 grid grid-cols-2">
                    <div className="flex items-start space-x-3">
                      <FileText className={`w-4 h-4 mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <p className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Loan Account No
                        </p>
                        <p className={`text-base font-mono font-semibold ${
                          isDark ? "text-emerald-400" : "text-emerald-600"
                        }`}>
                          {loanData.loanNo || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <IndianRupee className={`w-4 h-4 mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <p className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Sanction Amount
                        </p>
                        <p className={`text-base font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}>
                          {formatCurrency(loanData.sanctionAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Calendar className={`w-4 h-4 mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <p className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Due Date
                        </p>
                        <p className={`text-base font-semibold ${
                          isDark ? "text-red-400" : "text-red-600"
                        }`}>
                          {formatDate(getDueDate())}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className={`w-4 h-4 mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`} />
                      <div>
                        <p className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                          Status
                        </p>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          loanData.status === 'Disbursed'
                            ? isDark 
                              ? 'bg-orange-500/20 text-orange-300'
                              : 'bg-orange-100 text-orange-800'
                            : loanData.status === 'Completed'
                            ? isDark
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-green-100 text-green-800'
                            : isDark
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {loanData.status || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className={`rounded-xl border overflow-hidden ${
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
                        Debit (₹)
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white">
                        Credit (₹)
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white">
                        Balance (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    isDark ? "divide-gray-700" : "divide-gray-200"
                  }`}>
                    {transactionData.length > 0 ? (
                      transactionData.map((transaction, index) => (
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
                            {transaction.particular || "N/A"}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-mono ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}>
                            {transaction.debit || "0"}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-mono ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}>
                            {transaction.credit || "0"}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-mono font-semibold ${
                            isDark ? "text-emerald-400" : "text-emerald-600"
                          }`}>
                            {transaction.balance || "0"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className={`px-6 py-8 text-center ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}>
                          <div className="flex flex-col items-center justify-center">
                            <FileText className={`w-12 h-12 mb-2 ${
                              isDark ? "text-gray-600" : "text-gray-400"
                            }`} />
                            <p className="text-lg font-medium">No transactions found</p>
                            <p className="text-sm">There are no transactions available for this loan account.</p>
                          </div>
                        </td>
                      </tr>
                    )}
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

export default LoanDetailsModal;