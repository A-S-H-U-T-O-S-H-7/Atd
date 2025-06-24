"use client";
import React, { useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle, CreditCard, Download, Scale } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import SearchBar from "../SearchBar";
import LegalTable from "./LegalTable";
import { exportToExcel } from "@/components/utils/exportutil";

// Main Legal Management Component
const LegalPage = () => {
  const { isDark } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [legals, setLegals] = useState([
    {
      id: 1,
      sNo: 1,
      customerName: "Niladri Bhushan Jena",
      fatherHusbandName: "Jagannath Jena",
      mobileNo: "9167658561",
      loanId: "ATDAM03702",
      crnNo: "N5AS850",
      address: "ROOMNO 303,MRUNALI GUEST HOUSE ,SEC 19, CBD BELAPUR Navi Mumbai",
      currentAddress: "ROOMNO 303,MRUNALI GUEST HOUSE ,SEC 19, CBD BELAPUR Navi Mumbai",
      otherAddress: "Vill- JUGALA, POST - DHAMARA, JAGULA, BHADRAK,ODISHA,756171",
      otherAddress2: "KAMOTHE KAMOTHE 1207 MAHARASHTRA 410209",
      principal: 24000,
      interest: 3456,
      penalty: 500,
      bounceCharges: 500,
      penalInterest: 6048,
      totalAmount: 34504,
      sanctionedLoanAmount: 24000,
      tenure: 30,
      sanctionDate: "2019-10-31",
      disbursementAmount: 23434,
      disbursementDate: "2019-10-31",
      processingFee: 480,
      gst: 86,
      emi: 25440,
      daysEmi: 0,
      totalPfGst: 566,
      bankName: "ICICI BANK",
      ifsc: "SBIN0010330",
      accountNo: "08310500173805",
      bankAddress: "Laxmi Nagar, Delhi",
      chequeNo: "260637",
      chequeDate: "10-01-2020",
      chequeAmount: 35093,
      chequeBounceDate: "13-01-2020",
      intimationMailFromBank: "18-01-2020",
      intimationMailFormDispatch: "18-01-2020",
      intimationMailBankFormDeliver: "18-01-2020",
      chequeReturnMemo: "13-01-2020",
      chequeReturnMemoReceived: "17-01-2020",
      reasonOfBounce: "Fund Insufficient",
      closeDate: "28-01-2020",
      certifiedCopyStatement: "28-01-2020",
      legalNotice: "06-02-2020",
      speedPost: "06-02-2020",
      speedPostReceived: "06-02-2020",
      policeStation: "Sec 58, Noida",
      boardResolution: "10-01-2020",
      loanAgreement: "31-01-2019",
      loanApplication: "01-03-2020",
      noticeUs138: "27-01-2020",
      replyReceived: "",
      caseFilled: "20-03-2020",
      deliveryStatus: "DELIVERED"
    },
    {
      id: 2,
      sNo: 2,
      customerName: "Akash Yadav",
      fatherHusbandName: "Virender Singh Yadav",
      mobileNo: "9654733636",
      loanId: "ATDAM0000000",
      crnNo: "A11AH527",
      address: "RZ H-1 Sangam Chowk West Sagarpur",
      currentAddress: "RZ H-1 Sangam Chowk West Sagarpur",
      otherAddress: "",
      otherAddress2: "",
      principal: 10000,
      interest: 8960,
      penalty: 2300,
      bounceCharges: 118,
      penalInterest: 26640,
      totalAmount: 48018,
      sanctionedLoanAmount: 10000,
      tenure: 30,
      sanctionDate: "2018-09-29",
      disbursementAmount: 9646,
      disbursementDate: "2018-10-06",
      processingFee: 300,
      gst: 54,
      emi: 10600,
      daysEmi: 0,
      totalPfGst: 354,
      bankName: "YES BANK",
      ifsc: "KKBK0004588",
      accountNo: "001481300000713",
      bankAddress: "Sector-63 Noida Uttar Pradesh 201301",
      chequeNo: "021563",
      chequeDate: "28-01-2020",
      chequeAmount: 46700,
      chequeBounceDate: "29-01-2020",
      intimationMailFromBank: "15-01-2020",
      intimationMailFormDispatch: "22-01-2020",
      intimationMailBankFormDeliver: "23-01-2020",
      chequeReturnMemo: "23-01-2020",
      chequeReturnMemoReceived: "31-01-2020",
      reasonOfBounce: "Fund Insufficient",
      closeDate: "23-01-2020",
      certifiedCopyStatement: "23-01-2020",
      legalNotice: "",
      speedPost: "",
      speedPostReceived: "",
      policeStation: "New Ashok Nagar",
      boardResolution: "16-01-2020",
      loanAgreement: "14-11-2019",
      loanApplication: "22-01-2020",
      noticeUs138: "23-01-2020",
      replyReceived: "",
      caseFilled: "",
      deliveryStatus: "NOT DELIVERED"
    }
  ]);

  const itemsPerPage = 10;

  const handleExport = (type) => {
    const exportData = filteredLegals.map(legal => ({
      'S.No': legal.sNo,
      'Customer Name': legal.customerName,
      'Mobile No': legal.mobileNo,
      'Loan ID': legal.loanId,
      'CRN No': legal.crnNo,
      'Principal': legal.principal,
      'Interest': legal.interest,
      'Total Amount': legal.totalAmount,
      'Bank Name': legal.bankName,
      'IFSC': legal.ifsc,
      'Sanction Date': legal.sanctionDate,
      'Disbursement Date': legal.disbursementDate,
      'Police Station': legal.policeStation,
      'Delivery Status': legal.deliveryStatus
    }));

    if (type === 'excel') {
      exportToExcel(exportData, 'legal-cases');
    }
  };

  // Filter legals based on search term
  const filteredLegals = legals.filter(legal => {
    const searchLower = searchTerm.toLowerCase();
    return (
      legal.customerName.toLowerCase().includes(searchLower) ||
      legal.mobileNo.includes(searchTerm) ||
      legal.loanId.toLowerCase().includes(searchLower) ||
      legal.crnNo.toLowerCase().includes(searchLower) ||
      legal.ifsc.toLowerCase().includes(searchLower) ||
      legal.bankName.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredLegals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLegals = filteredLegals.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-blue-50/30"
    }`}>
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "hover:bg-gray-800 bg-gray-800/50 border border-blue-600/30"
                  : "hover:bg-blue-50 bg-blue-50/50 border border-blue-200"
              }`}>
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <div className="flex items-center space-x-3">
                
                <h1 className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
            } bg-clip-text text-transparent`}>
                  Legal Cases Management
                </h1>
              </div>
            </div>
            
            {/* Export Button */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('excel')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search by Customer Name, Mobile No, Loan ID, CRN No, IFSC..."
              />
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-xl border-2 ${
              isDark
                ? "bg-gray-800 border-blue-600/50"
                : "bg-white border-blue-200"
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-blue-900/50" : "bg-blue-100"
                }`}>
                  <Scale className={`w-6 h-6 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {filteredLegals.length}
                  </p>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Total Cases
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 ${
              isDark
                ? "bg-gray-800 border-green-600/50"
                : "bg-white border-green-200"
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
              isDark ? "bg-green-900/50" : "bg-green-100"
            }`}>
              <CheckCircle className={`w-6 h-6 ${
                isDark ? "text-green-400" : "text-green-600"
              }`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}>
                {filteredLegals.filter(legal => legal.deliveryStatus?.toLowerCase() === 'delivered').length}
              </p>
              <p className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Delivered
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border-2 ${
          isDark
            ? "bg-gray-800 border-orange-600/50"
            : "bg-white border-orange-200"
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${
              isDark ? "bg-orange-900/50" : "bg-orange-100"
            }`}>
              <AlertCircle className={`w-6 h-6 ${
                isDark ? "text-orange-400" : "text-orange-600"
              }`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}>
                {filteredLegals.filter(legal => legal.deliveryStatus?.toLowerCase() === 'not delivered').length}
              </p>
              <p className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Not Delivered
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border-2 ${
          isDark
            ? "bg-gray-800 border-purple-600/50"
            : "bg-white border-purple-200"
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${
              isDark ? "bg-purple-900/50" : "bg-purple-100"
            }`}>
              <CreditCard className={`w-6 h-6 ${
                isDark ? "text-purple-400" : "text-purple-600"
              }`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}>
                ₹{filteredLegals.reduce((sum, legal) => sum + (legal.totalAmount || 0), 0).toLocaleString()}
              </p>
              <p className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Total Amount
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Legal Table */}
    <LegalTable
      paginatedLegals={paginatedLegals}
      filteredLegals={filteredLegals}
      currentPage={currentPage}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      isDark={isDark}
      onPageChange={setCurrentPage}
    />
  </div>
</div>
);
};

export default LegalPage;