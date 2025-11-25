"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowLeft, Save, X, Calendar, IndianRupee } from "lucide-react";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { toast } from 'react-hot-toast';
import { expenseService } from "@/lib/services/ExpenseService";
import { useSearchParams } from "next/navigation";

// ✅ ExpenseInput component outside
const ExpenseInput = ({ label, name, placeholder, required = false, formik, isDark }) => (
  <div>
    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IndianRupee className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
      </div>
      <input
        type="number"
        step="0.01"
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
          isDark
            ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
            : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
        } ${
          formik.touched[name] && formik.errors[name] ? 'border-red-500' : ''
        } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
        placeholder={placeholder}
      />
    </div>
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
    )}
  </div>
);

const ExpenseManagement = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const searchParams = useSearchParams();
  const expenseId = searchParams.get('id');
  const isEdit = Boolean(expenseId);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i + 5);

  // Validation Schema
  const validationSchema = Yup.object({
    month: Yup.string().required('Month is required'),
    year: Yup.number().required('Year is required'),
    salary: Yup.number()
      .typeError('Salary must be a number')
      .min(0, 'Salary cannot be negative')
      .required('Salary is required'),
    mobileExpenses: Yup.number()
      .typeError('Mobile expenses must be a number')
      .min(0, 'Mobile expenses cannot be negative'),
    convence: Yup.number()
      .typeError('Convence must be a number')
      .min(0, 'Convence cannot be negative'),
    interest: Yup.number()
      .typeError('Interest must be a number')
      .min(0, 'Interest cannot be negative'),
    electricity: Yup.number()
      .typeError('Electricity must be a number')
      .min(0, 'Electricity cannot be negative'),
    rent: Yup.number()
      .typeError('Rent must be a number')
      .min(0, 'Rent cannot be negative'),
    promotionAdvertisement: Yup.number()
      .typeError('Promotion/Advertisement must be a number')
      .min(0, 'Promotion/Advertisement cannot be negative'),
    cibil: Yup.number()
      .typeError('Cibil must be a number')
      .min(0, 'Cibil cannot be negative'),
    others: Yup.number()
      .typeError('Others must be a number')
      .min(0, 'Others cannot be negative')
  });

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  // ✅ Initialize formik first
  const formik = useFormik({
    initialValues: {
      month: "",
      year: new Date().getFullYear(),
      salary: 0,
      mobileExpenses: 0,
      convence: 0,
      interest: 0,
      electricity: 0,
      rent: 0,
      promotionAdvertisement: 0,
      cibil: 0,
      others: 0
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        
        let response;
        
        if (isEdit) {
          response = await expenseService.updateExpense(expenseId, values);
        } else {
          response = await expenseService.addExpense(values);
        }
        
        
        // ✅ Fixed: response already unwrapped by axios interceptor
        if (response && response.success) {
          const message = isEdit ? 'Expense updated successfully!' : 'Expense added successfully!';
          toast.success(message);
          resetForm();
          setIsRedirecting(true);
          
          setTimeout(() => {
            window.history.back();
          }, 1500);
        } else {
          const message = response?.message || (isEdit ? 'Expense updated successfully!' : 'Expense added successfully!');
          toast.success(message);
          resetForm();
          setIsRedirecting(true);
          
          setTimeout(() => {
            window.history.back();
          }, 1500);
        }
      } catch (error) {
        console.error('Error submitting expense:', error);
        console.error('Error response:', error.response); // Debug log
        const errorMessage = error.response?.data?.message || error.message || 
          (isEdit ? 'Failed to update expense' : 'Failed to add expense');
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (isEdit && expenseId) {
      fetchExpenseData();
    }
  }, [isEdit, expenseId]);

  const fetchExpenseData = async () => {
    try {
      setLoading(true);
      const response = await expenseService.getExpenseById(expenseId);
      
      console.log('Fetch response:', response); // Debug log
      
      // ✅ Fixed: response already unwrapped by axios interceptor
      if (response && response.success) {
        const expenseData = response.data;
        
        // ✅ Convert all values to numbers
        formik.setValues({
          month: getMonthName(expenseData.month),
          year: parseInt(expenseData.year) || new Date().getFullYear(),
          salary: parseFloat(expenseData.salary) || 0,
          mobileExpenses: parseFloat(expenseData.mobile_expenses) || 0,
          convence: parseFloat(expenseData.convence) || 0,
          interest: parseFloat(expenseData.interest) || 0,
          electricity: parseFloat(expenseData.electricity) || 0,
          rent: parseFloat(expenseData.rent) || 0,
          promotionAdvertisement: parseFloat(expenseData.promotion) || 0,
          cibil: parseFloat(expenseData.cibil) || 0,
          others: parseFloat(expenseData.others) || 0
        });
      } else {
        toast.error('Failed to fetch expense data');
      }
    } catch (error) {
      console.error('Error fetching expense:', error);
      toast.error('Error loading expense data');
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (monthNumber) => {
    const months = {
      '01': 'January', '02': 'February', '03': 'March', '04': 'April',
      '05': 'May', '06': 'June', '07': 'July', '08': 'August',
      '09': 'September', '10': 'October', '11': 'November', '12': 'December'
    };
    
    if (monthNumber && monthNumber.includes('-')) {
      const monthPart = monthNumber.split('-')[0];
      return months[monthPart] || 'January';
    }
    
    return months[monthNumber] || 'January';
  };

  const handleCancel = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-emerald-50/30"}`}>
        <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4`}>
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-emerald-50/30"}`}>
      {/* Loading Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4`}>
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Redirecting...
            </p>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Please wait
            </p>
          </div>
        </div>
      )}
      
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              </button>
              <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                {isEdit ? "Edit Expense" : "Add Expense"}
              </h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <div className={`rounded-2xl border-2 overflow-hidden ${
            isDark ? "bg-gray-800 border-emerald-600/50" : "bg-white border-emerald-300"
          }`}>
            {/* Form Header */}
            <div className={`px-6 py-4 border-b-2 ${
              isDark ? "border-emerald-600/50" : "border-emerald-300"
            }`}>
              <h2 className={`text-lg font-bold ${isDark ? "text-gray-100" : "text-gray-700"}`}>
                {isEdit ? "Edit Expense" : "Add Expense"}
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Month */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Month <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                    </div>
                    <select
                      name="month"
                      value={formik.values.month}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        isDark
                          ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                          : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                      } ${
                        formik.touched.month && formik.errors.month ? 'border-red-500' : ''
                      } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    >
                      <option value="">Select Month</option>
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  {formik.touched.month && formik.errors.month && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.month}</p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Year <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                    </div>
                    <select
                      name="year"
                      value={formik.values.year}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        isDark
                          ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                          : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                      } ${
                        formik.touched.year && formik.errors.year ? 'border-red-500' : ''
                      } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    >
                      <option value="">Select Year</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  {formik.touched.year && formik.errors.year && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.year}</p>
                  )}
                </div>

                {/* ✅ Pass formik and isDark as props */}
                <ExpenseInput 
                  label="Salary" 
                  name="salary" 
                  placeholder="Enter salary amount" 
                  required 
                  formik={formik}
                  isDark={isDark}
                />
                <ExpenseInput 
                  label="Mobile Expenses" 
                  name="mobileExpenses" 
                  placeholder="Enter mobile expenses" 
                  formik={formik}
                  isDark={isDark}
                />
                <ExpenseInput 
                  label="Convence" 
                  name="convence" 
                  placeholder="Enter convence amount" 
                  formik={formik}
                  isDark={isDark}
                />
                <ExpenseInput 
                  label="Interest" 
                  name="interest" 
                  placeholder="Enter interest amount" 
                  formik={formik}
                  isDark={isDark}
                />
                <ExpenseInput 
                  label="Electricity" 
                  name="electricity" 
                  placeholder="Enter electricity bill" 
                  formik={formik}
                  isDark={isDark}
                />
                <ExpenseInput 
                  label="Rent" 
                  name="rent" 
                  placeholder="Enter rent amount" 
                  formik={formik}
                  isDark={isDark}
                />
                <ExpenseInput 
                  label="Promotion/Advertisement" 
                  name="promotionAdvertisement" 
                  placeholder="Enter promotion/advertisement" 
                  formik={formik}
                  isDark={isDark}
                />
                <ExpenseInput 
                  label="Cibil" 
                  name="cibil" 
                  placeholder="Enter cibil charges" 
                  formik={formik}
                  isDark={isDark}
                />
                <ExpenseInput 
                  label="Others" 
                  name="others" 
                  placeholder="Enter other expenses" 
                  formik={formik}
                  isDark={isDark}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-emerald-200/50">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={formik.isSubmitting}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isDark
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-gray-500 hover:bg-gray-600 text-white"
                  } shadow-lg ${formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <X size={20} />
                  <span>Cancel</span>
                </button>

                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isDark
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"
                  } shadow-lg ${formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Save size={20} />
                  <span>{formik.isSubmitting ? 'Saving...' : (isEdit ? 'Update Expense' : 'Save Expense')}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseManagement;