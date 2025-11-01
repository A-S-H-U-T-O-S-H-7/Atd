import React, { useEffect } from 'react';
import { CreditCard, AlertTriangle } from 'lucide-react';

const LoanDetails = ({ formik, isDark, errors = {} }) => {
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
      ? "bg-gray-800 border-gray-700 text-gray-400"
      : "bg-gray-100 border-gray-300 text-gray-500"
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

  // Helper function to get field error
  const getFieldError = (fieldName) => {
    const possibleNames = [
      fieldName,
      fieldName.replace(/([A-Z])/g, '_$1').toLowerCase(),
      fieldName.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
    ];
    
    for (const name of possibleNames) {
      if (errors[name]) {
        return errors[name];
      }
    }
    return null;
  };

  // Helper function to check if field has error
  const hasError = (fieldName) => {
    return getFieldError(fieldName) !== null;
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
      return Math.round(adminFee); // Round to nearest integer
    }
    return 0;
  };

  // Calculate GST (18% of Administration Fee)
  const calculateGST = () => {
    const adminFee = calculateAdministrationFee();
    const gst = adminFee * 0.18;
    return Math.round(gst); // Round to nearest integer
  };

  // Update calculated fields when dependencies change
  useEffect(() => {
    const collectionAmount = calculateCollectionAmount();
    const adminFeeAmount = calculateAdministrationFee();
    const gstAmount = calculateGST();

    // Update formik values if they don't match calculated values
    if (formik.values.collectionAmount !== collectionAmount.toString()) {
      formik.setFieldValue('collectionAmount', collectionAmount);
    }

    if (formik.values.emiCollectionAmount !== collectionAmount.toString()) {
      formik.setFieldValue('emiCollectionAmount', collectionAmount);
    }

    if (formik.values.administrationFeeAmount !== adminFeeAmount.toString()) {
      formik.setFieldValue('administrationFeeAmount', adminFeeAmount);
    }

    if (formik.values.gst !== gstAmount.toString()) {
      formik.setFieldValue('gst', gstAmount);
    }
  }, [
    formik.values.amountApproved,
    formik.values.tenure,
    formik.values.administrationFeePercent,
    formik.values.collectionAmount,
    formik.values.emiCollectionAmount,
    formik.values.administrationFeeAmount,
    formik.values.gst
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
              onChange={formik.handleChange}
              className={hasError('amountApplied') ? errorInputClassName : inputClassName}
              placeholder="Enter applied amount"
            />
            {hasError('amountApplied') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('amountApplied')}</span>
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
              className={disabledInputClassName}
              placeholder="Approved amount"
              readOnly
            />
            {hasError('amountApproved') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('amountApproved')}</span>
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
              className={hasError('loanTerm') ? errorSelectClassName : selectClassName}
            >
              <option value="4">One Time Payment</option>
            </select>
            {hasError('loanTerm') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('loanTerm')}</span>
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
              className={hasError('roi') ? errorInputClassName : inputClassName}
              placeholder="Enter ROI"
            />
            {hasError('roi') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('roi')}</span>
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
              className={hasError('tenure') ? errorInputClassName : inputClassName}
              placeholder="Enter tenure"
            />
            {hasError('tenure') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('tenure')}</span>
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
              value={calculateCollectionAmount()}
              className={disabledInputClassName}
              placeholder="Auto-calculated"
              readOnly
            />
            {hasError('collectionAmount') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('collectionAmount')}</span>
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
              value={calculateCollectionAmount()}
              className={disabledInputClassName}
              placeholder="Same as collection amount"
              readOnly
            />
            {hasError('emiCollectionAmount') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('emiCollectionAmount')}</span>
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
              className={hasError('gracePeriod') ? errorInputClassName : inputClassName}
              placeholder="Enter grace period"
            />
            {hasError('gracePeriod') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('gracePeriod')}</span>
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
              onChange={formik.handleChange}
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
                <span>{getFieldError('administrationFeePercent')}</span>
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
              value={calculateAdministrationFee()}
              className={disabledInputClassName}
              placeholder="Auto-calculated"
              readOnly
            />
            {hasError('administrationFeeAmount') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('administrationFeeAmount')}</span>
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
              value={calculateGST()}
              className={disabledInputClassName}
              placeholder="Auto-calculated"
              readOnly
            />
            {hasError('gst') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('gst')}</span>
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
              className={hasError('redeemPoints') ? errorInputClassName : inputClassName}
              placeholder="Enter redeem points"
            />
            {hasError('redeemPoints') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('redeemPoints')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;