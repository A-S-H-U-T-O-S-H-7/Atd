import React from "react";
import { Star, Calendar, Phone, Mail } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";

const ReviewRow = ({ review, index, onStatusClick }) => {
  const { isDark } = useAdminAuth();
  

  const getStatusColor = (status) => {
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

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating
            ? "text-yellow-400 fill-current"
            : isDark
            ? "text-gray-600"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <tr
      className={`transition-all border  duration-200 ${
        isDark
          ? "hover:bg-gradient-to-r border-emerald-800 hover:from-gray-700/50 hover:to-emerald-900/20"
          : "hover:bg-gradient-to-r border-emerald-400 hover:from-emerald-50/50 hover:to-teal-50/50"
      }`}
    >
      {/* Serial Number */}
      <td className="px-6 py-5">
        <span
          className={`text-sm font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {index}
        </span>
      </td>

      {/* Customer */}
      <td className="px-6 py-5">
        <div className="flex items-center space-x-4">
          <div
            className={`relative ${
              isDark
                ? "ring-2 ring-emerald-500/50"
                : "ring-2 ring-emerald-400"
            } rounded-full p-0.5`}
          >
            <img
              src={review.photo}
              alt={review.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                isDark
                  ? "bg-emerald-500 border-gray-800"
                  : "bg-emerald-400 border-white"
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={`text-sm font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {review.name}
            </div>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className="px-6 py-5">
        <div className="space-y-2">
          <div
            className={`flex items-center space-x-3 text-sm font-medium ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <div
              className={`p-1.5 rounded-lg ${
                isDark ? "bg-emerald-900/50" : "bg-emerald-100"
              }`}
            >
              <Phone
                className={`w-3.5 h-3.5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
            </div>
            <span>{review.phone}</span>
          </div>
          <div
            className={`flex items-center space-x-3 text-sm ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <div
              className={`p-1.5 rounded-lg ${
                isDark ? "bg-emerald-900/50" : "bg-emerald-100"
              }`}
            >
              <Mail
                className={`w-3.5 h-3.5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
            </div>
            <span className="break-all font-medium">{review.email}</span>
          </div>
        </div>
      </td>

      {/* CRN Number */}
      <td className="px-6 py-5">
        <span
          className={`px-4 py-2 text-sm font-bold rounded-md border-2 ${
            isDark
              ? "bg-gradient-to-r from-blue-900/50 to-indigo-900/50 text-blue-300 border-blue-600/50"
              : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-300"
          }`}
        >
          {review.crnNo}
        </span>
      </td>

      {/* Review */}
      <td className="px-6 py-5">
        <div className="max-w-sm">
          <p
            className={`text-sm leading-relaxed ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {review.review}
          </p>
        </div>
      </td>

      {/* Rating */}
      <td className="px-6 py-5">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">{renderStars(review.rating)}</div>
          <span
            className={`text-sm font-bold px-2 py-1 rounded-lg ${
              isDark
                ? "text-yellow-300 bg-yellow-900/30"
                : "text-yellow-700 bg-yellow-100"
            }`}
          >
            {review.rating}.0
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-5">
        <button
          onClick={() => onStatusClick(review)}
          className={`px-4 py-2 text-xs font-bold rounded-md cursor-pointer capitalize transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 ${getStatusColor(
            review.status
          )}`}
        >
          {review.status}
        </button>
      </td>

      {/* Reply */}
      <td className="px-6 py-5">
        <div className="max-w-sm">
          <p
            className={`text-sm leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {review.reply || "No reply yet"}
          </p>
        </div>
      </td>

      {/* Approved By */}
      <td className="px-6 py-5">
        <span
          className={`text-sm font-medium px-3 py-1 rounded-lg ${
            review.approvedBy
              ? isDark
                ? "text-gray-300"
                : "text-gray-700"
              : isDark
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {review.approvedBy || "-"}
        </span>
      </td>

      {/* Date */}
      <td className="px-6 py-5">
        <div
          className={`flex items-center space-x-2 text-sm font-medium ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <div
            className={`p-1.5 rounded-lg ${
              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
            }`}
          >
            <Calendar
              className={`w-3.5 h-3.5 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <span>{review.date}</span>
        </div>
      </td>
    </tr>
  );
};

export default ReviewRow;