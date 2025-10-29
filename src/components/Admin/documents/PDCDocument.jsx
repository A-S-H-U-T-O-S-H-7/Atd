import React from "react";
import { FileText, X } from "lucide-react";

const PDCDocument = ({ fileName, hasDoc, onFileView, fileLoading, loadingFileName }) => {
  return (
    <div className="flex items-center justify-center">
      {hasDoc ? (
        <button
          onClick={() => onFileView(fileName, 'pdc_file')}
          disabled={fileLoading && loadingFileName === fileName}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            fileLoading && loadingFileName === fileName
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-purple-100 hover:bg-purple-200 text-purple-700 cursor-pointer"
          }`}
          title="View PDC"
        >
          <FileText className="text-lg" />
        </button>
      ) : (
        <div
          className="p-1 rounded-lg bg-red-100 text-red-600"
          title="PDC Missing"
        >
          <X size={16} />
        </div>
      )}
    </div>
  );
};

export default PDCDocument;