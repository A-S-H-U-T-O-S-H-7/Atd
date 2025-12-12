"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { ChequeService, formatLoanDetails, formatDepositDataForAPI } from "@/lib/services/ChequeService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";

// Helper functions
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const ManageChequeDepositPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEdit = !!editId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFetchingLoan, setIsFetchingLoan] = useState(false);
  const [loanFetched, setLoanFetched] = useState(false);
  const [banks, setBanks] = useState([]);
  const [loanData, setLoanData] = useState(null);

  const relationOptions = ["Son", "Daughter", "Spouse"];
  const chequeTypeOptions = ["Repayment Cheque", "Security Cheque", "Interest Cheque"];
  const statusOptions = ["Bounced", "Received/cleared"];
  const deliveryStatusOptions = ["Not Delivered", "Returned Back"];

  // Reusable input classes
  const inputClasses = `w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${
    isDark
      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  }`;

  // Custom validation for date fields
  const validateDates = (values) => {
    const errors = {};
    const depositDate = new Date(values.chequeDepositDate);
    const chequeDate = new Date(values.chequeDate);
    const today = new Date();

    // Deposit date validation
    if (values.chequeDepositDate) {
      const deposit = new Date(values.chequeDepositDate);
      if (deposit > today) {
        errors.chequeDepositDate = "Deposit date cannot be in the future";
      }
    }

    // Cheque date validation
    if (values.chequeDate) {
      const cheque = new Date(values.chequeDate);
      if (cheque > today) {
        errors.chequeDate = "Cheque date cannot be in the future";
      }
    }

    // Post-deposit date validations
    const postDepositFields = [
      'bounceDate',
      'chequeReturnMemoDate',
      'chequeReturnMemoReceivedDate',
      'intimationMailFromBankDate',
      'intimationMailFromDispatchChequeDate'
    ];

    postDepositFields.forEach(field => {
      if (values[field] && values.chequeDepositDate) {
        const fieldDate = new Date(values[field]);
        if (fieldDate < depositDate) {
          errors[field] = `Date cannot be before deposit date (${values.chequeDepositDate})`;
        }
        if (fieldDate > today) {
          errors[field] = "Date cannot be in the future";
        }
      }
    });

    return errors;
  };

  // Custom Yup validation for positive numbers
  const positiveNumber = (message = "Amount must be positive") => {
    return Yup.number()
      .transform(value => (isNaN(value) ? undefined : value))
      .min(0, message)
      .typeError("Please enter a valid number");
  };

  const validationSchema = Yup.object({
    loanNo: Yup.string().required("Loan number is required"),
    name: Yup.string().required("Name is required"),
    fatherName: Yup.string().required("Father name is required"),
    relation: Yup.string().required("Relation is required"),
    chequePresented: Yup.string().required("Cheque type is required"),
    chequeNo: Yup.string()
      .required("Cheque number is required")
      .matches(/^\d{6}$/, "Cheque number must be exactly 6 digits"),
    principalAmount: positiveNumber("Principal amount must be positive"),
    chequeAmount: positiveNumber("Cheque amount is required and must be positive").required("Cheque amount is required"),
    chequeDate: Yup.date().required("Cheque date is required"),
    chequeDepositDate: Yup.date().required("Cheque deposit date is required"),
    interest: positiveNumber("Interest must be positive"),
    penalInterest: positiveNumber("Penal interest must be positive"),
    penalty: positiveNumber("Penalty must be positive"),
  });

  const formik = useFormik({
    initialValues: {
      loanNo: "",
      name: "",
      fatherName: "",
      relation: "",
      chequePresented: "Repayment Cheque",
      
      companyBankName: "",
      companyBankId: "",
      companyBankBranch: "",
      companyBankAC: "",
      companyBankIFSC: "",
      customerBankName: "",
      customerBankBranch: "",
      customerBankAC: "",
      customerBankIFSC: "",
      
      chequeNo: "",
      chequeDate: "",
      chequeDepositDate: "",
      principalAmount: "",
      chequeAmount: "",
      interest: "",
      penalInterest: "",
      penalty: "",
      
      status: "",
      bounceDate: "",
      bounceCharge: "",
      deliveryStatus: "",
      deliveryAddress: "",
      chequeReturnMemoDate: "",
      chequeReturnMemoReceivedDate: "",
      intimationMailFromBankDate: "",
      intimationMailFromDispatchChequeDate: "",
      reasonOfBounce: "",
      applicationId: ""
    },
    validationSchema,
    validate: validateDates,
    onSubmit: async (values) => {
      await handleSubmit(values);
    }
  });

  const isStatusReceived = formik.values.status === "Received/cleared";
  const today = getTodayDate();

  // Fetch banks on component mount
  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await ChequeService.getBanks();
      if (response.success && response.data) {
        setBanks(response.data.map(bank => ({
          id: bank.id,
          name: bank.bank_name
        })));
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
      toast.error("Failed to load banks");
    }
  };

  // Fetch bank details when bank is selected
  const fetchBankDetails = async (bankId) => {
    if (!bankId) return;
    
    try {
      const response = await ChequeService.getBankDetails(bankId);
      if (response.success && response.data) {
        const bankData = response.data;
        formik.setValues(prev => ({
          ...prev,
          companyBankBranch: bankData.branch_name || "",
          companyBankAC: bankData.account_no || "",
          companyBankIFSC: bankData.ifsc_code || ""
        }));
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      toast.error("Failed to load bank details");
    }
  };

  useEffect(() => {
    if (isEdit && editId) {
      fetchDepositData(editId);
    }
  }, [isEdit, editId]);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      if (formik.values.loanNo && formik.values.loanNo.length >= 9 && !loanFetched) {
        setIsFetchingLoan(true);
        try {
          const response = await ChequeService.getLoanDetails(formik.values.loanNo);
          
          if (response.status && response.data) {
            const loanDetails = formatLoanDetails(response.data);
            
            formik.setValues(prev => ({
              ...prev,
              ...loanDetails,
              name: response.data.customer_name || "",
              fatherName: response.data.fathername || "",
              applicationId: response.data.application_id || "",
            }));
            
            setLoanData(response.data);
            setLoanFetched(true);
          }
        } catch (error) {
          console.error("Error fetching loan details:", error);
          setLoanFetched(false);
        } finally {
          setIsFetchingLoan(false);
        }
      }
    };

    const timerId = setTimeout(fetchLoanDetails, 800);
    return () => clearTimeout(timerId);
  }, [formik.values.loanNo, loanFetched]);

  useEffect(() => {
    setLoanFetched(false);
  }, [formik.values.loanNo]);

  // Handle bank selection change
  const handleBankChange = async (e) => {
    const bankName = e.target.value;
    const selectedBank = banks.find(bank => bank.name === bankName);
    
    formik.handleChange(e);
    
    if (selectedBank) {
      formik.setFieldValue('companyBankId', selectedBank.id);
      await fetchBankDetails(selectedBank.id);
    } else {
      formik.setFieldValue('companyBankId', '');
      formik.setValues(prev => ({
        ...prev,
        companyBankBranch: "",
        companyBankAC: "",
        companyBankIFSC: ""
      }));
    }
  };

  const fetchDepositData = async (depositId) => {
  try {
    setLoading(true);
    
    const depositResponse = await ChequeService.getChequeDeposit(depositId);
    
    console.log("Edit API Response:", depositResponse); 
    
    if (depositResponse.status && depositResponse.data) {
      const apiData = depositResponse.data;
      
      console.log("API Data for Edit:", apiData); 
      
      const initialValues = {
        loanNo: apiData.loan_no || "",
        name: apiData.name || "",
        fatherName: apiData.fathername || apiData.f_name || "", 
        relation: apiData.relation_with || "",
        chequePresented: "Repayment Cheque",
        companyBankName: apiData.company_bank_name || "",
        companyBankBranch: apiData.company_bank_branch || "",
        companyBankAC: apiData.company_bank_ac || "",
        companyBankIFSC: apiData.company_bank_ifsc || "",
        customerBankName: apiData.customer_bank_name || "",
        customerBankBranch: apiData.customer_bank_branch || "",
        customerBankAC: apiData.customer_bank_ac || "",
        customerBankIFSC: apiData.customer_bank_ifsc || "",
        chequeNo: apiData.cheque_no || "",
        chequeDate: formatDateForInput(apiData.cheque_date),
        chequeDepositDate: formatDateForInput(apiData.deposit_date),
        principalAmount: apiData.principal_amount || "",
        chequeAmount: apiData.deposit_amount || "",
        interest: apiData.interest || "",
        penalInterest: apiData.penal_interest || "",
        penalty: apiData.penality || "",
        status: apiData.status || "",
        bounceDate: formatDateForInput(apiData.bounce_date),
        bounceCharge: apiData.bounce_charge || "",
        deliveryStatus: apiData.delivery_status || "",
        deliveryAddress: apiData.delivery_address || "",
        chequeReturnMemoDate: formatDateForInput(apiData.cheque_return_memo || apiData.cheque_return_memo_date), // Try both
        chequeReturnMemoReceivedDate: formatDateForInput(apiData.memo_received_date || apiData.cheque_return_memo_received_date), // Try both
        intimationMailFromBankDate: formatDateForInput(apiData.intimation_mail_despatch || apiData.intimation_mail_from_bank_date), // Try both
        intimationMailFromDispatchChequeDate: formatDateForInput(apiData.intimation_mail_deliver || apiData.intimation_mail_from_dispatch_cheque_date), // Try both
        reasonOfBounce: apiData.reason_bounce || apiData.reason_of_bounce || "", // Try both
        applicationId: apiData.application_id || ""
      };
      
      console.log("Form Values Set:", initialValues); 
      
      formik.setValues(initialValues);
      setLoanFetched(true);
      
      // Fetch loan data for reference values
      if (apiData.loan_no) {
        try {
          const loanResponse = await ChequeService.getLoanDetails(apiData.loan_no);
          if (loanResponse.status && loanResponse.data) {
            setLoanData(loanResponse.data);
          }
        } catch (error) {
          console.error("Error fetching loan data for reference:", error);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching deposit data:", error);
    toast.error("Failed to load deposit data");
  } finally {
    setLoading(false);
  }
};

  // Custom input handler to prevent negative numbers
  const handleNumberInput = (e, fieldName) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      formik.handleChange(e);
    }
  };

  // Custom date handler to enforce max date
  const handleDateChange = (e, fieldName) => {
    formik.handleChange(e);
  };

  const handleSubmit = async (values) => {
  setSubmitting(true);

  try {
    const depositData = formatDepositDataForAPI(values, isEdit);
    
    let response;
    if (isEdit) {
      response = await ChequeService.updateChequeDeposit(editId, depositData);
    } else {
      response = await ChequeService.addChequeDeposit(depositData);
    }

    if (response.status) {
      toast.success(isEdit ? "Deposit updated successfully!" : "Deposit added successfully!");
      
      setTimeout(() => {
        router.push("/crm/cheque-management");
      }, 1500);
    } else {
      toast.error(response.message || "Operation failed");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    
    let errorMessage = "Failed to submit. Please try again.";
    
    if (error.response?.status === 422 && error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const firstErrorKey = Object.keys(errors)[0];
      if (errors[firstErrorKey] && errors[firstErrorKey][0]) {
        errorMessage = errors[firstErrorKey][0];
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
  } finally {
    setSubmitting(false);
  }
};

  const handleCancel = () => {
    router.push("/crm/cheque-management");
  };

  // Custom renderField with number and date validation
  const renderField = (name, label, type = "text", placeholder = "", colSpan = 1, disabled = false) => {
    const isNumberField = type === "number";
    const isDateField = type === "date";
    
    let maxDate = "";
    let minDate = "";
    
    if (isDateField) {
      if (name === "chequeDate" || name === "chequeDepositDate") {
        maxDate = today;
      } else if (name === "bounceDate" || 
                 name === "chequeReturnMemoDate" || 
                 name === "chequeReturnMemoReceivedDate" ||
                 name === "intimationMailFromBankDate" ||
                 name === "intimationMailFromDispatchChequeDate") {
        maxDate = today;
        // Set min date to chequeDepositDate for post-deposit dates
        if (formik.values.chequeDepositDate) {
          minDate = formik.values.chequeDepositDate;
        }
      }
    }

    return (
      <div className={`col-span-${colSpan}`}>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={formik.values[name]}
          onChange={(e) => {
            if (isNumberField) {
              handleNumberInput(e, name);
            } else if (isDateField) {
              handleDateChange(e, name);
            } else {
              formik.handleChange(e);
            }
          }}
          onBlur={formik.handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          min={isNumberField ? "0" : 
               (isDateField && name !== "chequeDate" && name !== "chequeDepositDate" && formik.values.chequeDepositDate) 
                 ? formik.values.chequeDepositDate 
                 : undefined}
          step={isNumberField ? "any" : undefined}
          max={isDateField ? maxDate : undefined}
          className={`${inputClasses} disabled:opacity-50 disabled:cursor-not-allowed ${
            formik.touched[name] && formik.errors[name] ? "border-red-500" : ""
          }`}
        />
        {formik.touched[name] && formik.errors[name] && (
          <div className="text-red-500 text-xs mt-1">{formik.errors[name]}</div>
        )}
      </div>
    );
  };

  const renderSelect = (name, label, options, colSpan = 1, disabled = false) => (
    <div className={`col-span-${colSpan}`}>
      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        {label}
      </label>
      <select
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={disabled}
        className={`${inputClasses} disabled:opacity-50 disabled:cursor-not-allowed ${
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

  const renderBankSelect = () => (
    <div>
      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        Bank Name
      </label>
      <select
        name="companyBankName"
        value={formik.values.companyBankName}
        onChange={handleBankChange}
        onBlur={formik.handleBlur}
        className={`${inputClasses} ${
          formik.touched.companyBankName && formik.errors.companyBankName ? "border-red-500" : ""
        }`}
      >
        <option value="">----SELECT BANK----</option>
        {banks.map(bank => (
          <option key={bank.id} value={bank.name}>{bank.name}</option>
        ))}
      </select>
      {formik.touched.companyBankName && formik.errors.companyBankName && (
        <div className="text-red-500 text-xs mt-1">{formik.errors.companyBankName}</div>
      )}
    </div>
  );

  const renderTextArea = (name, label, rows = 3, colSpan = 2, disabled = false) => (
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
        disabled={disabled}
        className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 resize-none focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${
          isDark
            ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
            : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
        } disabled:opacity-50 disabled:cursor-not-allowed ${
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

        <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}>
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

            {isFetchingLoan && (
              <div className={`p-3 rounded-lg mb-4 ${isDark ? "bg-blue-900/20" : "bg-blue-50"}`}>
                <div className="flex items-center space-x-2">
                  <div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${
                    isDark ? "border-blue-400" : "border-blue-600"
                  }`}></div>
                  <span className={`text-sm ${isDark ? "text-blue-300" : "text-blue-600"}`}>
                    Fetching loan details...
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                  isDark ? "text-cyan-300 border-cyan-600/50" : "text-purple-700 border-purple-300"
                }`}>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderField("loanNo", "Loan No", "text", "Enter loan number", 1, isEdit)}
                  {renderField("name", "Name", "text", "Enter name", 1)}
                  {renderField("fatherName", "Father Name", "text", "Enter father's name", 1)}
                  {renderSelect("relation", "Relation", relationOptions, 1)}
                  {renderSelect("chequePresented", "Cheque Presented", chequeTypeOptions, 1)}
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                  isDark ? "text-cyan-300 border-cyan-600/50" : "text-purple-700 border-purple-300"
                }`}>
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Company Bank Details */}
                  <div className={`rounded-xl border-2 p-4 ${
                    isDark
                      ? "bg-gray-800/50 border-blue-600/30"
                      : "bg-blue-50 border-blue-200"
                  }`}>
                    <h4 className={`font-semibold  ${
                      isDark ? "text-blue-300" : "text-blue-700"
                    }`}>
                      Company Bank Details
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderBankSelect()}
                        {renderField("companyBankAC", "Account No.", "text", "Enter account number", 1)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField("companyBankBranch", "Branch", "text", "Enter branch", 1)}
                        {renderField("companyBankIFSC", "IFSC Code", "text", "Enter IFSC code", 1)}
                      </div>
                    </div>
                  </div>

                  {/* Customer Bank Details */}
                  <div className={`rounded-xl border-2 p-4 ${
                    isDark
                      ? "bg-gray-800/50 border-purple-500/40"
                      : "bg-purple-50 border-purple-200"
                  }`}>
                    <h4 className={`font-semibold mb-4 ${
                      isDark ? "text-purple-300" : "text-purple-700"
                    }`}>
                      Customer Bank Details
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField("customerBankName", "Bank Name", "text", "Enter bank name", 1)}
                        {renderField("customerBankBranch", "Branch", "text", "Enter branch", 1)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField("customerBankAC", "Account No.", "text", "Enter account number", 1)}
                        {renderField("customerBankIFSC", "IFSC Code", "text", "Enter IFSC code", 1)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cheque Details */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                  isDark ? "text-cyan-300 border-cyan-600/50" : "text-purple-700 border-purple-300"
                }`}>
                  Cheque Details
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {renderField("chequeNo", "Cheque No (6 digits)", "text", "Enter 6-digit cheque number", 1)}
                    {renderField("chequeDate", "Cheque Date", "date", "", 1)}
                    {renderField("chequeDepositDate", "Cheque Deposit Date", "date", "", 1)}
                    {renderField("chequeAmount", "Cheque Amount", "number", "Enter cheque amount", 1)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      {renderField("principalAmount", "Principal Amount", "number", "Enter Principal Amount", 1)}
                      {loanData?.details?.final_recommendation?.principal_amount && (
                        <div className="mt-1">
                          <span className={`text-xs ml-2 font-semibold ${isDark ? "text-blue-300" : "text-blue-600"}`}>
                            Principal: {loanData.details.final_recommendation.principal_amount}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      {renderField("interest", "Interest", "number", "Enter Interest Amount", 1)}
                      {loanData?.details?.final_recommendation?.interest && (
                        <div className="mt-1">
                          <span className={`text-xs ml-2 font-semibold ${isDark ? "text-blue-300" : "text-blue-600"}`}>
                            Interest: {loanData.details.final_recommendation.interest}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      {renderField("penalInterest", "Penal Interest", "number", "Enter Penal Interest", 1)}
                      {loanData?.details?.final_recommendation?.penal_interest && (
                        <div className="mt-1">
                          <span className={`text-xs ml-2 font-semibold ${isDark ? "text-blue-300" : "text-blue-600"}`}>
                            Penal Interest: {loanData.details.final_recommendation.penal_interest}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      {renderField("penalty", "Penalty", "number", "Enter Penalty Amount", 1)}
                      {loanData?.details?.final_recommendation?.penality && (
                        <div className="mt-1">
                          <span className={`text-xs ml-2 font-semibold ${isDark ? "text-blue-300" : "text-blue-600"}`}>
                            Penalty: {loanData.details.final_recommendation.penality}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Mode Sections */}
              {isEdit && (
                <>
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                      isDark ? "text-cyan-300 border-cyan-600/50" : "text-purple-700 border-purple-300"
                    }`}>
                      Cheque Clear/Bounce Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {renderSelect("status", "Status", statusOptions, 1)}
                        {renderField("bounceDate", "Bounce Date / Cheque Clear Date", "date", "", 1, 
                          isStatusReceived && formik.values.status !== "" ? false : isStatusReceived
                        )}
                        {renderField("bounceCharge", "Bounce Charge", "number", "Enter bounce charge", 1, isStatusReceived)}
                        {renderSelect("deliveryStatus", "Cheque Delivery Status", deliveryStatusOptions, 1, isStatusReceived)}
                      </div>
                      {renderTextArea("deliveryAddress", "Delivery Address", 2, 4, isStatusReceived)}
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                      isDark ? "text-cyan-300 border-cyan-600/50" : "text-purple-700 border-purple-300"
                    }`}>
                      Cheque Return Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {renderField("chequeReturnMemoDate", "Cheque Return Memo Date", "date", "", 1, isStatusReceived)}
                        {renderField("chequeReturnMemoReceivedDate", "Cheque Return Memo Received Date", "date", "", 1, isStatusReceived)}
                        {renderField("intimationMailFromBankDate", "Intimation Mail from Bank Date", "date", "", 1, isStatusReceived)}
                        {renderField("intimationMailFromDispatchChequeDate", "Intimation Mail from Dispatch Cheque Date", "date", "", 1, isStatusReceived)}
                      </div>
                      {renderTextArea("reasonOfBounce", "Reason of Bounce", 2, 4, isStatusReceived)}
                    </div>
                  </div>
                </>
              )}
            </div>

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
                disabled={submitting || isFetchingLoan || !formik.isValid}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"
                } shadow-lg`}
              >
                <Save size={20} />
                <span>{submitting ? "Processing..." : (isEdit ? "Update" : "Save")}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageChequeDepositPage;