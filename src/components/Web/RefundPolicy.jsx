import React from "react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-teal-50 text-gray-800 p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-teal-700 mb-6">
          Cancellation & Refund Policy
        </h1>

        <p className="mb-4">
          At <span className="font-semibold text-teal-600">ATD Money</span>, we value our customers and are committed to providing the best services.
        </p>

        <h2 className="text-2xl font-semibold text-teal-600 mb-4">Refund Conditions:</h2>
        <ul className="list-disc list-inside space-y-3 mb-6">
          <li>
            If loan repayment has been made twice by any means.
          </li>
          <li>
            If any extra payment is received over the repayment value.
          </li>
          <li>
            If repayment was made unintentionally before the due date.
          </li>
        </ul>

        <p className="mb-4">
          If you're not satisfied with our services, you can call us for assistance. We’ll do our best to improve your experience.
        </p>

        <p className="mb-4">
          We strongly recommend reading the refund policy before making a payment.
        </p>

        <p className="mb-4">
          If eligible, the refund will be credited to your bank account within <span className="font-medium text-teal-600">7 working days</span>.
        </p>

        <div className="text-sm text-gray-500 mt-6">
          For support, contact us anytime. Your satisfaction is our priority.
        </div>
      </div>
    </div>
  );
}
