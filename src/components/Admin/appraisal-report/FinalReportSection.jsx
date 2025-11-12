"use client"
import React, { useState, useEffect } from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';

const FinalReportSection = ({ formik, onSubmit, onReject, isDark, submitting, saving, applicationId }) => {
  const [autoRecommendation, setAutoRecommendation] = useState(null);

  // Calculate automatic recommendation based on 6 section final reports
  useEffect(() => {
    const calculateAutoRecommendation = () => {
      const {
        personal_final_report,
        organizationFinalReport,
        bankVerificationFinalReport,
        cibilFinalReport,
        socialScoreFinalReport,
        incomeVerificationFinalReport,
        finalReport
      } = formik.values;

      const sections = [
        { name: 'Personal', value: personal_final_report },
        { name: 'Income', value: incomeVerificationFinalReport },
        { name: 'Organization', value: organizationFinalReport },
        { name: 'Bank', value: bankVerificationFinalReport },
        { name: 'Social', value: socialScoreFinalReport },
        { name: 'CIBIL', value: cibilFinalReport }
      ];

      const sectionStatus = sections.map(section => {
        const value = section.value?.toLowerCase() || '';
        const isPositive = value.includes('positive');
        const isNegative = value.includes('negative');
        return {
          name: section.name,
          isPositive,
          isNegative,
          isEmpty: !section.value
        };
      });

      const allPositive = sectionStatus.every(s => s.isPositive);
      const anyNegative = sectionStatus.some(s => s.isNegative);
      const allFilled = sectionStatus.every(s => !s.isEmpty);

      let recommendation = null;
      
      if (allFilled) {
        if (allPositive) {
          recommendation = 'Recommended';
        } else if (anyNegative) {
          recommendation = 'Not Recommended';
        }
      }

      setAutoRecommendation(recommendation);
      
      if (recommendation) {
        if (!finalReport) {
          formik.setFieldValue('finalReport', recommendation);
        }
        else if (finalReport === 'Recommended' || finalReport === 'Not Recommended') {
          if (finalReport !== recommendation) {
            formik.setFieldValue('finalReport', recommendation);
          }
        }
      }
    };

    calculateAutoRecommendation();
  }, [
    formik.values.personal_final_report,
    formik.values.organizationFinalReport,
    formik.values.bankVerificationFinalReport,
    formik.values.cibilFinalReport,
    formik.values.socialScoreFinalReport,
    formik.values.incomeVerificationFinalReport,
    formik.values.finalReport,
    formik
  ]);

  const handleRejectClick = () => {
    Swal.fire({
      title: 'Reject Application?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Reject Application',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return onReject(formik.values);
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Rejected!',
          'Application has been rejected successfully.',
          'success'
        );
      }
    });
  };

  const getRecommendationColor = (status) => {
    switch (status) {
      case 'Recommended':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Not Recommended':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className={`rounded-2xl border transition-all duration-300 bg-gradient-to-r ${
      isDark 
        ? "from-cyan-700 to-cyan-500 border-emerald-600/30" 
        : "from-cyan-500 to-cyan-300 border-blue-200 shadow-lg"
    }`}>
      <div className="p-6">
        {/* Compact Layout - Single Row */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Final Recommendation Dropdown */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col  gap-3">
              <label className={`text-sm font-medium whitespace-nowrap ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Final Recommendation
              </label>
              
              <select
                name="finalReport"
                value={formik.values.finalReport || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`flex-1 max-w-[400px] px-4 py-2.5 rounded-xl border transition-colors duration-200 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    : "bg-white border-blue-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                } ${formik.errors.finalReport && formik.touched.finalReport ? 'border-red-500' : ''}`}
              >
                <option value="">Select Recommendation</option>
                <option value="Recommended">✅ Recommended</option>
                <option value="Not Recommended">❌ Not Recommended</option>
              </select>

              
            </div>
            
            {formik.errors.finalReport && formik.touched.finalReport && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.finalReport}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onSubmit(formik.values)}
              disabled={submitting || saving || !formik.values.finalReport}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none"
            >
              <Check className="w-4 h-4 mr-2" />
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
            
            <button
              type="button"
              onClick={handleRejectClick}
              disabled={submitting || saving}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </button>
          </div>
        </div>

        {/* Warning for incomplete selection */}
        {!formik.values.finalReport && (
          <div className={`mt-3 p-3 rounded-xl border ${
            isDark ? "bg-yellow-900/20 border-yellow-700" : "bg-yellow-50 border-yellow-200"
          }`}>
            <div className="flex items-center justify-center">
              <AlertTriangle className={`w-4 h-4 mr-2 ${
                isDark ? "text-yellow-400" : "text-yellow-600"
              }`} />
              <span className={`text-sm ${
                isDark ? "text-yellow-300" : "text-yellow-700"
              }`}>
                Please select a final recommendation before submitting.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalReportSection;