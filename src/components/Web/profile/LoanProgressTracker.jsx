import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, Banknote, FileCheck, Landmark } from 'lucide-react';

export default function LoanStatusTracker ({ loanStatus = 2 }) {
  const getLoanStatusLabel = (statusCode) => {
    switch (parseInt(statusCode)) {
      case 2: return 'applied';
      case 4: return 'applied';
      case 5: return 'inprogress';
      case 3: return 'rejected';

      case 6: return 'sanctioned';
      case 7: return 'sanctioned';
      case 8: return 'sanctioned';
      case 9: return 'sanctioned';

      case 10: return 'disbursed'; 
      case 11: return 'disbursed'; 
      case 12: return 'disbursed';

      case 13: return 'closed';
      
      default: return 'applied';
    }
  };

  const statusLabel = getLoanStatusLabel(loanStatus);
  
  const getStatusConfig = (status) => {
    const configs = {
      applied: { label: 'Applied Successfully', color: 'blue', icon: FileCheck },
      inprogress: { label: 'In Progress', color: 'yellow', icon: Clock },
      sanctioned: { label: 'Sanctioned', color: 'green', icon: CheckCircle },
      rejected: { label: 'Rejected', color: 'red', icon: XCircle },
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
      if (statusLabel === 'rejected') return step.key === 'sanctioned';
      return step.key === statusLabel;
    });

    return allSteps.map((step, index) => {
      let status = 'pending';
      
      if (index < currentIndex) {
        status = 'completed';
      } else if (index === currentIndex) {
        if (statusLabel === 'rejected') {
          status = 'rejected';
        } else {
          status = 'current';
        }
      }

      return { ...step, status, index };
    });
  };

  const steps = getProgressSteps();
  const currentConfig = getStatusConfig(statusLabel);

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
    <div className="bg-white rounded-xl mb-5 shadow-sm border border-dashed border-cyan-500  overflow-hidden max-w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-5 py-3 border-b border-cyan-300">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">Loan Status</h3>
          
          {/* Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusLabel === 'rejected' 
              ? 'bg-red-50 text-red-600 border border-red-100'
              : statusLabel === 'closed'
              ? 'bg-gray-50 text-gray-600 border border-gray-100'
              : statusLabel === 'disbursed'
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : statusLabel === 'sanctioned'
              ? 'bg-green-50 text-green-600 border border-green-100'
              : 'bg-blue-50 text-blue-600 border border-blue-100'
          }`}>
            {statusLabel.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Milestones */}
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
        {statusLabel === 'inprogress' && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="text-sm italic text-blue-700">
                <span>Loan application </span>
                <span className="font-semibold">in progress.</span><br/>
                <span>For further processing select:</span>
              </div>
                     
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-blue-100 border-2 border-blue-300 flex flex-col items-center justify-center w-16 h-16 shadow-sm">
                  <Landmark className="text-blue-600 w-4 h-4" />
                  <p className="text-xs font-semibold text-blue-700 mt-0.5">Report</p>
                </div>
                         
                <button
                  onClick={handleBankReportClick}
                  className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
                >
                  Bank Account Report
                </button>
              </div>
            </div>
          </div>
        )}

        {statusLabel === 'rejected' && (
          <div className="mt-4 p-2 italic bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-700">
            💔 Your loan application has been declined at this time 😔. You're welcome to reapply after 30 days </p>
          </div>
        )}

        {statusLabel === 'disbursed' && (
          <div className="mt-4 p-2 italic bg-emerald-50 border border-emerald-100 rounded-lg">
            <p className="text-sm text-emerald-700">
              🎉 Congratulations! Your loan has been disbursed successfully.
            </p>
          </div>
        )}

        {statusLabel === 'closed' && (
          <div className="mt-4 p-2 italic bg-gray-50 border border-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">
              🙏 Your loan has been successfully closed. Thank you for banking with us!✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}