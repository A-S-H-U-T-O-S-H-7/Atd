"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
// import { EamandateService, formatLoanDetails, formatEamandateDataForAPI } from "@/lib/services/EamandateService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const ManageEamandateDepositPage = () => {
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
  const eamandateTypeOptions = ["Repayment E-Mandate", "Security E-Mandate", "Interest E-Mandate"];
  const statusOptions = ["Bounced", "Received/cleared"];
  const deliveryStatusOptions = ["Successful", "Unsuccessful"];
  
  const bounceReasonOptions = [
    "Funds Insufficient",
    "Account Closed",
    "Account Frozen",
    "Account Blocked",
    "Account Does Not Exist",
    "Payment Stopped by Drawer",
    "Incomplete / Incorrect Details",
    "Invalid Mandate",
    "Incorrect IFSC / MICR",
    "Drawer Deceased",
    "Drawer Insolvent",
    "Technical Failure",
    "Mandate Expired",
    "Other"
  ];

  const inputClasses = `w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${
    isDark
      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  }`;

  const validateDates = (values) => {
    const errors = {};
    const emandateHitDate = new Date(values.emandateHitDate);
    const today = new Date();

    if (values.emandateHitDate) {
      const hitDate = new Date(values.emandateHitDate);
      if (hitDate > today) {
        errors.emandateHitDate = "E-Mandate hit date cannot be in the future";
      }
    }

    if (values.emandateStatusDate) {
      const statusDate = new Date(values.emandateStatusDate);
      if (statusDate > today) {
        errors.emandateStatusDate = "Status date cannot be in the future";
      }
    }

    const postHitFields = [
      'bounceDate',
      'bankNpcpDate'
    ];

    postHitFields.forEach(field => {
      if (values[field] && values.emandateHitDate) {
        const fieldDate = new Date(values[field]);
        if (fieldDate < emandateHitDate) {
          errors[field] = `Date cannot be before E-Mandate hit date (${values.emandateHitDate})`;
        }
        if (fieldDate > today) {
          errors[field] = "Date cannot be in the future";
        }
      }
    });

    return errors;
  };

  const positiveNumber = (message = "Amount must be positive") => {
    return Yup.number()
      .transform(value => (isNaN(value) ? undefined : value))
      .min(0, message)
      .typeError("Please enter a valid number");
  };

  const validationSchema = Yup.object({
    loanNo: Yup.string().required("Loan number is required"),
    name: Yup.string().required("Name is required"),
    fatherSpouseName: Yup.string().required("Father/Spouse name is required"),
    relation: Yup.string().required("Relation is required"),
    eamandatePresented: Yup.string().required("E-Mandate type is required"),
    emandateNumber: Yup.string()
      .required("E-Mandate number/Transaction ID is required"),
    principalAmount: positiveNumber("Principal amount must be positive"),
    emandateAmount: positiveNumber("E-Mandate amount is required and must be positive").required("E-Mandate amount is required"),
    emandateStatusDate: Yup.date().required("Status date is required"),
    emandateHitDate: Yup.date().required("E-Mandate hit date is required"),
    interest: positiveNumber("Interest must be positive"),
    penalInterest: positiveNumber("Penal interest must be positive"),
    penalty: positiveNumber("Penalty must be positive"),
  });

  const formik = useFormik({
    initialValues: {
      loanNo: "",
      name: "",
      fatherSpouseName: "",
      relation: "",
      eamandatePresented: "Repayment E-Mandate",
      
      companyBankName: "",
      companyBankId: "",
      companyBankBranch: "",
      companyBankAC: "",
      companyBankIFSC: "",
      customerBankName: "",
      customerBankBranch: "",
      customerBankAC: "",
      customerBankIFSC: "",
      
      emandateNumber: "",
      emandateStatusDate: "",
      emandateHitDate: "",
      principalAmount: "",
      emandateAmount: "",
      interest: "",
      penalInterest: "",
      penalty: "",
      
      status: "",
      bounceDate: "",
      bounceCharge: "",
      deliveryStatus: "",
      deliveryAddress: "",
      reasonOfBounce: "",
      otherReason: "",
      bankNpcpDate: "",
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

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await EamandateService.getBanks();
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

  const fetchBankDetails = async (bankId) => {
    if (!bankId) return;
    
    try {
      const response = await EamandateService.getBankDetails(bankId);
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
    const loadEditData = async () => {
      if (isEdit && editId) {
        setLoading(true);
        try {
          if (banks.length === 0) {
            await fetchBanks();
          }
          await fetchEamandateData(editId);
        } catch (error) {
          console.error("Error loading edit data:", error);
          toast.error("Failed to load data");
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadEditData();
  }, [isEdit, editId]);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      if (isEdit) return;
      
      if (formik.values.loanNo && formik.values.loanNo.length >= 9 && !loanFetched) {
        setIsFetchingLoan(true);
        try {
          const response = await EamandateService.getLoanDetails(formik.values.loanNo);
          
          if (response.status && response.data) {
            const loanDetails = formatLoanDetails(response.data);
            
            formik.setValues(prev => ({
              ...prev,
              ...loanDetails,
              name: response.data.customer_name || "",
              fatherSpouseName: response.data.fathername || "",
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
  }, [formik.values.loanNo, loanFetched, isEdit]);

  useEffect(() => {
    setLoanFetched(false);
  }, [formik.values.loanNo]);

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

  const fetchEamandateData = async (emandateId) => {
    try {
      setLoading(true);
      
      if (banks.length === 0) {
        await fetchBanks();
      }
      
      const emandateResponse = await EamandateService.getEamandateDeposit(emandateId);
      
      if (emandateResponse.status && emandateResponse.data) {
        const apiData = emandateResponse.data;
        
        const initialValues = {
          loanNo: apiData.loan_no || "",
          name: apiData.customer_name || "",
          fatherSpouseName: apiData.customer_father_name || "",
          relation: apiData.relation_with || "",
          eamandatePresented: apiData.emandate_presented || "Repayment E-Mandate",
          companyBankName: apiData.company_bank_name || "",
          companyBankBranch: apiData.company_bank_branch || "",
          companyBankAC: apiData.company_bank_ac || "",
          companyBankIFSC: apiData.company_bank_ifsc || "",
          customerBankName: apiData.customer_bank_name || "",
          customerBankBranch: apiData.customer_bank_branch || "",
          customerBankAC: apiData.customer_bank_ac || "",
          customerBankIFSC: apiData.customer_bank_ifsc || "",
          emandateNumber: apiData.emandate_no || "",
          emandateStatusDate: formatDateForInput(apiData.status_date),
          emandateHitDate: formatDateForInput(apiData.hit_date),
          principalAmount: apiData.principal_amount || "",
          emandateAmount: apiData.emandate_amount || "",
          interest: apiData.interest || "",
          penalInterest: apiData.penal_interest || "",
          penalty: apiData.penality || "",
          status: apiData.status || "",
          bounceDate: formatDateForInput(apiData.bounce_date),
          bounceCharge: apiData.bounce_charge || "",
          deliveryStatus: apiData.delivery_status || "",
          reasonOfBounce: apiData.reason_bounce || "",
          bankNpcpDate: formatDateForInput(apiData.bank_npcp_date),
          applicationId: apiData.application_id || ""
        };
        
        formik.setValues(initialValues);
        setLoanFetched(true);
        
        if (apiData.loan_no) {
          try {
            const loanResponse = await EamandateService.getLoanDetails(apiData.loan_no);
            if (loanResponse.status && loanResponse.data) {
              setLoanData(loanResponse.data);
            }
          } catch (error) {
            console.error("Error fetching loan data for reference:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching emandate data:", error);
      toast.error("Failed to load emandate data");
    } finally {
      setLoading(false);
    }
  };

  const handleNumberInput = (e, fieldName) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      formik.handleChange(e);
    }
  };

  const handleDateChange = (e, fieldName) => {
    formik.handleChange(e);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      const emandateData = formatEamandateDataForAPI(values, isEdit);
      
      let response;
      if (isEdit) {
        response = await EamandateService.updateEamandateDeposit(editId, emandateData);
      } else {
        response = await EamandateService.addEamandateDeposit(emandateData);
      }

      if (response.status) {
        toast.success(isEdit ? "E-Mandate updated successfully!" : "E-Mandate added successfully!");
        
        setTimeout(() => {
          router.push("/crm/emandate-management");
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
    router.push("/crm/emandate-management");
  };

  const renderField = (name, label, type = "text", placeholder = "", colSpan = 1, disabled = false) => {
    const isNumberField = type === "number";
    const isDateField = type === "date";
    
    let maxDate = "";
    let minDate = "";
    
    if (isDateField) {
      if (name === "emandateStatusDate" || name === "emandateHitDate") {
        maxDate = today;
      } else if (name === "bounceDate" || name === "bankNpcpDate") {
        maxDate = today;
        if (formik.values.emandateHitDate) {
          minDate = formik.values.emandateHitDate;
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
               (isDateField && name !== "emandateStatusDate" && name !== "emandateHitDate" && formik.values.emandateHitDate) 
                 ? formik.values.emandateHitDate 
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

  const renderBounceReasonSelect = () => (
    <div className="col-span-2">
      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        Reason of Bounce
      </label>
      <select
        name="reasonOfBounce"
        value={formik.values.reasonOfBounce}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={isStatusReceived}
        className={`${inputClasses} disabled:opacity-50 disabled:cursor-not-allowed ${
          formik.touched.reasonOfBounce && formik.errors.reasonOfBounce ? "border-red-500" : ""
        }`}
      >
        <option value="">----SELECT REASON----</option>
        {bounceReasonOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {formik.touched.reasonOfBounce && formik.errors.reasonOfBounce && (
        <div className="text-red-500 text-xs mt-1">{formik.errors.reasonOfBounce}</div>
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
                {isEdit ? "Edit E-Mandate Deposit" : "Add E-Mandate Deposit"}
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
              {isEdit ? "Edit E-Mandate Deposit" : "Add E-Mandate Deposit"}
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
              <div>
                <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                  isDark ? "text-cyan-300 border-cyan-600/50" : "text-purple-700 border-purple-300"
                }`}>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderField("loanNo", "Loan No", "text", "Enter loan number", 1, isEdit)}
                  {renderField("name", "Name", "text", "Enter name", 1)}
                  {renderField("fatherSpouseName", "Father/Spouse Name", "text", "Enter father/spouse name", 1)}
                  {renderSelect("relation", "Relation", relationOptions, 1)}
                  {renderSelect("eamandatePresented", "E-Mandate Presented", eamandateTypeOptions, 1)}
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                  isDark ? "text-cyan-300 border-cyan-600/50" : "text-purple-700 border-purple-300"
                }`}>
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <div>
                <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
                  isDark ? "text-cyan-300 border-cyan-600/50" : "text-purple-700 border-purple-300"
                }`}>
                  E-Mandate Details
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {renderField("emandateNumber", "E-Mandate Number/ Transaction ID", "text", "Nach/E-mandate payment report number/date", 1)}
                    {renderField("emandateStatusDate", "E-Mandate Status Date", "date", "", 1)}
                    {renderField("emandateHitDate", "E-Mandate Hit Date", "date", "", 1)}
                    {renderField("emandateAmount", "E-Mandate Amount", "number", "Enter E-Mandate amount", 1)}
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

              {isEdit && (
  <>
    <div>
      <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
        isDark ? "text-cyan-300 border-cyan-600/50" : "text-purple-700 border-purple-300"
      }`}>
        E-Mandate Status Details
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {renderSelect("status", "E-Mandate Status", statusOptions, 1)}
          {renderField("bounceDate", "E-Mandate Bounce Date / E-Mandate Clear Date", "date", "", 1, 
            isStatusReceived && formik.values.status !== "" ? false : isStatusReceived
          )}
          {renderField("bounceCharge", "Bounce Charge", "number", "Enter bounce charge", 1, isStatusReceived)}
          {renderSelect("deliveryStatus", "Delivery Status", deliveryStatusOptions, 1, isStatusReceived)}
        </div>
        
        {/* Add Delivery Address Input */}
        {formik.values.deliveryStatus && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-4">
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Delivery Address
              </label>
              <textarea
                name="deliveryAddress"
                value={formik.values.deliveryAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={2}
                disabled={isStatusReceived}
                className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 resize-none focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${
                  isDark
                    ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                    : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                } disabled:opacity-50 disabled:cursor-not-allowed ${
                  formik.touched.deliveryAddress && formik.errors.deliveryAddress ? "border-red-500" : ""
                }`}
                placeholder="Enter delivery address..."
              />
              {formik.touched.deliveryAddress && formik.errors.deliveryAddress && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.deliveryAddress}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

    <div>
  <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${
    isDark ? "text-cyan-300 border-cyan-600/50" : "text-purple-700 border-purple-300"
  }`}>
    Bounce Details
  </h3>
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Bank/NPCP Date */}
      {renderField("bankNpcpDate", "Bank/NPCP Date", "date", "", 1, isStatusReceived)}
      
      {/* Reason of Bounce */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          Reason of Bounce
        </label>
        <select
          name="reasonOfBounce"
          value={formik.values.reasonOfBounce}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isStatusReceived}
          className={`${inputClasses} disabled:opacity-50 disabled:cursor-not-allowed ${
            formik.touched.reasonOfBounce && formik.errors.reasonOfBounce ? "border-red-500" : ""
          }`}
        >
          <option value="">----SELECT REASON----</option>
          {bounceReasonOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {formik.touched.reasonOfBounce && formik.errors.reasonOfBounce && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.reasonOfBounce}</div>
        )}
      </div>
      
      {/* Other Reason (conditional) */}
      <div>
        {formik.values.reasonOfBounce === "Other" && (
          <>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              Specify Other Reason
            </label>
            <textarea
              name="otherReason"
              value={formik.values.otherReason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={2}
              disabled={isStatusReceived}
              className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 resize-none focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${
                isDark
                  ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } disabled:opacity-50 disabled:cursor-not-allowed ${
                formik.touched.otherReason && formik.errors.otherReason ? "border-red-500" : ""
              }`}
              placeholder="Please specify the bounce reason..."
            />
            {formik.touched.otherReason && formik.errors.otherReason && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.otherReason}</div>
            )}
          </>
        )}
      </div>
    </div>
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

export default ManageEamandateDepositPage;