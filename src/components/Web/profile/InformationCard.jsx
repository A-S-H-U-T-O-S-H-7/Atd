import { useState } from 'react';
import { User, Calendar, FileText, CreditCard, Hash, ChevronDown, ChevronUp, History, AlertCircle } from 'lucide-react';

const InfoItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-100 hover:shadow-sm transition-all duration-200">
    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200 shadow-sm">
      <Icon className="w-4 h-4 text-slate-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-slate-600 mb-1">{label}</p>
      <p className="text-sm text-slate-800 font-medium break-words">{value || 'Not provided'}</p>
    </div>
  </div>
);

const CollapsibleCard = ({ title, icon: Icon, children, bgColor, borderColor, iconBg, isExpanded, onToggle }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md border-1 border-dashed ${borderColor} overflow-hidden transition-all duration-300 ${isExpanded ? 'row-span-2' : ''}`}>
      <div 
        className={`${bgColor} px-4 py-3 border-b border-slate-200 cursor-pointer hover:opacity-90 transition-opacity`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center shadow-lg`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-slate-600 font-medium hidden sm:block">
              {isExpanded ? 'Hide' : 'Show'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-600" />
            )}
          </div>
        </div>
      </div>
      
      {/* Expandable Content */}
      <div className={`overflow-hidden transition-all duration-300 ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function InformationCards({ user, loanHistory = [] }) {
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardToggle = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="mt-6 md:mt-0">
      {/* Three Column Grid - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 auto-rows-min">
        {/* Personal Information */}
        <CollapsibleCard
          title="Personal Information"
          icon={User}
          bgColor="bg-gradient-to-r from-blue-100 to-blue-200"
          borderColor="border-blue-400"
          iconBg="bg-gradient-to-r from-blue-500 to-blue-600"
          isExpanded={expandedCard === 'personal'}
          onToggle={() => handleCardToggle('personal')}
        >
          <div className="space-y-3">
            <InfoItem label="Full Name" value={`${user?.fname || ''} ${user?.lname || ''}`} icon={User} />
            <InfoItem label="Date of Birth" value={user?.dob} icon={Calendar} />
            <InfoItem label="Gender" value={user?.gender} icon={User} />
            <InfoItem label="Father's Name" value={user?.fathername} icon={User} />
          </div>
        </CollapsibleCard>

        {/* Account Details */}
        <CollapsibleCard
          title="Account Details"
          icon={FileText}
          bgColor="bg-gradient-to-r from-green-100 to-green-200"
          borderColor="border-green-300"
          iconBg="bg-gradient-to-r from-green-500 to-green-600"
          isExpanded={expandedCard === 'account'}
          onToggle={() => handleCardToggle('account')}
        >
          <div className="space-y-3">
            <InfoItem label="CRN Number" value={user?.crnno || 'Not provided'} icon={Hash} />
            <InfoItem label="Account Number" value={user?.accountId || 'Not provided'} icon={CreditCard} />
            <InfoItem label="Aadhar Number" value={user?.aadhar_no || 'Not provided'} icon={CreditCard} />
            <InfoItem label="PAN Number" value={user?.pan_no || 'Not provided'} icon={FileText} />
          </div>
        </CollapsibleCard>

        {/* Loan History */}
        <CollapsibleCard
          title="Loan History"
          icon={History}
          bgColor="bg-gradient-to-r from-purple-100 to-indigo-200"
          borderColor="border-purple-400"
          iconBg="bg-gradient-to-r from-purple-500 to-indigo-600"
          isExpanded={expandedCard === 'loans'}
          onToggle={() => handleCardToggle('loans')}
        >
          {loanHistory && loanHistory.length > 0 ? (
            <div className="space-y-3">
              {loanHistory.map((loan, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-purple-200 shadow-sm">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-semibold text-slate-800">Loan #{loan.id}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        loan.status === 'completed' ? 'bg-green-100 text-green-700' :
                        loan.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {loan.status?.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-600">Amount:</span>
                        <p className="font-medium">₹{loan.amount}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Duration:</span>
                        <p className="font-medium">{loan.duration} months</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Applied:</span>
                        <p className="font-medium">{loan.appliedDate}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Rate:</span>
                        <p className="font-medium">{loan.interestRate}% p.a.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">No Loan History</h4>
              <p className="text-xs text-slate-500 mb-4">
                You haven't applied for any loans yet.
              </p>
              <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                Apply for Loan
              </button>
            </div>
          )}
        </CollapsibleCard>
      </div>
    </div>
  );
}