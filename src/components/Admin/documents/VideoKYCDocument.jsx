import React from "react";
import { Play, X } from "lucide-react";

const VideoKYCDocument = ({
  fileName,
  hasDoc,
  onFileView,
  fileLoading,
  loadingFileName,
  isDark
}) => {
  const handleFileClick = () => {
    if (hasDoc && fileName) {
      onFileView(fileName, "video");
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
              : "bg-green-100 hover:bg-green-200 text-green-700 cursor-pointer"
          }`}
          title="View Video KYC"
        >
          {fileLoading && loadingFileName === fileName ? (
            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Play className="text-lg" />
          )}
        </button>
      ) : (
        <div
          className="p-1 rounded-lg bg-red-100 text-red-600"
          title="Video KYC Missing"
        >
          <X size={16} />
        </div>
      )}
    </div>
  );
};

export default VideoKYCDocument;