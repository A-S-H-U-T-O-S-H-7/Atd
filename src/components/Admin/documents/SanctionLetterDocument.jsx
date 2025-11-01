import React from "react";
import { FaRegFilePdf} from "react-icons/fa";
import x, { X } from "lucide-react";

const SanctionLetterDocument = ({
  fileName,
  hasDoc,
  onFileView,
  fileLoading,
  loadingFileName,
  isDark
}) => {
  const handleFileClick = () => {
    if (hasDoc && fileName) {
      onFileView(fileName, "sanction_letter");
    }
  };

  return (
    <div className="flex items-center justify-center">
      {hasDoc && fileName ? (
        <button
          onClick={handleFileClick}
          disabled={fileLoading && loadingFileName === fileName}
          className={`p-1 rounded-lg transition-colors duration-200 ${
            fileLoading && loadingFileName === fileName
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-500 cursor-pointer hover:text-red-600"
          }`}
          title="View Sanction Letter PDF"
        >
          {fileLoading && loadingFileName === fileName ? (
            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FaRegFilePdf size={25} />
          )}
        </button>
      ) : (
        <div
          className="p-1 rounded-lg bg-red-100 text-red-600"
          title="Sanction Letter Missing"
        >
          <X size={16} />
        </div>
      )}
    </div>
  );
};

export default SanctionLetterDocument;