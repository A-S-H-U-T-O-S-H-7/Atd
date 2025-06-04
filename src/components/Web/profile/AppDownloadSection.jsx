import React from 'react'

function AppDownloadSection() {
  return (
    <div>
      {/* App Download Section */}
      <div className="relative w-full py-12 px-6 sm:px-12 bg-blue-950 rounded-2xl overflow-hidden border border-dashed border-blue-700 flex flex-col items-center justify-center gap-10">
                {/* Abstract Glow Effects */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>

                {/* Heading */}
                <h2 className="text-white text-2xl sm:text-3xl font-bold text-center z-10">
                  Download the ATD Money App
                </h2>
                <p className="text-gray-300 text-center max-w-xl z-10">
                  Get instant personal loans with low interest rates. Download our app now from your favorite store and get started in minutes!
                </p>

                {/* Store Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 z-10">
                  {/* Google Play */}
                  <button className="group flex items-center gap-3 px-6 py-3 border border-green-600 rounded-xl cursor-pointer bg-white hover:bg-green-50 transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <img 
                      src="playstore.png" 
                      alt="Google Play Store"
                      className="h-10 w-10 object-contain"
                    />
                    <div className="text-left">
                      <p className="text-xs text-gray-500">Get it on</p>
                      <p className="text-sm font-semibold text-green-700">Google Play</p>
                    </div>
                  </button>

                  {/* Apple Store */}
                  <button className="group flex items-center gap-3 px-6 py-3 border border-gray-500 rounded-xl bg-white hover:bg-green-50 cursor-pointer transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-600">
                    <img 
                      src="apple.png" 
                      alt="Apple App Store"
                      className="h-10 w-10 object-contain"
                    />
                    <div className="text-left">
                      <p className="text-xs text-gray-500">Download on the</p>
                      <p className="text-sm font-semibold text-green-700">App Store</p>
                    </div>
                  </button>
                </div>
              </div>
    </div>
  )
}

export default AppDownloadSection
