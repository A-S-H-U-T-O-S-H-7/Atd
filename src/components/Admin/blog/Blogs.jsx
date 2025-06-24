"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import SearchBar from "../SearchBar";
import { useRouter } from "next/navigation";
import { blogAPI, formatBlogForUI } from "@/lib/api";
import BlogTable from "./BlogTable";
import Swal from "sweetalert2";

const BlogPage = () => {
  const { isDark } = useAdminAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [blogs, setBlogs] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Debounced search function
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchBlogs = useCallback(
    async (isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setInitialLoading(true);
        } else {
          setIsUpdating(true);
        }

        setError(null);

        const params = {
          page: currentPage
        };

        // Add search parameter if exists
        if (searchTerm.trim()) {
          params.title = searchTerm.trim();

        }

        // Add status filter if not 'all'
        if (statusFilter !== "all") {
          params.status = statusFilter === "published" ? "2" : "1";
        }

        console.log("Fetching blogs with params:", params); // Debug log

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
          throw new Error("API returned success: false");
        }
      } catch (err) {
        console.error("Fetch blogs error:", err);
        setError("Failed to fetch blogs");
      } finally {
        setInitialLoading(false);
        setIsUpdating(false);
      }
    },
    [currentPage, searchTerm, statusFilter]
  );

  // Initial load effect
  useEffect(() => {
    fetchBlogs(true);
  }, []);

  // Debounced effect for search
  useEffect(
    () => {
      if (initialLoading) return;

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        // Reset to page 1 when searching
        if (currentPage !== 1) {
          setCurrentPage(1);
        } else {
          fetchBlogs(false);
        }
      }, 500);

      setSearchTimeout(timeout);

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    },
    [searchTerm]
  );

  // Effect for page change and status filter (immediate)
  useEffect(
    () => {
      if (initialLoading) return;
      fetchBlogs(false);
    },
    [currentPage, statusFilter]
  );

  // Reset to page 1 when search or filter changes
  useEffect(
    () => {
      if (searchTerm && currentPage !== 1 && !initialLoading) {
        setCurrentPage(1);
      }
    },
    [searchTerm, statusFilter]
  );

  const itemsPerPage = 10;

  const handleCreateBlog = () => {
    router.push("blogs/manage-blog");
  };

  const handleEditBlog = blogId => {
    router.push(`blogs/manage-blog?id=${blogId}`);
  };

  const handleDeleteBlog = async (blogId, blogTitle) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${blogTitle}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000",
      customClass: {
        popup: isDark ? "dark-swal rounded-xl border-2 border-emerald-500" : "rounded-xl border-2 border-emerald-500"
      }
    });

    if (result.isConfirmed) {
      try {
        setIsUpdating(true);
        await blogAPI.deletePost(blogId);

        await Swal.fire({
          title: "Deleted!",
          text: "Blog has been deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#ffffff" : "#000000"
        });

        fetchBlogs(false);
      } catch (error) {
        console.error("Delete error:", error);
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete blog. Please try again.",
          icon: "error",
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#ffffff" : "#000000"
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleSearchChange = value => {
    setSearchTerm(value);
  };

  const handleStatusFilterChange = e => {
    setStatusFilter(e.target.value);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleRetry = () => {
    fetchBlogs(true);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark
        ? "bg-gray-900"
        : "bg-gary-50"}`}
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
                placeholder="Search blogs by title "
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

        {/* Initial Loading State */}
        {initialLoading &&
          <div
            className={`text-center py-8 ${isDark
              ? "text-gray-300"
              : "text-gray-600"}`}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4" />
            Loading blogs...
          </div>}

        {/* Error State */}
        {error &&
          !initialLoading &&
          <div
            className={`text-center py-8 ${isDark
              ? "text-red-400"
              : "text-red-600"}`}
          >
            <p>
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Try Again
            </button>
          </div>}

        {/* Blog Table */}
        {!initialLoading &&
          <BlogTable
            blogs={blogs}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            totalItems={totalItems}
            isUpdating={isUpdating}
            isDark={isDark}
            error={error}
            onEdit={handleEditBlog}
            onDelete={handleDeleteBlog}
            onPageChange={handlePageChange}
          />}
      </div>
    </div>
  );
};

export default BlogPage;
