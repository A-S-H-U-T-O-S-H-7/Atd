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
      const response = await bankService.getBankById(bankOrId);
      if (response.success) {
        bankData = response.data;
      } else {
        throw new Error("Failed to fetch bank details");
      }
    } else {
      bankData = {
        bank: bankOrId.bank,
        branch_name: bankOrId.branchName,
        account_no: bankOrId.accountNo,
        ifsc_code: bankOrId.ifscCode,
        account_type: bankOrId.accountType,
        name: bankOrId.name,
        contact_person: bankOrId.contactPerson || '',
        phone: bankOrId.phone || '',
        email: bankOrId.email || '',
        amount: bankOrId.amount,
        apikey: bankOrId.apikey || '',
        passCode: bankOrId.passCode || '',
        bcID: bankOrId.bcID || '',
        uses_for: bankOrId.usesFor || 'collection'
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
      fetchBanks(currentPage, searchTerm);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-blue-50/30"
    }`}>
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
  <div className="flex items-center gap-3 sm:gap-4">
    <button
      onClick={() => router.back()}
      className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0 ${
        isDark
          ? "hover:bg-gray-800 bg-gray-800/50 border border-blue-600/30"
          : "hover:bg-blue-50 bg-blue-50/50 border border-blue-200"
      }`}
    >
      <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${
        isDark ? "text-emerald-400" : "text-emerald-600"
      }`} />
    </button>
    <div className="flex items-center gap-2 sm:gap-3">
      <div className={`p-2 sm:p-3 rounded-lg ${
        isDark ? "bg-emerald-900/50" : "bg-emerald-100"
      }`}>
        <Building2 className={`w-5 h-5 sm:w-6 sm:h-6 ${
          isDark ? "text-emerald-400" : "text-emerald-600"
        }`} />
      </div>
      <h1 className={`text-lg sm:text-xl md:text-3xl font-bold bg-gradient-to-r truncate ${
        isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
      } bg-clip-text text-transparent`}>
        Manage Banks
      </h1>
    </div>
  </div>
  
  <div className="flex gap-2 w-full sm:w-auto">
    <button
      onClick={() => {
        if (isEditMode) cancelEdit();
        setIsFormExpanded(true);
      }}
      className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
        isDark
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
    >
      <Plus size={14} className="sm:size-[16px]" />
      <span className="text-xs sm:text-sm">Add Bank</span>
    </button>
    
    <button
      onClick={() => fetchBanks(currentPage, searchTerm)}
      disabled={isLoading}
      className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
        isDark
          ? "bg-gray-700 hover:bg-gray-600 text-white"
          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <RefreshCw size={14} className={`sm:size-[16px] ${isLoading ? 'animate-spin' : ''}`} />
      <span className="text-xs sm:text-sm">Refresh</span>
    </button>
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