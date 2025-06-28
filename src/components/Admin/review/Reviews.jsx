"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import SearchBar from "../SearchBar";
import ReviewTable from "./ReviewTable";
import ReviewStatusModal from "./ReviewStatusModal";
import { reviewAPI, formatReviewForUI, getReviewStatusNumber } from "@/lib/api";

const ReviewPage = () => {
  const { isDark } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(totalReviews / itemsPerPage);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm.trim() || undefined,
        status: statusFilter === "all" ? undefined : getReviewStatusNumber(statusFilter),
        rating: ratingFilter === "all" ? undefined : ratingFilter
      };
      
      // Remove undefined values from params
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await reviewAPI.getReviews(params);
      
      if (response?.data?.data) {
        const formattedReviews = response.data.data.map(formatReviewForUI);
        setReviews(formattedReviews);
        setTotalReviews(response.data.pagination?.total || 0);
      } else {
        setReviews([]);
        setTotalReviews(0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to fetch reviews. Please try again.");
      setReviews([]);
      setTotalReviews(0);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when filters change
  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    
    switch (filterType) {
      case 'search':
        setSearchTerm(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
      case 'rating':
        setRatingFilter(value);
        break;
      default:
        break;
    }
  };

  // Fetch reviews when dependencies change
  useEffect(() => {
    fetchReviews();
  }, [currentPage, searchTerm, statusFilter, ratingFilter]);

  const handleStatusClick = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (reviewId, status, reply) => {
    try {
      await reviewAPI.updateReviewStatus(reviewId, status, reply);
      
      // Update local state to reflect changes immediately
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId
            ? { ...review, status, reply, approvedBy: "Admin" }
            : review
        )
      );
      
      setIsModalOpen(false);
      setSelectedReview(null);
      
      
    } catch (error) {
      console.error("Error updating review status:", error);
      // You might want to show an error message to user here
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    // Add your navigation logic here
    console.log("Back button clicked");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-emerald-50/30"}`}>
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackClick}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              </button>
              <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                Customer Reviews
              </h1>
            </div>
            
            {/* Stats */}
            <div className={`hidden md:flex items-center space-x-4 px-4 py-2 rounded-lg ${
              isDark ? "bg-gray-800/50" : "bg-white/70"
            }`}>
              <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Total Reviews: 
              </span>
              <span className={`text-sm font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                {totalReviews}
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={(value) => handleFilterChange('search', value)}
                placeholder="Search reviews, names, or CRN numbers..."
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                  : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg border ${
            isDark 
              ? "bg-red-900/20 border-red-700 text-red-300" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            <p className="text-sm font-medium">{error}</p>
            <button 
              onClick={fetchReviews}
              className={`mt-2 text-sm underline hover:no-underline ${
                isDark ? "text-red-400" : "text-red-600"
              }`}
            >
              Try again
            </button>
          </div>
        )}

        {/* Review Table */}
        <ReviewTable
          reviews={reviews}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalReviews={totalReviews}
          onPageChange={handlePageChange}
          onStatusClick={handleStatusClick}
          loading={loading}
        />

        {/* Review Status Modal */}
        <ReviewStatusModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedReview(null);
          }}
          review={selectedReview}
          onSubmit={handleModalSubmit}
        />
      </div>
    </div>
  );
};

export default ReviewPage;