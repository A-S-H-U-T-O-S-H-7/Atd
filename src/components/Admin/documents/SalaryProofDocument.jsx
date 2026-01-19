import React from "react";
import { FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

const SalaryProofDocument = ({ 
  fileName, 
  hasDoc, 
  secondFileName, 
  hasSecondDoc,
  thirdFileName,
  hasThirdDoc,
  isDark,
  applicationId,
  className = "",
  size = "default"  // small, default, large
}) => {
  const documents = [
    { 
      file: fileName, 
      hasDoc, 
      title: "First Salary Slip", 
      index: 1,
      type: 'salary_slip'
    },
    { 
      file: secondFileName, 
      hasDoc: hasSecondDoc, 
      title: "Second Salary Slip", 
      index: 2,
      type: 'second_salary_slip'
    },
    { 
      file: thirdFileName, 
      hasDoc: hasThirdDoc, 
      title: "Third Salary Slip", 
      index: 3,
      type: 'third_salary_slip'
    }
  ].filter(doc => doc.hasDoc && doc.file);

  if (documents.length === 0) {
    return (
      <div 
        className={`p-2 rounded-lg bg-red-100 text-red-600 flex items-center justify-center cursor-not-allowed ${className}`}
        title="Salary Proof Missing"
      >
        <FileText size={18} className="flex-shrink-0" />
        <span className="text-xs ml-1">✗</span>
      </div>
    );
  }

  // Size configurations - using DEFAULT as base
  const sizeConfig = {
    small: {
      padding: "p-1",
      iconSize: 14,
      externalLinkSize: 6,
      numberMargin: "ml-0.5",
      numberSize: "text-xs"
    },
    default: {  // THIS IS DEFAULT
      padding: "p-2",
      iconSize: 18,
      externalLinkSize: 10,
      numberMargin: "ml-1",
      numberSize: "text-sm"
    },
    large: {
      padding: "p-3",
      iconSize: 22,
      externalLinkSize: 12,
      numberMargin: "ml-1.5",
      numberSize: "text-base"
    }
  };

  const config = sizeConfig[size] || sizeConfig.default;

  return (
    <div className={`flex space-x-2 justify-center ${className}`}>
      {documents.map((doc, index) => (
        <Link
          key={index}
          href={`/documents/view?file=${encodeURIComponent(doc.file)}&type=${doc.type}${applicationId ? `&appId=${applicationId}` : ''}`}
          target="_blank"
          className={`${config.padding} rounded-lg transition-colors cursor-pointer flex items-center justify-center group relative ${
            isDark
              ? 'bg-blue-900/50 hover:bg-blue-800/50 text-blue-300'
              : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
          }`}
          title={`View ${doc.title}`}
        >
          <FileText 
            size={config.iconSize} 
            className="flex-shrink-0" 
          />
          <span className={`${config.numberMargin} ${config.numberSize} font-medium`}>
            {doc.index}
          </span>
          <ExternalLink 
            size={config.externalLinkSize} 
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity" 
          />
        </Link>
      ))}
    </div>
  );
};

export default SalaryProofDocument;