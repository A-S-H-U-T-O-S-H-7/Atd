export default function LoadingSpinner({ isRefreshing }) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">
            {isRefreshing ? 'Refreshing session...' : 'Loading your profile...'}
          </p>
        </div>
      </div>
    );
  }