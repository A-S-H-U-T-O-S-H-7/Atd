'use client';
import React from 'react';
import { Calendar, FileText, Hash, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

const GuidelineFormFields = ({
  isDark,
  guidelineDate,
  setGuidelineDate,
  referenceNo,
  setReferenceNo,
  subject,
  setSubject,
  cautionAdviceNo,
  setCautionAdviceNo,
  remarks,
  setRemarks,
  status,
  setStatus,
  isEditMode
}) => {
  const inputClasses = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:outline-none text-sm ${
    isDark
      ? "bg-gray-700 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400 focus:ring-emerald-500/20"
      : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20"
  }`;

  const labelClasses = `block text-sm font-semibold mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const iconClasses = `w-4 h-4 ${
    isDark ? "text-emerald-400" : "text-emerald-600"
  }`;

  return (
    <div className="space-y-4">
      {/* Row 1: Guideline Date and Reference No */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RBI Guideline Date */}
        <div className="space-y-1">
          <label className={labelClasses}>
            <div className="flex items-center space-x-2">
              <Calendar className={iconClasses} />
              <span>RBI Guideline Date <span className="text-red-500">*</span></span>
            </div>
          </label>
          <input
            type="date"
            value={guidelineDate}
            onChange={(e) => setGuidelineDate(e.target.value)}
            className={inputClasses}
            required
          />
        </div>

        {/* Reference No */}
        <div className="space-y-1">
          <label className={labelClasses}>
            <div className="flex items-center space-x-2">
              <Hash className={iconClasses} />
              <span>Reference No.</span>
            </div>
          </label>
          <input
            type="text"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
            placeholder="Enter reference number"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Row 2: Subject */}
      <div className="space-y-1">
        <label className={labelClasses}>
          <div className="flex items-center space-x-2">
            <FileText className={iconClasses} />
            <span>Subject <span className="text-red-500">*</span></span>
          </div>
        </label>
        <textarea
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter the subject of the guideline"
          rows="2"
          className={inputClasses}
          required
        />
      </div>

      {/* Row 3: Caution Advice No and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Caution Advice No */}
        <div className="space-y-1">
          <label className={labelClasses}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className={iconClasses} />
              <span>Caution Advice No.</span>
            </div>
          </label>
          <input
            type="text"
            value={cautionAdviceNo}
            onChange={(e) => setCautionAdviceNo(e.target.value)}
            placeholder="Enter caution advice number"
            className={inputClasses}
          />
        </div>

        
      </div>

      

      {/* Required Fields Note */}
      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center space-x-1`}>
        <span className="text-red-500">*</span>
        <span>indicates required fields</span>
      </div>
    </div>
  );
};

export default GuidelineFormFields;