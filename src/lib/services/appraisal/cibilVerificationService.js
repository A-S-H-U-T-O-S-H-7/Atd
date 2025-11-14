// lib/services/appraisal/cibilVerificationService.js
import api from "@/utils/axiosInstance";
import { toast } from 'react-hot-toast';


class CibilVerificationService {
  // ==================== API ENDPOINTS ====================
  
  saveCibilRemarks = (data) => 
    api.post("/crm/appraisal/cibil/remarks", data);

  saveCibilVerification = (data) => 
    api.post("/crm/appraisal/cibil/verification", data);

  // ==================== BUSINESS LOGIC METHODS ====================
  
  /**
   * Save CIBIL remark with validation
   */
  saveCibilRemark = async (data) => {
    try {
      // Validate remark data
      await cibilRemarkSchema.validate(data);
      
      if (!data.application_id) {
        throw new Error('Application ID is required');
      }

      const response = await this.saveCibilRemarks(data);
      // Toast shown in component layer to avoid duplicates
      return response;
    } catch (error) {
      this.handleApiError(error, 'CIBIL remark');
      throw error;
    }
  };

  /**
 * Save complete CIBIL verification with validation
 */
saveCibilVerificationData = async (data) => {
  if (!data.application_id) {
    toast.error('Application ID is required');
    return Promise.resolve();
  }

  try {
    // Auto-assess final report based on score and other factors
    const assessedData = this.assessCibilFinalReport(data);
    
    const response = await this.saveCibilVerification(assessedData);
    // Toast shown in component layer to avoid duplicates
    return response;
    
  } catch (error) {
    // Handle API errors only
    if (error.response) {
      const message = error.response.data?.message || 'Failed to save CIBIL verification';
      toast.error(message);
    } else if (error.request) {
      toast.error('Network error - please check your connection');
    } else {
      toast.error('Failed to save CIBIL verification');
    }
    
    return Promise.resolve();
  }
};
  /**
   * Auto-assess final report based on CIBIL data
   */
  assessCibilFinalReport = (data) => {
    const score = parseInt(data.cibil_score) || 0;
    const isScoreGood = score >= 600;
    const isScoreStatusPositive = data.score_status === 'Positive';
    const isDPDGood = data.dpd === 'Nil' || data.dpd_status === 'Positive';
    const hasLowWriteOffs = parseInt(data.write_off_settled || 0) <= 0;
    
    let finalReport = data.cibil_final_report;
    
    // Auto-set to Positive if main conditions are good
    if (isScoreGood && isScoreStatusPositive && !finalReport) {
      finalReport = 'Positive';
    }
    // Auto-set to Negative if score is really bad
    else if (score > 0 && score < 500 && data.score_status === 'Negative' && !finalReport) {
      finalReport = 'Negative';
    }
    
    return {
      ...data,
      cibil_final_report: finalReport || data.cibil_final_report
    };
  };

  /**
   * Format CIBIL verification data for API
   */
  formatCibilVerificationData = (applicationId, formValues) => {
    return {
      application_id: parseInt(applicationId),
      cibil_score: parseInt(formValues.cibilScore) || 0,
      score_status: formValues.cibilScoreStatus || '',
      total_active_amount: parseInt(formValues.totalActiveLoans) || 0,
      total_active_amount_status: formValues.activeLoanStatus || '',
      total_closed_amount: parseInt(formValues.totalClosedLoans) || 0,
      total_closed_amount_status: formValues.closedLoanStatus || '',
      write_off_settled: parseInt(formValues.writeOffSettled) || 0,
      write_off_settled_status: formValues.writeOffStatus || '',
      overdue: parseInt(formValues.noOfOverdue) || 0,
      overdue_status: formValues.overdueStatus || '',
      total_emi_cibil: parseInt(formValues.totalEmiAsCibil) || 0,
      comment: formValues.cibilComment || '',
      dpd: formValues.dpd || '',
      dpd_status: formValues.dpdStatus || '',
      cibil_final_report: formValues.cibilFinalReport || ''
    };
  };

  /**
   * Extract customer data for CIBIL verification
   */
  extractCustomerData = (formValues) => {
    return {
      fname: formValues.name?.split(' ')[0] || '',
      lname: formValues.name?.split(' ').slice(1).join(' ') || '',
      phone: formValues.phoneNo || '',
      email: formValues.email || '',
      crnno: formValues.crnNo || '',
      applied_amount: formValues.appliedAmount || '',
      pan_no: formValues.panNo || '',
      aadhar_no: formValues.aadharNo || '',
      dob: formValues.dob || '',
      organization_name: formValues.organizationName || ''
    };
  };

  /**
   * Get CIBIL score assessment
   */
  getCibilScoreAssessment = (score) => {
    if (score >= 750) return { level: 'Excellent', color: 'green' };
    if (score >= 700) return { level: 'Good', color: 'blue' };
    if (score >= 650) return { level: 'Fair', color: 'yellow' };
    if (score >= 600) return { level: 'Poor', color: 'orange' };
    return { level: 'Very Poor', color: 'red' };
  };

  /**
   * Handle API errors consistently
   */
  // handleApiError = (error, context) => {
  //   console.error(`Error in ${context}:`, error);

  //   if (error.name === 'ValidationError') {
  //     toast.error(error.message);
  //     return;
  //   }

  //   if (error.response) {
  //     const status = error.response.status;
  //     const message = error.response.data?.message || error.response.data?.errors?.[0]?.message;

  //     switch (status) {
  //       case 422:
  //         toast.error(message || `Invalid ${context} data. Please check all fields.`);
  //         break;
  //       case 400:
  //         toast.error(message || `Bad request - please check the ${context} data`);
  //         break;
  //       case 404:
  //         toast.error(`${context} service not available`);
  //         break;
  //       case 500:
  //         toast.error('Server error - please try again later');
  //         break;
  //       default:
  //         toast.error(message || `Failed to save ${context}`);
  //     }
  //   } else if (error.request) {
  //     toast.error('Network error - please check your connection');
  //   } else {
  //     toast.error(error.message || `Failed to save ${context}`);
  //   }
  // };
}

// Create and export singleton instance
export const cibilVerificationService = new CibilVerificationService();