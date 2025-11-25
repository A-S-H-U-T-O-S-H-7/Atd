"use client"
import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, X, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { 
  ChequeService, 
  formatLoanOptions, 
  formatLoanDetails, 
  formatDepositDataForForm,
  formatDepositDataForAPI 
} from "@/lib/services/ChequeService";
import { useFormik } from "formik";
import * as Yup from "yup";

const ManageChequeDepositPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEdit = !!editId;

  const [loanOptions, setLoanOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const relationOptions = ["Self", "Father", "Mother", "Son", "Daughter", "Spouse", "Brother", "Sister"];
  const chequeTypeOptions = ["Repayment Cheque", "Security Cheque", "Interest Cheque"];
  const statusOptions = ["Bounced", "Received"];
  const deliveryStatusOptions = ["Delivered", "Not Delivered", "Returned Back"];

  // Validation Schema
  const validationSchema = Yup.object({
    loanNo: Yup.string().required("Loan number is required"),
    name: Yup.string().required("Name is required"),
    fatherName: Yup.string().required("Father name is required"),
    relation: Yup.string().required("Relation is required"),
    chequePresented: Yup.string().required("Cheque type is required"),
    chequeNo: Yup.string().required("Cheque number is required"),
    amount: Yup.number().required("Amount is required").positive("Amount must be positive"),
    status: Yup.string(),
    bounceDate: Yup.date().nullable(),
    bounceCharge: Yup.number().min(0, "Bounce charge cannot be negative"),
    deliveryStatus: Yup.string(),
    deliveryAddress: Yup.string(),
    chequeReturnMemoDate: Yup.date().nullable(),
    chequeReturnMemoReceivedDate: Yup.date().nullable(),
    reasonOfBounce: Yup.string(),
    certifiedCopyDisbursementDate: Yup.date().nullable(),
    certifiedCopyDepositDate: Yup.date().nullable(),
    legalNoticeDate: Yup.date().nullable(),
    legalNoticeSpeedPostSentDate: Yup.date().nullable(),
    speedPostTrackingNo: Yup.string(),
    speedPostStatus: Yup.string(),
    speedPostReceivedDate: Yup.date().nullable(),
    remarkWithCaseDetails: Yup.string(),
  });

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      // Basic Information
      loanNo: "",
      name: "",
      fatherName: "",
      relation: "",
      chequePresented: "Repayment Cheque",
      otherAddress: "",
      
      // Bank Details
      companyBankName: "",
      companyBankBranch: "",
      companyBankAC: "",
      companyBankIFSC: "",
      customerBankName: "",
      customerBankBranch: "",
      customerBankAC: "",
      customerBankIFSC: "",
      
      // Cheque Details
      chequeNo: "",
      chequeReceivedDate: "",
      chequeDepositDate: "",
      amount: "",
      interest: "",
      penalInterest: "",
      penalty: "",
      
      // Additional Fields for Edit Mode
      status: "",
      bounceDate: "",
      bounceCharge: "",
      deliveryStatus: "",
      deliveryAddress: "",
      chequeReturnMemoDate: "",
      chequeReturnMemoReceivedDate: "",
      reasonOfBounce: "",
      certifiedCopyDisbursementDate: "",
      certifiedCopyDepositDate: "",
      legalNoticeDate: "",
      legalNoticeSpeedPostSentDate: "",
      speedPostTrackingNo: "",
      speedPostStatus: "",
      speedPostReceivedDate: "",
      remarkWithCaseDetails: ""
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleSubmit(values);
    }
  });

  // Fetch loans for dropdown
  useEffect(() => {
    fetchLoans();
  }, []);

  // Fetch deposit data if in edit mode
  useEffect(() => {
    if (isEdit && editId) {
      fetchDepositData(editId);
    }
  }, [isEdit, editId]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await ChequeService.getLoans();
      
      if (response.status && response.data) {
        const formattedLoans = formatLoanOptions(response.data);
        setLoanOptions(formattedLoans);
        
        if (formattedLoans.length === 0) {
          setError("No loans found");
        }
      } else {
        setError("Failed to load loans");
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
      setError("Failed to load loans. Please try again.");
      setLoanOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepositData = async (depositId) => {
    try {
      setLoading(true);
      setError("");
      
      const [depositResponse, loansResponse] = await Promise.all([
        ChequeService.getChequeDeposit(depositId),
        ChequeService.getLoans()
      ]);
      
      if (depositResponse.status && depositResponse.data && loansResponse.status && loansResponse.data) {
        const apiData = depositResponse.data;
        const formattedLoans = formatLoanOptions(loansResponse.data);
        
        setLoanOptions(formattedLoans);
        
        const selectedLoan = formattedLoans.find(loan => loan.id === apiData.application_id);
        const loanNo = selectedLoan?.loanNo || "";
        
        // Set form data using Formik
        formik.setValues({
          loanNo: loanNo,
          name: apiData.name || "",
          fatherName: apiData.f_name || "",
          relation: apiData.relation_with || "",
          chequePresented: "Repayment Cheque",
          otherAddress: apiData.other_address || "",
          companyBankName: apiData.company_bank_name || "",
          companyBankBranch: apiData.company_bank_branch || "",
          companyBankAC: apiData.company_bank_ac || "",
          companyBankIFSC: apiData.company_bank_ifsc || "",
          customerBankName: apiData.customer_bank_name || "",
          customerBankBranch: apiData.customer_bank_branch || "",
          customerBankAC: apiData.customer_bank_ac || "",
          customerBankIFSC: apiData.customer_bank_ifsc || "",
          chequeNo: apiData.cheque_no || "",
          chequeReceivedDate: apiData.cheque_date || "",
          chequeDepositDate: apiData.deposit_date || "",
          amount: apiData.deposit_amount || "",
          interest: apiData.interest || "",
          penalInterest: apiData.penal_interest || "",
          penalty: apiData.penality || "",
          status: apiData.status || "",
          bounceDate: apiData.bounce_date || "",
          bounceCharge: apiData.bounce_charge || "",
          deliveryStatus: apiData.delivery_status || "",
          deliveryAddress: apiData.delivery_address || "",
          chequeReturnMemoDate: apiData.cheque_return_memo_date || "",
          chequeReturnMemoReceivedDate: apiData.cheque_return_memo_received_date || "",
          reasonOfBounce: apiData.reason_of_bounce || "",
          certifiedCopyDisbursementDate: apiData.certified_copy_disbursement_date || "",
          certifiedCopyDepositDate: apiData.certified_copy_deposit_date || "",
          legalNoticeDate: apiData.legal_notice_date || "",
          legalNoticeSpeedPostSentDate: apiData.legal_notice_speed_post_sent_date || "",
          speedPostTrackingNo: apiData.speed_post_tracking_no || "",
          speedPostStatus: apiData.speed_post_status || "",
          speedPostReceivedDate: apiData.speed_post_received_date || "",
          remarkWithCaseDetails: apiData.remark_with_case_details || ""
        });
      } else {
        setError("Failed to load deposit data");
      }
    } catch (error) {
      console.error("Error fetching deposit data:", error);
      setError("Failed to load deposit data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLoanDetails = async (loanId) => {
    if (!loanId) return;
    
    try {
      setLoading(true);
      const response = await ChequeService.getLoanDetails(loanId);
      
      if (response.status && response.data) {
        const loanDetails = formatLoanDetails(response.data);
        
        formik.setValues(prev => ({
          ...prev,
          ...loanDetails
        }));
      }
    } catch (error) {
      console.error("Error fetching loan details:", error);
      setError("Failed to load loan details");
    } finally {
      setLoading(false);
    }
  };

  const handleLoanChange = (e) => {
    const { value } = e.target;
    formik.setFieldValue("loanNo", value);

    if (value) {
      const selectedLoan = loanOptions.find(loan => loan.loanNo === value);
      if (selectedLoan) {
        fetchLoanDetails(selectedLoan.id);
      }
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const depositData = formatDepositDataForAPI(values, loanOptions, isEdit);
      
      let response;
      if (isEdit) {
        response = await ChequeService.updateChequeDeposit(editId, depositData);
      } else {
        response = await ChequeService.addChequeDeposit(depositData);
      }

      if (response.status) {
        setSuccess(isEdit ? "Deposit updated successfully!" : "Deposit added successfully!");
        
        setTimeout(() => {
          router.push("/admin/cheque-deposit");
        }, 1500);
      } else {
        setError(response.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/crm/cheque-management");
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Helper function to render form fields with error handling
  const renderField = (name, label, type = "text", placeholder = "", colSpan = 1) => (
    <div className={`col-span-${colSpan}`}>
      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
          isDark
            ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
            : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
        } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${
          formik.touched[name] && formik.errors[name] ? "border-red-500" : ""
        }`}
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-xs mt-1">{formik.errors[name]}</div>
      )}
    </div>
  );

  const renderSelect = (name, label, options, colSpan = 1) => (
    <div className={`col-span-${colSpan}`}>
      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        {label}
      </label>
      <select
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
          isDark
            ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
            : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
        } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${
          formik.touched[name] && formik.errors[name] ? "border-red-500" : ""
        }`}
      >
        <option value="">----SELECT----</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-xs mt-1">{formik.errors[name]}</div>
      )}
    </div>
  );

  const renderTextArea = (name, label, rows = 3, colSpan = 2) => (
    <div className={`col-span-${colSpan}`}>
      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        {label}
      </label>
      <textarea
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        rows={rows}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none ${
          isDark
            ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
            : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
        } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${
          formik.touched[name] && formik.errors[name] ? "border-red-500" : ""
        }`}
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-xs mt-1">{formik.errors[name]}</div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleCancel}
                className={`p-3 cursor-pointer rounded-xl transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                {isEdit ? "Edit Cheque Deposit" : "Add Cheque Deposit"}
              </h1>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl border-2 flex items-center space-x-3 ${
            isDark 
              ? "bg-red-900/20 border-red-600/50 text-red-200" 
              : "bg-red-50 border-red-300 text-red-700"
          }`}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className={`mb-6 p-4 rounded-xl border-2 flex items-center space-x-3 ${
            isDark 
              ? "bg-green-900/20 border-green-600/50 text-green-200" 
              : "bg-green-50 border-green-300 text-green-700"
          }`}>
            <AlertCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}>
          {/* Form Header */}
          <div className={`px-6 py-4 border-b-2 ${
            isDark
              ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
              : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
          }`}>
            <h2 className={`text-lg font-bold ${
              isDark ? "text-gray-100" : "text-gray-700"
            }`}>
              {isEdit ? "Edit Cheque Deposit" : "Add Cheque Deposit"}
            </h2>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-6">
            {loading && (
              <div className="text-center py-4">
                <div className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
                  isDark ? "border-emerald-400" : "border-emerald-600"
                }`}></div>
              </div>
            )}

            <div className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                  isDark ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                }`}>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Choose Loan No */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      Choose Loan No:
                    </label>
                    <select
                      name="loanNo"
                      value={formik.values.loanNo}
                      onChange={handleLoanChange}
                      onBlur={formik.handleBlur}
                      disabled={loading || loanOptions.length === 0 || isEdit}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        isDark
                          ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                          : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                      } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                        formik.touched.loanNo && formik.errors.loanNo ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">---Select Loan No---</option>
                      {loanOptions.map(loan => (
                        <option key={loan.id} value={loan.loanNo}>{loan.loanNo}</option>
                      ))}
                    </select>
                    {formik.touched.loanNo && formik.errors.loanNo && (
                      <div className="text-red-500 text-xs mt-1">{formik.errors.loanNo}</div>
                    )}
                  </div>

                  {renderField("name", "Name", "text", "", 1)}
                  {renderField("fatherName", "Father Name", "text", "", 1)}
                  {renderSelect("relation", "Relation", relationOptions, 1)}
                  {renderSelect("chequePresented", "Cheque Presented", chequeTypeOptions, 1)}
                </div>
                {renderTextArea("otherAddress", "Other Address", 2, 3)}
              </div>

              {/* Bank Details Section */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                  isDark ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                }`}>
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderField("companyBankName", "Company Bank Name", "text", "", 1)}
                  {renderField("companyBankBranch", "Company Bank Branch", "text", "", 1)}
                  {renderField("companyBankAC", "Company Bank A/C", "text", "", 1)}
                  {renderField("companyBankIFSC", "Company Bank IFSC", "text", "", 1)}
                  {renderField("customerBankName", "Customer Bank Name", "text", "", 1)}
                  {renderField("customerBankBranch", "Customer Bank Branch", "text", "", 1)}
                  {renderField("customerBankAC", "Customer Bank A/C", "text", "", 1)}
                  {renderField("customerBankIFSC", "Customer Bank IFSC", "text", "", 1)}
                </div>
              </div>

              {/* Cheque Details Section */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                  isDark ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                }`}>
                  Cheque Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderField("chequeNo", "Cheque No", "text", "", 1)}
                  {renderField("chequeReceivedDate", "Cheque Received Date", "date", "", 1)}
                  {renderField("chequeDepositDate", "Cheque Deposit Date", "date", "", 1)}
                  {renderField("amount", "Amount", "number", "", 1)}
                  {renderField("interest", "Interest", "number", "", 1)}
                  {renderField("penalInterest", "Penal Interest", "number", "", 1)}
                  {renderField("penalty", "Penalty", "number", "", 1)}
                </div>
              </div>

              {/* Additional Fields for Edit Mode */}
              {isEdit && (
                <>
                  {/* Status and Bounce Details */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                      isDark ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                    }`}>
                      Status & Bounce Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {renderSelect("status", "Status", statusOptions, 1)}
                      {renderField("bounceDate", "Bounce Date / Cheque Clear Date", "date", "", 1)}
                      {renderField("bounceCharge", "Bounce Charge", "number", "", 1)}
                      {renderSelect("deliveryStatus", "Delivery Status", deliveryStatusOptions, 1)}
                    </div>
                    {renderTextArea("deliveryAddress", "Delivery Address", 2, 3)}
                  </div>

                  {/* Cheque Return Details */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                      isDark ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                    }`}>
                      Cheque Return Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {renderField("chequeReturnMemoDate", "Cheque-Return Memo Date", "date", "", 1)}
                      {renderField("chequeReturnMemoReceivedDate", "Cheque-Return Memo Received Date", "date", "", 1)}
                    </div>
                    {renderTextArea("reasonOfBounce", "Reason Of Bounce", 2, 3)}
                  </div>

                  {/* Certified Copy Details */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                      isDark ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                    }`}>
                      Certified Copy Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {renderField("certifiedCopyDisbursementDate", "Certified Copy (Disbursement) Date", "date", "", 1)}
                      {renderField("certifiedCopyDepositDate", "Certified Copy (Deposit) Date", "date", "", 1)}
                    </div>
                  </div>

                  {/* Legal Notice Details */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                      isDark ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                    }`}>
                      Legal Notice Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {renderField("legalNoticeDate", "Legal Notice Date", "date", "", 1)}
                      {renderField("legalNoticeSpeedPostSentDate", "Legal Notice Speed Post Sent Date", "date", "", 1)}
                      {renderField("speedPostTrackingNo", "Tracking No.", "text", "", 1)}
                      {renderField("speedPostStatus", "Status", "text", "", 1)}
                      {renderField("speedPostReceivedDate", "Speed Post Received Date", "date", "", 1)}
                    </div>
                    {renderTextArea("remarkWithCaseDetails", "Remark With Case Details", 3, 3)}
                  </div>
                </>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-emerald-200/50">
              <button
                type="button"
                onClick={handleCancel}
                disabled={submitting}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "bg-gray-600 hover:bg-gray-700 text-white"
                    : "bg-gray-500 hover:bg-gray-600 text-white"
                } shadow-lg`}
              >
                <X size={20} />
                <span>Cancel</span>
              </button>
              
              <button
                type="submit"
                disabled={submitting || loading || !formik.isValid}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"
                } shadow-lg`}
              >
                <Save size={20} />
                <span>
                  {submitting ? "Processing..." : (isEdit ? "Update" : "Save")}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageChequeDepositPage;