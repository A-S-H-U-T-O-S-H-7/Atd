import React from "react";
import { Calendar, Image as ImageIcon, Upload, X, Save } from "lucide-react";
import { toast } from "react-hot-toast";

const BlogSidebar = ({ formData, onInputChange, onSubmit, isLoading, isDark }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        onInputChange('featuredImage', file);
        onInputChange('featuredImagePreview', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    onInputChange('featuredImage', null);
    onInputChange('featuredImagePreview', null);
  };

  const getButtonText = () => {
    if (isLoading) {
      return formData.status === 'published' ? "Publishing..." : "Saving...";
    }
    return formData.status === 'published' ? "Publish Post" : "Save as Draft";
  };

  return (
    <div className="space-y-6">
      {/* Post Status */}
      <div
        className={`rounded-2xl shadow-2xl border-2 p-6 ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div
            className={`p-2 rounded-lg ${
              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
            }`}
          >
            <Calendar
              className={`w-5 h-5 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <h3
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Post Status
          </h3>
        </div>

        <select
          value={formData.status}
          onChange={(e) => onInputChange('status', e.target.value)}
          className={`w-full px-4 cursor-pointer py-3 rounded-xl border-2 transition-all duration-200 ${
            isDark
              ? "bg-gray-700 border-emerald-600/50 text-white focus:border-emerald-400"
              : "bg-gray-50 border-emerald-300 text-gray-900 focus:border-emerald-500"
          } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Featured Image */}
      <div
        className={`rounded-2xl shadow-2xl border-2 p-6 ${
          isDark
            ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
            : "bg-white border-emerald-300 shadow-emerald-500/10"
        }`}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div
            className={`p-2 rounded-lg ${
              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
            }`}
          >
            <ImageIcon
              className={`w-5 h-5 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <h3
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Featured Image
          </h3>
        </div>

        {formData.featuredImagePreview ? (
          <div className="relative">
            <img
              src={formData.featuredImagePreview}
              alt="Featured"
              className="w-full h-48 object-cover rounded-xl"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop";
              }}
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label
            className={`block w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
              isDark
                ? "border-emerald-600/50 hover:border-emerald-500 bg-gray-700/50"
                : "border-emerald-300 hover:border-emerald-400 bg-gray-50"
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <Upload
                className={`w-12 h-12 mb-4 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Click to upload image
              </p>
              <p
                className={`text-xs mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Max size: 5MB
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className={`w-full flex cursor-pointer items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
          formData.status === 'published'
            ? isDark
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
              : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            : isDark
            ? "bg-gray-700 hover:bg-gray-600 text-white border-2 border-emerald-600/50"
            : "bg-white hover:bg-gray-50 text-gray-900 border-2 border-emerald-300"
        } shadow-lg hover:shadow-xl`}
      >
        <Save className="w-5 h-5" />
        <span>{getButtonText()}</span>
      </button>
    </div>
  );
};

export default BlogSidebar;