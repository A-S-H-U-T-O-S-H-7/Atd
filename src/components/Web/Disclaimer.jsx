'use client';

import { useState } from 'react';

export default function Disclaimer() {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">Disclaimer</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Important regulatory information regarding ATD Money and the Reserve Bank of India.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-10">
          <div className="p-6 sm:p-8 bg-amber-600 text-white">
            <h2 className="text-2xl font-bold">Reserve Bank of India Disclaimer</h2>
            <p className="mt-2 text-amber-100">
              Please review this important disclaimer from the Reserve Bank of India regarding our company.
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="accordion-item">
              <button
                onClick={toggleExpanded}
                className="w-full px-6 py-5 sm:px-8 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg sm:text-xl font-medium text-gray-900">Official RBI Disclaimer</h3>
                <svg
                  className={`w-6 h-6 text-amber-600 transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expanded && (
                <div className="px-6 py-5 sm:px-8 bg-gray-50 text-gray-700 prose prose-amber max-w-none">
                  <div className="p-6 bg-amber-50 rounded-lg border border-amber-200 mb-6">
                    <p className="text-lg italic text-gray-800 font-medium leading-relaxed">
                      "Reserve Bank of India does not accept any responsibility or guarantee about the present position as to the financial soundness of the Company or the correctness of any of the statements or representations made or opinions expressed by the Company and for discharge of liability by the Company. Neither is there any provision in law to keep, nor does the Company keep any part of the deposits with the Reserve Bank of India and by issuing the Certificate of Registration to the Company, the Reserve Bank neither accepts any responsibility nor guarantee for the payment of the deposit amount of any depositor."
                    </p>
                  </div>
                  
                 
                </div>
              )}
            </div>
          </div>
        </div>
        
        
        
        <div className="bg-amber-600 rounded-xl shadow-xl overflow-hidden mb-10">
          <div className="p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Questions?</h3>
            </div>
            <p className="mt-4">
              If you have any questions about this disclaimer or would like to learn more about our financial services and how we protect your investments, please reach out to our support team.
            </p>
            <div className="mt-6 inline-flex rounded-md shadow">
              <a
                href="/contactus"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-amber-600 bg-white hover:bg-amber-50"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
        
        <footer className="text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} ATD Money. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}