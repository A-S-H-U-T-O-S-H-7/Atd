"use client";
import React, { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import AdvancedSearchBar from "../AdvanceSearchBar";
import OverdueApplicantTable from "./OverdueApplicantTable";
import { exportToExcel } from "@/components/utils/exportutil";
import CallDetailsModal from "../CallDetailsModal";
import AdjustmentModal from "../AdjustmentModal";
import OverdueAmountModal from "../OverdueAmountModal";
import { useRouter } from "next/navigation";

// Main Overdue Applicant Management Component
const OverdueApplicantPage = () => {
  const { isDark } = useAdminAuth();
  const router = useRouter();
const [searchField, setSearchField] = useState("");
const [searchTerm, setSearchTerm] = useState("");  const [statusFilter, setStatusFilter] = useState("all");
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showOverdueModal, setShowOverdueModal] = useState(false);
  const [selectedApplicantForAdjustment,setSelectedApplicantForAdjustment] = useState(null);
  const [selectedApplicantForOverdue,setSelectedApplicantForOverdue] = useState(null);

  const [overdueApplicants, setOverdueApplicants] = useState([
    {
      id: 1158,
      srNo: 1,
      call: true,
      loanNo: "ATDAM35685",
      dueDate: "27-06-2025",
      name: "Prabhat Kumar",
      phoneNo: "9892139975",
      email: "prabhat88.india@gmail.com",
      adjustment: "Adjustment",
      balance: 16182.0,
      overdueAmt: 16182.0,
      upiPayments: 16182.0,
      demandNotice: "Send Notice",
      status: "Adjustment"
    },
    {
      id: 1157,
      srNo: 2,
      call: true,
      loanNo: "ATDAM35675",
      dueDate: "26-06-2025",
      name: "Sachin Satish Hegshetye",
      phoneNo: "9987209129",
      email: "sachin.hegshetye@gmail.com",
      adjustment: "Adjustment",
      balance: 3034.0,
      overdueAmt: 3034.0,
      upiPayments: 3034.0,
      demandNotice: "Send Notice",
      status: "Adjustment"
    },
    {
      id: 1156,
      srNo: 3,
      call: true,
      loanNo: "ATDAM35673",
      dueDate: "27-06-2025",
      name: "YESHAS HASSAN CHIDAMBARA",
      phoneNo: "9538591172",
      email: "yeshas1991@gmail.com",
      adjustment: "Adjustment",
      balance: 19229.0,
      overdueAmt: 19229.0,
      upiPayments: 19229.0,
      demandNotice: "Send Notice",
      status: "Adjustment"
    },
    {
      id: 1155,
      srNo: 4,
      call: true,
      loanNo: "ATDAM35407",
      dueDate: "21-06-2025",
      name: "Vikas Dhyani",
      phoneNo: "9582063690",
      email: "vikas92dh@gmail.com",
      adjustment: "Adjustment",
      balance: 9126.0,
      overdueAmt: 9975.0,
      upiPayments: 9975.0,
      demandNotice: "Send Notice",
      status: "Overdue"
    },
    {
      id: 1154,
      srNo: 5,
      call: true,
      loanNo: "ATDAM35403",
      dueDate: "24-06-2025",
      name: "Gaurav Jain",
      phoneNo: "9351084161",
      email: "gaurav9253@gmail.com",
      adjustment: "Adjustment",
      balance: 20321.0,
      overdueAmt: 20321.0,
      upiPayments: 20321.0,
      demandNotice: "Send Notice",
      status: "Adjustment"
    }
  ]);

  const SearchOptions = [
  { value: 'loanNo', label: 'Loan No.' },
  { value: 'name', label: 'Name' },
  { value: 'phoneNo', label: 'Phone Number' },
  { value: 'dueDate', label: 'Due Date' },
];

  const handleCall = applicant => {
    setSelectedApplicant(applicant);
    setShowCallModal(true);
  };

  const handleCallSubmit = callData => {
    console.log("Call submitted:", callData);
    setShowCallModal(false);
    setSelectedApplicant(null);
  };

  const handleAdjustmentClick = applicant => {
    setSelectedApplicantForAdjustment(applicant);
    setShowAdjustmentModal(true);
  };

  const handleOverdueAmountClick = applicant => {
    setSelectedApplicantForOverdue(applicant);
    setShowOverdueModal(true);
  };

  const handleAdjustmentSubmit = adjustmentData => {
    console.log("Adjustment submitted:", adjustmentData);
    setShowAdjustmentModal(false);
    setSelectedApplicantForAdjustment(null);
  };

  const handleAdjustment = applicant => {
    // Handle adjustment functionality
    console.log("Processing adjustment for:", applicant.name);
  };

  const handleRenew = applicant => {
    // Handle renew functionality
    console.log("Renewing for:", applicant.name);
  };

  const handleSendNotice = applicant => {
    // Handle send notice functionality
    console.log("Sending notice to:", applicant.name);
  };
  

  const handleExport = type => {
    const exportData = filteredApplicants.map(applicant => ({
      "SR No": applicant.srNo,
      "Loan No": applicant.loanNo,
      "Due Date": applicant.dueDate,
      Name: applicant.name,
      "Phone No": applicant.phoneNo,
      Email: applicant.email,
      Balance: applicant.balance,
      "Overdue Amount": applicant.overdueAmt,
      "UPI Payments": applicant.upiPayments,
      Status: applicant.status
    }));

    if (type === "excel") {
      exportToExcel(exportData, "overdue_applicants");
    } else if (type === "overdue_ref") {
      exportToExcel(exportData, "overdue_reference_export");
    }
  };

  //  filter logic:
const filteredApplicants = overdueApplicants.filter(applicant => {
  const matchesSearch = !searchField || !searchTerm || 
    applicant[searchField]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchesStatus = statusFilter === "all" || 
    applicant.status.toLowerCase() === statusFilter.toLowerCase();
  
  return matchesSearch && matchesStatus;
});

 const handleAdvancedSearch = ({ field, term }) => {
  setSearchField(field);
  setSearchTerm(term);
};

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark
        ? "bg-gray-900"
        : "bg-emerald-50/30"}`}
    >
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
              onClick={()=>router.back()}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${isDark
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
                Overdue All Applicants
              </h1>
            </div>

            {/* Export Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport("excel")}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${isDark
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"}`}
              >
                <Download size={16} />
                <span>Export</span>
              </button>
              <button
                onClick={() => handleExport("overdue_ref")}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${isDark
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"}`}
              >
                <Download size={16} />
                <span>Overdue Ref. Export</span>
              </button>
            </div>
          </div>

          {/* Search and Total Records */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <AdvancedSearchBar 
  searchOptions={SearchOptions}
  onSearch={handleAdvancedSearch}
  isDark={isDark}
/>
            </div>
          </div>

          {/* Total Records Display */}
          <div
            className={`mb-4 px-4 py-2 rounded-lg ${isDark
              ? "bg-gray-800/50 text-emerald-400"
              : "bg-emerald-50 text-emerald-700"}`}
          >
            <span className="font-semibold">
              Total Records: {filteredApplicants.length}
            </span>
          </div>
        </div>

        <AdjustmentModal
          isOpen={showAdjustmentModal}
          onClose={() => {
            setShowAdjustmentModal(false);
            setSelectedApplicantForAdjustment(null);
          }}
          applicant={selectedApplicantForAdjustment}
          isDark={isDark}
          onSubmit={handleAdjustmentSubmit}
        />

        <OverdueAmountModal
          isOpen={showOverdueModal}
          onClose={() => {
            setShowOverdueModal(false);
            setSelectedApplicantForOverdue(null);
          }}
          applicant={selectedApplicantForOverdue}
          isDark={isDark}
        />

        {/* Table */}
        <OverdueApplicantTable
          filteredApplicants={filteredApplicants}
          isDark={isDark}
          onCall={handleCall}
          onAdjustment={handleAdjustmentClick}
          onRenew={handleRenew}
          onSendNotice={handleSendNotice}
          onOverdueAmountClick={handleOverdueAmountClick}
        />
      </div>

      <CallDetailsModal
        isOpen={showCallModal}
        onClose={() => {
          setShowCallModal(false);
          setSelectedApplicant(null);
        }}
        data={selectedApplicant}
        isDark={isDark}
        onSubmit={handleCallSubmit}
      />
    </div>
  );
};

export default OverdueApplicantPage;
