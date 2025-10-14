"use client";
import React, { useState } from "react";
import { ArrowLeft, Plus, } from "lucide-react";
import CashTable from "./CashTable";
import CashDepositModal from "./CashDepositModal";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";

// Main Cash Management Component
const CashManagementPage = () => {
const { theme } = useThemeStore();
 const isDark = theme === "dark";
   const [currentPage, setCurrentPage] = useState(1);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [editingDeposit, setEditingDeposit] = useState(null);
  const router = useRouter();
  
  const [deposits, setDeposits] = useState([
    {
      id: 1,
      sNo: 1,
      bankName: "ICICI Bank-A/C-1738",
      depositDate: "2020-02-29",
      amount: 11500,
      user: "piyush"
    },
    {
      id: 2,
      sNo: 2,
      bankName: "ICICI Bank-A/C-1738",
      depositDate: "2020-02-27",
      amount: 14840,
      user: "piyush"
    },
    {
      id: 3,
      sNo: 3,
      bankName: "ICICI Bank-A/C-1738",
      depositDate: "2020-02-24",
      amount: 38086,
      user: "piyush"
    },
    {
      id: 4,
      sNo: 4,
      bankName: "HDFC Bank-A/C-2456",
      depositDate: "2020-02-20",
      amount: 25000,
      user: "admin"
    },
    {
      id: 5,
      sNo: 5,
      bankName: "SBI Bank-A/C-9871",
      depositDate: "2020-02-18",
      amount: 15000,
      user: "manager"
    }
  ]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(deposits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeposits = deposits.slice(startIndex, startIndex + itemsPerPage);

  const handleAddDeposit = () => {
    setEditingDeposit(null);
    setIsDepositModalOpen(true);
  };

  const handleEditDeposit = (deposit) => {
    setEditingDeposit(deposit);
    setIsDepositModalOpen(true);
  };

  const handleSaveDeposit = (depositData) => {
    if (editingDeposit) {
      // Update existing deposit
      setDeposits(prev => prev.map(deposit => 
        deposit.id === editingDeposit.id 
          ? { ...deposit, ...depositData }
          : deposit
      ));
    } else {
      // Add new deposit
      const newDeposit = {
        id: deposits.length + 1,
        sNo: deposits.length + 1,
        ...depositData
      };
      setDeposits(prev => [...prev, newDeposit]);
    }
    setIsDepositModalOpen(false);
    setEditingDeposit(null);
  };

//   const handleExport = () => {
//     const exportData = deposits.map(deposit => ({
//       'S.No': deposit.sNo,
//       'Bank Name': deposit.bankName,
//       'Deposit Date': deposit.depositDate,
//       'Amount': deposit.amount,
//       'User': deposit.user
//     }));

//     exportToExcel(exportData, 'cash-deposits');
//   };

  

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-blue-50/30"
    }`}>
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
              onClick={()=> router.back()}
               className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
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
                  Cash Deposit Management
                </h1>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              {/* <button
                onClick={handleExport}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <TrendingUp size={16} />
                <span>Export</span>
              </button> */}
              <button
                onClick={handleAddDeposit}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                <Plus size={16} />
                <span>Add Deposit</span>
              </button>
            </div>
          </div>

          
        </div>

        {/* Cash Table */}
        <CashTable
          paginatedDeposits={paginatedDeposits}
          deposits={deposits}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onEditDeposit={handleEditDeposit}
        />

        {/* Cash Deposit Modal */}
        <CashDepositModal
          isOpen={isDepositModalOpen}
          onClose={() => {
            setIsDepositModalOpen(false);
            setEditingDeposit(null);
          }}
          onSave={handleSaveDeposit}
          editingDeposit={editingDeposit}
          isDark={isDark}
        />
      </div>
    </div>
  );
};

export default CashManagementPage;