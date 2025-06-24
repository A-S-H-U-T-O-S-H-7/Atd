import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ExpandableText = ({ text, maxLength = 100, isDark }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text || text.length <= maxLength) {
    return (
      <p className={`text-sm leading-relaxed ${isDark ? "text-gray-200" : "text-gray-800"}`}>
        {text || "No content available"}
      </p>
    );
  }

  return (
    <div>
      <p className={`text-sm leading-relaxed ${isDark ? "text-gray-200" : "text-gray-800"}`}>
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`mt-2 text-xs font-medium flex items-center space-x-1 transition-colors duration-200 ${
          isDark ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-600 hover:text-emerald-700"
        }`}
      >
        <span>{isExpanded ? "Read Less" : "Read More"}</span>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
    </div>
  );
};

export default ExpandableText;