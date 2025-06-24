"use client";
import React, { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import SearchBar from "../../SearchBar";
import ChequeDepositTable from "./ChequeDepositTable";
import ChequeDepositModal from "./ManageChequeDeposit";
import { useRouter } from "next/navigation";

const ChequeDepositPage = () => {
  const { isDark } = useAdminAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  
  const [deposits, setDeposits] = useState([
    {
      id: 1,
      loanNo: "ATDAM00282",
      chequeNo: "000029",
      bankName: "ICICI BANK",
      depositDate: "17-02-2020",
      amount: 27357,
      user: "prashant",
      status: "bounced",
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
      chequeReceivedDate: "15-02-2020",
      chequeDepositDate: "17-02-2020",
      interest: 12.5,
      penalInterest: 2.5,
      penalty: 500
    },
    {
      id: 2,
      loanNo: "ATDAM01250",
      chequeNo: "324043",
      bankName: "ICICI BANK",
      depositDate: "17-02-2020",
      amount: 28580,
      user: "satyendra",
      status: "received",
      name: "Priya Sharma",
      fatherName: "Mohan Sharma",
      relation: "Daughter",
      chequePresented: "Repayment Cheque",
      otherAddress: "456 Park Avenue, Town",
      companyBankName: "ICICI BANK",
      companyBankBranch: "North Branch",
      companyBankAC: "111222333",
      companyBankIFSC: "ICIC0001111",
      customerBankName: "SBI BANK",
      customerBankBranch: "East Branch",
      customerBankAC: "444555666",
      customerBankIFSC: "SBIN0004445",
      chequeReceivedDate: "14-02-2020",
      chequeDepositDate: "17-02-2020",
      interest: 10.0,
      penalInterest: 3.0,
      penalty: 750
    },
    {
      id: 3,
      loanNo: "ATDAM02042",
      chequeNo: "000127",
      bankName: "ICICI BANK",
      depositDate: "17-02-2020",
      amount: 42192,
      user: "prashant",
      status: "bounced",
      name: "Amit Patel",
      fatherName: "Suresh Patel",
      relation: "Son",
      chequePresented: "Repayment Cheque",
      otherAddress: "789 Garden Road, Village",
      companyBankName: "ICICI BANK",
      companyBankBranch: "West Branch",
      companyBankAC: "777888999",
      companyBankIFSC: "ICIC0007778",
      customerBankName: "AXIS BANK",
      customerBankBranch: "Central Branch",
      customerBankAC: "123789456",
      customerBankIFSC: "UTIB0001237",
      chequeReceivedDate: "16-02-2020",
      chequeDepositDate: "17-02-2020",
      interest: 15.0,
      penalInterest: 4.0,
      penalty: 1000
    }
  ]);

  const itemsPerPage = 10;

  const handleAddDeposit = () => {
    router.push("/crm/cheque-management/manage-cheque-deposit");
  };

  const handleEditClick = (deposit) => {
    router.push(`/crm/cheque-management/manage-cheque-deposit?id=${deposit.id}`);
  };


  // Filter deposits
  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = 
      deposit.loanNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.chequeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.user.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || deposit.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeposits = filteredDeposits.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
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
                Manage Cheque Deposit
              </h1>
            </div>
            
            {/* Add Deposit Button */}
            <button
              onClick={handleAddDeposit}
              className={`px-6 py-3 cursor-pointer rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 ${
                isDark
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"
              } shadow-lg`}
            >
              <Plus size={20} />
              <span>Add Deposit</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search by loan no, cheque no, bank name, customer name..."
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            >
              <option value="all">All Status</option>
              <option value="received">Received</option>
              <option value="bounced">Bounced</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <ChequeDepositTable
          paginatedDeposits={paginatedDeposits}
          filteredDeposits={filteredDeposits}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onEditClick={handleEditClick}
        />
      </div>

    
    </div>
  );
};

export default ChequeDepositPage;