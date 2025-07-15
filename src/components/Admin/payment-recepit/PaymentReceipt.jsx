"use client";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import SearchBar from "../SearchBar";
import PaymentReceiptTable from "./PaymentReceiptTable";
import PaymentUpdateModal from "./PaymentUpdateModal";
import { useRouter } from "next/navigation";

// Main Payment Receipt Management Component
const PaymentReceiptPage = () => {
  const { isDark } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const router = useRouter();
  
  const [payments, setPayments] = useState([
    {
      id: 1,
      srNo: 1,
      date: "04-06-2025",
      loanNo: "ATDAM34475",
      name: "Harini Manavalan",
      email: "harinivenkatesh166@gmail.com",
      phone: "6379299449",
      outstandingAmount: "13,214.44",
      payableAmount: "13478.7288",
      receivedAmount: "",
      commission: "-"
    },
    {
      id: 2,
      srNo: 2,
      date: "31-05-2025",
      loanNo: "ATDAM33861",
      name: "Pratik Ghosh",
      email: "ghoshpratik941@gmail.com",
      phone: "7000090528",
      outstandingAmount: "8,517.48",
      payableAmount: "8687.8296",
      receivedAmount: "",
      commission: "-"
    },
    {
      id: 3,
      srNo: 3,
      date: "30-05-2025",
      loanNo: "ATDAM34495",
      name: "Amar S Dudhanikar",
      email: "amarsd76@gmail.com",
      phone: "7204141496",
      outstandingAmount: "30,623.00",
      payableAmount: "31235.46",
      receivedAmount: "",
      commission: "-"
    },
    {
      id: 4,
      srNo: 4,
      date: "30-04-2025",
      loanNo: "ATDAM33624",
      name: "Amar S Dudhanikar",
      email: "amarsd76@gmail.com",
      phone: "7204141496",
      outstandingAmount: "29,641.00",
      payableAmount: "30233.82",
      receivedAmount: "",
      commission: "-"
    },
    {
      id: 5,
      srNo: 5,
      date: "11-03-2025",
      loanNo: "ATDAM31646",
      name: "Sathish Kumar Vijaya Kumar",
      email: "sathishkumar8084@gmail.com",
      phone: "9940437532",
      outstandingAmount: "38,473.67",
      payableAmount: "39243.1434",
      receivedAmount: "",
      commission: "-"
    },
    {
      id: 6,
      srNo: 6,
      date: "24-12-2024",
      loanNo: "ATDAM30561",
      name: "Sachin Yadav",
      email: "yadav.sachin586@gmail.com",
      phone: "7678169063",
      outstandingAmount: "6,121.00",
      payableAmount: "6243.42",
      receivedAmount: "",
      commission: "-"
    },
    {
      id: 7,
      srNo: 7,
      date: "30-11-2024",
      loanNo: "ATDAM30070",
      name: "Rohit Prabhunrayan Singh",
      email: "rhtsingh240@gmail.com",
      phone: "8097287957",
      outstandingAmount: "7,150.00",
      payableAmount: "7293",
      receivedAmount: "",
      commission: "-"
    },
    {
      id: 8,
      srNo: 8,
      date: "15-11-2024",
      loanNo: "ATDAM29789",
      name: "Amrita Mahesh Pimpalkhare",
      email: "amritam.pimpalkhare@gmail.com",
      phone: "9890328997",
      outstandingAmount: "7,155.00",
      payableAmount: "7298.1",
      receivedAmount: "",
      commission: "-"
    },
    {
      id: 9,
      srNo: 9,
      date: "01-11-2024",
      loanNo: "ATDAM29392",
      name: "Debashis Pramanik",
      email: "deb.pramanik9@gmail.com",
      phone: "8100223035",
      outstandingAmount: "10,201.00",
      payableAmount: "10405.02",
      receivedAmount: "",
      commission: "-"
    }
  ]);

  const itemsPerPage = 10;

  const handleUpdateClick = (payment) => {
    setSelectedPayment(payment);
    setIsUpdateModalOpen(true);
  };

  const handlePaymentUpdate = (paymentId, updateData) => {
    setPayments(prevPayments =>
      prevPayments.map(payment =>
        payment.id === paymentId
          ? { ...payment, ...updateData }
          : payment
      )
    );
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.loanNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.phone.includes(searchTerm);

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
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
                Payment Receipt
              </h1>
            </div>
          </div>

          {/* Search */}
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

        {/* Table */}
        <PaymentReceiptTable
          paginatedPayments={paginatedPayments}
          filteredPayments={filteredPayments}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onUpdateClick={handleUpdateClick}
        />
      </div>

      {/* Modal */}
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