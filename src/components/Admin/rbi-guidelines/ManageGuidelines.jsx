'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Edit } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import GuidelineFormFields from './GuidelineFormFields';
import { useAdminAuth } from "@/lib/AdminAuthContext";
import Swal from "sweetalert2";

const ManageGuidelinePage = () => {
  const { isDark } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const guidelineId = searchParams.get('id');
  const isEditMode = Boolean(guidelineId);

  const [guidelineDate, setGuidelineDate] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [subject, setSubject] = useState('');
  const [cautionAdviceNo, setCautionAdviceNo] = useState('');
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('Pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load guideline data for editing
  useEffect(() => {
    if (isEditMode) {
      loadGuidelineData();
    }
  }, [isEditMode, guidelineId]);

  const loadGuidelineData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call to fetch guideline data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API call
      const mockData = {
        guidelineDate: '2023-02-16',
        referenceNo: 'Dos.CO.FMG. No. S339/23.08.003/2022-23',
        subject: 'Fraudulent letters/emails conveying imposition of monetary penalties purported to be issued by RBI',
        cautionAdviceNo: '4149',
        remarks: 'Implementation in progress',
        status: 'Pending'
      };
      
      setGuidelineDate(mockData.guidelineDate);
      setReferenceNo(mockData.referenceNo);
      setSubject(mockData.subject);
      setCautionAdviceNo(mockData.cautionAdviceNo);
      setRemarks(mockData.remarks);
      setStatus(mockData.status);
      
    } catch (error) {
      console.error('Error loading guideline data:', error);
      await Swal.fire({
        title: "Error!",
        text: "Failed to load guideline data. Please try again.",
        icon: "error",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!guidelineDate || !subject) {
      await Swal.fire({
        title: "Validation Error!",
        text: "Please fill in all required fields (Guideline Date and Subject).",
        icon: "warning",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        guidelineDate,
        referenceNo,
        subject,
        cautionAdviceNo,
        remarks,
        status,
        addedBy: 'ADMIN USER', // This should come from user context
        lastModify: new Date().toISOString(),
        ...(isEditMode && { id: guidelineId })
      };
      
      console.log(isEditMode ? 'Updating Guideline:' : 'Adding Guideline:', payload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success message
      await Swal.fire({
        title: "Success!",
        text: `Guideline ${isEditMode ? 'updated' : 'added'} successfully!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000"
      });
      
      // Navigate back to guidelines list
      router.push('crm/rbi-guidelines');
      
    } catch (error) {
      console.error('Error saving guideline:', error);
      await Swal.fire({
        title: "Error!",
        text: `Failed to ${isEditMode ? 'update' : 'add'} guideline. Please try again.`,
        icon: "error",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back()
  };

  if (isLoading) {
    return (
      <div className={`h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4" />
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading guideline data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header - Fixed height */}
      <div className="flex-shrink-0 p-3 md:px-6 lg:px-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBack}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "hover:bg-gray-800 bg-gray-800/50 border border-emerald-600/30"
                  : "hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200"
              }`}
            >
              <ArrowLeft
                className={`w-4 h-4 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
            </button>
            <h1
              className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${
                isDark
                  ? "from-emerald-400 to-teal-400"
                  : "from-gray-800 to-black"
              } bg-clip-text text-transparent`}
            >
              {isEditMode ? 'Edit Guideline' : 'Add Guideline'}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content - Flexible height */}
      <div className="flex-1 p-3 md:px-6 lg:px-12 pb-4 overflow-hidden">
        <div
          className={`h-full rounded-xl shadow-xl border flex flex-col ${
            isDark
              ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
              : "bg-white border-emerald-300 shadow-emerald-500/10"
          }`}
        >
          {/* Form Header - Fixed height */}
          <div
            className={`flex-shrink-0 px-4 py-3 border-b ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-900 border-emerald-600/50"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300"
            }`}
          >
            <h2
              className={`text-base font-bold ${
                isDark ? "text-gray-100" : "text-gray-700"
              }`}
            >
              {isEditMode ? 'Edit Guideline Details' : 'Guideline Details'}
            </h2>
            <p
              className={`text-xs mt-1 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {isEditMode 
                ? 'Update the guideline information below' 
                : 'Fill in the details to register a new RBI guideline'
              }
            </p>
          </div>

          {/* Form Content - Scrollable if needed */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="space-y-4">
                {/* Form Fields */}
                <GuidelineFormFields
                  isDark={isDark}
                  guidelineDate={guidelineDate}
                  setGuidelineDate={setGuidelineDate}
                  referenceNo={referenceNo}
                  setReferenceNo={setReferenceNo}
                  subject={subject}
                  setSubject={setSubject}
                  cautionAdviceNo={cautionAdviceNo}
                  setCautionAdviceNo={setCautionAdviceNo}
                  remarks={remarks}
                  setRemarks={setRemarks}
                  status={status}
                  setStatus={setStatus}
                  isEditMode={isEditMode}
                />
              </div>
            </div>
          </div>

          {/* Submit Button - Fixed at bottom */}
          <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg text-white text-sm font-bold transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:outline-none flex items-center space-x-2 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : isDark
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-500/50 shadow-lg shadow-emerald-500/25"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-500/50 shadow-lg shadow-emerald-500/25"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isEditMode ? 'Updating...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    {isEditMode ? <Edit className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    <span>{isEditMode ? 'Update Guideline' : 'Submit Guideline'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGuidelinePage;