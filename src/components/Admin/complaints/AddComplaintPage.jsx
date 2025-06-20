'use client';
import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import ComplaintFormFields from './ComplaintsFormFields';
import { useAdminAuth } from "@/lib/AdminAuthContext";

const AddComplaintPage = () => {
  const { isDark } = useAdminAuth();
  const [complaintDate, setComplaintDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [loanAcNo, setLoanAcNo] = useState('');
  const [loanProvider, setLoanProvider] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const payload = {
        complaintDate,
        customerName,
        mobileNo,
        email,
        loanAcNo,
        loanProvider,
      };
      
      console.log('Adding Complaint:', payload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form after successful submission
      setComplaintDate('');
      setCustomerName('');
      setMobileNo('');
      setEmail('');
      setLoanAcNo('');
      setLoanProvider('');
      
      alert('Complaint added successfully!');
    } catch (error) {
      console.error('Error adding complaint:', error);
      alert('Failed to add complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 `}
    >
      <div className="p-3 md:px-54 md:py-3 md:pt-10">
        {/* Header */}
        <div className=" mb-5 md:mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <button
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
              >
                <ArrowLeft
                  className={`w-4 h-4 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              </button>
              <div className="flex items-center space-x-3">
                <h1
                  className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${
                    isDark
                      ? "from-emerald-400 to-teal-400"
                      : "from-gray-800 to-black"
                  } bg-clip-text text-transparent`}
                >
                  Add Complaint
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div
          className={`rounded-xl shadow-xl border overflow-hidden ${
            isDark
              ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
              : "bg-white border-emerald-300 shadow-emerald-500/10"
          }`}
        >
          <div
            className={`px-4 py-3 border-b ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-900 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}
          >
            <h2
              className={`text-base font-bold ${
                isDark ? "text-gray-100" : "text-gray-700"
              }`}
            >
              Complaint Details
            </h2>
            <p
              className={`text-xs mt-1 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Fill in the details to register a new complaint
            </p>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              {/* Form Fields */}
              <ComplaintFormFields
              isDark={isDark}
                complaintDate={complaintDate}
                setComplaintDate={setComplaintDate}
                customerName={customerName}
                setCustomerName={setCustomerName}
                mobileNo={mobileNo}
                setMobileNo={setMobileNo}
                email={email}
                setEmail={setEmail}
                loanAcNo={loanAcNo}
                setLoanAcNo={setLoanAcNo}
                loanProvider={loanProvider}
                setLoanProvider={setLoanProvider}
              />

              {/* Submit Button */}
              <div className="flex justify-end pt-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg text-white text-sm font-bold transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:outline-none flex items-center space-x-2 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : isDark
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-500/50 shadow-lg shadow-emerald-500/25"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-500/50 shadow-lg shadow-emerald-500/25"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Submit Complaint</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComplaintPage;