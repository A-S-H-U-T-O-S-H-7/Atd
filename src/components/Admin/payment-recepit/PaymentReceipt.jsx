"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import SearchBar from "../SearchBar";
import PaymentReceiptTable from "./PaymentReceiptTable";
import PaymentUpdateModal from "./PaymentUpdateModal";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { paymentReceiptAPI, formatPaymentForUI } from "@/lib/services/PaymentReceiptServices";
import toast from "react-hot-toast";

const PaymentReceiptPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();

  const itemsPerPage = 10;

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      const params = {
        per_page: itemsPerPage,
        page: currentPage,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await paymentReceiptAPI.getPayments(params);
      
      if (response && response.success) {
        const paymentsData = response.data || [];
        const formattedPayments = paymentsData.map((payment, index) => 
          formatPaymentForUI(payment, index, currentPage, itemsPerPage)
        );
        
        setPayments(formattedPayments);
        
        if (!searchTerm && response.pagination) {
          setTotalPages(response.pagination.total_pages || 1);
          setTotalCount(response.pagination.total || formattedPayments.length);
        } else {
          setTotalPages(1);
          setTotalCount(formattedPayments.length);
        }
      } else {
        setPayments([]);
        setTotalCount(0);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("API Error:", err);
      setPayments([]);
      setTotalCount(0);
      setTotalPages(0);
      toast.error("Failed to fetch payments", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (payment) => {
    setSelectedPayment(payment);
    setIsUpdateModalOpen(true);
  };

  const handlePaymentUpdate = async (paymentId, updateData) => {
    try {
      const response = await paymentReceiptAPI.updatePaymentReceipt(paymentId, updateData);
      
      if (response && response.success) {
        toast.success(response.message || "Payment updated successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        
        fetchPayments();
        setIsUpdateModalOpen(false);
        setSelectedPayment(null);
      } else {
        toast.error(response?.message || "Update failed", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update payment", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1);
      fetchPayments();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-0 md:p-4">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={()=>router.back()}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
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
                  Payment Receipt
                </h1>
                <p className={`text-sm mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  {totalCount} payments found
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => fetchPayments()}
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search payments, names, loan numbers..."
              />
            </div>
          </div>
        </div>

        <PaymentReceiptTable
          paginatedPayments={payments}
          filteredPayments={payments}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onUpdateClick={handleUpdateClick}
          loading={loading}
          totalItems={totalCount}
        />
      </div>

      <PaymentUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        payment={selectedPayment}
        onUpdate={handlePaymentUpdate}
        isDark={isDark}
      />
    </div>
  );
};

export default PaymentReceiptPage;