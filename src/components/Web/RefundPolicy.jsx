'use client';

import { useState } from 'react';

export default function CancellationRefundPolicy() {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className=" bg-gradient-to-br from-teal-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">Cancellation & Refund Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            At ATD Money we value our customers and are committed to providing best services.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-10">
          <div className="p-6 sm:p-8 bg-teal-600 text-white">
            <h2 className="text-2xl font-bold">Cancellation & Refund Policy Overview</h2>
            <p className="mt-2 text-teal-100">
              We strongly recommend that before making a payment, our visitors and potential clients should read the refund policy.
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="accordion-item">
              <button
                onClick={toggleExpanded}
                className="w-full px-6 py-5 sm:px-8 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg sm:text-xl font-medium text-gray-900">Refund Conditions</h3>
                <svg
                  className={`w-6 h-6 text-teal-600 transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expanded && (
                <div className="px-6 py-5 sm:px-8 bg-gray-50 text-gray-700 prose prose-teal max-w-none">
                  <p className="mb-4">Refund process will only be initiated by ATD Money in following conditions:</p>
                  
                  <ol className="list-decimal ml-6 space-y-4">
                    <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
                      If repayment of the loan has been done by the borrower twice by any means.
                    </li>
                    <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
                      Any extra payment has been received by ATD Money over and above the repayment value in any case.
                    </li>
                    <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
                      Repayment has been done mistakenly by the borrower unintentionally before his/her the due date of loan repayment.
                    </li>
                  </ol>
                  
                  <div className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <h4 className="text-lg font-medium text-teal-800 mb-2">Customer Satisfaction</h4>
                    <p className="text-teal-700">
                      If for some unforeseen reason, the client is not satisfied with our services, they may call us to seek direction on future calls. We will give our best effort to increase the satisfaction levels in such cases.
                    </p>
                  </div>
                  
                  <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h5 className="text-gray-900 font-medium">Important Note</h5>
                        <p className="text-gray-700 text-sm mt-1">
                          If the customer is eligible for the refund then the refund amount would be credited in the respective bank account within 7 working days.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-10">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Request a Refund</h3>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                    <span className="text-xl font-bold">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Contact Customer Support</h4>
                  <p className="mt-1 text-gray-600">Reach out to our customer support team through our official contact channels.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                    <span className="text-xl font-bold">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Provide Transaction Details</h4>
                  <p className="mt-1 text-gray-600">Share your transaction ID and relevant payment information.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                    <span className="text-xl font-bold">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Verification Process</h4>
                  <p className="mt-1 text-gray-600">Our team will verify your refund eligibility based on the conditions mentioned above.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                    <span className="text-xl font-bold">4</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Refund Processing</h4>
                  <p className="mt-1 text-gray-600">If eligible, your refund will be processed within 7 working days to your registered bank account.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-teal-600 rounded-xl shadow-xl overflow-hidden mb-10">
          <div className="p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Need Help?</h3>
            </div>
            <p className="mt-4">
              If you have any questions or need assistance regarding our cancellation and refund policy, please don't hesitate to contact our customer support team.
            </p>
            <div className="mt-6 inline-flex rounded-md shadow">
              <a
                href="/contactus"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50"
              >
                Contact Support
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