import React from "react";
import { FileText, Globe } from "lucide-react";

const BlogForm = ({ formData, errors, onInputChange, isDark }) => {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div
        className={`rounded-2xl shadow-2xl border-2 p-6 ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div
            className={`p-2 rounded-lg ${
              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
            }`}
          >
            <FileText
              className={`w-5 h-5 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <h2
            className={`text-xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Basic Information
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Post Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                isDark
                  ? "bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 focus:border-emerald-400"
                  : "bg-gray-50 border-emerald-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${
                errors.title ? "border-red-500" : ""
              }`}
              placeholder="Enter blog title..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              URL Slug *
            </label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => onInputChange('url', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                isDark
                  ? "bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 focus:border-emerald-400"
                  : "bg-gray-50 border-emerald-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${
                errors.url ? "border-red-500" : ""
              }`}
              placeholder="enter-url-slug"
            />
            {errors.url && (
              <p className="text-red-500 text-sm mt-1">{errors.url}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div
        className={`rounded-2xl shadow-2xl border-2 p-6 ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div
            className={`p-2 rounded-lg ${
              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
            }`}
          >
            <FileText
              className={`w-5 h-5 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <h2
            className={`text-xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Post Content
          </h2>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Content *
          </label>
          <div
            className={`border-2 rounded-xl overflow-hidden ${
              isDark
                ? "border-emerald-600/50"
                : "border-emerald-300"
            } ${errors.content ? "border-red-500" : ""}`}
          >
            {/* Editor Toolbar */}
            <div
              className={`flex items-center space-x-1 p-3 border-b ${
                isDark
                  ? "bg-gray-700 border-emerald-600/50"
                  : "bg-gray-50 border-emerald-300"
              }`}
            >
              <button className={`p-2 rounded ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}>
                <strong>B</strong>
              </button>
              <button className={`p-2 rounded ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}>
                <em>I</em>
              </button>
              <button className={`p-2 rounded ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}>
                <u>U</u>
              </button>
            </div>
            
            <textarea
              value={formData.content}
              onChange={(e) => onInputChange('content', e.target.value)}
              rows={12}
              className={`w-full p-4 resize-none ${
                isDark
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-white text-gray-900 placeholder-gray-500"
              } focus:outline-none`}
              placeholder="Write your blog content here..."
            />
          </div>
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>
      </div>

      {/* SEO Settings */}
      <div
        className={`rounded-2xl shadow-2xl border-2 p-6 ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div
            className={`p-2 rounded-lg ${
              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
            }`}
          >
            <Globe
              className={`w-5 h-5 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <h2
            className={`text-xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            SEO Settings
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Meta Title *
            </label>
            <input
              type="text"
              value={formData.metatitle}
              onChange={(e) => onInputChange('metatitle', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                isDark
                  ? "bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 focus:border-emerald-400"
                  : "bg-gray-50 border-emerald-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${
                errors.metatitle ? "border-red-500" : ""
              }`}
              placeholder="Enter meta title..."
            />
            {errors.metatitle && (
              <p className="text-red-500 text-sm mt-1">{errors.metatitle}</p>
            )}
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Meta Description *
            </label>
            <textarea
              value={formData.metadesc}
              onChange={(e) => onInputChange('metadesc', e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                isDark
                  ? "bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 focus:border-emerald-400"
                  : "bg-gray-50 border-emerald-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${
                errors.metadesc ? "border-red-500" : ""
              }`}
              placeholder="Enter meta description..."
            />
            {errors.metadesc && (
              <p className="text-red-500 text-sm mt-1">{errors.metadesc}</p>
            )}
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Meta Keywords
            </label>
            <input
              type="text"
              value={formData.metakeword}
              onChange={(e) => onInputChange('metakeword', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                isDark
                  ? "bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 focus:border-emerald-400"
                  : "bg-gray-50 border-emerald-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
              } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;