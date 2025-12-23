'use client';
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RefreshCw, 
  Plus,
  MessageSquare,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { toast } from 'react-hot-toast';
import { ticketAPI, formatTicketForUI, ticketService } from '@/lib/services/TicketService';
import { priorityOptions, statusOptions, typeOptions, categoryOptions } from '@/lib/schema/ticketSchema';
import TicketForm from './TicketForm';
import TicketTable from './HelpTicketTable';
import TicketDetailsModal from './TicketDetailsModal';

const HelpTicketPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    type: 'all',
    category: 'all'
  });
  
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    per_page: 10,
    total_pages: 0
  });

  const itemsPerPage = 10;

  const fetchTickets = async (page = 1, search = "", filterParams = filters) => {
    try {
      setIsLoading(true);
      
      const params = {
        page,
        per_page: itemsPerPage,
        ...(search && { search }),
        ...(filterParams.status !== 'all' && { status: filterParams.status }),
        ...(filterParams.priority !== 'all' && { priority: filterParams.priority }),
        ...(filterParams.type !== 'all' && { type: filterParams.type }),
        ...(filterParams.category !== 'all' && { category: filterParams.category })
      };

      const response = await ticketAPI.getTickets(params);

      if (response.success) {
        const formattedTickets = response.data.map(formatTicketForUI);
        setTickets(formattedTickets);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || "Failed to fetch tickets");
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      toast.error(err.message || "Failed to load tickets");
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(currentPage, searchTerm, filters);
  }, [currentPage, searchTerm, filters]);

  const handleSubmitTicket = async (formData) => {
    try {
      const response = await ticketAPI.createTicket(formData);
      
      if (response.success) {
        toast.success(response.message || 'Ticket created successfully!');
        setIsFormOpen(false);
        fetchTickets(currentPage, searchTerm, filters);
      } else {
        toast.error(response.message || 'Failed to create ticket');
      }
    } catch (err) {
      console.error('Create ticket error:', err);
      toast.error(err.message || 'Failed to create ticket');
    }
  };

  const handleViewTicket = async (ticket) => {
    try {
      const response = await ticketAPI.getTicketById(ticket.id); 
      if (response.success) {
        const formattedTicket = formatTicketForUI(response.data);
        setSelectedTicket(formattedTicket);
      }
    } catch (err) {
      console.error("Error fetching ticket details:", err);
      toast.error("Failed to load ticket details");
    }
  };

  const handleUpdateStatus = async (ticketId, status) => {
    try {
      const userId = 1; // Current user ID from auth
      await ticketService.updateStatus(ticketId, status, userId);
      
      fetchTickets(currentPage, searchTerm, filters);
      
      if (selectedTicket && selectedTicket.id === ticketId) {
        const updatedResponse = await ticketAPI.getTicketById(ticketId); 
        if (updatedResponse.success) {
          setSelectedTicket(formatTicketForUI(updatedResponse.data));
        }
      }

    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleAssignTicket = async (ticketId, assigneeId) => {
    try {
      const userId = 1; // Current user ID from auth
      await ticketService.assignTicket(ticketId, assigneeId, userId);
      
      toast.success(assigneeId ? 'Ticket assigned successfully!' : 'Ticket unassigned');
      
      fetchTickets(currentPage, searchTerm, filters);
      
      if (selectedTicket && selectedTicket.id === ticketId) {
        const updatedResponse = await ticketAPI.getTicketById(ticketId); 
        if (updatedResponse.success) {
          setSelectedTicket(formatTicketForUI(updatedResponse.data));
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to assign ticket');
    }
  };

  const handleAddMessage = async (ticketId, messageData) => {
    try {
      await ticketService.addMessage(ticketId, messageData);      
      fetchTickets(currentPage, searchTerm, filters);
      
      if (selectedTicket && selectedTicket.id === ticketId) {
        const updatedResponse = await ticketAPI.getTicketById(ticketId); 
        if (updatedResponse.success) {
          setSelectedTicket(formatTicketForUI(updatedResponse.data));
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
      throw err;
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      type: 'all',
      category: 'all'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-emerald-50/30"
    }`}>
      <div className="p-4 md:p-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
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
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-emerald-900/50" : "bg-emerald-100"
                }`}>
                  <MessageSquare className={`w-6 h-6 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`} />
                </div>
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                    isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                  } bg-clip-text text-transparent`}>
                    Help Tickets
                  </h1>
                  <p className={`text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Raise and track issues with the development team
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsFormOpen(true)}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white"
                }`}
              >
                <Plus size={16} />
                <span>New Ticket</span>
              </button>
              
              <button
                onClick={() => fetchTickets(currentPage, searchTerm, filters)}
                disabled={isLoading}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
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

          {pagination.total > 0 && (
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-6`}>
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-gray-800/50' : 'bg-white'
              } border ${isDark ? 'border-emerald-600/30' : 'border-emerald-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Tickets</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {pagination.total}
                    </p>
                  </div>
                  <MessageSquare className={`w-8 h-8 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-gray-800/50' : 'bg-white'
              } border ${isDark ? 'border-emerald-600/30' : 'border-emerald-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {tickets.filter(t => t.status === 'Pending').length}
                    </p>
                  </div>
                  <AlertCircle className={`w-8 h-8 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-gray-800/50' : 'bg-white'
              } border ${isDark ? 'border-emerald-600/30' : 'border-emerald-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>In Process</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      {tickets.filter(t => t.status === 'Process').length}
                    </p>
                  </div>
                  <Clock className={`w-8 h-8 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-gray-800/50' : 'bg-white'
              } border ${isDark ? 'border-emerald-600/30' : 'border-emerald-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Closed</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {tickets.filter(t => t.status === 'Closed').length}
                    </p>
                  </div>
                  <CheckCircle className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search tickets by ID, subject, description or creator..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 focus:border-emerald-500'
                        : 'bg-white border-emerald-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
                    } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-4 py-3 rounded-xl flex items-center space-x-2 ${
                    isDark
                      ? 'bg-gray-800 hover:bg-gray-700 border border-emerald-600/50 text-gray-300'
                      : 'bg-white hover:bg-gray-50 border border-emerald-300 text-gray-700'
                  }`}
                >
                  <Filter size={16} />
                  <span>Filters</span>
                  {Object.values(filters).some(f => f !== 'all') && (
                    <span className={`w-2 h-2 rounded-full ${
                      isDark ? 'bg-emerald-500' : 'bg-emerald-600'
                    }`}></span>
                  )}
                </button>
                
                {Object.values(filters).some(f => f !== 'all') || searchTerm && (
                  <button
                    onClick={clearFilters}
                    className={`px-4 py-3 rounded-xl text-sm ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
            
            {showAdvancedFilters && (
              <div className={`mt-4 p-4 rounded-xl border ${
                isDark
                  ? 'bg-gray-800 border-emerald-600/50'
                  : 'bg-white border-emerald-300'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-gray-700 border-emerald-600/50 text-white'
                          : 'bg-white border-emerald-300 text-gray-900'
                      }`}
                    >
                      <option value="all">All Status</option>
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Priority
                    </label>
                    <select
                      value={filters.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-gray-700 border-emerald-600/50 text-white'
                          : 'bg-white border-emerald-300 text-gray-900'
                      }`}
                    >
                      <option value="all">All Priorities</option>
                      {priorityOptions.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-gray-700 border-emerald-600/50 text-white'
                          : 'bg-white border-emerald-300 text-gray-900'
                      }`}
                    >
                      <option value="all">All Types</option>
                      {typeOptions.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-gray-700 border-emerald-600/50 text-white'
                          : 'bg-white border-emerald-300 text-gray-900'
                      }`}
                    >
                      <option value="all">All Categories</option>
                      {categoryOptions.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <TicketTable
          tickets={tickets}
          filteredTickets={tickets}
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onViewTicket={handleViewTicket}
          isLoading={isLoading}
          totalItems={pagination.total}
        />
      </div>

      {isFormOpen && (
        <TicketForm
          isDark={isDark}
          onSubmit={handleSubmitTicket}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          isDark={isDark}
          onClose={() => setSelectedTicket(null)}
          onUpdateStatus={handleUpdateStatus}
          onAssign={handleAssignTicket}
          onAddMessage={handleAddMessage}
        />
      )}
    </div>
  );
};

export default HelpTicketPage;