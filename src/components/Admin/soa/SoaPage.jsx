"use client";
import React, { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import SoaDetails from "./SoaDetails";
import SoaTable from "./SoaTable";
import { exportToExcel } from "@/components/utils/exportutil";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";

const SoaPage = () => {
const { theme } = useThemeStore();
 const isDark = theme === "dark";
   const router = useRouter();

  // Sample SOA data
  const [soaData] = useState({
    crnNo: "CRN123456",
    name: "Abhi Shukla",
    sanctionedAmt: "50000",
    sanctionedDate: "24-06-2025",
    disburseAmt: "50000",
    disburseDate: "24-06-2025",
    roi: "12.5",
    tenure: "365",
    loanNo: "ATDAM35807",
    ledgerOsAmt: "8188"
  });

  // Sample transaction data
  const [transactionData] = useState([
    {
      id: 1,
      sn: 1,
      particular: "Loan Disbursement",
      date: "24-06-2025",
      principalAmount: "50000.00",
      interest: "0.00",
      dueAmount: "50000.00",
      receiptAmount: "0.00",
      penalty: "0.00",
      penalInterest: "0.00",
      penalGst: "0.00",
      bounceCharge: "0.00",
      balance: "50000.00"
    },
    {
      id: 2,
      sn: 2,
      particular: "EMI Payment",
      date: "24-07-2025",
      principalAmount: "41812.00",
      interest: "0.00",
      dueAmount: "41812.00",
      receiptAmount: "41812.00",
      penalty: "0.00",
      penalInterest: "0.00",
      penalGst: "0.00",
      bounceCharge: "0.00",
      balance: "8188.00"
    },
    {
      id: 3,
      sn: 3,
      particular: "Interest Charge",
      date: "25-07-2025",
      principalAmount: "0.00",
      interest: "273.97",
      dueAmount: "273.97",
      receiptAmount: "0.00",
      penalty: "0.00",
      penalInterest: "0.00",
      penalGst: "0.00",
      bounceCharge: "0.00",
      balance: "8461.97"
    }
  ]);

  const handleExport = (type) => {
    const exportData = transactionData.map(item => ({
      'SN': item.sn,
      'Particular': item.particular,
      'Date': item.date,
      'Principal Amount': item.principalAmount,
      'Interest': item.interest,
      'Due Amount': item.dueAmount,
      'Receipt Amount': item.receiptAmount,
      'Penalty': item.penalty,
      'Penal Interest': item.penalInterest,
      'Penal GST': item.penalGst,
      'Bounce Charge': item.bounceCharge,
      'Balance': item.balance
    }));

    if (type === 'excel') {
      exportToExcel(exportData, 'statement-of-account');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button 
              onClick={()=>router.back()}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                  : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
              }`}>
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Statement of Account
              </h1>
            </div>
            
            {/* Export Button */}
            <button
              onClick={() => handleExport('excel')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                isDark
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Details Section */}
        <SoaDetails data={soaData} isDark={isDark} />

        {/* Statement Table */}
        <SoaTable 
          transactionData={transactionData} 
          isDark={isDark} 
        />
      </div>
    </div>
  );
};

export default SoaPage;