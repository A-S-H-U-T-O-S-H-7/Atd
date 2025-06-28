import React from "react";
import { X } from "lucide-react";

const OverdueAmountModal = ({ isOpen, onClose, applicant, isDark }) => {
  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate days passed from due date
  const calculateDaysPassed = (dueDate) => {
    const today = new Date();
    const dateParts = dueDate.split('-');
    const formattedDate = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;
    const dueDateObj = new Date(formattedDate);
    const daysDiff = Math.ceil((today - dueDateObj) / (1000 * 60 * 60 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };

  // Sample calculations - you can adjust these based on your business logic
  const daysPassed = calculateDaysPassed(applicant.dueDate);
  const sanctionAmount = applicant.balance || 9000.00;
  const interestAmount = (sanctionAmount * 0.02) || 156.78; // 2% interest
  const penalty = 500.00;
  const penalInterest = 319.00;
  const collection = 1000.00;
  const totalDueAmount = sanctionAmount + interestAmount + penalty + penalInterest - collection;

  // Renewal calculations
  const processingFee = sanctionAmount * 0.15 || 1274.00; // 15% processing fee
  const renewalFee = (sanctionAmount * 0.02) + (sanctionAmount * 0.02 * 0.18) || 212.40; // 2% + 18% GST
  const totalPayableAmount = processingFee + interestAmount + penalty + penalInterest + renewalFee;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`relative w-full max-w-md mx-4 rounded-lg shadow-xl ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Overdue Amount of {applicant.name}
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-gray-100 transition-colors ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <X size={20} className={isDark ? "text-gray-400" : "text-gray-600"} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Overdue Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">No of days passed :</span>
              <span className="text-sm font-semibold">{daysPassed} Days</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Sanction Amount :</span>
              <span className="text-sm font-semibold">{sanctionAmount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Interest :</span>
              <span className="text-sm font-semibold">{interestAmount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Penalty :</span>
              <span className="text-sm font-semibold">{penalty.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Penal Interest :</span>
              <span className="text-sm font-semibold">{penalInterest.toFixed(2)} (Including 18% GST)</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Collection :</span>
              <span className="text-sm font-semibold">{collection.toFixed(2)}</span>
            </div>
            
            <hr className={`my-3 ${isDark ? "border-gray-600" : "border-gray-300"}`} />
            
            <div className="flex justify-between items-center font-bold">
              <span className="text-sm">Total Due Amount :</span>
              <span className="text-sm">{totalDueAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Renewal Case Section */}
          <div className="mt-6">
            <h3 className="text-base font-semibold mb-3">Renewal Case</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Processing Fee :</span>
                <span className="text-sm font-semibold">{processingFee.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Interest :</span>
                <span className="text-sm font-semibold">{interestAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Penalty :</span>
                <span className="text-sm font-semibold">{penalty.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Penal Interest :</span>
                <span className="text-sm font-semibold">{penalInterest.toFixed(2)} (Including 18% GST)</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Renewal Fee :</span>
                <span className="text-sm font-semibold">{renewalFee.toFixed(2)} (2% of sanction amount + GST)</span>
              </div>
              
              <hr className={`my-3 ${isDark ? "border-gray-600" : "border-gray-300"}`} />
              
              <div className="flex justify-between items-center font-bold">
                <span className="text-sm">Total Payable Amount :</span>
                <span className="text-sm">{totalPayableAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverdueAmountModal;