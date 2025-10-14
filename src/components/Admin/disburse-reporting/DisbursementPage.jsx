"use client";
import React, { useState } from "react";
import { ArrowLeft, Download, Calendar, Search, Filter } from "lucide-react";
import AdvancedSearchBar from "../AdvanceSearchBar";
import DisbursementTable from "./DisbursementTable";
import BankDateFilter from "../BankDateFilter";
import { exportToExcel } from "@/components/utils/exportutil";
import NewLoanModal from "./NewLoanModal";
import UpdateDisbursementModal from "./UpdateDisbursementModal";
import TransactionDetailsModal from "./TransationDetailsModal";
import DisburseStatusModal from "./DisburseStatus";
import { useRouter } from "next/navigation";
import TransferModal from "./TransferModal";
import toast from "react-hot-toast"; 
import { useThemeStore } from "@/lib/store/useThemeStore";


const DisbursementPage = () => {
  const { theme } = useThemeStore();
    const isDark = theme === "dark";
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedBank, setSelectedBank] = useState("all");
  const [filterBy, setFilterBy] = useState("all");
  const [advancedSearch, setAdvancedSearch] = useState({ field: "", term: "" });
  const [newLoanModal, setNewLoanModal] = useState({ isOpen: false, customerName: '', oldLoanNo: '' });
  const [updateModal, setUpdateModal] = useState({ 
    isOpen: false, 
    disbursementData: null 
  });
  const [transactionModal, setTransactionModal] = useState({ 
    isOpen: false, 
    disbursementData: null 
  });
  const [transactionStatusModal, setTransactionStatusModal] = useState({ 
    isOpen: false, 
    disbursementData: null 
  });
  const [transferModal, setTransferModal] = useState({ 
  isOpen: false, 
  disbursementData: null 
});



  // Sample disbursement data
  const [disbursementData, setDisbursementData] = useState([
    {
      id: 1,
      sn: 1,
      loanNo: "ATDAM36345",
      disburseDate: "2025-07-07",
      crnNo: "R24AJ757",
      tranRefNo: "7",
      tranDate: "2025-07-07",
      sanctionedAmount: "29000.00",
      disbursedAmount: "24894.00",
      dueDate: "2025-08-07",
      senderAcNo: "9876543210123456",
      senderName: "ATD FINANCIAL SERVICES PVT LTD",
      transaction: "NEFT",
      beneficiaryBankIFSC: "IBKL0001807",
      beneficiaryAcType: "Saving",
      beneficiaryAcNo: "180710400074713",
      beneficiaryAcName: "Rakesh P v",
      beneficiaryPhone: "9876543210",
      sendToRec: "Loan/ATDAM36345",
      newLoan: "Active",
      action: "Completed",
      isTransaction: true
    },
    {
      id: 2,
      sn: 2,
      loanNo: "ATDAM36346",
      disburseDate: "2025-07-08",
      crnNo: "R24AJ758",
      tranRefNo: "8",
      tranDate: "2025-07-08",
      sanctionedAmount: "50000.00",
      dueDate: "2025-08-07",
      disbursedAmount: "47500.00",
      senderAcNo: "9876543210123456",
      senderName: "ATD FINANCIAL SERVICES PVT LTD",
      transaction: "RTGS",
      beneficiaryBankIFSC: "SBIN0001234",
      beneficiaryAcType: "Current",
      beneficiaryAcNo: "123456789012345",
      beneficiaryAcName: "Priya Sharma",
      beneficiaryPhone: "9876543211",
      sendToRec: "Loan/ATDAM36346",
      newLoan: "Active",
      action: "Completed",
      isTransaction: true
    },
    {
      id: 3,
      sn: 3,
      loanNo: "ATDAM36347",
      disburseDate: "2025-07-09",
      crnNo: "R24AJ759",
      tranRefNo: "9",
      tranDate: "2025-07-09",
      sanctionedAmount: "75000.00",
      disbursedAmount: "71250.00",
      senderAcNo: "9876543210123456",
      senderName: "ATD FINANCIAL SERVICES PVT LTD",
      transaction: "IMPS",
      beneficiaryBankIFSC: "HDFC0001234",
      beneficiaryAcType: "Saving",
      beneficiaryAcNo: "987654321098765",
      beneficiaryAcName: "Amit Kumar",
      beneficiaryPhone: "9876543212",
      sendToRec: "Loan/ATDAM36347",
      newLoan: "Active",
      action: "Pending",
      isTransaction: false
    },
    {
      id: 4,
      sn: 4,
      loanNo: "ATDAM36348",
      disburseDate: "2025-07-10",
      crnNo: "R24AJ760",
      tranRefNo: "10",
      tranDate: "2025-07-10",
      sanctionedAmount: "100000",
      disbursedAmount: "95000",
      senderAcNo: "9876543210123456",
      senderName: "ATD FINANCIAL SERVICES PVT LTD",
      transaction: "NEFT",
      beneficiaryBankIFSC: "ICIC0001234",
      beneficiaryAcType: "Saving",
      beneficiaryAcNo: "456789123456789",
      beneficiaryAcName: "Sunita Devi",
      beneficiaryPhone: "9876543213",
      sendToRec: "Loan/ATDAM36348",
      newLoan: "Active",
      action: "Completed",
      isTransaction: true
    },
    {
      id: 5,
      sn: 5,
      loanNo: "ATDAM36349",
      disburseDate: "2025-07-11",
      crnNo: "R24AJ761",
      tranRefNo: "11",
      tranDate: "2025-07-11",
      sanctionedAmount: "35000",
      disbursedAmount: "33250",
      senderAcNo: "9876543210123456",
      senderName: "ATD FINANCIAL SERVICES PVT LTD",
      transaction: "UPI",
      beneficiaryBankIFSC: "AXIS0001234",
      beneficiaryAcType: "Current",
      beneficiaryAcNo: "789123456789123",
      beneficiaryAcName: "Ravi Singh",
      beneficiaryPhone: "9876543214",
      sendToRec: "Loan/ATDAM36349",
      newLoan: "Active",
      action: "Failed",
      isTransaction: false
    }
  ]);

  // Sample banks for filtering
  const banks = [
    { id: "all", name: "All Banks" },
    { id: "IBKL", name: "IDBI Bank" },
    { id: "SBIN", name: "State Bank of India" },
    { id: "HDFC", name: "HDFC Bank" },
    { id: "ICIC", name: "ICICI Bank" },
    { id: "AXIS", name: "Axis Bank" },
    { id: "PUNB", name: "Punjab National Bank" }
  ];


  // Advanced search options
  const searchOptions = [
    { value: 'crnNo', label: 'CRN No' },
    { value: 'loanNo', label: 'Loan No' },
    { value: 'beneficiaryAcName', label: 'Name' },
    { value: 'beneficiaryPhone', label: 'Phone' },
    { value: 'tranRefNo', label: 'Trans Ref' }
  ];

  const itemsPerPage = 10;

  // Filter disbursement data
  const filteredDisbursementData = disbursementData.filter(item => {
    // Advanced search filter
    const matchesAdvancedSearch = (() => {
      if (!advancedSearch.field || !advancedSearch.term) return true;
      
      const fieldValue = item[advancedSearch.field]?.toString().toLowerCase() || '';
      return fieldValue.includes(advancedSearch.term.toLowerCase());
    })();

    // Bank filter
    const matchesBank = selectedBank === "all" || 
      item.beneficiaryBankIFSC.includes(selectedBank);

    // Transaction filter
    const matchesFilter = (() => {
      if (filterBy === "all") return true;
      if (filterBy === "transaction") return item.isTransaction === true;
      if (filterBy === "not_transaction") return item.isTransaction === false;
      return item.action.toLowerCase() === filterBy.toLowerCase();
    })();

    // Date range filtering
    const matchesDateRange = (() => {
      if (!dateRange.from && !dateRange.to) return true;
      
      const itemDate = new Date(item.disburseDate);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;
      
      if (fromDate && toDate) {
        return itemDate >= fromDate && itemDate <= toDate;
      } else if (fromDate) {
        return itemDate >= fromDate;
      } else if (toDate) {
        return itemDate <= toDate;
      }
      return true;
    })();

    return matchesAdvancedSearch && matchesBank && matchesFilter && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredDisbursementData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDisbursementData = filteredDisbursementData.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = (type) => {
    const exportData = filteredDisbursementData.map(item => ({
      'SN': item.sn,
      'Loan No': item.loanNo,
      'Disburse Date': item.disburseDate,
      'CRN No': item.crnNo,
      'Tran Ref No': item.tranRefNo,
      'Tran Date': item.tranDate,
      'Sanctioned Amount': item.sanctionedAmount,
      'Disbursed Amount': item.disbursedAmount,
      'Sender A/C No': item.senderAcNo,
      'Sender Name': item.senderName,
      'Transaction': item.transaction,
      'Beneficiary Bank IFSC': item.beneficiaryBankIFSC,
      'Beneficiary A/C Type': item.beneficiaryAcType,
      'Beneficiary A/C No': item.beneficiaryAcNo,
      'Beneficiary A/C Name': item.beneficiaryAcName,
      'Beneficiary Phone': item.beneficiaryPhone,
      'Send to Rec': item.sendToRec,
      'New Loan': item.newLoan,
      'Action': item.action
    }));

    exportToExcel(exportData, type === 'gst' ? 'disbursement-gst-data' : 'disbursement-data');
  };

  const handleGSTExport = () => {
    // Filter only non-transaction data for GST export
    const gstData = filteredDisbursementData
      .filter(item => !item.isTransaction)
      .map(item => ({
        'SN': item.sn,
        'Loan No': item.loanNo,
        'Disburse Date': item.disburseDate,
        'CRN No': item.crnNo,
        'Sanctioned Amount': item.sanctionedAmount,
        'Disbursed Amount': item.disbursedAmount,
        'Beneficiary Bank IFSC': item.beneficiaryBankIFSC,
        'Beneficiary A/C Name': item.beneficiaryAcName,
        'Beneficiary Phone': item.beneficiaryPhone,
        'Action': item.action
      }));

    exportToExcel(gstData, 'disbursement-gst-export');
  };

  const handleAdvancedSearch = (searchData) => {
    setAdvancedSearch(searchData);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters) => {
    setDateRange(filters.dateRange);
    setSelectedBank(filters.selectedBank);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  // Transfer modal handlers
const handleTransferModalOpen = (disbursementData) => {
  setTransferModal({ isOpen: true, disbursementData });
};

const handleTransferModalClose = () => {
  setTransferModal({ isOpen: false, disbursementData: null });
};

const handleTransferSubmit = async (transferData) => {
  console.log('Transfer data:', transferData);
  
  try {
    // Update the disbursement data in your state
    setDisbursementData(prevData => 
      prevData.map(item => 
        item.id === transferData.id ? transferData : item
      )
    );
    
    // Add your API call here
    // Example: await processTransfer(transferData);
    
    toast.success('Transfer processed successfully!');
  } catch (error) {
    toast.error('Transfer failed. Please try again.');
  }
};

  const handleNewLoanModalOpen = (customerName, loanNo) => {
    setNewLoanModal({ isOpen: true, customerName, oldLoanNo: loanNo });
  };
  
  const handleNewLoanModalClose = () => {
    setNewLoanModal({ isOpen: false, customerName: '', oldLoanNo: '' });
  };
  
  const handleNewLoanSubmit = async (loanData) => {
    console.log('New loan data:', loanData);
    // Add your API call here
    // Example: await createNewLoan(loanData);
    alert('New loan created successfully!');
  };

//   update 
// Add handler functions:
const handleUpdateModalOpen = (disbursementData) => {
    setUpdateModal({ isOpen: true, disbursementData });
  };
  
  const handleUpdateModalClose = () => {
    setUpdateModal({ isOpen: false, disbursementData: null });
  };
  
  const handleUpdateSubmit = async (updatedData) => {
    console.log('Updated disbursement data:', updatedData);
    
    // Update the disbursement data in your state
    setDisbursementData(prevData => 
      prevData.map(item => 
        item.id === updatedData.id ? updatedData : item
      )
    );
    
    // Add your API call here
    // Example: await updateDisbursement(updatedData);
    alert('Disbursement updated successfully!');
  };

  //transaction
  const handleTransactionModalOpen = (disbursementData) => {
    setTransactionModal({ isOpen: true, disbursementData });
  };
  
  const handleTransactionModalClose = () => {
    setTransactionModal({ isOpen: false, disbursementData: null });
  };
  
  const handleTransactionSubmit = async (transactionData) => {
    console.log('Transaction data:', transactionData);
    
    // Update the disbursement data in your state
    setDisbursementData(prevData => 
      prevData.map(item => 
        item.id === transactionData.id ? transactionData : item
      )
    );
    
    // Add your API call here
    // Example: await updateTransaction(transactionData);
    alert('Transaction updated successfully!');
  };

  //status
  const handleTransactionStatusModalOpen = (disbursementData) => {
    setTransactionStatusModal({ isOpen: true, disbursementData });
  };
  
  const handleTransactionStatusModalClose = () => {
    setTransactionStatusModal({ isOpen: false, disbursementData: null });
  };
  
  const handleTransactionStatusSubmit = async (statusData) => {
    console.log('Transaction status data:', statusData);
    
    // Update the disbursement data in your state if needed
    setDisbursementData(prevData => 
      prevData.map(item => 
        item.id === statusData.id ? { ...item, transactionStatus: 'Checked' } : item
      )
    );
    
    // Add your API call here
    // Example: await checkTransactionStatus(statusData);
    alert('Transaction status checked successfully!');
  };

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
              <h1 className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Disbursement
              </h1>
            </div>
            
            {/* Export Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleGSTExport}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <Download size={16} />
                <span>Export GST</span>
              </button>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Bank Date Filter */}
          <BankDateFilter
            dateRange={dateRange}
            selectedBank={selectedBank}
            banks={banks}
            isDark={isDark}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />

          {/* Non-Transaction Export Block */}
          <div className={`rounded-2xl p-4 mb-6 border-2 ${
            isDark
              ? "bg-gray-800 border-blue-600/50"
              : "bg-blue-50 border-blue-300"
          }`}>
            <div className="flex flex-wrap gap-8 items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${
                  isDark ? "text-blue-300" : "text-blue-700"
                }`}>
                  Non-Transaction Data Export
                </h3>

                <p className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Export only non-transaction disbursement data
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className={`px-4 py-2 rounded-xl border-2 transition-all duration-200 font-medium ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  {banks.map(bank => (
                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleGSTExport}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  <Download size={16} />
                  <span>Export Non-Transaction</span>
                </button>
              </div>
            </div>
          </div>

          </div>

          <div className="flex justify-between">
          {/* Transaction Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Filter By:
            </span>
            <div className="flex space-x-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'transaction', label: 'Transaction' },
                { id: 'not_transaction', label: 'Not Transaction' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setFilterBy(filter.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                    filterBy === filter.id
                      ? isDark
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-500 text-white"
                      : isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Search */}
          <div className="mb-6">
            <AdvancedSearchBar
              searchOptions={searchOptions}
              onSearch={handleAdvancedSearch}
              placeholder="Search disbursement data..."
              defaultSearchField="loanNo"
            />
          </div>
          </div>


          
        </div>

        {/* Table */}
        <DisbursementTable
          paginatedDisbursementData={paginatedDisbursementData}
          filteredDisbursementData={filteredDisbursementData}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onNewLoanClick={handleNewLoanModalOpen}
          onUpdateClick={handleUpdateModalOpen}
          onTransactionClick={handleTransactionModalOpen}
            onTransactionStatusClick={handleTransactionStatusModalOpen}
            onTransferClick={handleTransferModalOpen}

        />
      </div>

<TransferModal
  isOpen={transferModal.isOpen}
  onClose={handleTransferModalClose}
  onSubmit={handleTransferSubmit}
  isDark={isDark}
  disbursementData={transferModal.disbursementData}
/>


      {/* New Loan Modal */}
<NewLoanModal
  isOpen={newLoanModal.isOpen}
  onClose={handleNewLoanModalClose}
  onSubmit={handleNewLoanSubmit}
  isDark={isDark}
  customerName={newLoanModal.customerName}
  oldLoanNo={newLoanModal.oldLoanNo}
/>

{/* Update Disbursement Modal */}
<UpdateDisbursementModal
  isOpen={updateModal.isOpen}
  onClose={handleUpdateModalClose}
  onSubmit={handleUpdateSubmit}
  isDark={isDark}
  disbursementData={updateModal.disbursementData}
/>

{/* Transaction Details Modal */}
<TransactionDetailsModal
  isOpen={transactionModal.isOpen}
  onClose={handleTransactionModalClose}
  onSubmit={handleTransactionSubmit}
  isDark={isDark}
  disbursementData={transactionModal.disbursementData}
/>

{/* Transaction Status Modal */}
<DisburseStatusModal
  isOpen={transactionStatusModal.isOpen}
  onClose={handleTransactionStatusModalClose}
  onSubmit={handleTransactionStatusSubmit}
  isDark={isDark}
  customerName={transactionStatusModal.disbursementData?.beneficiaryAcName}
  disbursementData={transactionStatusModal.disbursementData}
/>
    </div>
  );
};

export default DisbursementPage;