import React from "react";
import { FileText, X } from "lucide-react";

const NachFormDocument = ({
  fileName,
  hasDoc,
  onFileView,
  fileLoading,
  loadingFileName,
  isDark
}) => {
  const handleFileClick = () => {
    if (hasDoc && fileName) {
      onFileView(fileName, "nach_form");
    }
  };

  return (
    <div className="flex items-center justify-center">
      {hasDoc && fileName ? (
        <button
          onClick={handleFileClick}
          disabled={fileLoading && loadingFileName === fileName}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            fileLoading && loadingFileName === fileName
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-purple-100 hover:bg-purple-200 text-purple-700 cursor-pointer"
          }`}
          title="View NACH Form"
        >
          {fileLoading && loadingFileName === fileName ? (
            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FileText className="text-lg" />
          )}
        </button>
      ) : (
        <div
          className="p-1 rounded-lg bg-red-100 text-red-600"
          title="NACH Form Missing"
        >
          <X size={16} />
        </div>
      )}
    </div>
  );
};

export default NachFormDocument;