import React, { useState, useEffect } from "react";
import { X, Eye, CreditCard, Calendar, User, MapPin, Phone, Loader2, ArrowRight } from "lucide-react";
import { formatLedgerDetailsForUI } from "@/lib/services/LedgerServices";

const CustomerTransactionDetails = ({ 
  isOpen, 
  onClose, 
  data, 
  isDark, 
  onUpdateBalance,
  showOtherCharges = false 
}) => {
  const [updateForm, setUpdateForm] = useState({
    date: '',
    interest: '',
    penalty: '',
    penalInterest: '',
    adjustment: 'DEBIT',
    debitCredit: 'DEBIT',
    remark: ''
  });

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data && data.ledgerDetails) {
      const formattedData = formatLedgerDetailsForUI(data.ledgerDetails);
      setTransactions(formattedData.transactions);
      setSummary(formattedData.summary);
    }
  }, [data]);

  // Add this useEffect near your other useEffects
useEffect(() => {
  const handleEscKey = (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  if (isOpen) {
    document.addEventListener("keydown", handleEscKey);
  }

  return () => {
    document.removeEventListener("keydown", handleEscKey);
  };
}, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const handleUpdateSubmit = () => {
    if (updateForm.date && updateForm.remark) {
      console.log('Update submitted:', updateForm);
      // Handle the update logic here
      setUpdateForm({
        date: '',
        interest: '',
        penalty: '',
        penalInterest: '',
        adjustment: 'DEBIT',
        debitCredit: 'DEBIT',
        remark: ''
      });
    }
  };

  const handleInputChange = (field, value) => {
    setUpdateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const totalDebit = transactions.reduce((sum, transaction) => sum + transaction.debit, 0);
  const totalCredit = transactions.reduce((sum, transaction) => sum + transaction.credit, 0);
  const finalBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;

  // Get today's date for max date input
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center p-2">
  <div 
    className="absolute inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50"
    onClick={onClose}
  />
      <div className={`w-full max-w-2xl backdrop-blur-sm max-h-[95vh] custom-scrollbar overflow-y-auto rounded-xl shadow-2xl border-2 z-10 ${
        isDark
          ? "bg-gray-800 border-emerald-600/50"
          : "bg-white border-emerald-300"
      }`}
      onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with ATD Logo */}
        <div className={`flex items-center justify-between p-4 border-b-2 ${
          isDark
            ? "border-emerald-600/50 bg-gradient-to-r from-gray-900 to-gray-800"
            : "border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50"
        }`}>
          <div className="flex items-center space-x-4">
            {/* ATD Logo */}
            <div className={`p-2 rounded-lg ${isDark ? "bg-emerald-50" : "bg-emerald-100"}`}>
              <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src="/atdlogo.png" 
                  alt="ATD Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <span class="text-white font-bold text-lg">ATD</span>
                      </div>
                    `;
                  }}
                />
              </div>
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                ATD FINANCE
              </h2>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Customer Ledger Details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          
          {/* Customer Details - Enhanced with CRN Badge */}
          <div className={`rounded-lg p-4 border ${
            isDark
              ? "bg-gray-700/50 border-emerald-600/30"
              : "bg-emerald-50/50 border-emerald-200"
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                    <span className={`font-semibold text-sm ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                      {data.name}
                    </span>
                  </div>
                  
                </div>
                
                <div className="flex items-start space-x-2">
                  <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {data.address}
                  </span>
                </div>
                
                {data.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                    <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      {data.phone}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CreditCard className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Loan: {data.loanNo}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-orange-400" : "text-orange-600"}`}>
                    Due Date: {data.dueDate}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    CRN No: {data.crnno}
                  </span>
                </div>

                {/* Phone number in right column too for mobile */}
                {data.phone && (
                  <div className="flex items-center space-x-2 lg:hidden">
                    <Phone className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                    <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      {data.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Card */}
          {summary && (
            <div className={`rounded-lg p-4 border ${
              isDark
                ? "bg-gray-700/50 border-emerald-600/30"
                : "bg-emerald-50/50 border-emerald-200"
            }`}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Total Debit</p>
                  <p className={`text-lg font-bold ${isDark ? "text-red-400" : "text-red-600"}`}>
                    ₹{(summary.total_debits || totalDebit).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Total Credit</p>
                  <p className={`text-lg font-bold ${isDark ? "text-green-400" : "text-green-600"}`}>
                    ₹{(summary.total_credits || totalCredit).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Balance</p>
                  <p className={`text-lg font-bold ${
  (summary.balance || finalBalance) < 0 
    ? isDark ? "text-red-400" : "text-red-600"
    : isDark ? "text-emerald-400" : "text-emerald-600"
}`}>
  {(summary.balance || finalBalance) < 0 ? '-' : ''}
  ₹{Math.abs(summary.balance || finalBalance).toLocaleString()}
</p>
                </div>
              </div>
            </div>
          )}

          {/* Ledger Transactions Table */}
          <div className={`rounded-lg overflow-hidden border ${
            isDark ? "border-emerald-600/50" : "border-emerald-300"
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={`${
                  isDark
                    ? "bg-gradient-to-r from-gray-900 to-gray-800"
                    : "bg-gradient-to-r from-emerald-50 to-teal-50"
                }`}>
                  <tr>
                    <th className={`px-3 py-2 text-left text-xs font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}>Date</th>
                    <th className={`px-3 py-2 text-left text-xs font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}>Particular</th>
                    <th className={`px-3 py-2 text-right text-xs font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}>Debit (₹)</th>
                    <th className={`px-3 py-2 text-right text-xs font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}>Credit (₹)</th>
                    <th className={`px-3 py-2 text-right text-xs font-bold ${
                      isDark ? "text-gray-100" : "text-gray-700"
                    }`}>Balance (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr
                      key={transaction.id || index}
                      className={`border-b transition-all duration-200 ${
                        isDark
                          ? "border-emerald-700 hover:bg-gray-700/30"
                          : "border-emerald-300 hover:bg-emerald-50/30"
                      } ${
                        index % 2 === 0
                          ? isDark 
                            ? "bg-gray-700/20" 
                            : "bg-gray-50/50"
                          : ""
                      }`}
                    >
                      <td className={`px-3 py-2 text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {transaction.date}
                      </td>
                      <td className={`px-3 py-2 text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                        {transaction.particular}
                      </td>
                      <td className={`px-3 py-2 text-xs text-right font-semibold ${
                        isDark ? "text-red-400" : "text-red-600"
                      }`}>
                        {transaction.debit > 0 ? transaction.debit.toLocaleString() : "0"}
                      </td>
                      <td className={`px-3 py-2 text-xs text-right font-semibold ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}>
                        {transaction.credit > 0 ? transaction.credit.toLocaleString() : "0"}
                      </td>
                      <td className={`px-3 py-2 text-xs text-right font-bold ${
  transaction.balance < 0 
    ? isDark ? "text-red-400" : "text-red-600"
    : isDark ? "text-emerald-400" : "text-emerald-600"
}`}>
  {transaction.balance < 0 ? '-' : ''}
  ₹{Math.abs(transaction.balance).toLocaleString()}
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conditional: Update Other Charges Section */}
          {showOtherCharges && (
            <div className={`rounded-lg p-4 border ${
              isDark
                ? "bg-gray-700/50 border-emerald-600/30"
                : "bg-emerald-50/50 border-emerald-200"
            }`}>
              <h3 className={`text-base font-bold mb-3 ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                Update Other Charges Respect Of Tally
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Date with Future Date Restriction */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={updateForm.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    max={getTodayDate()}
                    className={`w-full px-2 py-1.5 text-xs rounded border transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-emerald-600/50 text-white focus:border-emerald-400"
                        : "bg-white border-emerald-300 text-gray-900 focus:border-emerald-500"
                    } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                  <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Future dates are not allowed
                  </p>
                </div>

                {/* Adjustment Type Dropdown */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Adjustment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={updateForm.adjustment}
                    onChange={(e) => handleInputChange('adjustment', e.target.value)}
                    className={`w-full px-2 py-1.5 text-xs rounded border transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-emerald-600/50 text-white focus:border-emerald-400"
                        : "bg-white border-emerald-300 text-gray-900 focus:border-emerald-500"
                    } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                  >
                    <option value="DEBIT">DEBIT</option>
                    <option value="CREDIT">CREDIT</option>
                    <option value="INTEREST">INTEREST</option>
                    <option value="PENALTY">PENALTY</option>
                    <option value="PENAL INTEREST">PENAL INTEREST</option>
                    <option value="ADJUSTMENT">ADJUSTMENT</option>
                  </select>
                </div>

                {/* Amount Input */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={updateForm.interest}
                    onChange={(e) => handleInputChange('interest', e.target.value)}
                    placeholder="Enter amount"
                    min="0.01"
                    step="0.01"
                    className={`w-full px-2 py-1.5 text-xs rounded border transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-emerald-600/50 text-white focus:border-emerald-400 placeholder-gray-400"
                        : "bg-white border-emerald-300 text-gray-900 focus:border-emerald-500 placeholder-gray-500"
                    } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>

                {/* Remark */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Remark <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={updateForm.remark}
                    onChange={(e) => handleInputChange('remark', e.target.value)}
                    rows={2}
                    className={`w-full px-2 py-1.5 text-xs rounded border transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-emerald-600/50 text-white focus:border-emerald-400 placeholder-gray-400"
                        : "bg-white border-emerald-300 text-gray-900 focus:border-emerald-500 placeholder-gray-500"
                    } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none resize-none`}
                    placeholder="Enter remark..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleUpdateSubmit}
                  disabled={!updateForm.date || !updateForm.interest || !updateForm.remark}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    (!updateForm.date || !updateForm.interest || !updateForm.remark) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:scale-105 transform'
                  } ${
                    isDark
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                  }`}
                >
                  <span>Submit Other Charges</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTransactionDetails;