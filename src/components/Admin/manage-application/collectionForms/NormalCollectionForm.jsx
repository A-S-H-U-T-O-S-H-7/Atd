"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X, Calendar, Banknote, AlertCircle, ArrowRight } from "lucide-react";
import { collectionService } from "@/lib/services/colletionForms/CollectionService";
import { manageApplicationService } from "@/lib/services/ManageApplicationServices";
import toast from "react-hot-toast";

const NormalCollectionForm = ({ 
  isOpen,
  onClose, 
  application,
  onCollectionSubmit,
  isDark
}) => {
  const [collectionData, setCollectionData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [banks, setBanks] = useState([]);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validation Schema
  const validationSchema = Yup.object({
    collectionDate: Yup.string()
      .required('Collection date is required')
      .test('is-valid-date', 'Please select a valid date', value => {
        if (!value) return false;
        return new Date(value) <= new Date();
      }),
    collectionAmount: Yup.number()
      .typeError('Collection amount must be a number')
      .min(0.01, 'Collection amount must be greater than 0')
      .required('Collection amount is required'),
    collectionBy: Yup.string()
      .required('Collection method is required')
      .oneOf(['by bank', 'by cash'], 'Invalid collection method'),
    bounceCharge: Yup.number()
      .typeError('Bounce charge must be a number')
      .min(0, 'Bounce charge cannot be negative')
      .required('Bounce charge is required'),
    transactionId: Yup.string()
      .when('collectionBy', {
        is: 'by bank',
        then: (schema) => schema.required('Transaction ID is required for bank collection'),
        otherwise: (schema) => schema.notRequired()
      }),
    bankId: Yup.string()
      .when('collectionBy', {
        is: 'by bank',
        then: (schema) => schema.required('Bank selection is required for bank collection'),
        otherwise: (schema) => schema.notRequired()
      }),
    normalInterest: Yup.number()
      .min(0, 'Normal interest cannot be negative')
      .required('Normal interest is required'),
    penalInterest: Yup.number()
      .min(0, 'Penal interest cannot be negative')
      .required('Penal interest is required'),
    penaltyInput: Yup.number()
      .min(0, 'Penalty cannot be negative')
      .required('Penalty is required'),
    totalDueAmount: Yup.number()
      .min(0, 'Total due amount cannot be negative')
      .required('Total due amount is required')
  });

  // Initial Values
  const initialValues = {
    collectionDate: "",
    collectionAmount: "",
    collectionBy: "",
    bounceCharge: "0",
    transactionId: "",
    bankId: "",
    bankName: "",
    normalInterest: "0",
    penalInterest: "0",
    penaltyInput: "0",
    totalDueAmount: "0"
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await handleSubmit(values);
    },
    enableReinitialize: false
  });

  useEffect(() => {
    if (isOpen) {
      fetchBanks();
      if (application) {
        // Reset form when modal opens with new application
        formik.resetForm();
        setCollectionData(null);
        setSelectedBankDetails(null);
      }
    }
  }, [isOpen, application]);

  const fetchBanks = async () => {
    try {
      const response = await collectionService.getBankList();
      if (response.success) {
        setBanks(response.bank || []);
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
      toast.error("Failed to load bank list");
    }
  };

  const fetchBankDetails = async (bankId) => {
    try {
      const response = await collectionService.getBankDetails(bankId);
      if (response.success) {
        setSelectedBankDetails(response.bank);
      } else {
        setSelectedBankDetails(null);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      setSelectedBankDetails(null);
    }
  };

  const calculateCharges = async (date) => {
    if (!application?.id || !date) return;

    try {
      setApiLoading(true);
      setApiError(null);
      
      const response = await collectionService.calculateCollection(
        application.id, 
        date
      );
      
      if (response.success && response.data) {
        setCollectionData(response.data);
        
        const {
          principal_amount,
          normal_interest_before,
          normal_interest_after,
          penal_interest_before,
          penal_interest_after,
          penalty_before,
          penalty_after,
          bounce_amount,
          disburse_bank
        } = response.data;

        const normalInterestTotal = (parseFloat(normal_interest_before || 0) + parseFloat(normal_interest_after || 0));
        const penalInterestTotal = (parseFloat(penal_interest_before || 0) + parseFloat(penal_interest_after || 0));
        const penaltyTotal = (parseFloat(penalty_before || 0) + parseFloat(penalty_after || 0));

        const totalDue = parseFloat(principal_amount || 0) + 
                        normalInterestTotal + 
                        penalInterestTotal + 
                        penaltyTotal + 
                        parseFloat(bounce_amount || 0);

        // Update formik values
        await formik.setValues({
          ...formik.values,
          collectionDate: date,
          normalInterest: normalInterestTotal.toFixed(2),
          penalInterest: penalInterestTotal.toFixed(2),
          penaltyInput: penaltyTotal.toFixed(2),
          bounceCharge: bounce_amount || "0",
          totalDueAmount: totalDue.toFixed(2)
        });

        // Auto-select bank if disburse bank matches
        if (disburse_bank && banks.length > 0) {
          const bankName = disburse_bank.split('-')[0];
          const bank = banks.find(b => b.bank_name.includes(bankName));
          if (bank) {
            await formik.setFieldValue('bankId', bank.id.toString());
            await formik.setFieldValue('bankName', bank.bank_name);
            fetchBankDetails(bank.id);
          }
        }

        toast.success('Charges calculated successfully');
      } else {
        throw new Error(response.message || "Failed to calculate charges");
      }
    } catch (error) {
      console.error("Error calculating charges:", error);
      setApiError(error.message || "Failed to calculate charges");
      toast.error('Failed to calculate charges for selected date');
    } finally {
      setApiLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFormikChange = async (e) => {
    const { name, value } = e.target;
    
    // Let Formik handle the change
    await formik.setFieldValue(name, value);
    
    if (name === "collectionDate" && value) {
      calculateCharges(value);
    } else if (name === "collectionBy" && value === "by cash") {
      // Clear bank-related fields when switching to cash
      await formik.setFieldValue('bankId', '');
      await formik.setFieldValue('bankName', '');
      await formik.setFieldValue('transactionId', '');
      setSelectedBankDetails(null);
    } else if (name === "bankId") {
      const selectedBank = banks.find(bank => bank.id.toString() === value);
      if (selectedBank) {
        await formik.setFieldValue('bankName', selectedBank.bank_name);
        fetchBankDetails(selectedBank.id);
      } else {
        await formik.setFieldValue('bankName', '');
        setSelectedBankDetails(null);
      }
    } else if (name === "bounceCharge") {
      // Recalculate total when bounce charge changes
      setTimeout(() => recalculateTotal(), 100);
    }
  };

  const recalculateTotal = () => {
    const principal = parseFloat(collectionData?.principal_amount || 0);
    const normalInt = parseFloat(formik.values.normalInterest || 0);
    const penalInt = parseFloat(formik.values.penalInterest || 0);
    const penalty = parseFloat(formik.values.penaltyInput || 0);
    const bounce = parseFloat(formik.values.bounceCharge || 0);
    
    const totalDue = principal + normalInt + penalInt + penalty + bounce;
    
    formik.setFieldValue('totalDueAmount', totalDue.toFixed(2));
  };

  const handleSubmit = async (values) => {
    if (!collectionData) {
      toast.error('Please select a collection date to calculate charges first');
      return;
    }

    try {
      setLoading(true);
      
      const submissionData = {
        collectionDate: values.collectionDate,
        normalInterestBefore: parseFloat(collectionData?.normal_interest_before || 0),
        normalInterestAfter: parseFloat(collectionData?.normal_interest_after || 0),
        penalInterestBefore: parseFloat(collectionData?.penal_interest_before || 0),
        penalInterestAfter: parseFloat(collectionData?.penal_interest_after || 0),
        penaltyBefore: parseFloat(collectionData?.penalty_before || 0),
        penaltyAfter: parseFloat(collectionData?.penalty_after || 0),
        bounceCharge: parseFloat(values.bounceCharge || 0),
        totalDueAmount: parseFloat(values.totalDueAmount || 0),
        collectionAmount: parseFloat(values.collectionAmount),
        transactionId: values.transactionId,
        collectionBy: values.collectionBy,
        bankId: values.bankId
      };
      
      await collectionService.submitNormalCollection(
        application.id, 
        submissionData, 
        collectionData
      );
      
      if (onCollectionSubmit) {
        await onCollectionSubmit(application.id, submissionData);
      }
      
      toast.success('Collection submitted successfully');
      onClose();
    } catch (error) {
      console.error("Collection error:", error);
      toast.error(error.message || 'Failed to process collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount || 0);
    return `${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Helper function to render form field with error
  const renderField = (name, label, type = "text", options = {}) => {
    const { isReadOnly = false, isRequired = true, showError = true, placeholder = "", customClass = "" } = options;
    const error = formik.touched[name] && formik.errors[name];
    const value = formik.values[name];

    if (type === "select") {
      return (
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            {label} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <select
            name={name}
            value={value}
            onChange={handleFormikChange}
            onBlur={formik.handleBlur}
            disabled={options.disabled || false}
            className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
              isDark 
                ? options.disabled
                  ? "bg-gray-600/50 border-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gray-600 border-gray-500 text-white"
                : options.disabled
                  ? "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-white border-gray-300 text-gray-900"
            } ${error ? 'border-red-500' : ''} ${customClass}`}
            required={isRequired}
          >
            {options.children}
          </select>
          {showError && error && (
            <div className="text-red-500 text-xs mt-1">{error}</div>
          )}
        </div>
      );
    }

    return (
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}>
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleFormikChange}
          onBlur={formik.handleBlur}
          readOnly={isReadOnly}
          disabled={options.disabled || false}
          placeholder={placeholder}
          className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
            isDark 
              ? isReadOnly || options.disabled
                ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                : "bg-gray-600 border-gray-500 text-white placeholder-gray-400"
              : isReadOnly || options.disabled
                ? "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          } ${error ? 'border-red-500' : ''} ${customClass}`}
          step={type === "number" ? "0.01" : undefined}
          min={type === "number" ? "0" : undefined}
          max={name === "collectionDate" ? new Date().toISOString().split('T')[0] : undefined}
          required={isRequired}
        />
        {showError && error && (
          <div className="text-red-500 text-xs mt-1">{error}</div>
        )}
      </div>
    );
  };

  // Get data from collectionData (API response) instead of applicationData
  const sanctionAmount = application?.approvedAmount || "0"; 
  const principalAmount = collectionData?.principal_amount || "0";
  const amtDisbursedFrom = collectionData?.disburse_bank || "";
  const lastCollectionDate = collectionData?.last_collection_date || "";

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all ${
          isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10 ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}>
          <h2 className={`text-xl font-bold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Collection of {application?.name || "Customer"}
            {apiLoading && <span className="text-sm ml-2 text-yellow-500">(Calculating...)</span>}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200" 
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {apiError && (
          <div className={`mx-6 mt-4 p-3 rounded-lg border ${
            isDark ? "bg-red-900/20 border-red-700 text-red-300" : "bg-red-50 border-red-200 text-red-700"
          }`}>
            <div className="flex items-start">
              <AlertCircle className={`w-5 h-5 mt-0.5 mr-2 ${isDark ? "text-red-400" : "text-red-500"}`} />
              <div>
                <strong className="font-semibold">Error:</strong> {apiError}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="p-6">
          {/* Application Details */}
          <div className={`mb-6 p-4 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-3 flex items-center ${
              isDark ? "text-indigo-300" : "text-indigo-700"
            }`}>
              Application Details
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Sanction Amount
                </div>
                <div className={`text-lg font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                  ₹{formatCurrency(sanctionAmount)}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Disburse Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(application?.disburseDateTime)}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Transaction Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(application?.transactionDateTime)}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Due Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(application?.dueDateTime)}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Last Collection
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(lastCollectionDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Collection Details */}
          <div className={`mb-6 p-5 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${
              isDark ? "text-indigo-300" : "text-indigo-700"
            }`}>
              Collection Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Collection Date */}
              {renderField('collectionDate', 'Collection Date', 'date')}

              {/* Principal Amount */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>
                  Principal Amount
                </label>
                <input
                  type="text"
                  value={formatCurrency(principalAmount)}
                  readOnly
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark 
                      ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                      : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Normal Interest */}
              {renderField('normalInterest', 'Normal Interest', 'number', { isReadOnly: true, showError: false })}
              
              {/* Penal Interest */}
              {renderField('penalInterest', 'Penal Interest', 'number', { isReadOnly: true, showError: false })}

              {/* Penalty */}
              {renderField('penaltyInput', 'Penalty', 'number', { isReadOnly: true, showError: false })}

              {/* Bounce Charge */}
              {renderField('bounceCharge', 'Bounce Charge', 'number', { 
                placeholder: 'Enter bounce charge',
                isRequired: false
              })}

              {/* Total Due Amount */}
              {renderField('totalDueAmount', 'Total Due Amount', 'number', { 
                isReadOnly: true, 
                showError: false,
                customClass: "font-bold bg-emerald-50 border-emerald-300 text-emerald-700"
              })}

              {/* Collection Amount */}
              {renderField('collectionAmount', 'Collection Amount', 'number', { 
                placeholder: 'Enter collection amount'
              })}

              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Collection By */}
                  {renderField('collectionBy', 'Collection By', 'select', {
                    children: (
                      <>
                        <option value="">--Select--</option>
                        <option value="by bank">By Bank</option>
                        <option value="by cash">By Cash</option>
                      </>
                    )
                  })}

                  {/* Transaction ID */}
                  {renderField('transactionId', 'Transaction ID', 'text', {
                    placeholder: 'Enter transaction ID',
                    isRequired: formik.values.collectionBy === 'by bank',
                    disabled: formik.values.collectionBy !== 'by bank'
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bank Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}>
                      Bank Name
                      {selectedBankDetails && (
                        <span className={`text-xs ml-2 ${
                          isDark ? "text-emerald-300" : "text-emerald-600"
                        }`}>
                          ({selectedBankDetails.branch_name})
                        </span>
                      )}
                    </label>
                    <select
                      name="bankId"
                      value={formik.values.bankId}
                      onChange={handleFormikChange}
                      onBlur={formik.handleBlur}
                      disabled={formik.values.collectionBy === "by cash"}
                      className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                        formik.values.collectionBy === "by cash"
                          ? isDark
                            ? "bg-gray-600/50 border-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                          : isDark 
                            ? "bg-gray-600 border-gray-500 text-white" 
                            : "bg-white border-gray-300 text-gray-900"
                      } ${formik.touched.bankId && formik.errors.bankId ? 'border-red-500' : ''}`}
                      required={formik.values.collectionBy === 'by bank'}
                    >
                      <option value="">--Select Bank--</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.bank_name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.bankId && formik.errors.bankId && (
                      <div className="text-red-500 text-xs mt-1">{formik.errors.bankId}</div>
                    )}
                  </div>

                  {/* Amt Disbursed From */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}>
                      Amt Disbursed From
                    </label>
                    <input
                      type="text"
                      value={amtDisbursedFrom}
                      readOnly
                      className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                        isDark 
                          ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                          : "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-6 py-3 rounded-lg border transition-colors font-medium ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400"
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || apiLoading || !formik.isValid || !formik.dirty || !collectionData}
              className={`px-8 py-3 rounded-lg text-white transition-colors flex items-center justify-center gap-2 font-medium ${
                loading || apiLoading || !formik.isValid || !formik.dirty || !collectionData
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Submit Collection
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NormalCollectionForm;