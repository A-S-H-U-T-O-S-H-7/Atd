"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/lib/AdminAuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { blogAPI, formatBlogForUI, getStatusNumber } from "@/lib/api";
import { toast } from "react-hot-toast";
import BlogForm from "./BlogForm";
import BlogSidebar from "./BlogSidebar";

const ManageBlogPage = () => {
  const { isDark } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get('id');
  const isEditMode = Boolean(blogId);

  // Form state - Updated field names to match API
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    content: "",
    metatitle: "",
    metadesc: "",
    metakeword: "",
    status: "draft",
    featuredImage: null,
    featuredImagePreview: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  const [errors, setErrors] = useState({});

  // Load blog data for editing
  useEffect(() => {
    const loadBlogData = async () => {
      if (isEditMode && blogId) {
        setIsLoadingBlog(true);
        try {
          const response = await blogAPI.getPost(blogId);
          if (response.data.success) {
            const blogData = formatBlogForUI(response.data.data);
            setFormData({
              title: blogData.title || "",
              url: blogData.url || "",
              content: blogData.content || "",
              metatitle: blogData.metatitle || "",
              metadesc: blogData.metadesc || "",
              metakeword: blogData.metakeword || "",
              status: blogData.status || "draft",
              featuredImage: null,
              featuredImagePreview: blogData.image || null
            });
          }
        } catch (error) {
          console.error('Error loading blog:', error);
          toast.error('Failed to load blog data');
        } finally {
          setIsLoadingBlog(false);
        }
      }
    };

    loadBlogData();
  }, [blogId, isEditMode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.url.trim()) newErrors.url = "URL is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.metatitle.trim()) newErrors.metatitle = "Meta title is required";
    if (!formData.metadesc.trim()) newErrors.metadesc = "Meta description is required";
    
    // Validate URL format (basic check)
    if (formData.url.trim() && !/^[a-z0-9-]+$/.test(formData.url.trim())) {
      newErrors.url = "URL should only contain lowercase letters, numbers, and hyphens";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('url', formData.url);
      submitData.append('content', formData.content);
      submitData.append('metatitle', formData.metatitle);
      submitData.append('metadesc', formData.metadesc);
      submitData.append('metakeword', formData.metakeword);
      submitData.append('status', getStatusNumber(formData.status));
      
      // Only append image if a new one was selected
      if (formData.featuredImage) {
        submitData.append('featured', formData.featuredImage);
      }

      let response;
      if (isEditMode) {
        response = await blogAPI.updatePost(blogId, submitData);
      } else {
        response = await blogAPI.createPost(submitData);
      }

      if (response.data.success) {
        const statusText = formData.status === 'published' ? 'published' : 'saved as draft';
        toast.success(`Blog ${statusText} successfully!`);
        router.push('/crm/blogs');
      } else {
        throw new Error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to save blog');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/crm/blogs');
  };

  // Show loading state while fetching blog data
  if (isLoadingBlog) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-emerald-50/30"}`}>
        <div className={`text-center ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          Loading blog data...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-200"
      }`}
    >
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                    : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
                }`}
              >
                <ArrowLeft
                  className={`w-5 h-5 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              </button>
              <h1
                className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                  isDark
                    ? "from-emerald-400 to-teal-400"
                    : "from-emerald-600 to-teal-600"
                } bg-clip-text text-transparent`}
              >
                {isEditMode ? "Edit Blog" : "Create New Blog"}
              </h1>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <BlogForm
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              isDark={isDark}
            />
          </div>

          {/* Sidebar */}
          <div>
            <BlogSidebar
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBlogPage;