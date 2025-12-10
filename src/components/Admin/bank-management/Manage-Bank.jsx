'use client';
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Plus,
  Building2,
  DollarSign
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { toast } from 'react-hot-toast';
import BankForm from './BankForm';
import BankTable from './BankTable';
import { bankService, formatBankForUI } from '@/lib/services/BankServices';
import { exportToExcel } from '@/components/utils/exportutil';

const ManageBankPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State Management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  
  const [banks, setBanks] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    per_page: 10,
    total_pages: 0
  });

  const itemsPerPage = 10;
  const editId = searchParams.get('edit');

  // Fetch banks
  const fetchBanks = async (page = 1, search = "") => {
    try {
      setIsLoading(true);
      const response = await bankService.getBanks({
        page,
        per_page: itemsPerPage,
        search
      });

      if (response.success) {
        const formattedBanks = response.banks.map(formatBankForUI);
        setBanks(formattedBanks);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || "Failed to fetch banks");
      }
    } catch (err) {
      console.error("Error fetching banks:", err);
      toast.error(err.message || "Failed to load banks");
      setBanks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit mode from URL
  useEffect(() => {
    if (editId) {
      handleEdit(editId);
    }
  }, [editId]);

  // Fetch data on mount and when page/search changes
  useEffect(() => {
    fetchBanks(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Handle add/update bank
  const handleSubmitBank = async (values) => {
    try {
      if (isEditMode && selectedBank) {
        await bankService.updateBank(selectedBank.id, values);
      } else {
        await bankService.addBank(values);
      }
      
      // Refresh the list
      fetchBanks(currentPage, searchTerm);
      
      // Reset form
      setIsFormExpanded(false);
      setIsEditMode(false);
      setSelectedBank(null);
      
      // Clear edit param from URL
      if (editId) {
        router.replace('/crm/bank/manage');
      }
    } catch (err) {
      throw new Error(err.message || "Failed to save bank");
    }
  };

  // Handle edit
  const handleEdit = async (bankOrId) => {
    try {
      let bankData;
      
      if (typeof bankOrId === 'string' || typeof bankOrId === 'number') {
        // Fetch from API
        const response = await bankService.getBankById(bankOrId);
        if (response.success) {
          bankData = response.data;
        } else {
          throw new Error("Failed to fetch bank details");
        }
      } else {
        // Use provided bank object
        bankData = {
          bank: bankOrId.bank,
          branch_name: bankOrId.branchName,
          account_no: bankOrId.accountNo,
          ifsc_code: bankOrId.ifscCode,
          account_type: bankOrId.accountType,
          name: bankOrId.name,
          contact_person: bankOrId.contactPerson,
          phone: bankOrId.phone,
          email: bankOrId.email,
          amount: bankOrId.amount,
          apikey: bankOrId.apikey,
          passCode: bankOrId.passCode,
          bcID: bankOrId.bcID,
          uses_for: bankOrId.usesFor
        };
      }

      setSelectedBank({
        id: typeof bankOrId === 'object' ? bankOrId.id : bankOrId,
        ...bankData
      });
      setIsEditMode(true);
      setIsFormExpanded(true);
    } catch (err) {
      console.error("Error fetching bank:", err);
      toast.error("Failed to load bank details");
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id) => {
    try {
      await bankService.toggleStatus(id);
      toast.success("Status updated successfully");
      fetchBanks(currentPage, searchTerm);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  // Handle export
  const handleExport = () => {
    const exportData = banks.map(bank => ({
      'S.No': bank.id,
      'Bank': bank.bank,
      'Branch': bank.branchName,
      'Account No': bank.accountNo,
      'IFSC Code': bank.ifscCode,
      'Account Type': bank.accountType,
      'Account Name': bank.name,
      'Contact Person': bank.contactPerson,
      'Phone': bank.phone,
      'Email': bank.email,
      'Amount': bank.amount,
      'Usage': bank.usesFor,
      'API Key': bank.apikey,
      'BC ID': bank.bcID,
      'Status': bank.isActive ? 'Active' : 'Inactive',
      'Added By': bank.addedBy,
      'Created At': bank.createdAt
    }));

    exportToExcel(exportData, 'banks-list');
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Toggle form expansion
  const toggleForm = () => {
    setIsFormExpanded(!isFormExpanded);
    if (isFormExpanded && isEditMode) {
      setIsEditMode(false);
      setSelectedBank(null);
      if (editId) {
        router.replace('/crm/bank/manage');
      }
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setIsEditMode(false);
    setSelectedBank(null);
    setIsFormExpanded(false);
    if (editId) {
      router.replace('/crm/bank/manage');
    }
  };

  // Calculate statistics
  const totalAmount = banks.reduce((sum, bank) => sum + bank.amount, 0);
  const activeBanks = banks.filter(bank => bank.isActive).length;
  const disbursementBanks = banks.filter(bank => bank.usesFor === 'disbursement').length;
  const collectionBanks = banks.filter(bank => bank.usesFor === 'collection').length;

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
                onClick={() => router.back()}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-blue-600/30"
                    : "hover:bg-blue-50 bg-blue-50/50 border border-blue-200"
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
              </button>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-emerald-900/50" : "bg-emerald-100"
                }`}>
                  <Building2 className={`w-6 h-6 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`} />
                </div>
                <h1 className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${
                  isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                } bg-clip-text text-transparent`}>
                  Manage Banks
                </h1>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  if (isEditMode) cancelEdit();
                  setIsFormExpanded(true);
                }}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <Plus size={16} />
                <span>Add Bank Account</span>
              </button>
              <button
                onClick={handleExport}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                <Download size={16} />
                <span>Export</span>
              </button>
              <button
                onClick={() => fetchBanks(currentPage, searchTerm)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-xl border-2 ${
              isDark
                ? "bg-gray-800 border-emerald-600/50"
                : "bg-white border-emerald-200"
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-emerald-900/50" : "bg-emerald-100"
                }`}>
                  <Building2 className={`w-6 h-6 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {pagination.total || banks.length}
                  </p>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Total Bank Accounts
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
                  
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    ₹{totalAmount.toLocaleString()}
                  </p>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Total Amount
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 ${
              isDark
                ? "bg-gray-800 border-blue-600/50"
                : "bg-white border-blue-200"
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-blue-900/50" : "bg-blue-100"
                }`}>
                  <Building2 className={`w-6 h-6 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {activeBanks}
                  </p>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Active Accounts
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
                  <Building2 className={`w-6 h-6 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {disbursementBanks} / {collectionBanks}
                  </p>
                  <p className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Disb. / Collection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Form */}
        <div className="mb-8">
          <BankForm
            isDark={isDark}
            onSubmit={handleSubmitBank}
            initialData={selectedBank}
            isEditMode={isEditMode}
            isExpanded={isFormExpanded}
            onToggleExpand={toggleForm}
          />
        </div>

        {/* Bank Table */}
        <BankTable
          paginatedBanks={banks}
          filteredBanks={banks}
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ManageBankPage;