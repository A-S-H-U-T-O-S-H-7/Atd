import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, Banknote, FileCheck } from 'lucide-react';

export default function LoanStatusTracker ({ loanStatus = 'applied' }) {
  // Loan status can be: 'applied', 'inprogress', 'sanctioned_approved', 'sanctioned_rejected', 'disbursed', 'closed'
  
  const getStatusConfig = (status) => {
    const configs = {
      applied: { label: 'Applied Successfully', color: 'blue', icon: FileCheck },
      inprogress: { label: 'In Progress', color: 'yellow', icon: Clock },
      sanctioned_approved: { label: 'Sanctioned - Approved', color: 'green', icon: CheckCircle },
      sanctioned_rejected: { label: 'Sanctioned - Rejected', color: 'red', icon: XCircle },
      disbursed: { label: 'Disbursed', color: 'emerald', icon: Banknote },
      closed: { label: 'Closed', color: 'gray', icon: CheckCircle }
    };
    return configs[status] || configs.applied;
  };

  const getProgressSteps = () => {
    const allSteps = [
      { key: 'applied', label: 'Applied', icon: FileCheck },
      { key: 'inprogress', label: 'In Progress', icon: Clock },
      { key: 'sanctioned', label: 'Sanctioned', icon: CheckCircle },
      { key: 'disbursed', label: 'Disbursed', icon: Banknote },
      { key: 'closed', label: 'Closed', icon: CheckCircle }
    ];

    const currentIndex = allSteps.findIndex(step => {
      if (loanStatus === 'sanctioned_approved') return step.key === 'sanctioned';
      if (loanStatus === 'sanctioned_rejected') return step.key === 'sanctioned';
      return step.key === loanStatus;
    });

    return allSteps.map((step, index) => {
      let status = 'pending';
      
      if (index < currentIndex) {
        status = 'completed';
      } else if (index === currentIndex) {
        if (loanStatus === 'sanctioned_rejected') {
          status = 'rejected';
        } else {
          status = 'current';
        }
      }

      return { ...step, status, index };
    });
  };

  const steps = getProgressSteps();
  const currentConfig = getStatusConfig(loanStatus);

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500 text-white';
      case 'current':
        return 'bg-blue-500 border-blue-500 text-white';
      case 'rejected':
        return 'bg-red-500 border-red-500 text-white';
      case 'pending':
      default:
        return 'bg-gray-100 border-gray-300 text-gray-400';
    }
  };

  const getConnectorColor = (index) => {
    const currentStep = steps.find(s => s.status === 'current' || s.status === 'rejected');
    const currentIndex = currentStep ? currentStep.index : -1;
    
    if (index < currentIndex) {
      return 'bg-green-400';
    }
    return 'bg-gray-200';
  };

  const handleBankReportClick = () => {
    // Placeholder for future API integration
    console.log('Bank Account Report button clicked');
  };

  return (
    <div className="bg-white rounded-xl mb-5 shadow-sm border border-gray-200 overflow-hidden max-w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-5 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">Loan Status</h3>
          
          {/* Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            loanStatus === 'sanctioned_rejected' 
              ? 'bg-red-50 text-red-600 border border-red-100'
              : loanStatus === 'closed'
              ? 'bg-gray-50 text-gray-600 border border-gray-100'
              : loanStatus === 'disbursed'
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : 'bg-blue-50 text-blue-600 border border-blue-100'
          }`}>
            {loanStatus === 'sanctioned_approved' ? 'APPROVED' : 
             loanStatus === 'sanctioned_rejected' ? 'REJECTED' : 
             loanStatus.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Milestones - Added min-height to prevent stretching */}
      <div className="p-5 min-h-[180px]">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center space-y-2">
                {/* Step Circle */}
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getStepColor(step.status)}`}>
                  <step.icon className="w-4 h-4" />
                </div>
                
                {/* Step Label */}
                <p className={`text-xs font-medium text-center ${
                  step.status === 'completed' ? 'text-green-600' :
                  step.status === 'current' ? 'text-blue-600' :
                  step.status === 'rejected' ? 'text-red-600' :
                  'text-gray-400'
                }`}>
                  {step.label}
                </p>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 rounded-full transition-all duration-300 ${getConnectorColor(index)}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Additional Info Messages */}
        {loanStatus === 'inprogress' && (
          <div className="mt-4 p-2 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-blue-700 mb-3">
              Loan application <span className="font-semibold">in progress</span>. For further processing select 
            
            <button 
              onClick={handleBankReportClick}
              className="bg-blue-600 hover:bg-blue-700 ml-3 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Bank Account Report
            </button>
            </p>
          </div>
        )}

        {/* {loanStatus === 'sanctioned_approved' && (
          <div className="mt-4 p-2 bg-pink-50 border border-pink-100 rounded-lg">
            <p className="text-sm text-pink-700 ">
              🎉 Congratulations! Your loan has been sanctioned. Please complete the formalities via the following steps: Video Verification, E-Mandate, and Digital loan agreement.
            </p>
          </div>
        )} */}

        {loanStatus === 'sanctioned_rejected' && (
          <div className="mt-4 p-2 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-700">
              Your loan application has been rejected. Please contact support for more information.
            </p>
          </div>
        )}

        {loanStatus === 'disbursed' && (
          <div className="mt-4 p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
            <p className="text-sm text-emerald-700">
              🎉 Congratulations! Your loan has been disbursed successfully.
            </p>
          </div>
        )}

        {loanStatus === 'closed' && (
          <div className="mt-4 p-2 bg-gray-50 border border-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">
              Your loan has been successfully closed. Thank you for banking with us!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};