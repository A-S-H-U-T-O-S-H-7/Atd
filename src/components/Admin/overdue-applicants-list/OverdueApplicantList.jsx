"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Download, Mail, RefreshCw } from "lucide-react";
import AdvancedSearchBar from "../AdvanceSearchBar";
import { exportToExcel } from "@/components/utils/exportutil";
import OverdueApplicantTable from "./OverdueApplicantListTable";
import AdjustmentModal from "../application-modals/AdjustmentModal";
import OverdueAmountModal from "../application-modals/OverdueAmountModal";
import CustomerTransactionDetails from "../CustomerTransactionDetails";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { overdueApplicantService } from "@/lib/services/OverdueApplicantServices";
import Swal from "sweetalert2";
import ChargeICICIModal from "../application-modals/ChargeICICIModal";
import Pagination from "./OverduePagiantion";

// ---------------------------------------------------------------------------
// Read initial page / limit from URL query string.
// This is what makes Ctrl+Click work correctly:
//   - page=4&limit=50 in the URL → currentPage=4, itemsPerPage=50 on mount
//   - the single useEffect fires immediately with those values
//   - pagination highlights page 4, table shows 50 rows of page-4 data
// ---------------------------------------------------------------------------
const getInitialPage = () => {
  if (typeof window === "undefined") return 1;
  const p = parseInt(new URLSearchParams(window.location.search).get("page"), 10);
  return p > 0 ? p : 1;
};

const getInitialLimit = () => {
  if (typeof window === "undefined") return 100;
  const l = parseInt(new URLSearchParams(window.location.search).get("limit"), 10);
  return l > 0 ? l : 100; 
};

// ---------------------------------------------------------------------------

const OverdueApplicantList = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [itemsPerPage, setItemsPerPage] = useState(getInitialLimit);

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showOverdueModal, setShowOverdueModal] = useState(false);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [showChargeICICIModal, setShowChargeICICIModal] = useState(false);

  const [selectedApplicantForAdjustment, setSelectedApplicantForAdjustment] = useState(null);
  const [selectedApplicantForOverdue, setSelectedApplicantForOverdue] = useState(null);
  const [selectedApplicantForLedger, setSelectedApplicantForLedger] = useState(null);
  const [selectedApplicantForCharge, setSelectedApplicantForCharge] = useState(null);

  const [overdueApplicants, setOverdueApplicants] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const searchOptions = [
    { value: "loan_no", label: "Loan No." },
    { value: "crnno", label: "CRN No." },
    { value: "name", label: "Name" },
    { value: "phone", label: "Phone Number" },
    { value: "email", label: "Email" },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-GB");
    } catch {
      return dateString;
    }
  };

  // ---------------------------------------------------------------------------
  // fetchOverdueApplicants
  //
  // All params are passed in explicitly — never reads from state/closure —
  // so there are zero stale-value bugs regardless of when it is called.
  //
  // Also writes page+limit back into the URL with replaceState so that
  // Ctrl+Click on any page always opens the new tab with the correct params.
  // ---------------------------------------------------------------------------
  const fetchOverdueApplicants = useCallback(async (page, perPage, field, term, range) => {
    try {
      setLoading(true);

      // Keep URL in sync (no navigation — just updates the query string)
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("page", page);
        url.searchParams.set("limit", perPage);
        window.history.replaceState(null, "", url.toString());
      }

      const params = { per_page: perPage, page };
      if (field && term?.trim()) {
        params.search_by = field;
        params.search_value = term.trim();
      }
      if (range?.start) params.from_date = range.start;
      if (range?.end) params.to_date = range.end;

      const response = await overdueApplicantService.getOverdueApplicants(params);

      if (response?.data) {
        setOverdueApplicants(
          response.data.map((item, index) => ({
            ...item,
            srNo: (page - 1) * perPage + index + 1,
            call: true,
            adjustment: "Adjustment",
            demandNotice: "Send Notice",
            sreAssignDate: item.last_collection_date
              ? formatDate(item.last_collection_date)
              : "N/A",
          }))
        );
        setTotalCount(response.pagination?.total ?? response.data.length);
        setTotalPages(response.pagination?.total_pages ?? 1);
      } else {
        setOverdueApplicants([]);
        setTotalCount(0);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("Error fetching overdue applicants:", err);
      setOverdueApplicants([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []); // stable — no deps needed because all values come in as args

  // ---------------------------------------------------------------------------
  // SINGLE effect — fires on mount and whenever any of these change.
  // On mount it uses the URL-initialised state (page=4, limit=50) so the
  // pagination immediately highlights the correct page with no extra logic.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    fetchOverdueApplicants(currentPage, itemsPerPage, searchField, searchTerm, dateRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, searchField, searchTerm, dateRange]);

  // ---------------------------------------------------------------------------
  // Handlers — setCurrentPage(1) is enough to trigger the effect above
  // ---------------------------------------------------------------------------
  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const handleAdvancedSearch = ({ field, term }) => {
    setSearchField(field && term?.trim() ? field : "");
    setSearchTerm(field && term?.trim() ? term.trim() : "");
    setCurrentPage(1);
  };

  const handleDateFilter = (filters) => {
    setDateRange(filters.dateRange || { start: "", end: "" });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchField("");
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  const handleExport = async (type) => {
    if (overdueApplicants.length === 0) {
      Swal.fire({
        title: "No Data to Export",
        text: "There is no overdue applicant data to export.",
        icon: "warning",
        confirmButtonColor: "#10b981",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
      return;
    }

    const result = await Swal.fire({
      title: type === "excel" ? "Export Overdue Applicants?" : "Export Overdue Reference?",
      text: "This will export all overdue applicant data with current filters.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Export CSV",
      cancelButtonText: "Cancel",
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    });

    if (!result.isConfirmed) return;

    try {
      setExporting(true);
      const headers = [
        "SR No", "Loan No", "Due Date", "Name", "Phone No", "Email",
        "Balance", "Overdue Amount", "UPI Payments", "Days Overdue",
        "Status", "Approved Amount", "ROI (%)", "Tenure",
      ];
      const dataRows = overdueApplicants.map((item, index) => [
        index + 1, item.loanNo, item.dueDate, item.name, item.phoneNo,
        item.email, item.balance.toFixed(2), item.overdueAmt.toFixed(2),
        item.upiPayments.toFixed(2), item.ovedays, item.status,
        item.approved_amount.toFixed(2),
        `${(parseFloat(item.roi) * 100).toFixed(1)}%`, item.tenure,
      ]);
      exportToExcel(
        [headers, ...dataRows],
        type === "excel"
          ? `overdue-applicants-${new Date().toISOString().split("T")[0]}.csv`
          : `overdue-reference-${new Date().toISOString().split("T")[0]}.csv`
      );
      await Swal.fire({
        title: "Export Successful!",
        text: "Overdue applicant data has been exported as CSV.",
        icon: "success",
        confirmButtonColor: "#10b981",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } catch (err) {
      console.error("Export error:", err);
      Swal.fire({
        title: "Export Failed!",
        text: "Failed to export data. Please try again.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleAdjustmentClick = (applicant) => {
    setSelectedApplicantForAdjustment(applicant);
    setShowAdjustmentModal(true);
  };

  const handleAdjustmentSubmit = async (adjustmentData) => {
    try {
      await Swal.fire({
        title: "Adjustment Submitted!",
        text: "Adjustment has been submitted successfully.",
        icon: "success",
        confirmButtonColor: "#10b981",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
      fetchOverdueApplicants(currentPage, itemsPerPage, searchField, searchTerm, dateRange);
    } catch (error) {
      console.error("Adjustment error:", error);
      Swal.fire({
        title: "Adjustment Failed!",
        text: error.message || "Failed to submit adjustment.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } finally {
      setShowAdjustmentModal(false);
      setSelectedApplicantForAdjustment(null);
    }
  };

  const handleOverdueAmountClick = (applicant) => {
    setSelectedApplicantForOverdue(applicant);
    setShowOverdueModal(true);
  };

  const handleRenew = (applicant) => {};

  const handleSendNotice = (applicant) => {
    console.log("Sending notice to:", applicant.name);
  };

  const handleView = (applicant) => {
    setSelectedApplicantForLedger(applicant);
    setShowLedgerModal(true);
  };

  const handleChargeICICI = (applicant) => {
    setSelectedApplicantForCharge(applicant);
    setShowChargeICICIModal(true);
  };

  const handleChargeSubmit = async () => {
    try {
      fetchOverdueApplicants(currentPage, itemsPerPage, searchField, searchTerm, dateRange);
      Swal.fire({
        title: "Success",
        text: "Charge scheduled successfully",
        icon: "success",
        confirmButtonColor: isDark ? "#10b981" : "#059669",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } catch (error) {
      console.error("Charge error:", error);
    }
  };

  const handleSREAssign = (applicant) => {
    console.log("Assigning SRE for:", applicant.name);
  };

  const handleBalanceUpdate = () => {
    setShowLedgerModal(false);
    setSelectedApplicantForLedger(null);
  };

  const handleBulkEmail = () => {
    console.log("Sending bulk email");
  };

  if (loading && overdueApplicants.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-emerald-50/30"}`}>
        <div className="text-center">
          <RefreshCw className={`w-8 h-8 animate-spin mx-auto mb-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          <p className={`text-lg font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Loading overdue applicants...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-emerald-50/30"}`}>
      <div className="p-0 md:p-4">
        <div className="mb-8">

          {/* ── Header row ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => router.back()}
                className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
              >
                <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              </button>
              <h1
                className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r truncate ${
                  isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
                } bg-clip-text text-transparent`}
              >
                Overdue Applicants ({totalCount})
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => fetchOverdueApplicants(currentPage, itemsPerPage, searchField, searchTerm, dateRange)}
                disabled={loading}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                  isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? "animate-spin" : ""}`} />
                <span className="text-xs sm:text-sm">Refresh</span>
              </button>

              <button
                onClick={() => handleExport("excel")}
                disabled={exporting || overdueApplicants.length === 0}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                  isDark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-500 hover:bg-green-600 text-white"
                } ${exporting || overdueApplicants.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Download className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${exporting ? "animate-spin" : ""}`} />
                <span className="text-xs sm:text-sm">{exporting ? "Exporting..." : "Export"}</span>
              </button>

              <button
                onClick={() => handleExport("overdue_ref")}
                disabled={exporting || overdueApplicants.length === 0}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                  isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-500 text-white"
                } ${exporting || overdueApplicants.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Download className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${exporting ? "animate-spin" : ""}`} />
                <span className="text-xs sm:text-sm">{exporting ? "Exporting..." : "Ref. Export"}</span>
              </button>

              <button
                onClick={handleBulkEmail}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                  isDark ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"
                }`}
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Bulk Email</span>
              </button>
            </div>
          </div>

          {/* ── Search bar ── */}
          <div className="mb-6 md:grid md:grid-cols-2">
            <AdvancedSearchBar
              searchOptions={searchOptions}
              onSearch={handleAdvancedSearch}
              isDark={isDark}
              placeholder="Search overdue applicants..."
              buttonText="Search"
            />
          </div>

          {/* ── Active filter chips ── */}
          {(searchTerm || dateRange.start || dateRange.end) && (
            <div className={`mb-4 p-4 rounded-lg border ${isDark ? "bg-gray-800/50 border-emerald-600/30" : "bg-emerald-50/50 border-emerald-200"}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`text-sm font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                    Active Filters:
                  </span>
                  {searchTerm && (
                    <span className={`px-3 py-1 rounded-full text-sm ${isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"}`}>
                      {searchOptions.find((o) => o.value === searchField)?.label}: {searchTerm}
                    </span>
                  )}
                  {dateRange.start && (
                    <span className={`px-3 py-1 rounded-full text-sm ${isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"}`}>
                      From: {new Date(dateRange.start).toLocaleDateString("en-GB")}
                    </span>
                  )}
                  {dateRange.end && (
                    <span className={`px-3 py-1 rounded-full text-sm ${isDark ? "bg-emerald-900/30 text-emerald-300" : "bg-emerald-100 text-emerald-700"}`}>
                      To: {new Date(dateRange.end).toLocaleDateString("en-GB")}
                    </span>
                  )}
                </div>
                <button
                  onClick={clearAllFilters}
                  className={`text-sm px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isDark ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={[10, 20, 50, 100, 200, 500, 1000, 2000]}
          />
        )}

        {/* ── Table ── */}
        <OverdueApplicantTable
          paginatedApplicants={overdueApplicants}
          isDark={isDark}
          loading={loading}
          onAdjustment={handleAdjustmentClick}
          onRenew={handleRenew}
          onSendNotice={handleSendNotice}
          onOverdueAmountClick={handleOverdueAmountClick}
          onView={handleView}
          onChargeICICI={handleChargeICICI}
          onSREAssign={handleSREAssign}
        />
      </div>

      {/* ── Modals ── */}
      <AdjustmentModal
        isOpen={showAdjustmentModal}
        onClose={() => { setShowAdjustmentModal(false); setSelectedApplicantForAdjustment(null); }}
        applicant={selectedApplicantForAdjustment}
        isDark={isDark}
        onSubmit={handleAdjustmentSubmit}
      />
      <ChargeICICIModal
        isOpen={showChargeICICIModal}
        onClose={() => { setShowChargeICICIModal(false); setSelectedApplicantForCharge(null); }}
        applicant={selectedApplicantForCharge}
        isDark={isDark}
        onChargeSubmit={handleChargeSubmit}
      />
      <OverdueAmountModal
        isOpen={showOverdueModal}
        onClose={() => { setShowOverdueModal(false); setSelectedApplicantForOverdue(null); }}
        applicant={selectedApplicantForOverdue}
        isDark={isDark}
      />
      <CustomerTransactionDetails
        isOpen={showLedgerModal}
        onClose={() => { setShowLedgerModal(false); setSelectedApplicantForLedger(null); }}
        data={selectedApplicantForLedger}
        isDark={isDark}
        onUpdateBalance={handleBalanceUpdate}
      />
    </div>
  );
};

export default OverdueApplicantList;