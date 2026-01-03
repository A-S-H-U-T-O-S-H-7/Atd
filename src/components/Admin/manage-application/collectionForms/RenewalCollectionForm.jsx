"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X, Calendar, IndianRupee, BanknoteIcon, ArrowRight } from "lucide-react";
import { collectionService } from "@/lib/services/colletionForms/CollectionService";
import toast from "react-hot-toast";

const RenewalCollectionForm = ({
  isOpen,
  onClose,
  application,
  onRenewalSubmit,
  initialData = null,
  isDark
}) => {
  const [bankList, setBankList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);

  // Validation Schema
  const validationSchema = Yup.object({
    collectionDate: Yup.string()
      .required('Collection date is required'),
    principalAmount: Yup.number()
      .min(0, 'Principal amount cannot be negative')
      .required('Principal amount is required'),
    normalInterest: Yup.number()
      .min(0, 'Interest cannot be negative')
      .required('Normal interest is required'),
    penalInterest: Yup.number()
      .min(0, 'Penal interest cannot be negative')
      .required('Penal interest is required'),
    penaltyInput: Yup.number()
      .min(0, 'Penalty cannot be negative')
      .required('Penalty is required'),
    bounceCharge: Yup.number()
      .min(0, 'Bounce charge cannot be negative')
      .required('Bounce charge is required'),
    renewalCharge: Yup.number()
      .min(0, 'Renewal charge cannot be negative')
      .required('Renewal charge is required'),
    renewalGst: Yup.number()
      .min(0, 'Renewal GST cannot be negative')
      .required('Renewal GST is required'),
    totalDueAmount: Yup.number()
      .min(0, 'Total due amount cannot be negative')
      .required('Total due amount is required'),
    collectionBy: Yup.string()
      .required('Collection method is required'),
    collectionBankName: Yup.string()
      .when('collectionBy', {
        is: 'by bank',
        then: (schema) => schema.required('Bank name is required for bank collection'),
        otherwise: (schema) => schema.notRequired()
      }),
    collectionAmount: Yup.number()
      .min(1, 'Collection amount must be greater than 0')
      .required('Collection amount is required'),
    collectionTransactionId: Yup.string()
      .when('collectionBy', {
        is: 'by bank',
        then: (schema) => schema.required('Transaction ID is required for bank collection'),
        otherwise: (schema) => schema.notRequired()
      })
  });

  // Initial Values
  const initialValues = {
    collectionDate: "",
    principalAmount: "0",
    normalInterest: "0",
    penalInterest: "0",
    penaltyInput: "0",
    bounceCharge: "0", 
    renewalCharge: "0", 
    renewalGst: "0",
    totalDueAmount: "0",
    collectionBy: "",
    collectionBankName: "", 
    disbursedBank: "",
    collectionAmount: "0",
    collectionTransactionId: "",
    selectedBankId: ""
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await handleSubmit(values);
    },
    enableReinitialize: true
  });

  useEffect(() => {
    if (isOpen && application) {
      // Reset form when modal opens
      formik.resetForm();
      fetchBankList();
      
      if (initialData) {
        populateFormWithInitialData(initialData);
      }
    }
  }, [isOpen, application, initialData]);

  const fetchBankList = async () => {
    try {
      const response = await collectionService.getBankList();
      console.log("Bank list response:", response);
      
      if (response.success) {
        const banks = response.data || response.bank || response.banks || response;
        setBankList(Array.isArray(banks) ? banks : []);
      } else {
        setBankList(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      console.error('Error fetching bank list:', error);
      toast.error('Failed to load bank list');
      setBankList([]);
    }
  };

  const fetchBankDetails = async (bankId) => {
    try {
      const response = await collectionService.getBankDetails(bankId);
      if (response.success) {
        setSelectedBankDetails(response.bank || response.data);
      } else {
        setSelectedBankDetails(null);
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      setSelectedBankDetails(null);
    }
  };

  const populateFormWithInitialData = (data) => {
    // Calculate total amounts
    const normalInterestTotal = (parseFloat(data.normal_interest_before || 0) + parseFloat(data.normal_interest_after || 0));
    const penalInterestTotal = (parseFloat(data.penal_interest_before || 0) + parseFloat(data.penal_interest_after || 0));
    const penaltyTotal = (parseFloat(data.penalty_before || 0) + parseFloat(data.penalty_after || 0));

    const formattedData = {
      principalAmount: data.principal_amount || "0",
      normalInterest: normalInterestTotal.toFixed(2),
      penalInterest: penalInterestTotal.toFixed(2),
      penaltyInput: penaltyTotal.toFixed(2),
      bounceCharge: data.bounce_amount || "0",
      renewalCharge: data.renewal || "0",
      renewalGst: data.renewal_gst || "0",
      disbursedBank: data.disburse_bank || ""
    };

    // Update form values
    Object.keys(formattedData).forEach(key => {
      formik.setFieldValue(key, formattedData[key]);
    });

    calculateTotalDueAmount(formattedData);
  };

  const calculateTotalDueAmount = (data) => {
    const principal = parseFloat(data.principalAmount || 0);
    const normalInterest = parseFloat(data.normalInterest || 0);
    const penalInterest = parseFloat(data.penalInterest || 0);
    const penalty = parseFloat(data.penaltyInput || 0);
    const bounceCharge = parseFloat(data.bounceCharge || 0);
    const renewalCharge = parseFloat(data.renewalCharge || 0);
    const renewalGst = parseFloat(data.renewalGst || 0);

    const totalDue = principal + normalInterest + penalInterest + penalty + bounceCharge + renewalCharge + renewalGst;
    
    formik.setFieldValue('totalDueAmount', totalDue.toFixed(2));
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    // Let Formik handle the change first
    await formik.setFieldValue(name, value);
    
    if (name === "collectionDate") {
      if (value && application?.id) {
        try {
          setCalculating(true);
          const response = await collectionService.calculateRenewalCollection(
            application.id,
            value
          );

          if (response.success) {
            populateFormWithInitialData(response.data);
            toast.success('Renewal calculated successfully');
          } else {
            toast.error('Failed to calculate renewal');
          }
        } catch (error) {
          console.error('Calculation error:', error);
          toast.error('Failed to calculate renewal');
        } finally {
          setCalculating(false);
        }
      }
    } else if (name === "collectionBy") {
      if (value === "by cash") {
        await formik.setFieldValue("selectedBankId", "");
        await formik.setFieldValue("collectionBankName", "");
        await formik.setFieldValue("collectionTransactionId", "");
        setSelectedBankDetails(null);
      }
    } else if (name === "selectedBankId") {
      const selectedBank = bankList.find(bank => bank.id && bank.id.toString() === value);
      if (selectedBank) {
        await formik.setFieldValue("collectionBankName", selectedBank.bank_name || selectedBank.name || "");
        fetchBankDetails(selectedBank.id);
      } else {
        await formik.setFieldValue("collectionBankName", "");
        setSelectedBankDetails(null);
      }
    } else if (['bounceCharge', 'renewalCharge', 'renewalGst', 'collectionAmount'].includes(name)) {
      // Recalculate total if these fields change
      if (name !== "collectionAmount") {
        setTimeout(() => recalculateTotal(), 10);
      }
    }
  };

  const recalculateTotal = () => {
    const values = formik.values;
    const principal = parseFloat(values.principalAmount || 0);
    const normalInterest = parseFloat(values.normalInterest || 0);
    const penalInterest = parseFloat(values.penalInterest || 0);
    const penalty = parseFloat(values.penaltyInput || 0);
    const bounceCharge = parseFloat(values.bounceCharge || 0);
    const renewalCharge = parseFloat(values.renewalCharge || 0);
    const renewalGst = parseFloat(values.renewalGst || 0);

    const totalDue = principal + normalInterest + penalInterest + penalty + bounceCharge + renewalCharge + renewalGst;
    
    formik.setFieldValue('totalDueAmount', totalDue.toFixed(2));
  };

  const handleSubmit = async (values) => {
    if (values.collectionBy === "by bank" && !values.selectedBankId) {
      toast.error('Please select a bank');
      return;
    }

    try {
      setLoading(true);
      
      const bounceCharge = parseFloat(values.bounceCharge || 0);
      const renewalCharge = parseFloat(values.renewalCharge || 0);
      const renewalGst = parseFloat(values.renewalGst || 0);
      const totalDueAmount = parseFloat(values.totalDueAmount || 0);
      
      const submissionData = {
        collection_date: values.collectionDate,
        principal_amount: parseFloat(values.principalAmount || 0),
        normal_interest_before: parseFloat(initialData?.normal_interest_before || 0),
        normal_interest_after: parseFloat(initialData?.normal_interest_after || 0),
        penal_interest_before: parseFloat(initialData?.penal_interest_before || 0),
        penal_interest_after: parseFloat(initialData?.penal_interest_after || 0),
        penalty_before: parseFloat(initialData?.penalty_before || 0),
        penalty_after: parseFloat(initialData?.penalty_after || 0),
        bounce_charge: bounceCharge,
        renewal_charge: renewalCharge,
        renewal_gst: renewalGst,
        total_due_amount: totalDueAmount,
        collection_bank_name: values.selectedBankId ? parseInt(values.selectedBankId) : null,
        disbursed_bank: values.disbursedBank || "",
        collection_amount: parseFloat(values.collectionAmount),
        collection_transaction_id: values.collectionTransactionId || "",
        collection_by: values.collectionBy
      };

      await onRenewalSubmit(application.id, submissionData);
      
    } catch (error) {
      console.error("Renewal error:", error);
      toast.error('Failed to submit renewal');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount || 0);
    return `${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Helper function to render form field with error
  const renderField = (name, label, type = "text", options = {}) => {
    const { isReadOnly = false, isRequired = true, showError = true, customClass = "" } = options;
    const error = formik.touched[name] && formik.errors[name];

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
          value={formik.values[name]}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          readOnly={isReadOnly}
          className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
            isDark 
              ? isReadOnly 
                ? "bg-gray-600/50 border-gray-600 text-gray-200 cursor-not-allowed" 
                : "bg-gray-600 border-gray-500 text-white placeholder-gray-400"
              : isReadOnly
                ? "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          } ${error ? 'border-red-500' : ''} ${customClass}`}
          step={type === "number" ? "0.01" : undefined}
          min={type === "number" ? "0" : undefined}
          required={isRequired}
        />
        {showError && error && (
          <div className="text-red-500 text-xs mt-1">{error}</div>
        )}
      </div>
    );
  };

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
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10 ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}>
          <div>
            <h2 className={`text-xl font-bold ${
              isDark ? "text-purple-400" : "text-purple-600"
            }`}>
              Loan Renewal - {application?.name || "Customer"}
            </h2>
            <p className={`text-sm mt-1 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              Loan No: {application?.loanNo} | CRN: {application?.crnNo}
            </p>
          </div>
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

        {/* Form Content */}
        <form onSubmit={formik.handleSubmit} className="p-6">
          {/* Loan Information Section */}
          <div className={`mb-6 p-4 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-3 flex items-center ${
              isDark ? "text-purple-300" : "text-purple-700"
            }`}>
              Loan Information
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Sanction Amount
                </div>
                <div className={` font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                  ₹{formatCurrency(application?.approvedAmount || 0)}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Disburse Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {initialData?.disburse_date ? formatDate(initialData.disburse_date) : "N/A"}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Transaction Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {initialData?.transaction_date ? formatDate(initialData.transaction_date) : "N/A"}
                </div>
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Due Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {initialData?.due_date ? formatDate(initialData.due_date) : "N/A"}
                </div>  
              </div>

              <div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Last Collection Date
                </div>
                <div className={`font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {initialData?.last_collection_date ? formatDate(initialData.last_collection_date) : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Collection Date */}
          <div className="mb-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Collection Date <span className="text-red-500">*</span>
                {calculating && <span className="ml-2 text-yellow-500 text-sm">(Calculating...)</span>}
              </label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`} />
                <input
                  type="date"
                  name="collectionDate"
                  value={formik.values.collectionDate}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } ${formik.touched.collectionDate && formik.errors.collectionDate ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {formik.touched.collectionDate && formik.errors.collectionDate && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.collectionDate}</div>
              )}
            </div>
          </div>

          {/* Renewal Calculation Section */}
          <div className={`mb-6 p-5 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              isDark ? "text-purple-300" : "text-purple-700"
            }`}>
              <IndianRupee className="w-5 h-5" />
              Renewal Calculation
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Principal Amount */}
              {renderField('principalAmount', 'Principal Amount', 'number', { isReadOnly: true, showError: false })}

              {/* Normal Interest */}
              {renderField('normalInterest', 'Normal Interest', 'number', { isReadOnly: true, showError: false })}

              {/* Penal Interest */}
              {renderField('penalInterest', 'Penal Interest', 'number', { isReadOnly: true, showError: false })}

              {/* Penalty */}
              {renderField('penaltyInput', 'Penalty', 'number', { isReadOnly: true, showError: false })}

              {/* Renewal Charges */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  {renderField('renewalCharge', 'Renewal Charge', 'number')}
                </div>
                <div>
                  {renderField('renewalGst', 'Renewal GST', 'number')}
                </div>
              </div>

              {/* Bounce Charge */}
              {renderField('bounceCharge', 'Bounce Charge', 'number')}

              {/* Disbursed Bank */}
              {renderField('disbursedBank', 'Disbursed Bank', 'text', { isReadOnly: true, isRequired: false, showError: false })}

              {/* Total Due Amount */}
              {renderField('totalDueAmount', 'Total Due Amount', 'number', { isReadOnly: true, showError: false })}
            </div>
          </div>

          {/* Collection Details Section */}
          <div className={`mb-6 p-5 rounded-xl border ${
            isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              isDark ? "text-purple-300" : "text-purple-700"
            }`}>
              <BanknoteIcon className="w-5 h-5" />
              Collection Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Collection Amount */}
              {renderField('collectionAmount', 'Collection Amount', 'number')}

              {/* Collection By */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Collection By <span className="text-red-500">*</span>
                </label>
                <select
                  name="collectionBy"
                  value={formik.values.collectionBy}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    isDark 
                      ? "bg-gray-600 border-gray-500 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  } ${formik.touched.collectionBy && formik.errors.collectionBy ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">-- Select Method --</option>
                  <option value="by cash">By Cash</option>
                  <option value="by bank">By Bank</option>
                </select>
                {formik.touched.collectionBy && formik.errors.collectionBy && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.collectionBy}</div>
                )}
              </div>

              {/* Bank Selection (conditionally shown) */}
              {formik.values.collectionBy === "by bank" && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Bank Name <span className="text-red-500">*</span>
                    {selectedBankDetails && (
                      <span className={`text-xs ml-2 ${
                        isDark ? "text-emerald-300" : "text-emerald-600"
                      }`}>
                        ({selectedBankDetails.branch_name || selectedBankDetails.branch})
                      </span>
                    )}
                  </label>
                  <select
                    name="selectedBankId"
                    value={formik.values.selectedBankId}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      isDark 
                        ? "bg-gray-600 border-gray-500 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    } ${formik.touched.selectedBankId && formik.errors.selectedBankId ? 'border-red-500' : ''}`}
                    required={formik.values.collectionBy === "by bank"}
                  >
                    <option value="">-- Select Bank --</option>
                    {bankList.length > 0 ? (
                      bankList.map((bank) => (
                        <option key={bank.id || bank._id} value={bank.id || bank._id}>
                          {bank.bank_name || bank.name || `Bank ${bank.id}`}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Loading banks...</option>
                    )}
                  </select>
                  {formik.touched.selectedBankId && formik.errors.selectedBankId && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.selectedBankId}</div>
                  )}
                </div>
              )}

              {/* Transaction ID */}
              {formik.values.collectionBy === "by bank" && (
                <div>
                  {renderField('collectionTransactionId', 'Transaction ID', 'text', { 
                    isRequired: false, 
                    placeholder: 'Enter transaction ID' 
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-6 py-3 rounded-lg border transition-colors font-medium ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400"
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formik.isValid || calculating || !formik.dirty}
              className={`px-8 py-3 rounded-lg text-white transition-colors flex items-center justify-center gap-2 font-medium ${
                loading || calculating || !formik.isValid || !formik.dirty
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-600/20"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Submit Renewal
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

export default RenewalCollectionForm;