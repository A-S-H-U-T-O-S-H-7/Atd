import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FileText, ExternalLink, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { salaryVerificationService } from '@/lib/services/appraisal/salaryVerificationService';
import { appraisalCoreService } from '@/lib/services/appraisal';

const SalarySlipVerification = ({ formik, isDark }) => {
  const [remarkSaving, setRemarkSaving] = useState(false);
  const [localRemarkValue, setLocalRemarkValue] = useState(formik.values.salarySlipRemark || '');
  const [salarySlipData, setSalarySlipData] = useState(null);
  const [loadingSalarySlips, setLoadingSalarySlips] = useState(false);
  const [loadingFile, setLoadingFile] = useState(null);
  const timeoutRef = useRef(null);
  
  const textareaClassName = `w-full px-4 py-3 rounded-lg border transition-all duration-200 text-base resize-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-emerald-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
  } focus:ring-2 focus:ring-emerald-500/30 focus:outline-none`;

  // Load salary slip data from API
  useEffect(() => {
    const loadSalarySlipData = async () => {
      if (!formik.values.applicationId) return;
      
      try {
        setLoadingSalarySlips(true);
        const response = await appraisalCoreService.getAppraisalReport(formik.values.applicationId);
        const applicationData = response?.data?.application || response?.application || response?.data;
        
        if (applicationData) {
          setSalarySlipData({
            firstSlip: applicationData.salary_slip || '',
            secondSlip: applicationData.second_salary_slip || '',
            thirdSlip: applicationData.third_salary_slip || ''
          });
        }
      } catch (error) {
        toast.error('Failed to load salary slip information');
        setSalarySlipData(null);
      } finally {
        setLoadingSalarySlips(false);
      }
    };
    
    loadSalarySlipData();
  }, [formik.values.applicationId]);

  // Function to open salary slip files
  const handleFileClick = async (fileName, slipType) => {
    if (!fileName) {
      toast.error(`No ${slipType} salary slip available`);
      return;
    }
    
    try {
      setLoadingFile(fileName);
      
      const folderMappings = {
        'first': 'first_salaryslip',
        'second': 'second_salaryslip', 
        'third': 'third_salaryslip',
      };
      
      const folder = folderMappings[slipType];
      const filePath = `${folder}/${fileName}`;
      const fileRef = ref(storage, filePath);
      const url = await getDownloadURL(fileRef);
      
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        toast.error('Popup blocked! Please allow popups for this site.');
      }
      
    } catch (error) {
      toast.error(`Failed to load file: ${fileName}`);
    } finally {
      setLoadingFile(null);
    }
  };

  // Sync external changes to local state
  useEffect(() => {
    setLocalRemarkValue(formik.values.salarySlipRemark || '');
  }, [formik.values.salarySlipRemark]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Debounced save function for salary remarks
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
      
      await salaryVerificationService.saveSalarySlipRemark({
        application_id: parseInt(formik.values.applicationId),
        remarks: value.trim()
      });
      // toast is handled in service
    } catch (error) {
      // Error handled in service
    } finally {
      setRemarkSaving(false);
    }
  }, 2000);
}, [formik.values.applicationId])

  const handleRemarkChange = (value) => {
    setLocalRemarkValue(value);
    formik.setFieldValue('salarySlipRemark', value);
    debouncedSaveRemark(value);
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Heading */}
      <div className="text-center">
        <h2 className={`text-2xl font-bold ${
          isDark ? "text-emerald-400" : "text-emerald-600"
        }`}>
          Salary Verification
        </h2>
      </div>

      {/* Main Content - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Salary Slips - Left - Enhanced */}
        <div className={`rounded-lg border transition-all duration-200 shadow-sm ${
          isDark
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}>
          <div className={`p-3 border-b text-base font-semibold ${
            isDark ? "border-gray-700 bg-gray-800/50 text-gray-100" : "border-gray-100 bg-gray-50 text-gray-800"
          }`}>
            Salary Slips
          </div>

          <div className="p-4">
            {loadingSalarySlips ? (
              <div className={`flex items-center justify-center py-2 text-base ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                <Loader className="w-5 h-5 animate-spin mr-2" />
                Loading salary slips...
              </div>
            ) : salarySlipData ? (
              <div className="space-y-3">
                {[
                  { key: 'firstSlip', label: '1st Salary Slip', type: 'first', fileName: salarySlipData.firstSlip },
                  { key: 'secondSlip', label: '2nd Salary Slip', type: 'second', fileName: salarySlipData.secondSlip },
                  { key: 'thirdSlip', label: '3rd Salary Slip', type: 'third', fileName: salarySlipData.thirdSlip }
                ].map((slip) => {
                  const isLoading = loadingFile === slip.fileName;
                  const isAvailable = slip.fileName && !isLoading;
                  
                  return (
                    <button
                      key={slip.key}
                      type="button"
                      onClick={() => handleFileClick(slip.fileName, slip.type)}
                      disabled={!slip.fileName || isLoading}
                      className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all duration-200 text-base font-medium ${
                        !slip.fileName || isLoading
                          ? isDark
                            ? "bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed"
                          : isDark 
                            ? "bg-gray-700/50 border-gray-600 hover:border-emerald-500 hover:bg-gray-700 text-gray-100 cursor-pointer hover:shadow-md" 
                            : "bg-white border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30 text-gray-800 cursor-pointer hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {isLoading ? (
                          <Loader className="w-5 h-5 animate-spin text-blue-500" />
                        ) : (
                          <FileText className={`w-5 h-5 ${
                            !slip.fileName
                              ? isDark ? "text-gray-600" : "text-gray-400"
                              : isDark ? "text-emerald-400" : "text-emerald-600"
                          }`} />
                        )}
                        <span className={`${!slip.fileName ? 'opacity-60' : ''}`}>
                          {slip.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!slip.fileName && !isLoading && (
                          <span className={`text-sm font-semibold px-2 py-0.5 rounded ${
                            isDark ? "text-red-400 bg-red-400/10" : "text-red-600 bg-red-50"
                          }`}>
                            NA
                          </span>
                        )}
                        {isAvailable && (
                          <ExternalLink className={`w-4 h-4 ${
                            isDark ? "text-blue-400" : "text-blue-600"
                          }`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className={`text-center py-6 text-base ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                No salary slips available
              </div>
            )}
          </div>
        </div>

        {/* Remarks - Right - Enhanced */}
        <div className={`rounded-lg border transition-all duration-200 shadow-sm ${
          isDark
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}>
          <div className={`p-2 border-b text-base font-semibold ${
            isDark ? "border-gray-700 bg-gray-800/50 text-gray-100" : "border-gray-100 bg-gray-50 text-gray-800"
          }`}>
            <div className="flex items-center justify-between">
              <span>Verification Remarks</span>
              {remarkSaving && (
                <div className="flex items-center space-x-1.5 text-sm text-emerald-500">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>Saving...</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4">
            <textarea
              rows={4}
              value={localRemarkValue}
              onChange={(e) => handleRemarkChange(e.target.value)}
              className={textareaClassName}
              placeholder="Enter salary verification remarks..."
            />
            <div className={`flex justify-between items-center mt-2 text-sm ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              <span className="font-medium">{localRemarkValue?.length || 0} characters</span>
              <span className={`flex items-center space-x-1 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}>
                <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                <span>Auto-saves</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default SalarySlipVerification;