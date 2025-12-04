import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TrendingUp, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { socialScoreVerificationService } from '@/lib/services/appraisal';
import { socialScoreVerificationSchema } from '@/lib/schema/socialScoreValidationSchemas';

const SocialScoreVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const [remarkSaving, setRemarkSaving] = useState(false);
  const [submittingSocial, setSubmittingSocial] = useState(false);
  const [localRemarkValue, setLocalRemarkValue] = useState(formik.values.socialScoreRemark || '');
  const [userManuallyChangedFinalReport, setUserManuallyChangedFinalReport] = useState(false);
  const timeoutRef = useRef(null);
  const formikUpdateTimeoutRef = useRef(null);

  const inputClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const textareaClassName = `w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-semibold mb-2 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const buttonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300"
  } disabled:cursor-not-allowed`;

  // Sync external changes to local state
  useEffect(() => {
    setLocalRemarkValue(formik.values.socialScoreRemark || '');
  }, [formik.values.socialScoreRemark]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (formikUpdateTimeoutRef.current) {
        clearTimeout(formikUpdateTimeoutRef.current);
      }
    };
  }, []);

  // Handle score status change
  const handleScoreStatusChange = (value) => {
    formik.setFieldValue('socialScoreRange', value);
    
    // Auto-set recommendation based on score status
    if (value === 'Positive') {
      formik.setFieldValue('socialScoreRecommendation', 'Recommended');
    } else if (value === 'Negative') {
      formik.setFieldValue('socialScoreRecommendation', 'Not Recommended');
    } else {
      // If cleared, also clear recommendation
      formik.setFieldValue('socialScoreRecommendation', '');
    }
  };

  // Handle final report change - track manual changes
  const handleFinalReportChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue('socialScoreFinalReport', value);
    setUserManuallyChangedFinalReport(true);
  };

  // Auto-update final report based on score, status, and recommendation - ONLY if user hasn't manually changed it
  useEffect(() => {
    // If user manually changed final report, don't auto-update
    if (userManuallyChangedFinalReport) {
      return;
    }

    const hasValidScore = 
      formik.values.socialScore && 
      formik.values.socialScore.toString().trim() !== '' &&
      !isNaN(parseInt(formik.values.socialScore));

    if (!hasValidScore) {
      // Clear final report if score is empty
      if (formik.values.socialScoreFinalReport) {
        formik.setFieldValue('socialScoreFinalReport', '');
      }
      return;
    }

    const isPositive = 
      formik.values.socialScoreRange === 'Positive' &&
      formik.values.socialScoreRecommendation === 'Recommended';

    const isNegative = 
      formik.values.socialScoreRange === 'Negative' ||
      formik.values.socialScoreRecommendation === 'Not Recommended';

    // Set final report
    if (isPositive && formik.values.socialScoreFinalReport !== 'Positive') {
      formik.setFieldValue('socialScoreFinalReport', 'Positive');
    } else if (isNegative && formik.values.socialScoreFinalReport !== 'Negative') {
      formik.setFieldValue('socialScoreFinalReport', 'Negative');
    }
  }, [formik.values, userManuallyChangedFinalReport]);

  // Reset manual change flag when all fields are cleared
  useEffect(() => {
    // Reset manual change if all fields are empty/not set
    const allFieldsEmpty = 
      !formik.values.socialScore &&
      !formik.values.socialScoreRange &&
      !formik.values.socialScoreRecommendation;
    
    if (allFieldsEmpty) {
      setUserManuallyChangedFinalReport(false);
    }
  }, [formik.values]);

  // Debounced save function for social remarks
  const debouncedSaveRemark = useCallback((value) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        if (!value || value.trim().length === 0 || !formik.values.applicationId) {
          return;
        }

        setRemarkSaving(true);
        
        await socialScoreVerificationService.saveSocialScoreRemark({
          application_id: parseInt(formik.values.applicationId),
          remarks: value.trim()
        });
      } catch (error) {
        // Error handled in service
      } finally {
        setRemarkSaving(false);
      }
    }, 3000);
  }, [formik.values.applicationId]);

  // Optimized remark change handler
  const handleRemarkChange = (value) => {
    setLocalRemarkValue(value);
    
    if (formikUpdateTimeoutRef.current) {
      clearTimeout(formikUpdateTimeoutRef.current);
    }
    formikUpdateTimeoutRef.current = setTimeout(() => {
      formik.setFieldValue('socialScoreRemark', value);
    }, 500);
    
    debouncedSaveRemark(value);
  };

  // Save social score verification
  const handleSaveSocialVerification = async () => {
    try {
      setSubmittingSocial(true);
      
      // Validate that social score is not empty
      if (!formik.values.socialScore || formik.values.socialScore.toString().trim() === '') {
        toast.error('Social score is required');
        return;
      }

      const socialData = socialScoreVerificationService.formatSocialScoreVerificationData(
        formik.values.applicationId,
        formik.values
      );
      
      try {
        await socialScoreVerificationSchema.validate(socialData, { abortEarly: false });
      } catch (validationError) {
        // Show first validation error
        const firstError = validationError.errors[0] || validationError.message;
        toast.error(firstError);
        return;
      }
      
      await socialScoreVerificationService.saveSocialScoreVerificationData(socialData);
      toast.success('Social score verification saved successfully!');
      
    } catch (error) {
      // API errors handled in service
    } finally {
      setSubmittingSocial(false);
    }
  };

  return (
    <div className={`rounded-xl mt-5 shadow-lg border transition-all duration-300 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-emerald-600/30 shadow-emerald-900/10 hover:shadow-emerald-900/20"
        : "bg-white border-emerald-200 shadow-emerald-500/5 hover:shadow-emerald-500/10"
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        isDark ? "border-gray-700 bg-gray-800/80" : "border-gray-100 bg-emerald-50/50"
      }`}>
        <div className="flex items-center space-x-2">
          <TrendingUp className={`w-5 h-5 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}>
            Social Score Verification
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Remarks at the top */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className={labelClassName}>Social Score Remarks</label>
            {remarkSaving && (
              <div className={`text-xs flex items-center space-x-1 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Saving...</span>
              </div>
            )}
          </div>
          <textarea
            rows="3"
            value={localRemarkValue}
            onChange={(e) => handleRemarkChange(e.target.value)}
            className={textareaClassName}
            placeholder="Enter social score verification remarks..."
          />
          <div className={`flex justify-between items-center mt-2 text-xs ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}>
            <span>{(localRemarkValue?.length || 0)} characters</span>
            <span>💾 Auto-saves after 2 seconds</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Score Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClassName}>Social Score (&gt;500)</label>
              <input 
                type="number" 
                value={formik.values.socialScore || ''} 
                onChange={e => {
                  formik.setFieldValue("socialScore", e.target.value);
                  // If score changes and is below 500, auto-set status to Negative
                  const score = parseInt(e.target.value);
                  if (score < 500 && formik.values.socialScoreRange !== 'Negative') {
                    formik.setFieldValue('socialScoreRange', 'Negative');
                    formik.setFieldValue('socialScoreRecommendation', 'Not Recommended');
                  } else if (score >= 500 && formik.values.socialScoreRange !== 'Positive') {
                    formik.setFieldValue('socialScoreRange', 'Positive');
                    formik.setFieldValue('socialScoreRecommendation', 'Recommended');
                  }
                }} 
                className={inputClassName} 
                placeholder="Enter score (e.g. 650)" 
                min="0"
                max="900"
              />
              <div className={`text-xs mt-1 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                Score should be above 500 for positive assessment
              </div>
              {formik.values.socialScore && parseInt(formik.values.socialScore) < 500 && (
                <div className="text-xs text-red-500 mt-1">
                  Score is below 500 - will auto-set to Negative
                </div>
              )}
            </div>
            <div>
              <label className={labelClassName}>Score Status</label>
              <select 
                value={formik.values.socialScoreRange || ''} 
                onChange={e => handleScoreStatusChange(e.target.value)} 
                className={selectClassName}
              >
                <option value="">Select Status</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
            <div>
              <label className={labelClassName}>Recommendation</label>
              <select 
                value={formik.values.socialScoreRecommendation || ''} 
                onChange={e => formik.setFieldValue("socialScoreRecommendation", e.target.value)} 
                className={selectClassName}
              >
                <option value="">Select Recommendation</option>
                <option value="Recommended">Recommended</option>
                <option value="Not Recommended">Not Recommended</option>
              </select>
            </div>
          </div>

          {/* Final Report and Submit Button */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex-1 max-w-xs">
              <label className={labelClassName}>Final Report</label>
              <select 
                value={formik.values.socialScoreFinalReport || ''} 
                onChange={handleFinalReportChange} 
                className={selectClassName}
              >
                <option value="">Select Final Report</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
            
            <button
              type="button"
              onClick={handleSaveSocialVerification}
              disabled={submittingSocial || saving || !formik.values.socialScore}
              className={buttonClassName}
            >
              {(submittingSocial || saving) ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{submittingSocial ? 'Saving Social...' : saving ? 'Submitting...' : 'Submit'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialScoreVerification;