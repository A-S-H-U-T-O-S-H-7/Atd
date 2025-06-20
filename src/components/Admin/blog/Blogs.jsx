"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Calendar, Edit, Trash2, Plus } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import SearchBar from "../SearchBar";
import Pagination from "../Pagination";
import { useRouter } from "next/navigation";
import { blogAPI, formatBlogForUI } from "@/lib/api";

const BlogPage = () => {
  const { isDark } = useAdminAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounced search function
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
      };
      
      if (searchTerm.trim()) {
        params.title = searchTerm.trim();
      }
      
      params.status = statusFilter === "all" ? "" : (statusFilter === "published" ? "2" : "1");


      const response = await blogAPI.getPosts(params);
      
      // Handle the correct API response structure
      if (response.data.success) {
        const formattedBlogs = response.data.data.map(formatBlogForUI);
        setBlogs(formattedBlogs);
        
        // Use the correct pagination structure from API
        const pagination = response.data.pagination;
        setTotalPages(pagination.total_pages || 1);
        setTotalItems(pagination.total || 0);
      } else {
        throw new Error('API returned success: false');
      }
    } catch (err) {
      console.error('Fetch blogs error:', err);
      setError('Failed to fetch blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  // Debounced effect for search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      fetchBlogs();
    }, 500); // 500ms debounce
    
    setSearchTimeout(timeout);
    
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchTerm]);

  // Effect for page change and status filter (immediate)
  useEffect(() => {
    fetchBlogs();
  }, [currentPage, statusFilter]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter]);

  const itemsPerPage = 10;

  const getStatusColor = status => {
    switch (status.toLowerCase()) {
      case "published":
        return isDark
          ? "bg-green-900/50 text-green-300 border-green-700"
          : "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return isDark
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "archived":
        return isDark
          ? "bg-gray-700 text-gray-300 border-gray-600"
          : "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return isDark
          ? "bg-gray-700 text-gray-300 border-gray-600"
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleCreateBlog = () => {
    router.push("blogs/manage-blog");
  };

  const handleEditBlog = blogId => {
    router.push(`blogs/manage-blog?id=${blogId}`);
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await blogAPI.deletePost(blogId);
        fetchBlogs(); // Refresh the list
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete blog');
      }
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark
        ? "bg-gray-900"
        : "bg-emerald-50/30"}`}
    >
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
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
                className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${isDark
                  ? "from-emerald-400 to-teal-400"
                  : "from-emerald-600 to-teal-600"} bg-clip-text text-transparent`}
              >
                Blogs
              </h1>
            </div>
            <button
              onClick={handleCreateBlog}
              className={`flex cursor-pointer items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${isDark
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"} shadow-lg hover:shadow-xl`}
            >
              <Plus className="w-5 h-5" />
              <span>Create Blog</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                placeholder="Search blogs by title or content..."
              />
            </div>

            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${isDark
                ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
                : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={`text-center py-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            Loading blogs...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`text-center py-8 ${isDark ? "text-red-400" : "text-red-600"}`}>
            <p>{error}</p>
            <button 
              onClick={fetchBlogs}
              className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Table Container */}
        {!loading && !error && (
          <div
            className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${isDark
              ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
              : "bg-white border-emerald-300 shadow-emerald-500/10"}`}
          >
            {blogs.length === 0 ? (
              <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                <p className="text-lg">No blogs found</p>
                <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <>
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
                          style={{ minWidth: "120px" }}
                        >
                          Image
                        </th>
                        <th
                          className={`px-6 py-5 text-left text-sm font-bold ${isDark
                            ? "text-gray-100"
                            : "text-gray-700"}`}
                          style={{ minWidth: "400px" }}
                        >
                          Title
                        </th>
                        <th
                          className={`px-6 py-5 text-left text-sm font-bold ${isDark
                            ? "text-gray-100"
                            : "text-gray-700"}`}
                          style={{ minWidth: "120px" }}
                        >
                          Status
                        </th>
                        <th
                          className={`px-6 py-5 text-left text-sm font-bold ${isDark
                            ? "text-gray-100"
                            : "text-gray-700"}`}
                          style={{ minWidth: "180px" }}
                        >
                          Publication Date
                        </th>
                        <th
                          className={`px-6 py-5 text-left text-sm font-bold ${isDark
                            ? "text-gray-100"
                            : "text-gray-700"}`}
                          style={{ minWidth: "100px" }}
                        >
                          Views
                        </th>
                        <th
                          className={`px-6 py-5 text-left text-sm font-bold ${isDark
                            ? "text-gray-100"
                            : "text-gray-700"}`}
                          style={{ minWidth: "200px" }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y-2 ${isDark
                        ? "divide-emerald-800/30"
                        : "divide-emerald-200"}`}
                    >
                      {blogs.map((blog, index) => (
                        <tr
                          key={blog.id}
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
                                src={blog.featured}
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
                            <span
                              className={`px-4 py-2 text-xs font-bold rounded-md capitalize border-2 ${getStatusColor(
                                blog.status
                              )}`}
                            >
                              {blog.status}
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
                                {formatDate(blog.publicationDate)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`text-sm font-bold ${isDark
                                ? "text-white"
                                : "text-gray-900"}`}
                            >
                              {blog.views || 0}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditBlog(blog.id)}
                                className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
                                  ? "bg-blue-900/50 hover:bg-blue-800/50 text-blue-400 border border-blue-600/50"
                                  : "bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-300"}`}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
                                  ? "bg-red-900/50 hover:bg-red-800/50 text-red-400 border border-red-600/50"
                                  : "bg-red-100 hover:bg-red-200 text-red-600 border border-red-300"}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;