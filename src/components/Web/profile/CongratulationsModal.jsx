const CongratulationsModal = ({ show, onClose, userName }) => {
    if (!show) return null;
  
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform animate-bounce">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
          >
            <span className="text-gray-500 text-xl leading-none">&times;</span>
          </button>
          
          {/* Modal Content */}
          <div className="p-8 text-center">
            {/* Celebration Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-4xl">🎉</span>
              </div>
              <div className="flex justify-center space-x-2">
                <span className="text-2xl animate-bounce" style={{ animationDelay: '0s' }}>🎊</span>
                <span className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>✨</span>
                <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎈</span>
              </div>
            </div>
            
            {/* Congratulations Text */}
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Congratulations!
            </h2>
            <p className="text-xl text-gray-700 font-semibold mb-4">
              {userName} 🎊
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your loan application has been successfully submitted!<br />

              Welcome to ATD Money family.
            </p>
            
            {/* Success Badge */}
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 mb-6">
              <span className="text-green-500">✅</span>
              <span className="font-medium">Applied Successfully</span>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default CongratulationsModal;