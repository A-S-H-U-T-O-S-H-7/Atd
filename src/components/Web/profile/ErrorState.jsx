import { User } from 'lucide-react';

const ErrorState = ({ onRetry, isRefreshing }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-slate-700 mb-6">No profile data found</p>
        <button 
          onClick={onRetry}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200"
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Refreshing...' : 'Retry Loading'}
        </button>
      </div>
    </div>
  );
};

export default ErrorState;