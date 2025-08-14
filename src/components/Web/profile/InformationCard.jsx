import { CreditCard, History, AlertCircle } from 'lucide-react';

export default function LoanInformation({ loanHistory = [] }) {
  return (
    <div className="mt-6 md:my-5">
      <div className="bg-white rounded-xl shadow-md border border-purple-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-200 px-4 py-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <History className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Loan History</h3>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {loanHistory && loanHistory.length > 0 ? (
            <div className="space-y-3">
              {loanHistory.map((loan, index) => (
                <div key={index} className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-start space-x-3">
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
                          <p className="font-medium text-slate-800">₹{loan.amount}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Duration:</span>
                          <p className="font-medium text-slate-800">{loan.duration} months</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Applied:</span>
                          <p className="font-medium text-slate-800">{loan.appliedDate}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Rate:</span>
                          <p className="font-medium text-slate-800">{loan.interestRate}% p.a.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">No Loan History</h4>
              <p className="text-xs text-slate-500">
                You haven't applied for any loans yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}