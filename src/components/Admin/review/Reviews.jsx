"use client";
import React, { useState } from "react";
import { Star, Calendar, Phone, Mail, ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import SearchBar from "../SearchBar";
import Pagination from "../Pagination";
import ReviewStatusModal from "./ReviewStatusModal";

// Main Review Management Component
const ReviewPage = () => {
  const { isDark } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      photo:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      name: "Somalinga Prasanth Kumar Singh",
      phone: "9442611823",
      email: "manikandaprasanthsu@gmail.com",
      crnNo: "S02BY823",
      review:
        "Good so far. Will update once the full process is complete. The customer service has been responsive and helpful throughout the loan application process.",
      rating: 5,
      status: "pending",
      date: "15 Jun 2025",
      reply: "",
      approvedBy: ""
    },
    {
      id: 2,
      photo:
        "https://images.unsplash.com/photo-1494790108755-2616b332c1be?w=100&h=100&fit=crop&crop=face",
      name: "Manisha Soni",
      phone: "9261215555",
      email: "mani.soni8311992@gmail.com",
      crnNo: "M15CY555",
      review:
        "SHORT TERMS LOAN TENURES ATLEAST GIVE MINIMUM 6 MONTH TENURE. The current terms are too restrictive for my financial planning needs.",
      rating: 2,
      status: "pending",
      date: "12 Jun 2025",
      reply: "",
      approvedBy: ""
    },
    {
      id: 3,
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      name: "Rajesh Kumar",
      phone: "9876543210",
      email: "rajesh.kumar@gmail.com",
      crnNo: "R25KM789",
      review:
        "Excellent service! The loan process was smooth and quick. Highly recommended to anyone looking for hassle-free lending solutions.",
      rating: 5,
      status: "approved",
      date: "10 Jun 2025",
      reply:
        "Thank you for your feedback! We're glad you had a great experience with our services.",
      approvedBy: "Admin"
    },
    {
      id: 4,
      photo:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      name: "Priya Sharma",
      phone: "8765432109",
      email: "priyasharma@gmail.com",
      crnNo: "P30SH456",
      review:
        "Good experience overall. Customer support was helpful throughout the process and answered all my queries promptly.",
      rating: 4,
      status: "approved",
      date: "08 Jun 2025",
      reply:
        "We appreciate your positive feedback and look forward to serving you again!",
      approvedBy: "Admin"
    },
    {
      id: 5,
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      name: "Amit Patel",
      phone: "7654321098",
      email: "amit.patel@gmail.com",
      crnNo: "A18PT321",
      review:
        "Average service. The interest rates could be better. Processing time was okay but could be improved for better customer satisfaction.",
      rating: 3,
      status: "rejected",
      date: "05 Jun 2025",
      reply:
        "Thank you for your feedback. We are working to improve our services and will consider your suggestions.",
      approvedBy: "Admin"
    },
    {
      id: 6,
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      name: "Amit Patel",
      phone: "7654321098",
      email: "amit.patel@gmail.com",
      crnNo: "A18PT321",
      review:
        "Average service. The interest rates could be better. Processing time was okay but could be improved for better customer satisfaction.",
      rating: 3,
      status: "rejected",
      date: "05 Jun 2025",
      reply:
        "Thank you for your feedback. We are working to improve our services and will consider your suggestions.",
      approvedBy: "Admin"
    },
    {
      id: 7,
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      name: "Amit Patel",
      phone: "7654321098",
      email: "amit.patel@gmail.com",
      crnNo: "A18PT321",
      review:
        "Average service. The interest rates could be better. Processing time was okay but could be improved for better customer satisfaction.",
      rating: 3,
      status: "rejected",
      date: "05 Jun 2025",
      reply:
        "Thank you for your feedback. We are working to improve our services and will consider your suggestions.",
      approvedBy: "Admin"
    },
    {
      id: 8,
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      name: "Amit Patel",
      phone: "7654321098",
      email: "amit.patel@gmail.com",
      crnNo: "A18PT321",
      review:
        "Average service. The interest rates could be better. Processing time was okay but could be improved for better customer satisfaction.",
      rating: 3,
      status: "rejected",
      date: "05 Jun 2025",
      reply:
        "Thank you for your feedback. We are working to improve our services and will consider your suggestions.",
      approvedBy: "Admin"
    },
    {
      id: 9,
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      name: "Amit Patel",
      phone: "7654321098",
      email: "amit.patel@gmail.com",
      crnNo: "A18PT321",
      review:
        "Average service. The interest rates could be better. Processing time was okay but could be improved for better customer satisfaction.",
      rating: 3,
      status: "rejected",
      date: "05 Jun 2025",
      reply:
        "Thank you for your feedback. We are working to improve our services and will consider your suggestions.",
      approvedBy: "Admin"
    },
    {
      id: 10,
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      name: "Amit Patel",
      phone: "7654321098",
      email: "amit.patel@gmail.com",
      crnNo: "A18PT321",
      review:
        "Average service. The interest rates could be better. Processing time was okay but could be improved for better customer satisfaction.",
      rating: 3,
      status: "rejected",
      date: "05 Jun 2025",
      reply:
        "Thank you for your feedback. We are working to improve our services and will consider your suggestions.",
      approvedBy: "Admin"
    },
    {
      id: 11,
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      name: "Amit Patel",
      phone: "7654321098",
      email: "amit.patel@gmail.com",
      crnNo: "A18PT321",
      review:
        "Average service. The interest rates could be better. Processing time was okay but could be improved for better customer satisfaction.",
      rating: 3,
      status: "rejected",
      date: "05 Jun 2025",
      reply:
        "Thank you for your feedback. We are working to improve our services and will consider your suggestions.",
      approvedBy: "Admin"
    },
    {
      id: 12,
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      name: "Amit Patel",
      phone: "7654321098",
      email: "amit.patel@gmail.com",
      crnNo: "A18PT321",
      review:
        "Average service. The interest rates could be better. Processing time was okay but could be improved for better customer satisfaction.",
      rating: 3,
      status: "rejected",
      date: "05 Jun 2025",
      reply:
        "Thank you for your feedback. We are working to improve our services and will consider your suggestions.",
      approvedBy: "Admin"
    },
  ]);

  const itemsPerPage = 10;

  const getStatusColor = status => {
    switch (status.toLowerCase()) {
      case "approved":
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return isDark
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return isDark
          ? "bg-red-900/50 text-red-300 border-red-700"
          : "bg-red-100 text-red-800 border-red-200";
      default:
        return isDark
          ? "bg-gray-700 text-gray-300 border-gray-600"
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const renderStars = rating => {
    return [...Array(5)].map((_, i) =>
      <Star
        key={i}
        size={16}
        className={`${i < rating
          ? "text-yellow-400 fill-current"
          : isDark ? "text-gray-600" : "text-gray-300"}`}
      />
    );
  };

  const handleStatusClick = review => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (reviewId, status, reply) => {
    setReviews(prevReviews =>
      prevReviews.map(
        review =>
          review.id === reviewId
            ? {
                ...review,
                status,
                reply,
                approvedBy:
                  status === "approved" || status === "rejected" ? "Admin" : ""
              }
            : review
      )
    );
  };

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.crnNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || review.status === statusFilter;
    const matchesRating =
      ratingFilter === "all" || review.rating.toString() === ratingFilter;

    return matchesSearch && matchesStatus && matchesRating;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark
        ? "bg-gray-900"
        : "bg-emerald-50/30"}`}
    >
      <div className="p-0 md:p-4 ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${isDark
                  ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                  : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"}`}
              >
                <ArrowLeft
                  className={`w-5 h-5 ${isDark
                    ? "text-emerald-400"
                    : "text-emerald-600"}`}
                />
              </button>
              <h1
                className={` text-2xl md:text-3xl font-bold bg-gradient-to-r ${isDark
                  ? "from-emerald-400 to-teal-400"
                  : "from-emerald-600 to-teal-600"} bg-clip-text text-transparent`}
              >
                Customer Reviews
              </h1>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search reviews, names, or CRN numbers..."
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${isDark
                ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={ratingFilter}
              onChange={e => setRatingFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${isDark
                ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
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

        {/* Table Container */}
        <div
          className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-max" style={{ minWidth: "1200px" }}>
              <thead
                className={`border-b-2 ${isDark
                  ? "bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50"
                  : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"}`}
              >
                <tr>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "60px" }}
                  >
                    SN
                  </th>

                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "300px" }}
                  >
                    Customer
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "270px" }}
                  >
                    Contact
                  </th>

                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "120px" }}
                  >
                    CRN No.
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "300px" }}
                  >
                    Review
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "120px" }}
                  >
                    Rating
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "100px" }}
                  >
                    Status
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "250px" }}
                  >
                    Reply
                  </th>
                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "120px" }}
                  >
                    Approved By
                  </th>

                  <th
                    className={`px-6 py-5 text-left text-sm font-bold ${isDark
                      ? "text-gray-100"
                      : "text-gray-700"}`}
                    style={{ minWidth: "170px" }}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y-2 ${isDark
                  ? "divide-emerald-800/30"
                  : "divide-emerald-200"}`}
              >
                {paginatedReviews.map((review, index) =>
                  <tr
                    key={review.id}
                    className={`transition-all duration-200 ${isDark
                      ? "hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-emerald-900/20"
                      : "hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50"}`}
                  >
                    <td className="px-6 py-5">
                      <span
                        className={`text-sm font-bold ${isDark
                          ? "text-white"
                          : "text-gray-900"}`}
                      >
                        {startIndex + index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`relative ${isDark
                            ? "ring-2 ring-emerald-500/50"
                            : "ring-2 ring-emerald-400"} rounded-full p-0.5`}
                        >
                          <img
                            src={review.photo}
                            alt={review.name}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${isDark
                              ? "bg-emerald-500 border-gray-800"
                              : "bg-emerald-400 border-white"}`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={`text-sm font-semibold ${isDark
                              ? "text-white"
                              : "text-gray-900"}`}
                          >
                            {review.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <div
                          className={`flex items-center space-x-3 text-sm font-medium ${isDark
                            ? "text-white"
                            : "text-gray-900"}`}
                        >
                          <div
                            className={`p-1.5 rounded-lg ${isDark
                              ? "bg-emerald-900/50"
                              : "bg-emerald-100"}`}
                          >
                            <Phone
                              className={`w-3.5 h-3.5 ${isDark
                                ? "text-emerald-400"
                                : "text-emerald-600"}`}
                            />
                          </div>
                          <span>
                            {review.phone}
                          </span>
                        </div>
                        <div
                          className={`flex items-center space-x-3 text-sm ${isDark
                            ? "text-gray-300"
                            : "text-gray-600"}`}
                        >
                          <div
                            className={`p-1.5 rounded-lg ${isDark
                              ? "bg-emerald-900/50"
                              : "bg-emerald-100"}`}
                          >
                            <Mail
                              className={`w-3.5 h-3.5 ${isDark
                                ? "text-emerald-400"
                                : "text-emerald-600"}`}
                            />
                          </div>
                          <span className="break-all font-medium">
                            {review.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-2 text-sm font-bold rounded-md border-2 ${isDark
                          ? "bg-gradient-to-r from-blue-900/50 to-indigo-900/50 text-blue-300 border-blue-600/50"
                          : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-300"}`}
                      >
                        {review.crnNo}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="max-w-sm">
                        <p
                          className={`text-sm leading-relaxed ${isDark
                            ? "text-gray-200"
                            : "text-gray-800"}`}
                        >
                          {review.review}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <span
                          className={`text-sm font-bold px-2 py-1 rounded-lg ${isDark
                            ? "text-yellow-300 bg-yellow-900/30"
                            : "text-yellow-700 bg-yellow-100"}`}
                        >
                          {review.rating}.0
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => handleStatusClick(review)}
                        className={`px-4 py-2 text-xs font-bold rounded-md cursor-pointer capitalize transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 ${getStatusColor(
                          review.status
                        )}`}
                      >
                        {review.status}
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <div className="max-w-sm">
                        <p
                          className={`text-sm leading-relaxed ${isDark
                            ? "text-gray-300"
                            : "text-gray-700"}`}
                        >
                          {review.reply || "No reply yet"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-lg ${review.approvedBy
                          ? isDark ? "text-gray-300" : "text-gray-700 "
                          : isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {review.approvedBy || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div
                        className={`flex items-center space-x-2 text-sm font-medium ${isDark
                          ? "text-gray-300"
                          : "text-gray-600"}`}
                      >
                        <div
                          className={`p-1.5 rounded-lg ${isDark
                            ? "bg-emerald-900/50"
                            : "bg-emerald-100"}`}
                        >
                          <Calendar
                            className={`w-3.5 h-3.5 ${isDark
                              ? "text-emerald-400"
                              : "text-emerald-600"}`}
                          />
                        </div>
                        <span>
                          {review.date}
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredReviews.length}
            itemsPerPage={itemsPerPage}
          />
        </div>

        {/* Modal */}
        <ReviewStatusModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          review={selectedReview}
          onSubmit={handleModalSubmit}
        />
      </div>
    </div>
  );
};

export default ReviewPage;
