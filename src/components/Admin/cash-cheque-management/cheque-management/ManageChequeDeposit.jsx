"use client"
import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/lib/AdminAuthContext";

const ManageChequeDepositPage = () => {
  const { isDark } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEdit = !!editId;

  const [formData, setFormData] = useState({
    loanNo: "",
    name: "",
    fatherName: "",
    relation: "",
    chequePresented: "Repayment Cheque",
    otherAddress: "",
    companyBankName: "",
    companyBankBranch: "",
    companyBankAC: "",
    companyBankIFSC: "",
    customerBankName: "",
    customerBankBranch: "",
    customerBankAC: "",
    customerBankIFSC: "",
    chequeNo: "",
    chequeReceivedDate: "",
    chequeDepositDate: "",
    amount: "",
    interest: "",
    penalInterest: "",
    penalty: ""
  });

  const [loanOptions] = useState([
    "ATDAM00282",
    "ATDAM01250", 
    "ATDAM02042",
    "ATDAM00315",
    "ATDAM01876"
  ]);

  const relationOptions = ["Self", "Father", "Mother", "Son", "Daughter", "Spouse", "Brother", "Sister"];
  const chequeTypeOptions = ["Repayment Cheque", "Security Cheque", "Interest Cheque"];

  useEffect(() => {
    if (isEdit) {
      // In real app, fetch deposit data by editId
      // For demo, using sample data
      const sampleData = {
        loanNo: "ATDAM00282",
        name: "Rajesh Kumar",
        fatherName: "Ram Kumar",
        relation: "Self",
        chequePresented: "Repayment Cheque",
        otherAddress: "123 Main Street, City",
        companyBankName: "ICICI BANK",
        companyBankBranch: "Central Branch",
        companyBankAC: "123456789",
        companyBankIFSC: "ICIC0001234",
        customerBankName: "HDFC BANK",
        customerBankBranch: "South Branch",
        customerBankAC: "987654321",
        customerBankIFSC: "HDFC0009876",
        chequeNo: "000029",
        chequeReceivedDate: "2020-02-15",
        chequeDepositDate: "2020-02-17",
        amount: "27357",
        interest: "12.5",
        penalInterest: "2.5",
        penalty: "500"
      };
      setFormData(sampleData);
    }
  }, [isEdit, editId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form Data:", formData);
    // Navigate back to deposits page
    router.push("/admin/cheque-deposit");
  };

  const handleCancel = () => {
    router.push("/crm/cheque-management");
  };

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
                <ArrowLeft
                
                 className={`w-5  h-5 ${
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

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Choose Loan No */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Choose Loan No:
                </label>
                <select
                  name="loanNo"
                  value={formData.loanNo}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  required
                >
                  <option value="">---Select Loan No---</option>
                  {loanOptions.map(loan => (
                    <option key={loan} value={loan}>{loan}</option>
                  ))}
                </select>
              </div>

              {/* Loan No (Display) */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Loan No:
                </label>
                <input
                  type="text"
                  value={formData.loanNo}
                  readOnly
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    isDark
                      ? "bg-gray-600 border-gray-500 text-gray-300"
                      : "bg-gray-100 border-gray-300 text-gray-600"
                  } cursor-not-allowed`}
                />
              </div>

              {/* Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  required
                />
              </div>

              {/* Father Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Father Name:
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  required
                />
              </div>

              {/* Relation */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Relation:
                </label>
                <select
                  name="relation"
                  value={formData.relation}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  required
                >
                  <option value="">----SELECT----</option>
                  {relationOptions.map(relation => (
                    <option key={relation} value={relation}>{relation}</option>
                  ))}
                </select>
              </div>

              {/* Cheque Presented */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Cheque Presented:
                </label>
                <select
                  name="chequePresented"
                  value={formData.chequePresented}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  required
                >
                  {chequeTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Other Address */}
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Other Address:
                </label>
                <textarea
                  name="otherAddress"
                  value={formData.otherAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>

              {/* Company Bank Details */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Company Bank Name <span className="text-xs">(Whose Cheque Maintained):</span>
                </label>
                <input
                  type="text"
                  name="companyBankName"
                  value={formData.companyBankName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Company Bank Branch <span className="text-xs">(Whose Cheque Maintained):</span>
                </label>
                <input
                  type="text"
                  name="companyBankBranch"
                  value={formData.companyBankBranch}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Company Bank A/C <span className="text-xs">(Whose Cheque Maintained):</span>
                </label>
                <input
                  type="text"
                  name="companyBankAC"
                  value={formData.companyBankAC}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Company Bank IFSC <span className="text-xs">(Whose Cheque Maintained):</span>
                </label>
                <input
                  type="text"
                  name="companyBankIFSC"
                  value={formData.companyBankIFSC}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>

              {/* Customer Bank Details */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Customer Bank Name <span className="text-xs">(Whose Cheque Maintained):</span>
                </label>
                <input
                  type="text"
                  name="customerBankName"
                  value={formData.customerBankName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Customer Bank Branch <span className="text-xs">(Whose Cheque Maintained):</span>
                </label>
                <input
                  type="text"
                  name="customerBankBranch"
                  value={formData.customerBankBranch}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Customer Bank A/C <span className="text-xs">(Whose Cheque Maintained):</span>
                </label>
                <input
                  type="text"
                  name="customerBankAC"
                  value={formData.customerBankAC}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Customer Bank IFSC <span className="text-xs">(Whose Cheque Maintained):</span>
                </label>
                <input
                  type="text"
                  name="customerBankIFSC"
                  value={formData.customerBankIFSC}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>

              {/* Cheque Details */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Cheque No:
                </label>
                <input
                  type="text"
                  name="chequeNo"
                  value={formData.chequeNo}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Cheque Received Date:
                </label>
                <input
                  type="date"
                  name="chequeReceivedDate"
                  value={formData.chequeReceivedDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Cheque Deposit Date:
                </label>
                <input
                  type="date"
                  name="chequeDepositDate"
                  value={formData.chequeDepositDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Amount:
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Interest:
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Penal Interest:
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="penalInterest"
                  value={formData.penalInterest}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                  Penalty:
                </label>
                <input
                  type="number"
                  name="penalty"
                  value={formData.penalty}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                      : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
                  } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex  justify-end space-x-4 mt-8 pt-6 border-t border-emerald-200/50">
              <button
                type="button"
                onClick={handleCancel}
                className={`px-6 py-3 rounded-xl cursor-pointer font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 ${
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
                className={`px-6 py-3 cursor-pointer rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 ${
                  isDark
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"
                } shadow-lg`}
              >
                <Save size={20} />
                <span>{isEdit ? "Update" : "Save"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageChequeDepositPage;