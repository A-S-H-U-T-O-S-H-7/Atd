"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  FileCheck,
  IndianRupee,
  MapPin, 
  Calendar, 
  Clock, 
  RefreshCw,
  FileText,
  PieChart,
  BarChart3,
  Activity,
  Filter,
  ChevronRight
} from "lucide-react";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { dashboardAPI } from "@/lib/services/DashboardServices";
import DashboardCard from "./DashboardCard";
import ChartCard from "./ChartCard";
import toast from "react-hot-toast";

const DashboardPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState("daily");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [filterParams, setFilterParams] = useState({});
  const [showAllStates, setShowAllStates] = useState(false); 

  const fetchDashboardData = async (params = {}) => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getDashboardData(params);
      
      if (response && response.success) {
        setDashboardData(response.data);
      } else {
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Error loading dashboard");
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDateRangeDisplay = () => {
    if (!filterParams.start_date || !filterParams.end_date) {
      return "All Time";
    }
    
    const start = new Date(filterParams.start_date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    });
    
    const end = new Date(filterParams.end_date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    return `${start} - ${end}`;
  };

  // Memoized calculations for better performance
  const { totals, groupedStates, chartData } = useMemo(() => {
    if (!dashboardData) return { totals: null, groupedStates: [], chartData: {} };

    // Get data for current tab
    const applications = dashboardData.applications[activeTab] || [];
    const disbursements = dashboardData.disbursements[activeTab] || [];
    const collections = dashboardData.collections[activeTab] || [];
    const states = dashboardData.states[activeTab] || [];

    // Calculate totals
    const totalApplications = applications.reduce((sum, item) => sum + (item.total || 0), 0);
    const completedApplications = applications.reduce((sum, item) => 
      sum + parseInt(item.completed || 0), 0);

    const dailyDisbursementCount = dashboardData.disbursements.daily?.reduce((sum, item) => 
      sum + (item.total || 0), 0) || 0;
    const disbursementAmount = disbursements.reduce((sum, item) => 
      sum + parseFloat(item.total_disbursement || 0), 0);

    const collectionCount = collections.reduce((sum, item) => sum + (item.total || 0), 0);
    const collectionAmount = collections.reduce((sum, item) => 
      sum + parseFloat(item.total_amount || 0), 0);

    // Group states by state name
    const stateMap = new Map();
    states.forEach(item => {
      const state = item.state;
      if (stateMap.has(state)) {
        const existing = stateMap.get(state);
        stateMap.set(state, {
          state,
          total: existing.total + item.total,
          completed: existing.completed + parseInt(item.completed || 0),
          pending: existing.pending + parseInt(item.pending || 0)
        });
      } else {
        stateMap.set(state, {
          state,
          total: item.total,
          completed: parseInt(item.completed || 0),
          pending: parseInt(item.pending || 0)
        });
      }
    });

    // Prepare chart data
    const disbursementsChartData = disbursements.map(item => ({
      ...item,
      total: parseFloat(item.total_disbursement || 0),
      count: item.total || 0
    }));

    const collectionsChartData = collections.map(item => ({
      ...item,
      total: parseFloat(item.total_amount || 0),
      count: item.total || 0
    }));

    return {
      totals: {
        totalApplications,
        completedApplications,
        disbursementCount: dailyDisbursementCount,
        disbursementAmount,
        collectionCount,
        collectionAmount
      },
      groupedStates: Array.from(stateMap.values()).sort((a, b) => b.total - a.total),
      chartData: {
        disbursements: disbursementsChartData,
        collections: collectionsChartData,
        applications
      }
    };
  }, [dashboardData, activeTab]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    });
  };

  const handleDateRangeApply = () => {
    if (dateRange.startDate && dateRange.endDate) {
      const params = {
        start_date: dateRange.startDate,
        end_date: dateRange.endDate
      };
      setFilterParams(params); 
      fetchDashboardData(params); 
      setShowDateFilter(false);
      toast.success("Date range applied");
    } else {
      toast.error("Please select both start and end dates");
    }
  };

  const handleDateRangeReset = () => {
    setDateRange({ startDate: "", endDate: "" });
    setFilterParams({}); 
    fetchDashboardData(); 
    setShowDateFilter(false);
    toast.success("Date filter reset");
  };

  if (loading && !dashboardData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <RefreshCw className={`w-10 h-10 animate-spin mx-auto mb-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <p className={`text-xl font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Determine which states to display based on showAllStates toggle
  const displayedStates = showAllStates ? groupedStates : groupedStates.slice(0, 6);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-2xl md:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                Dashboard Overview
              </h1>
              <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Real-time insights and analytics
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${isDark ? "bg-gray-800 text-gray-300 border border-gray-700" : "bg-white text-gray-700 border border-gray-200"}`}>
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Updated: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              
              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className={`p-3 rounded-xl transition-all duration-200 ${isDark 
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700" 
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"}`}
              >
                <Filter className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => fetchDashboardData(filterParams)} 
                disabled={loading}
                className={`p-3 rounded-xl transition-all duration-200 ${isDark 
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700" 
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${isDark ? "bg-gray-800 text-gray-300 border border-gray-700" : "bg-white text-gray-700 border border-gray-200"}`}>
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {formatDateRangeDisplay()}
                </span>
              </div>
            </div>
          </div>

          {/* Date Range Filter */}
          {showDateFilter && (
            <div className={`mb-6 p-4 rounded-xl ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${isDark 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"}`}
                  />
                </div>
                <div className="flex-1">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border ${isDark 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"}`}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDateRangeApply}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleDateRangeReset}
                    className={`px-6 py-2 rounded-lg transition-colors ${isDark 
                      ? "bg-gray-700 hover:bg-gray-600 text-white" 
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"}`}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Time Period Tabs */}
          <div className={`flex gap-2 mb-8 p-1 rounded-2xl ${isDark ? "bg-gray-800" : "bg-gray-100"} max-w-fit`}>
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "daily" 
                ? "bg-emerald-600 text-white shadow-lg"
                : isDark 
                  ? "text-gray-400 hover:text-white hover:bg-gray-700" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"}`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Daily
              </div>
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "monthly" 
                ? "bg-emerald-600 text-white shadow-lg"
                : isDark 
                  ? "text-gray-400 hover:text-white hover:bg-gray-700" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"}`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Monthly
              </div>
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <DashboardCard
              title="Total Applications"
              value={totals?.totalApplications || 0}
              icon={Users}
              trend="up"
              trendValue="+12%"
              iconColor="text-blue-600"
              bgColor="bg-gradient-to-br from-blue-50 to-indigo-100"
              isDark={isDark}
              subtitle="Applications"
            />
            <DashboardCard
    title="Pending Applications"
    value={(totals?.totalApplications || 0) - (totals?.completedApplications || 0)}
    icon={Clock}
    trend="down"
    trendValue="-4%"
    iconColor="text-amber-600"
    bgColor="bg-gradient-to-br from-amber-50 to-orange-100"
    isDark={isDark}
    subtitle="Applications"
  />
            <DashboardCard
              title="Completed Applications"
              value={totals?.completedApplications || 0}
              icon={FileCheck}
              trend="up"
              trendValue="+8%"
              iconColor="text-green-600"
              bgColor="bg-gradient-to-br from-green-50 to-emerald-100"
              isDark={isDark}
              subtitle="Applications"
            />
            
            <DashboardCard
              title="Total Disbursements"
              value={
                <div>
                  <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {formatCurrency(totals?.disbursementAmount || 0)}
                  </div>
                  <div className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {totals?.disbursementCount || 0} Applications
                  </div>
                </div>
              }
              icon={FileText}
              trend="up"
              trendValue="+15%"
              iconColor="text-purple-600"
              bgColor="bg-gradient-to-br from-purple-50 to-violet-100"
              isDark={isDark}
            />
            
            <DashboardCard
              title="Total Collections"
              value={
                <div>
                  <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {formatCurrency(totals?.collectionAmount || 0)}
                  </div>
                  <div className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {totals?.collectionCount || 0} Records
                  </div>
                </div>
              }
              icon={IndianRupee}
              trend="up"
              trendValue="+22%"
              iconColor="text-emerald-600"
              bgColor="bg-gradient-to-br from-teal-50 to-teal-100"
              isDark={isDark}
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Applications Chart */}
          {dashboardData?.applications[activeTab] && (
            <ChartCard
              title="Applications Trend"
              data={chartData.applications}
              icon={BarChart3}
              chartColor="#3b82f6"
              isDark={isDark}
              type="bar"
              isMonthly={activeTab === "monthly"}
              showCount={true}
              count={totals?.totalApplications || 0}
              countLabel="Applications"
            />
          )}

          {/* Disbursements Chart */}
          {chartData.disbursements.length > 0 && (
            <ChartCard
              title="Disbursements Amount"
              data={chartData.disbursements}
              icon={PieChart}
              chartColor="#a855f7"
              isDark={isDark}
              type="bar"
              formatValue={formatCurrency}
              isMonthly={activeTab === "monthly"}
              showCount={true}
              count={totals?.disbursementCount || 0}
              countLabel="Applications"
            />
          )}

          {/* Collections Chart */}
          {chartData.collections.length > 0 && (
            <ChartCard
              title="Collections Amount"
              data={chartData.collections}
              icon={IndianRupee}
              chartColor="#10b981"
              isDark={isDark}
              type="bar"
              formatValue={formatCurrency}
              isMonthly={activeTab === "monthly"}
              showCount={true}
              count={totals?.collectionCount || 0}
              countLabel="Records"
            />
          )}
        </div>

        {/* Enhanced States Distribution & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced States Card with Gradient Colors */}
          <div className={`rounded-2xl p-6 ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"} shadow-xl`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Top States
                </h3>
                <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Performance by region • {groupedStates.length} active
                </p>
              </div>
              <div className={`p-2 rounded-lg ${isDark ? "bg-gradient-to-br from-blue-900/30 to-indigo-900/30" : "bg-gradient-to-br from-blue-50 to-indigo-50"}`}>
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div className="space-y-3">
              {displayedStates.map((state, index) => {
                const completionRate = state.total > 0 ? Math.round((state.completed / state.total) * 100) : 0;
                
                // Determine gradient based on rank
                const getRankGradient = (rank) => {
                  if (rank === 0) return isDark 
                    ? "from-amber-900/20 to-yellow-900/20 border-amber-700/30" 
                    : "from-amber-50 to-yellow-50 border-amber-200";
                  if (rank === 1) return isDark 
                    ? "from-gray-700/20 to-gray-800/20 border-gray-600/30" 
                    : "from-gray-50 to-gray-100 border-gray-200";
                  if (rank === 2) return isDark 
                    ? "from-orange-900/20 to-amber-900/20 border-orange-700/30" 
                    : "from-orange-50 to-amber-50 border-orange-200";
                  
                  const gradients = [
                    isDark ? "from-blue-900/10 to-indigo-900/10 border-blue-700/20" : "from-blue-50/80 to-indigo-50/80 border-blue-100",
                    isDark ? "from-purple-900/10 to-violet-900/10 border-purple-700/20" : "from-purple-50/80 to-violet-50/80 border-purple-100",
                    isDark ? "from-emerald-900/10 to-teal-900/10 border-emerald-700/20" : "from-emerald-50/80 to-teal-50/80 border-emerald-100",
                    isDark ? "from-rose-900/10 to-pink-900/10 border-rose-700/20" : "from-rose-50/80 to-pink-50/80 border-rose-100",
                    isDark ? "from-cyan-900/10 to-sky-900/10 border-cyan-700/20" : "from-cyan-50/80 to-sky-50/80 border-cyan-100",
                  ];
                  
                  return gradients[(rank - 3) % gradients.length];
                };

                // Determine progress bar color based on completion rate
                const getProgressColor = () => {
                  if (completionRate >= 80) return isDark ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-green-400 to-emerald-500";
                  if (completionRate >= 60) return isDark ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-gradient-to-r from-blue-400 to-cyan-500";
                  if (completionRate >= 40) return isDark ? "bg-gradient-to-r from-yellow-500 to-amber-500" : "bg-gradient-to-r from-yellow-400 to-amber-500";
                  return isDark ? "bg-gradient-to-r from-red-500 to-rose-500" : "bg-gradient-to-r from-red-400 to-rose-500";
                };

                // Badge gradient colors
                const completedBadgeGradient = isDark 
                  ? "bg-gradient-to-r from-green-900/30 to-emerald-900/30" 
                  : "bg-gradient-to-r from-green-100 to-emerald-100";
                
                const pendingBadgeGradient = isDark 
                  ? "bg-gradient-to-r from-yellow-900/30 to-amber-900/30" 
                  : "bg-gradient-to-r from-yellow-100 to-amber-100";

                return (
                  <div 
                    key={index} 
                    className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-300 cursor-pointer
                      bg-gradient-to-r ${getRankGradient(index)} border
                      ${isDark ? "hover:scale-[1.02] hover:shadow-lg" : "hover:scale-[1.02] hover:shadow-md"}`}
                  >
                    {/* Left side: Ranking and State */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Ranking Circle with Gradient */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 
                        ${index === 0 ? "bg-gradient-to-br from-amber-500 to-yellow-500" :
                          index === 1 ? "bg-gradient-to-br from-gray-400 to-gray-500" :
                          index === 2 ? "bg-gradient-to-br from-orange-500 to-amber-500" :
                          isDark ? "bg-gradient-to-br from-gray-700 to-gray-800" : "bg-gradient-to-br from-gray-200 to-gray-300"
                        } shadow-sm`}>
                        <span className={`text-sm font-bold ${
                          index < 3 ? "text-white" : isDark ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                          {state.state}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-lg ${completedBadgeGradient} ${
                            isDark ? "text-green-300" : "text-green-800"
                          }`}>
                            ✓ {state.completed}
                          </span>
                          {state.pending > 0 && (
                            <span className={`text-xs px-2 py-1 rounded-lg ${pendingBadgeGradient} ${
                              isDark ? "text-yellow-300" : "text-yellow-800"
                            }`}>
                              ⏳ {state.pending}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side: Stats and Progress */}
                    <div className="flex items-center gap-4 flex-shrink-0 ml-3">
                      {/* Total Count */}
                      <div className="text-right">
                        <p className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                          {state.total}
                        </p>
                        <p className={`text-[10px] mt-0.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          Total
                        </p>
                      </div>
                      
                      {/* Completion Rate with Gradient Progress Bar */}
                      <div className="w-20">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-xs font-semibold ${
                            completionRate >= 80 ? (isDark ? "text-green-400" : "text-green-700") :
                            completionRate >= 60 ? (isDark ? "text-blue-400" : "text-blue-700") :
                            completionRate >= 40 ? (isDark ? "text-yellow-400" : "text-yellow-700") :
                            (isDark ? "text-red-400" : "text-red-700")
                          }`}>
                            {completionRate}%
                          </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-gray-700/50" : "bg-gray-200/70"}`}>
                          <div 
                            className={`h-full rounded-full ${getProgressColor()} transition-all duration-500`}
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* View More/Less Button with Gradient */}
              {groupedStates.length > 6 && (
                <button 
                  onClick={() => setShowAllStates(!showAllStates)}
                  className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-sm
                    ${isDark 
                      ? "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300 border border-gray-700" 
                      : "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 border border-gray-200"
                    } hover:scale-[1.02] hover:shadow-md`}
                >
                  <span className="font-medium">
                    {showAllStates ? "Show Less" : `View ${groupedStates.length - 6} more states`}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${showAllStates ? "rotate-90" : ""}`} />
                </button>
              )}
            </div>
          </div>

          {/* Ultra-Compact Activity Table */}
          <div className={`rounded-2xl p-6 ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"} shadow-xl`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Recent Activity
                </h3>
                <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Last 5 days of applications
                </p>
              </div>
              <div className={`p-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <th className={`text-left py-3 px-2 text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Date
                    </th>
                    <th className={`text-left py-3 px-2 text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Total
                    </th>
                    <th className={`text-left py-3 px-2 text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Completed
                    </th>
                    <th className={`text-left py-3 px-2 text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Pending
                    </th>
                    <th className={`text-left py-3 px-2 text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.applications.daily?.slice(-5).reverse().map((item, index) => {
                    const completionRate = item.total > 0 ? Math.round((parseInt(item.completed || 0) / item.total) * 100) : 0;
                    
                    return (
                      <tr 
                        key={index} 
                        className={`transition-colors ${isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"}`}
                      >
                        <td className={`py-3 px-2 text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                          {formatDate(item.date)}
                        </td>
                        <td className={`py-3 px-2 text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-900"}`}>
                          {item.total}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isDark ? "bg-green-500" : "bg-green-600"}`} />
                            <span className={`text-sm ${isDark ? "text-green-400" : "text-green-700"}`}>
                              {item.completed || 0}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isDark ? "bg-yellow-500" : "bg-yellow-600"}`} />
                            <span className={`text-sm ${isDark ? "text-yellow-400" : "text-yellow-700"}`}>
                              {item.pending || 0}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-16 h-1.5 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                              <div 
                                className={`h-full ${
                                  completionRate >= 80 ? "bg-green-600" : 
                                  completionRate >= 50 ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                style={{ width: `${completionRate}%` }}
                              />
                            </div>
                            <span className={`text-xs font-medium min-w-[35px] ${
                              completionRate >= 80 
                                ? isDark ? "text-green-400" : "text-green-700"
                                : completionRate >= 50
                                ? isDark ? "text-yellow-400" : "text-yellow-700"
                                : isDark ? "text-red-400" : "text-red-700"
                            }`}>
                              {completionRate}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className={`mt-8 p-6 rounded-2xl ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"} shadow-xl`}>
          <h3 className={`text-lg font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
            Performance Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl ${isDark ? "border border-gray-700" : "border border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${isDark ? "bg-blue-500" : "bg-blue-600"}`} />
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Avg Daily Applications</p>
              </div>
              <p className={`text-2xl font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                {dashboardData?.applications.daily?.length 
                  ? Math.round(totals?.totalApplications / dashboardData.applications.daily.length) 
                  : 0}
              </p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? "border border-gray-700" : "border border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${isDark ? "bg-green-500" : "bg-green-600"}`} />
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Completion Rate</p>
              </div>
              <p className={`text-2xl font-bold ${
                totals?.totalApplications && (totals.completedApplications / totals.totalApplications) >= 0.8
                  ? isDark ? "text-green-400" : "text-green-600"
                  : isDark ? "text-yellow-400" : "text-yellow-600"
              }`}>
                {totals?.totalApplications 
                  ? `${Math.round((totals.completedApplications / totals.totalApplications) * 100)}%` 
                  : "0%"}
              </p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? "border border-gray-700" : "border border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${isDark ? "bg-purple-500" : "bg-purple-600"}`} />
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Avg Collection</p>
              </div>
              <p className={`text-2xl font-bold ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                {dashboardData?.collections[activeTab]?.length 
                  ? formatCurrency(totals?.collectionAmount / dashboardData.collections[activeTab].length)
                  : formatCurrency(0)}
              </p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? "border border-gray-700" : "border border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${isDark ? "bg-indigo-500" : "bg-indigo-600"}`} />
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Active States</p>
              </div>
              <p className={`text-2xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                {groupedStates.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;