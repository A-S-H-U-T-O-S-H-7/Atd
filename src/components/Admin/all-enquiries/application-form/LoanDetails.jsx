import React from 'react';
import { CreditCard } from 'lucide-react';

const LoanDetails = ({ formik, isDark }) => {
  const inputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCard className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Loan Details
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClassName}>Amount Applied</label>
            <input
              type="number"
              name="amountApplied"
              value={formik.values.amountApplied}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter applied amount"
            />
          </div>

          <div>
            <label className={labelClassName}>Amount Approved</label>
            <input
              type="number"
              name="amountApproved"
              value={formik.values.amountApproved}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter approved amount"
            />
          </div>

          <div>
            <label className={labelClassName}>Loan Term</label>
            <select
              name="loanTerm"
              value={formik.values.loanTerm}
              onChange={formik.handleChange}
              className={selectClassName}
            >
              <option value="">Select Loan Term</option>
              <option value="1">One Day</option>
               <option value="4">One Time Payment</option>
              
            </select>
          </div>

          <div>
            <label className={labelClassName}>ROI (%)</label>
            <input
              type="number"
              step="0.01"
              name="roi"
              value={formik.values.roi}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter ROI"
            />
          </div>

          <div>
            <label className={labelClassName}>Tenure (months)</label>
            <input
              type="number"
              name="tenure"
              value={formik.values.tenure}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter tenure"
            />
          </div>

          <div>
            <label className={labelClassName}>Collection Amount</label>
            <input
              type="number"
              name="collectionAmount"
              value={formik.values.collectionAmount}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter collection amount"
            />
          </div>

          <div>
            <label className={labelClassName}>EMI Collection Amount</label>
            <input
              type="number"
              name="emiCollectionAmount"
              value={formik.values.emiCollectionAmount}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter EMI collection amount"
            />
          </div>

          <div>
            <label className={labelClassName}>Grace Period (days)</label>
            <input
              type="number"
              name="gracePeriod"
              value={formik.values.gracePeriod}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter grace period"
            />
          </div>

          <div>
            <label className={labelClassName}>Administration Fee (%)</label>
            <select
              name="administrationFeePercent"
              value={formik.values.administrationFeePercent}
              onChange={formik.handleChange}
              className={selectClassName}
            >
              <option value="">Please Select</option>
              <option value="1">1%</option>
              <option value="2">2%</option>
              <option value="3">3%</option>
              <option value="4">4%</option>
              <option value="5">5%</option>
            </select>
          </div>

          <div>
            <label className={labelClassName}>Administration Fee Amount</label>
            <input
              type="number"
              name="administrationFeeAmount"
              value={formik.values.administrationFeeAmount}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter fee amount"
            />
          </div>

          <div>
            <label className={labelClassName}>GST</label>
            <input
              type="number"
              name="gst"
              value={formik.values.gst}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter GST amount"
            />
          </div>

          <div>
            <label className={labelClassName}>Redeem Points</label>
            <input
              type="number"
              name="redeemPoints"
              value={formik.values.redeemPoints}
              onChange={formik.handleChange}
              className={inputClassName}
              placeholder="Enter redeem points"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;