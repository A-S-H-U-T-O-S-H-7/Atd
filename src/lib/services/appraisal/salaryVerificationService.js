// lib/services/appraisal/salaryVerificationService.js
import api from "@/utils/axiosInstance";
import { toast } from 'react-hot-toast';

export const salaryVerificationService = {
  // ==================== API ENDPOINTS ====================
  
  saveSalaryRemark: (data) => 
    api.post('/crm/appraisal/salary/remarks', data),

  addHouseholdIncome: (data) => 
    api.post('/crm/appraisal/add/house-hold-income', data),

  saveSalaryVerification: (data) => 
    api.post('/crm/appraisal/salary/verification', data),

  

  // ==================== BUSINESS LOGIC METHODS ====================
  
  saveSalarySlipRemark: async (data) => {
  try {
    if (!data.application_id) {
      throw new Error('Application ID is required');
    }

    if (!data.remarks || data.remarks.trim().length === 0) {
      throw new Error('Remark cannot be empty');
    }

    // ✅ FIX: Use direct API call, not recursive call
    const response = await api.post('/crm/appraisal/salary/remarks', data);
    toast.success('Salary remark saved successfully!');
    return response;
  } catch (error) {
    console.error('Error saving salary remark:', error);
    salaryVerificationService.handleApiError(error, 'salary remark');
    throw error;
  }
},

saveHouseholdIncomes: async (applicationId, familyMembers) => {
    try {
      if (!applicationId) {
        throw new Error('Application ID is required');
      }

      const validMembers = familyMembers.filter(member => 
        member.unit && member.annualIncome && parseFloat(member.annualIncome) > 0
      );

      if (validMembers.length === 0) {
        toast.info('No valid household members to save');
        return { success: true, message: 'No members to save' };
      }

      const savePromises = validMembers.map(async (member) => {
        const householdData = {
          application_id: parseInt(applicationId),
          house_holder_family: member.unit,
          nature_of_work: member.natureOfWork || 'Self-employed',
          contact_no: member.contactNo || '',
          annual_income: parseFloat(member.annualIncome) || 0
        };

        return await api.post('/crm/appraisal/add/house-hold-income', householdData);
      });

      const results = await Promise.all(savePromises);
      toast.success(`Saved ${validMembers.length} household member(s) successfully!`);
      return { success: true, results };
      
    } catch (error) {
      console.error('Error saving household income:', error);
      salaryVerificationService.handleApiError(error, 'household income');
      throw error;
    }
  },

saveSalaryVerificationData: async (data) => {
    try {
      if (!data.application_id) {
        throw new Error('Application ID is required');
      }

      // Only require essential fields
      const requiredFields = ['organization_applied', 'salaryslip_final_report'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const response = await api.post('/crm/appraisal/salary/verification', data);
      toast.success('Salary verification saved successfully!');
      return response;
    } catch (error) {
      console.error('Error saving salary verification:', error);
      salaryVerificationService.handleApiError(error, 'salary verification');
      throw error;
    }
  },


  handleApiError: (error, context) => {
    console.error(`Error in ${context}:`, error);

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.errors?.[0]?.message;

      switch (status) {
        case 422:
          toast.error(message || `Invalid ${context} data. Please check all fields.`);
          break;
        case 400:
          toast.error(message || `Bad request - please check the ${context} data`);
          break;
        case 404:
          toast.error(`${context} service not available`);
          break;
        case 500:
          toast.error('Server error - please try again later');
          break;
        default:
          toast.error(message || `Failed to save ${context}`);
      }
    } else if (error.request) {
      toast.error('Network error - please check your connection');
    } else {
      toast.error(error.message || `Failed to save ${context}`);
    }
  }
};