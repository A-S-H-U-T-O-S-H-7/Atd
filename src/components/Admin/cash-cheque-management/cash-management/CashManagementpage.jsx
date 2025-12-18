"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, RefreshCw } from "lucide-react";
import CashTable from "./CashTable";
import CashDepositModal from "./CashDepositModal";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { cashDepositAPI, formatCashDepositForUI, getBankIdFromName } from "@/lib/services/CashDepositServices";
import toast from "react-hot-toast";

const CashManagementPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [editingDeposit, setEditingDeposit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false); // New state for save loading
  
  const [deposits, setDeposits] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  const fetchCashDeposits = async () => {
    try {
      setLoading(true);
      
      const response = await cashDepositAPI.getCashDeposits({
        per_page: itemsPerPage,
        page: currentPage,
      });
      
      
      if (response && response.success) {
        const depositsData = response.data || [];
        const formattedDeposits = depositsData.map((deposit, index) => 
          formatCashDepositForUI(deposit, index, currentPage, itemsPerPage)
        );
        
        setDeposits(formattedDeposits);
        setTotalCount(response.pagination?.total || depositsData.length);
        setTotalPages(response.pagination?.total_pages || 1);
        
        // REMOVED: toast on load
        
      } else {
        setDeposits([]);
        setTotalCount(0);
        setTotalPages(0);
        
        if (response?.message) {
          console.error("API Error:", response.message);
        }
      }
    } catch (err) {
      console.error("API Error:", err);
      setDeposits([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeposit = () => {
    setEditingDeposit(null);
    setIsDepositModalOpen(true);
  };

  const handleEditDeposit = (deposit) => {
    
    const editData = {
      id: deposit.id,
      bankName: deposit.bankName || "HDFC Bank-A/C-2456",
      depositDate: deposit.depositDate || "",
      amount: deposit.amount?.toString() || "",
      user: deposit.user || "admin"
    };
    
    setEditingDeposit(editData);
    setIsDepositModalOpen(true);
  };

  const handleSaveDeposit = async (apiPayload) => {
  try {
    setSaving(true);
    
    let response;
    
    if (editingDeposit && editingDeposit.id) {
      response = await cashDepositAPI.updateCashDeposit(editingDeposit.id, apiPayload);
    } else {
      response = await cashDepositAPI.createCashDeposit(apiPayload);
    }
    
    if (response && response.status) {
      toast.success(response.message || "Deposit saved successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      
      fetchCashDeposits();
      setIsDepositModalOpen(false);
      setEditingDeposit(null);
    } else {
      toast.error(response?.message || "Save failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    
  } catch (error) {
    console.error("Save error:", error);
    
    const errorMessage = error.response?.data?.message || error.message || "Failed to save deposit";
    
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 3000,
    });
  } finally {
    setSaving(false);
  }
};

  useEffect(() => {
    fetchCashDeposits();
  }, [currentPage]);

  if (loading && deposits.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-blue-50/30"
      }`}>
        <div className="text-center">
          <RefreshCw className={`w-8 h-8 animate-spin mx-auto mb-4 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <p className={`text-lg font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            Loading cash deposits...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-blue-50/30"
    }`}>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-blue-600/30"
                    : "hover:bg-blue-50 bg-blue-50/50 border border-blue-200"
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <div>
                <h1 className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${
                  isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                } bg-clip-text text-transparent`}>
                  Cash Deposit Management
                </h1>
                <p className={`text-sm mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  {totalCount} deposits found
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => fetchCashDeposits()}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={handleAddDeposit}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
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

        <CashTable
          paginatedDeposits={deposits}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onEditDeposit={handleEditDeposit}
          loading={loading}
          totalItems={totalCount}
        />

        <CashDepositModal
          isOpen={isDepositModalOpen}
          onClose={() => {
            setIsDepositModalOpen(false);
            setEditingDeposit(null);
          }}
          onSave={handleSaveDeposit}
          editingDeposit={editingDeposit}
          isDark={isDark}
          saving={saving} 
        />
      </div>
    </div>
  );
};

export default CashManagementPage;