// components/appraisal/PersonalVerification.js
import React, { useState } from 'react';
import { UserCheck, Save, User, MapPin, Home, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import personalVerificationService from '@/lib/services/appraisal/personalVerificationService';

const PersonalVerification = ({ formik, onSectionSave, isDark, saving }) => {
  const [submittingPersonal, setSubmittingPersonal] = useState(false);

  // Consistent styling with other components
  const fieldClassName = `p-3 rounded-lg border transition-all duration-200 ${
    isDark
      ? "bg-gray-800/60 border-gray-600 hover:border-emerald-500/40 shadow-lg"
      : "bg-emerald-50/80 border-emerald-200 hover:border-emerald-300 shadow-sm"
  }`;

  const labelClassName = `text-sm font-semibold mb-1 flex items-center space-x-2 ${
    isDark ? "text-gray-300" : "text-emerald-700"
  }`;

  const inputClassName = `w-full bg-transparent border-none outline-none text-sm font-medium ${
    isDark ? "text-white placeholder-gray-400" : "text-gray-800 placeholder-gray-500"
  }`;

  const buttonClassName = `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm ${
    isDark
      ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-700 shadow-lg shadow-emerald-900/20"
      : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300 shadow-lg shadow-emerald-500/20"
  } disabled:cursor-not-allowed hover:scale-105`;

  const IconWrapper = ({ icon: Icon, className = "" }) => (
    <Icon className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"} ${className}`} />
  );

  const handleSavePersonalInfo = async () => {
    try {
      setSubmittingPersonal(true);
      
      if (!formik.values.userId || !formik.values.addressId) {
        toast.error('User ID and Address ID are required. Please refresh the page.');
        return;
      }
      
      const personalData = {
        user_id: formik.values.userId,
        address_id: formik.values.addressId,
        father_name: formik.values.fatherName,
        current_address: formik.values.currentAddress,
        permanent_address: formik.values.permanentAddress
      };

      await personalVerificationService.savePersonalInfo(personalData);
      
      // Don't call onSectionSave - it would trigger duplicate save
      // Component handles save directly
    } catch (error) {
      // Error handling is done in the service
    } finally {
      setSubmittingPersonal(false);
    }
  };

  return (
    <div className={`rounded-xl border-2 transition-all duration-300 overflow-hidden ${
      isDark
        ? "bg-gradient-to-br from-gray-800 to-gray-900 border-emerald-500/20 shadow-2xl shadow-emerald-900/10"
        : "bg-gradient-to-br from-gray-100 border-emerald-200 shadow-lg shadow-emerald-500/10"
    }`}>
      {/* Enhanced Header */}
      <div className={`p-4 border-b ${
        isDark 
          ? "border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900" 
          : "border-emerald-200 bg-gradient-to-r from-emerald-100 to-teal-100"
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isDark ? "bg-emerald-500/20" : "bg-emerald-500/10"
          }`}>
            <UserCheck className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${
              isDark ? "text-emerald-400" : "text-emerald-700"
            }`}>
              Personal Verification
            </h3>
            <p className={`text-xs ${
              isDark ? "text-gray-400" : "text-emerald-600"
            }`}>
              Father details and address information
            </p>
          </div>
        </div>
      </div>

      {/* Compact Content Grid */}
      <div className="p-4">
        <div>
          {/* Father Name */}
          <div className={`${fieldClassName} group hover:scale-[1.02]`}>
            <div className={labelClassName}>
              <IconWrapper icon={User} />
              <span>Father's Name</span>
            </div>
            <input
              type="text"
              value={formik.values.fatherName}
              onChange={(e) => formik.setFieldValue('fatherName', e.target.value)}
              className={inputClassName}
              placeholder="Enter father's name"
            />
          </div>
        </div>

        {/* Additional Information Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {/* Current Address Details */}
          <div className={`${fieldClassName} group hover:scale-[1.02]`}>
            <div className={labelClassName}>
              <IconWrapper icon={MapPin} />
              <span>Current Address Details</span>
            </div>
            <textarea
              rows="3"
              value={formik.values.currentAddress || ''}
              onChange={(e) => formik.setFieldValue('currentAddress', e.target.value)}
              className={`w-full bg-transparent border-none outline-none text-sm font-medium resize-none ${
                isDark ? "text-white placeholder-gray-400" : "text-gray-800 placeholder-gray-500"
              }`}
              placeholder="Enter current address details..."
            />
          </div>

          {/* Permanent Address Details */}
          <div className={`${fieldClassName} group hover:scale-[1.02]`}>
            <div className={labelClassName}>
              <IconWrapper icon={Home} />
              <span>Permanent Address Details</span>
            </div>
            <textarea
              rows="3"
              value={formik.values.permanentAddress || ''}
              onChange={(e) => formik.setFieldValue('permanentAddress', e.target.value)}
              className={`w-full bg-transparent border-none outline-none text-sm font-medium resize-none ${
                isDark ? "text-white placeholder-gray-400" : "text-gray-800 placeholder-gray-500"
              }`}
              placeholder="Enter permanent address details..."
            />
          </div>
        </div>

        {/* Submit Button at Bottom Right */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSavePersonalInfo}
            disabled={submittingPersonal || saving}
            className={buttonClassName}
          >
            {(submittingPersonal || saving) ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>
              {submittingPersonal 
                ? 'Submitting Personal Info...' 
                : saving 
                ? 'Submitting...' 
                : 'Submit'
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalVerification;