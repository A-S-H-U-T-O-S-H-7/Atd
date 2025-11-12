import React, { useEffect } from 'react';
import { CreditCard, AlertTriangle } from 'lucide-react';

const LoanDetails = ({ formik, isDark, errors = {}, touched = {}  }) => {
  const inputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const errorInputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400"
      : "bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const errorSelectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400"
      : "bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const disabledInputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-800 border-gray-700 text-gray-200"
      : "bg-gray-100 border-gray-300 text-gray-800"
  } cursor-not-allowed`;

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const errorLabelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  const errorTextClassName = `text-xs mt-1 flex items-center space-x-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  // Helper function to check if field has error
  const hasError = (fieldName) => {
    return errors[fieldName] && touched[fieldName];
  };

  // Calculate Collection Amount
  const calculateCollectionAmount = () => {
    const approvedAmount = parseFloat(formik.values.amountApproved) || 0;
    const tenure = parseInt(formik.values.tenure) || 0;
    const roi = 0.067; 
    
    if (approvedAmount > 0 && tenure > 0) {
      const interestAmount = approvedAmount * tenure * (roi / 100);
      const totalAmount = approvedAmount + interestAmount;
      return Math.round(totalAmount); 
    }
    return approvedAmount;
  };

  // Calculate Administration Fee Amount
  const calculateAdministrationFee = () => {
    const approvedAmount = parseFloat(formik.values.amountApproved) || 0;
    const adminFeePercent = parseFloat(formik.values.administrationFeePercent) || 0;
    
    if (approvedAmount > 0 && adminFeePercent > 0) {
      const adminFee = approvedAmount * (adminFeePercent / 100);
      return Math.round(adminFee);
    }
    return 0;
  };

  // Calculate GST (18% of Administration Fee)
  const calculateGST = () => {
    const adminFee = calculateAdministrationFee();
    const gst = adminFee * 0.18;
    return Math.round(gst);
  };

  // FIXED: Only calculate when fields are empty (don't overwrite API data)
  useEffect(() => {
    console.log('LoanDetails - Current values:', {
      administrationFeePercent: formik.values.administrationFeePercent,
      administrationFeeAmount: formik.values.administrationFeeAmount,
      gst: formik.values.gst,
      amountApproved: formik.values.amountApproved
    });

    // Only calculate if fields are empty (not overwriting existing data)
    const collectionAmount = calculateCollectionAmount();
    
    if (!formik.values.collectionAmount) {
      formik.setFieldValue('collectionAmount', collectionAmount.toString());
    }

    if (!formik.values.emiCollectionAmount) {
      formik.setFieldValue('emiCollectionAmount', collectionAmount.toString());
    }

    // Only calculate administration fee and GST if percentage is provided AND amounts are empty
    if (formik.values.administrationFeePercent && (!formik.values.administrationFeeAmount || !formik.values.gst)) {
      const adminFeeAmount = calculateAdministrationFee();
      const gstAmount = calculateGST();

      if (!formik.values.administrationFeeAmount) {
        formik.setFieldValue('administrationFeeAmount', adminFeeAmount.toString());
      }

      if (!formik.values.gst) {
        formik.setFieldValue('gst', gstAmount.toString());
      }
    }
  }, [
    formik.values.amountApproved,
    formik.values.tenure,
    formik.values.administrationFeePercent
  ]);

  // Set default loan term to "One Time Payment" if empty
  useEffect(() => {
    if (!formik.values.loanTerm) {
      formik.setFieldValue('loanTerm', '4');
    }
  }, [formik.values.loanTerm]);

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
          {/* Amount Applied */}
          <div>
            <label className={hasError('amountApplied') ? errorLabelClassName : labelClassName}>
              Amount Applied
            </label>
            <input
              type="number"
              name="amountApplied"
              value={formik.values.amountApplied}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className={hasError('amountApplied') ? errorInputClassName : inputClassName}
              placeholder="Enter applied amount"
            />
            {hasError('amountApplied') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.amountApplied}</span>
              </div>
            )}
          </div>

          {/* Amount Approved - Non-editable */}
          <div>
            <label className={hasError('amountApproved') ? errorLabelClassName : labelClassName}>
              Amount Approved
            </label>
            <input
              type="number"
              name="amountApproved"
              value={formik.values.amountApproved}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={disabledInputClassName}
              placeholder="Approved amount"
              readOnly
            />
            {hasError('amountApproved') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.amountApproved}</span>
              </div>
            )}
          </div>

          {/* Loan Term - Default to One Time Payment */}
          <div>
            <label className={hasError('loanTerm') ? errorLabelClassName : labelClassName}>
              Loan Term
            </label>
            <select
              name="loanTerm"
              value={formik.values.loanTerm}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('loanTerm') ? errorSelectClassName : selectClassName}
            >
              <option value="4">One Time Payment</option>
            </select>
            {hasError('loanTerm') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.loanTerm}</span>
              </div>
            )}
          </div>

          {/* ROI */}
          <div>
            <label className={hasError('roi') ? errorLabelClassName : labelClassName}>
              ROI (%)
            </label>
            <input
              type="number"
              step="0.01"
              name="roi"
              value={formik.values.roi}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('roi') ? errorInputClassName : inputClassName}
              placeholder="Enter ROI"
            />
            {hasError('roi') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.roi}</span>
              </div>
            )}
          </div>

          {/* Tenure */}
          <div>
            <label className={hasError('tenure') ? errorLabelClassName : labelClassName}>
              Tenure (days)
            </label>
            <input
              type="number"
              name="tenure"
              value={formik.values.tenure}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('tenure') ? errorInputClassName : inputClassName}
              placeholder="Enter tenure"
            />
            {hasError('tenure') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.tenure}</span>
              </div>
            )}
          </div>

          {/* Collection Amount - Non-editable and auto-calculated */}
          <div>
            <label className={hasError('collectionAmount') ? errorLabelClassName : labelClassName}>
              Collection Amount
            </label>
            <input
              type="number"
              name="collectionAmount"
              value={formik.values.collectionAmount}
              className={disabledInputClassName}
              placeholder="Auto-calculated"
              readOnly
            />
            {hasError('collectionAmount') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.collectionAmount}</span>
              </div>
            )}
          </div>

          {/* EMI Collection Amount - Non-editable and same as Collection Amount */}
          <div>
            <label className={hasError('emiCollectionAmount') ? errorLabelClassName : labelClassName}>
              EMI Collection Amount
            </label>
            <input
              type="number"
              name="emiCollectionAmount"
              value={formik.values.emiCollectionAmount}
              className={disabledInputClassName}
              placeholder="Same as collection amount"
              readOnly
            />
            {hasError('emiCollectionAmount') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.emiCollectionAmount}</span>
              </div>
            )}
          </div>

          {/* Grace Period */}
          <div>
            <label className={hasError('gracePeriod') ? errorLabelClassName : labelClassName}>
              Grace Period (days)
            </label>
            <input
              type="number"
              name="gracePeriod"
              value={formik.values.gracePeriod}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('gracePeriod') ? errorInputClassName : inputClassName}
              placeholder="Enter grace period"
            />
            {hasError('gracePeriod') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.gracePeriod}</span>
              </div>
            )}
          </div>

          {/* Administration Fee Percent - Extended options 1% to 15% */}
          <div>
            <label className={hasError('administrationFeePercent') ? errorLabelClassName : labelClassName}>
              Administration Fee (%)
            </label>
            <select
              name="administrationFeePercent"
              value={formik.values.administrationFeePercent}
              onChange={(e) => {
                console.log('Administration Fee % changed to:', e.target.value);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              className={hasError('administrationFeePercent') ? errorSelectClassName : selectClassName}
            >
              <option value="">Please Select</option>
              {Array.from({ length: 15 }, (_, i) => i + 1).map(percent => (
                <option key={percent} value={percent}>
                  {percent}%
                </option>
              ))}
            </select>
            {hasError('administrationFeePercent') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.administrationFeePercent}</span>
              </div>
            )}
          </div>

          {/* Administration Fee Amount - Non-editable and auto-calculated */}
          <div>
            <label className={hasError('administrationFeeAmount') ? errorLabelClassName : labelClassName}>
              Administration Fee Amount
            </label>
            <input
              type="number"
              name="administrationFeeAmount"
              value={formik.values.administrationFeeAmount}
              className={disabledInputClassName}
              placeholder="Auto-calculated"
              readOnly
            />
            {hasError('administrationFeeAmount') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.administrationFeeAmount}</span>
              </div>
            )}
          </div>

          {/* GST - Non-editable and auto-calculated */}
          <div>
            <label className={hasError('gst') ? errorLabelClassName : labelClassName}>
              GST
            </label>
            <input
              type="number"
              name="gst"
              value={formik.values.gst}
              className={disabledInputClassName}
              placeholder="Auto-calculated"
              readOnly
            />
            {hasError('gst') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.gst}</span>
              </div>
            )}
          </div>

          {/* Redeem Points */}
          <div>
            <label className={hasError('redeemPoints') ? errorLabelClassName : labelClassName}>
              Redeem Points
            </label>
            <input
              type="number"
              name="redeemPoints"
              value={formik.values.redeemPoints}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('redeemPoints') ? errorInputClassName : inputClassName}
              placeholder="Enter redeem points"
            />
            {hasError('redeemPoints') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{errors.redeemPoints}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;