"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, X, Calendar, IndianRupee } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";

const ExpenseManagement = () => {
  const { isDark } = useAdminAuth();
  const [isEdit] = useState(false); // This would come from URL params in real app

  const [formData, setFormData] = useState({
    month: "",
    year: new Date().getFullYear(),
    salary: "",
    mobileExpenses: "",
    convence: "",
    interest: "",
    electricity: "",
    rent: "",
    promotionAdvertisement: "",
    cibil: "",
    others: ""
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i + 5);

  useEffect(
    () => {
      if (isEdit) {
        // In real app, fetch expense data by editId
        // For demo, using sample data
        const sampleData = {
          month: "January",
          year: 2019,
          salary: "200000",
          mobileExpenses: "20000",
          convence: "20000",
          interest: "15000",
          electricity: "2000",
          rent: "10000",
          promotionAdvertisement: "0",
          cibil: "0",
          others: "20000"
        };
        setFormData(sampleData);
      }
    },
    [isEdit]
  );

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form Data:", formData);
    // Navigate back to expenses page
    // router.push("/admin/expenses");
  };

  const handleCancel = () => {
    // Navigate back to expenses page
    // router.push("/admin/expenses");
    window.history.back();
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark
        ? "bg-gray-900"
        : "bg-emerald-50/30"}`}
    >
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className={`p-3 cursor-pointer rounded-xl transition-all duration-200 hover:scale-105 ${isDark
                  ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                  : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"}`}
              >
                <ArrowLeft
                  className={`w-5 h-5 ${isDark
                    ? "text-emerald-400"
                    : "text-emerald-600"}`}
                />
              </button>
              <h1
                className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${isDark
                  ? "from-emerald-400 to-teal-400"
                  : "from-emerald-600 to-teal-600"} bg-clip-text text-transparent`}
              >
                {isEdit ? "Edit Expense" : "Add Expense"}
              </h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <div
          className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"}`}
        >
          {/* Form Header */}
          <div
            className={`px-6 py-4 border-b-2 ${isDark
              ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
              : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"}`}
          >
            <h2
              className={`text-lg font-bold ${isDark
                ? "text-gray-100"
                : "text-gray-700"}`}
            >
              {isEdit ? "Edit Expense" : "Add Expense"}
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Month */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDark
                    ? "text-gray-200"
                    : "text-gray-700"}`}
                >
                  Month:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar
                      className={`w-4 h-4 ${isDark
                        ? "text-gray-400"
                        : "text-gray-600"}`}
                    />
                  </div>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    required
                  >
                    <option value="">Select Month</option>
                    {months.map(month =>
                      <option key={month} value={month}>
                        {month}
                      </option>
                    )}
                  </select>
                </div>
              </div>

              {/* Year */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDark
                    ? "text-gray-200"
                    : "text-gray-700"}`}
                >
                  Year:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar
                      className={`w-4 h-4 ${isDark
                        ? "text-gray-400"
                        : "text-gray-600"}`}
                    />
                  </div>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    required
                  >
                    <option value="">Select Year</option>
                    {years.map(year =>
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )}
                  </select>
                </div>
              </div>

              {/* Salary */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDark
                    ? "text-gray-200"
                    : "text-gray-700"}`}
                >
                  Salary:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee
                      className={`w-4 h-4 ${isDark
                        ? "text-gray-400"
                        : "text-gray-600"}`}
                    />
                  </div>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter salary"
                    required
                  />
                </div>
              </div>

              {/* Mobile Expenses */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDark
                    ? "text-gray-200"
                    : "text-gray-700"}`}
                >
                  Mobile Expenses:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee
                      className={`w-4 h-4 ${isDark
                        ? "text-gray-400"
                        : "text-gray-600"}`}
                    />
                  </div>
                  <input
                    type="number"
                    name="mobileExpenses"
                    value={formData.mobileExpenses}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter mobile expenses"
                  />
                </div>
              </div>

              {/* Convence */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDark
                    ? "text-gray-200"
                    : "text-gray-700"}`}
                >
                  Convence:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee
                      className={`w-4 h-4 ${isDark
                        ? "text-gray-400"
                        : "text-gray-600"}`}
                    />
                  </div>
                  <input
                    type="number"
                    name="convence"
                    value={formData.convence}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter convence"
                  />
                </div>
              </div>

              {/* Interest */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDark
                    ? "text-gray-200"
                    : "text-gray-700"}`}
                >
                  Interest:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee
                      className={`w-4 h-4 ${isDark
                        ? "text-gray-400"
                        : "text-gray-600"}`}
                    />
                  </div>
                  <input
                    type="number"
                    name="interest"
                    value={formData.interest}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter interest"
                  />
                </div>
              </div>

              {/* Electricity */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDark
                    ? "text-gray-200"
                    : "text-gray-700"}`}
                >
                  Electricity:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee
                      className={`w-4 h-4 ${isDark
                        ? "text-gray-400"
                        : "text-gray-600"}`}
                    />
                  </div>
                  <input
                    type="number"
                    name="electricity"
                    value={formData.electricity}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter electricity"
                  />
                </div>
              </div>

              {/* Rent */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDark
                    ? "text-gray-200"
                    : "text-gray-700"}`}
                >
                  Rent:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee
                      className={`w-4 h-4 ${isDark
                        ? "text-gray-400"
                        : "text-gray-600"}`}
                    />
                  </div>
                  <input
                    type="number"
                    name="rent"
                    value={formData.rent}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter rent"
                  />
                </div>
              </div>

              {/* Promotion/Advertisement */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDark
                    ? "text-gray-200"
                    : "text-gray-700"}`}
                >
                  Promotion/Advertisement:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee
                      className={`w-4 h-4 ${isDark
                        ? "text-gray-400"
                        : "text-gray-600"}`}
                    />
                  </div>
                  <input
                    type="number"
                    name="promotionAdvertisement"
                    value={formData.promotionAdvertisement}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter promotion/advertisement"
                  />
                </div>
              </div>

              {/* Cibil */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDark
                    ? "text-gray-200"
                    : "text-gray-700"}`}
                >
                  Cibil:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee
                      className={`w-4 h-4 ${isDark
                        ? "text-gray-400"
                        : "text-gray-600"}`}
                    />
                  </div>
                  <input
                    type="number"
                    name="cibil"
                    value={formData.cibil}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter cibil"
                  />
                </div>
              </div>

              {/* Others */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDark
                    ? "text-gray-200"
                    : "text-gray-700"}`}
                >
                  Others:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee
                      className={`w-4 h-4 ${isDark
                        ? "text-gray-400"
                        : "text-gray-600"}`}
                    />
                  </div>
                  <input
                    type="number"
                    name="others"
                    value={formData.others}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                    placeholder="Enter others"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-emerald-200/50">
              <button
                type="button"
                onClick={handleCancel}
                className={`px-6 py-3 rounded-xl cursor-pointer font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 ${isDark
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-gray-500 hover:bg-gray-600 text-white"} shadow-lg`}
              >
                <X size={20} />
                <span>Cancel</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className={`px-6 py-3 cursor-pointer rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 ${isDark
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"} shadow-lg`}
              >
                <Save size={20} />
                <span>
                  {isEdit ? "Update" : "Save"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManagement;
