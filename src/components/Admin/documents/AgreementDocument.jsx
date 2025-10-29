import React from "react";
import { FileText, X } from "lucide-react";

const AgreementDocument = ({ fileName, hasDoc, onFileView, fileLoading, loadingFileName }) => {
  return (
    <div className="flex items-center justify-center">
      {hasDoc ? (
        <button
          onClick={() => onFileView(fileName, 'agreement_file')}
          disabled={fileLoading && loadingFileName === fileName}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            fileLoading && loadingFileName === fileName
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-100 hover:bg-blue-200 text-blue-700 cursor-pointer"
          }`}
          title="View Agreement"
        >
          <FileText className="text-lg" />
        </button>
      ) : (
        <div
          className="p-1 rounded-lg bg-red-100 text-red-600"
          title="Agreement Missing"
        >
          <X size={16} />
        </div>
      )}
    </div>
  );
};

export default AgreementDocument;