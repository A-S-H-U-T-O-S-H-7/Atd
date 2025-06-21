import React from "react";
import { Calendar, Edit, Trash2 } from "lucide-react";

const BlogTableRow = ({
  blog,
  index,
  currentPage,
  itemsPerPage,
  isDark,
  onEdit,
  onDelete
}) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "published":
        return isDark
          ? "bg-green-900/30 text-green-300 border-green-600/50"
          : "bg-green-50 text-green-700 border-green-200";
      case "draft":
        return isDark
          ? "bg-yellow-900/30 text-yellow-300 border-yellow-600/50"
          : "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "archived":
        return isDark
          ? "bg-gray-700/30 text-gray-300 border-gray-600/50"
          : "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return isDark
          ? "bg-gray-700/30 text-gray-300 border-gray-600/50"
          : "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleEditClick = () => {
    onEdit(blog.id);
  };

  const handleDeleteClick = () => {
    onDelete(blog.id, blog.title);
  };

  return (
    <tr
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
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
      </td>
      
      <td className="px-6 py-5">
        <div
          className={`relative ${isDark
            ? "ring-2 ring-emerald-500/50"
            : "ring-2 ring-emerald-400"} rounded-lg p-0.5`}
        >
          <img
            src={blog.image}
            alt={blog.title}
            className="w-18 h-16 rounded-lg object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop";
            }}
          />
        </div>
      </td>
      
      <td className="px-6 py-5">
        <div className="min-w-0 flex-1">
          <div
            className={`text-sm font-semibold mb-2 ${isDark
              ? "text-white"
              : "text-gray-900"}`}
          >
            {blog.title}
          </div>
          <p
            className={`text-xs leading-relaxed ${isDark
              ? "text-gray-300"
              : "text-gray-600"}`}
          >
            {blog.excerpt}
          </p>
        </div>
      </td>
      
      <td className="px-6 py-5">
        <div
          className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusColor(blog.status)}`}
        >
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              blog.status.toLowerCase() === 'published' 
                ? 'bg-green-400' 
                : blog.status.toLowerCase() === 'draft'
                ? 'bg-yellow-400'
                : 'bg-gray-400'
            }`}
          />
          <span className="capitalize">{blog.status}</span>
        </div>
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
            {formatDate(blog.publicationDate)}
          </span>
        </div>
      </td>
      
      <td className="px-6 py-5">
        <div className={`flex items-center space-x-1 ${isDark ? "text-white" : "text-gray-900"}`}>
          <span className="text-sm font-bold">
            {blog.views?.toLocaleString() || '0'}
          </span>
          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            views
          </span>
        </div>
      </td>
      
      <td className="px-6 py-5">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEditClick}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
              ? "bg-blue-900/50 hover:bg-blue-800/50 text-blue-400 border border-blue-600/50"
              : "bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-300"}`}
            title="Edit Blog"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteClick}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
              ? "bg-red-900/50 hover:bg-red-800/50 text-red-400 border border-red-600/50"
              : "bg-red-100 hover:bg-red-200 text-red-600 border border-red-300"}`}
            title="Delete Blog"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BlogTableRow;