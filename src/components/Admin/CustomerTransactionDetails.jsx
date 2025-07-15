import React, { useState } from "react";
import { X, Eye, CreditCard, Calendar, User,  MapPin, Phone} from "lucide-react";

const CustomerTransactionDetails = ({ isOpen, onClose, data, isDark, onUpdateBalance }) => {
  const [updateForm, setUpdateForm] = useState({
    date: '',
    interest: '',
    penalty: '',
    penalInterest: '',
    adjustment: 'DEBIT',
    debitCredit: 'DEBIT',
    remark: ''
  });

  if (!isOpen || !data) return null;

  // Sample customer data
  const customerData = {
    name: "Bhavikkumar Pravinbhai Patel",
    address: "Nikhil CHS, Thakur Complex, Near Childrens Academy School, Kandivali East",
    loanNo: "ATDAM35743",
    crnNo: "B12AS086",
    dueDate: "16-07-2025",
    phone: "+91 98765 43210",
    email: "bhavikkumar@email.com"
  };

  // Sample ledger transaction data
  const Transactions = [
    {
      date: "17/06/2025",
      particular: "DISBURSE AMOUNT",
      debit: 32620,
      credit: 0,
      balance: 32620
    },
    {
      date: "17/06/2025",
      particular: "PROCESSING FEE",
      debit: 2280,
      credit: 0,
      balance: 34900
    },
    {
      date: "17/06/2025",
      particular: "PROCESSING FEE GST",
      debit: 410,
      credit: 0,
      balance: 35310
    },
    {
      date: "17/06/2025",
      particular: "DOCUMENTATION CHARGES",
      debit: 2280,
      credit: 0,
      balance: 37590
    },
    {
      date: "17/06/2025",
      particular: "DOCUMENTATION CHARGES GST",
      debit: 410,
      credit: 0,
      balance: 38000
    },
    {
      date: "17/06/2025",
      particular: "INTEREST",
      debit: 764,
      credit: 0,
      balance: 38764
    }
  ];

  const totalDebit = Transactions.reduce((sum, transaction) => sum + transaction.debit, 0);
  const totalCredit = Transactions.reduce((sum, transaction) => sum + transaction.credit, 0);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/30 backdrop-blur-sm bg-opacity-50 ">
      <div className={`w-full max-w-2xl backdrop-blur-sm max-h-[95vh] custom-scrollbar overflow-y-auto rounded-xl shadow-2xl border-2 ${
        isDark
          ? "bg-gray-800 border-emerald-600/50"
          : "bg-white border-emerald-300"
      }`}>
        
        {/* Header with Logo */}
        <div className={`flex items-center justify-between p-4 border-b-2 ${
          isDark
            ? "border-emerald-600/50 bg-gradient-to-r from-gray-900 to-gray-800"
            : "border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50"
        }`}>
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className={`p-2 rounded-lg ${
              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
            }`}>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <span className="text-white font-bold text-lg">ATD</span>
              </div>
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                isDark ? "text-gray-100" : "text-gray-800"
              }`}>
                ATD FINANCE
              </h2>
              <p className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
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
          
          {/* Customer Details - Compact */}
          <div className={`rounded-lg p-4 border ${
            isDark
              ? "bg-gray-700/50 border-emerald-600/30"
              : "bg-emerald-50/50 border-emerald-200"
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span className={`font-semibold text-sm ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                    {customerData.name}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {customerData.address}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {customerData.phone}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CreditCard className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Loan: {customerData.loanNo}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    CRN: {customerData.crnNo}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Due: {customerData.dueDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ledger Transactions Table - Compact */}
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
                  {Transactions.map((transaction, index) => (
                    <tr
                      key={index}
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
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      }`}>
                        {transaction.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className={`${
                  isDark
                    ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                    : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
                } border-t`}>
                  <tr>
                    <td colSpan="2" className={`px-3 py-2 text-xs font-bold ${
                      isDark ? "text-gray-100" : "text-gray-800"
                    }`}>
                      Total
                    </td>
                    <td className={`px-3 py-2 text-xs text-right font-bold ${
                      isDark ? "text-red-400" : "text-red-600"
                    }`}>
                      {totalDebit.toLocaleString()}
                    </td>
                    <td className={`px-3 py-2 text-xs text-right font-bold ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}>
                      {totalCredit.toLocaleString()}
                    </td>
                    <td className={`px-3 py-2 text-xs text-right font-bold ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}>
                      {Transactions[Transactions.length - 1]?.balance.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Update Other Charges Section */}
          <div className={`rounded-lg p-4 border ${
            isDark
              ? "bg-gray-700/50 border-emerald-600/30"
              : "bg-emerald-50/50 border-emerald-200"
          }`}>
            <h3 className={`text-base font-bold mb-3 ${
              isDark ? "text-gray-100" : "text-gray-800"
            }`}>
              Update Other Charges Respect Of Tally
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Date */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Date
                </label>
                <input
                  type="date"
                  value={updateForm.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={`w-full px-2 py-1.5 text-xs rounded border transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 focus:border-emerald-500"
                  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>

              

              

              

              {/* Adjustment Dropdown */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Adjustment
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
                  <option value="INTEREST">INTEREST</option>
                  <option value="PENALTY">PENALTY</option>
                  <option value="PENAL INTEREST">PENAL INTEREST</option>
                  <option value="ADJUSTMENT">ADJUSTMENT</option>

                </select>
              </div>

              {/* Debit/Credit Dropdown */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Type
                </label>
                <select
                  value={updateForm.debitCredit}
                  onChange={(e) => handleInputChange('debitCredit', e.target.value)}
                  className={`w-full px-2 py-1.5 text-xs rounded border transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 focus:border-emerald-500"
                  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                >
                  <option value="DEBIT">DEBIT</option>
                  <option value="CREDIT">CREDIT</option>
                </select>
              </div>

              {/* Remark */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Remark
                </label>
                <textarea
                  value={updateForm.remark}
                  onChange={(e) => handleInputChange('remark', e.target.value)}
                  rows={2}
                  className={`w-full px-2 py-1.5 text-xs rounded border transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 focus:border-emerald-500"
                  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none resize-none`}
                  placeholder="Enter remark..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleUpdateSubmit}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white"
                } hover:scale-105 transform`}
              >
                Submit
              </button>
            </div>
          </div>

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