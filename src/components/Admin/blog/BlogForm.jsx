import React, { useEffect, useCallback } from "react";
import { FileText, Globe } from "lucide-react";
import RichTextEditor from "../RichTextEditor";

const BlogForm = ({ formData, errors, onInputChange, isDark }) => {
  // Function to generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') 
      .replace(/[\s_-]+/g, '-') 
      .replace(/^-+|-+$/g, ''); 
  };

  const handleSlugChange = (value) => {
    onInputChange("url", value);
    onInputChange("manualSlug", true); 
  };

  const handleTitleChange = (value) => {
    onInputChange("title", value);
    
    if (!formData.manualSlug) {
      const newSlug = generateSlug(value);
      onInputChange("url", newSlug);
    }
    
    // Reset manual flag when title changes
    if (formData.manualSlug) {
      onInputChange("manualSlug", false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div
        className={`rounded-xl shadow-lg border p-4 ${isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/10"
          : "bg-white border-emerald-300 shadow-emerald-500/5"}`}
      >
        <div className="flex items-center space-x-2 mb-4">
          <div
            className={`p-1.5 rounded-lg ${isDark
              ? "bg-emerald-900/50"
              : "bg-emerald-100"}`}
          >
            <FileText
              className={`w-4 h-4 ${isDark
                ? "text-emerald-400"
                : "text-emerald-600"}`}
            />
          </div>
          <h2
            className={`text-lg font-semibold ${isDark
              ? "text-white"
              : "text-gray-900"}`}
          >
            Basic Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark
                ? "text-gray-300"
                : "text-gray-700"}`}
            >
              Post Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => handleTitleChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 ${isDark
                ? "bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 focus:border-emerald-400"
                : "bg-gray-50 border-emerald-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"} focus:ring-2 focus:ring-emerald-500/20 focus:outline-none ${errors.title
                ? "border-red-500"
                : ""}`}
              placeholder="Enter blog title..."
            />
            {errors.title &&
              <p className="text-red-500 text-sm mt-1">
                {errors.title}
              </p>}
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark
                ? "text-gray-300"
                : "text-gray-700"}`}
            >
              URL Slug *
            </label>
            <input
              type="text"
              value={formData.url}
              onChange={e => handleSlugChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 ${isDark
                ? "bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 focus:border-emerald-400"
                : "bg-gray-50 border-emerald-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"} focus:ring-2 focus:ring-emerald-500/20 focus:outline-none ${errors.url
                ? "border-red-500"
                : ""}`}
              placeholder="enter-url-slug"
            />
            {errors.url &&
              <p className="text-red-500 text-sm mt-1">
                {errors.url}
              </p>}
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div
        className={`rounded-xl shadow-lg border p-4 ${isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/10"
          : "bg-white border-emerald-300 shadow-emerald-500/5"}`}
      >
        <div className="flex items-center space-x-2 mb-4">
          <div
            className={`p-1.5 rounded-lg ${isDark
              ? "bg-emerald-900/50"
              : "bg-emerald-100"}`}
          >
            <FileText
              className={`w-4 h-4 ${isDark
                ? "text-emerald-400"
                : "text-emerald-600"}`}
            />
          </div>
          <h2
            className={`text-lg font-semibold ${isDark
              ? "text-white"
              : "text-gray-900"}`}
          >
            Post Content
          </h2>
        </div>

        <RichTextEditor
          value={formData.content}
          onChange={(content) => onInputChange("content", content)}
          label="Content"
          placeholder="Write your blog content here..."
          minHeight="200px"
          required={true}
          error={errors.content}
        />
      </div>

      {/* SEO Settings */}
      <div
        className={`rounded-xl shadow-lg border p-4 ${isDark
          ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/10"
          : "bg-white border-emerald-300 shadow-emerald-500/5"}`}
      >
        <div className="flex items-center space-x-2 mb-4">
          <div
            className={`p-1.5 rounded-lg ${isDark
              ? "bg-emerald-900/50"
              : "bg-emerald-100"}`}
          >
            <Globe
              className={`w-4 h-4 ${isDark
                ? "text-emerald-400"
                : "text-emerald-600"}`}
            />
          </div>
          <h2
            className={`text-lg font-semibold ${isDark
              ? "text-white"
              : "text-gray-900"}`}
          >
            SEO Settings
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark
                ? "text-gray-300"
                : "text-gray-700"}`}
            >
              Meta Title *
            </label>
            <input
              type="text"
              value={formData.metatitle}
              onChange={e => onInputChange("metatitle", e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 ${isDark
                ? "bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 focus:border-emerald-400"
                : "bg-gray-50 border-emerald-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"} focus:ring-2 focus:ring-emerald-500/20 focus:outline-none ${errors.metatitle
                ? "border-red-500"
                : ""}`}
              placeholder="Enter meta title..."
            />
            {errors.metatitle &&
              <p className="text-red-500 text-sm mt-1">
                {errors.metatitle}
              </p>}
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark
                ? "text-gray-300"
                : "text-gray-700"}`}
            >
              Meta Description *
            </label>
            <textarea
              value={formData.metadesc}
              onChange={e => onInputChange("metadesc", e.target.value)}
              rows={2}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 resize-none ${isDark
                ? "bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 focus:border-emerald-400"
                : "bg-gray-50 border-emerald-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"} focus:ring-2 focus:ring-emerald-500/20 focus:outline-none ${errors.metadesc
                ? "border-red-500"
                : ""}`}
              placeholder="Enter meta description..."
            />
            {errors.metadesc &&
              <p className="text-red-500 text-sm mt-1">
                {errors.metadesc}
              </p>}
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark
                ? "text-gray-300"
                : "text-gray-700"}`}
            >
              Meta Keywords
            </label>
            <input
              type="text"
              value={formData.metakeword}
              onChange={e => onInputChange("metakeword", e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 ${isDark
                ? "bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 focus:border-emerald-400"
                : "bg-gray-50 border-emerald-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"} focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;