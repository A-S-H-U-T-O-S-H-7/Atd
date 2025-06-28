import React, { useState } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useAdminAuth } from '@/lib/AdminAuthContext';

const LoanEligibility = ({ enquiry, onBack }) => {
  const { isDark } = useAdminAuth();
  
  // Sample data - this would come from props or API based on selected enquiry
  const [eligibilityData, setEligibilityData] = useState({
    applicantName: enquiry?.name || "NANDIPATI SRIDHAR REDDY",
    grossSalary: "125000",
    netSalary: "112000",
    totalExitingEMI: "60000",
    maximumLimit: "",
    balance: "52000",
    min20PercentOfBalance: "10400",
    max30PercentOfBalance: "15600",
    finalRecommended: "13000"
  });

  const handleInputChange = (field, value) => {
    setEligibilityData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApprove = () => {
    // Handle approval logic
    console.log('Approved with recommended amount:', eligibilityData.finalRecommended);
    // You would typically call an API here and then navigate back
    onBack();
  };

  const handleReject = () => {
    // Handle rejection logic
    console.log('Loan application rejected');
    // You would typically call an API here and then navigate back
    onBack();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Loan Eligibility of {eligibilityData.applicantName}
              </h1>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleReject}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <X size={18} />
                <span>Reject</span>
              </button>
              <div className={`px-4 py-2 rounded-lg font-medium ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                OR
              </div>
              <button
                onClick={handleApprove}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Check size={18} />
                <span>Approve</span>
              </button>
            </div>
          </div>
        </div>

        {/* Eligibility Form */}
        <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Gross Salary :
                  </label>
                  <input
                    type="text"
                    value={eligibilityData.grossSalary}
                    onChange={(e) => handleInputChange('grossSalary', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-100 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Net Salary :
                  </label>
                  <input
                    type="text"
                    value={eligibilityData.netSalary}
                    onChange={(e) => handleInputChange('netSalary', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-100 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Total Exiting EMI:
                  </label>
                  <input
                    type="text"
                    value={eligibilityData.totalExitingEMI}
                    onChange={(e) => handleInputChange('totalExitingEMI', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-100 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Maximum Limit:
                  </label>
                  <input
                    type="text"
                    value={eligibilityData.maximumLimit}
                    onChange={(e) => handleInputChange('maximumLimit', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-100 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Final Recommended:
                  </label>
                  <input
                    type="text"
                    value={eligibilityData.finalRecommended}
                    onChange={(e) => handleInputChange('finalRecommended', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-100 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Balance:
                  </label>
                  <input
                    type="text"
                    value={eligibilityData.balance}
                    onChange={(e) => handleInputChange('balance', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-100 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Min 20% of Balance:
                  </label>
                  <input
                    type="text"
                    value={eligibilityData.min20PercentOfBalance}
                    onChange={(e) => handleInputChange('min20PercentOfBalance', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-100 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Max 30% of Balance:
                  </label>
                  <input
                    type="text"
                    value={eligibilityData.max30PercentOfBalance}
                    onChange={(e) => handleInputChange('max30PercentOfBalance', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
                        : "bg-gray-100 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                    } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanEligibility;