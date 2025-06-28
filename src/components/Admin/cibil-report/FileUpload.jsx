import React from 'react';
import { Upload, FileText, X } from 'lucide-react';

const FileUpload = ({ onFileSelect, selectedFile, isDark }) => {
    const handleFileChange = (e) => {
      onFileSelect(e);
    };
  
    const removeFile = () => {
      onFileSelect({ target: { files: [] } });
    };
  
    return (
      <div className="space-y-4">
        <label className={`block text-sm font-medium ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}>
          Select Excel File
        </label>
        
        {!selectedFile ? (
          <div className={`border-2 border-dashed rounded-xl p-6 text-center ${
            isDark
              ? "border-emerald-600/50 bg-gray-700/30"
              : "border-emerald-300 bg-emerald-50/30"
          }`}>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            
            <Upload className={`w-8 h-8 mx-auto mb-3 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
            
            <p className={`text-sm mb-3 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              Choose Excel or CSV file
            </p>
            
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
                isDark
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              Browse Files
            </label>
          </div>
        ) : (
          <div className={`border rounded-xl p-4 ${
            isDark
              ? "border-emerald-600/50 bg-gray-700/30"
              : "border-emerald-300 bg-emerald-50/30"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className={`w-5 h-5 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`} />
                <div>
                  <p className={`font-medium ${
                    isDark ? "text-gray-200" : "text-gray-900"
                  }`}>
                    {selectedFile.name}
                  </p>
                  <p className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <button
                onClick={removeFile}
                className={`p-1 rounded hover:bg-gray-200 ${
                  isDark ? "text-gray-400 hover:bg-gray-600" : "text-gray-500"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

export default FileUpload;