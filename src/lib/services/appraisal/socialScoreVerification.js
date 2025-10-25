// lib/services/appraisal/socialScoreVerificationService.js
import api from "@/utils/axiosInstance";
import { toast } from 'react-hot-toast';
import { socialScoreRemarkSchema,socialScoreVerificationSchema,
  socialScoreAssessmentSchema  } from "@/lib/schema/socialScoreValidationSchemas";

class SocialScoreVerificationService {
  // ==================== API ENDPOINTS ====================
  
  saveSocialRemarks = (data) => 
    api.post("/crm/appraisal/social/remarks", data);

  saveSocialVerification = (data) => 
    api.post("/crm/appraisal/social/verification", data);

  // ==================== BUSINESS LOGIC METHODS ====================
  
  /**
   * Save social score remark with validation
   */
  saveSocialScoreRemark = async (data) => {
    try {
      // Validate remark data
      await socialScoreRemarkSchema.validate(data);
      
      if (!data.application_id) {
        throw new Error('Application ID is required');
      }

      const response = await this.saveSocialRemarks(data);
      toast.success('Social score remark saved successfully!');
      return response;
    } catch (error) {
      this.handleApiError(error, 'social score remark');
      throw error;
    }
  };

  /**
   * Save complete social score verification with validation
   */
 saveSocialScoreVerificationData = async (data) => {
  try {
   
    if (!data.application_id) {
      toast.error('Application ID is required');
      return Promise.resolve();
    }

    // Auto-assess final report based on score data
    const assessedData = this.assessSocialScoreFinalReport(data);
    
    const response = await this.saveSocialVerification(assessedData);
    
    toast.success('Social verification completed successfully!');
    return response;
  } catch (error) {
    
    // Handle only API/network errors
    if (error.response) {
      const message = error.response.data?.message || 'Failed to save social verification';
      toast.error(message);
    } else if (error.request) {
      toast.error('Network error - please check your connection');
    } else {
      toast.error('Failed to save social verification');
    }
    
    return Promise.resolve();
  }
};

  /**
   * Auto-assess final report based on social score data
   */
  assessSocialScoreFinalReport = (data) => {
    const score = parseInt(data.social_score) || 0;
    const isScoreGood = score > 500;
    const isStatusPositive = data.social_score_status === 'Positive';
    const isRecommended = data.social_score_suggestion === 'Recommended';
    
    let finalReport = data.socialscore_final_report;
    
    // Auto-set to Positive if all conditions are met
    if (isScoreGood && isStatusPositive && isRecommended && !finalReport) {
      finalReport = 'Positive';
    }
    
    return {
      ...data,
      socialscore_final_report: finalReport || data.socialscore_final_report
    };
  };

  /**
   * Format social score verification data for API
   */
  formatSocialScoreVerificationData = (applicationId, formValues) => {
    return {
      application_id: parseInt(applicationId),
      social_score: parseInt(formValues.socialScore) || 0,
      social_score_status: formValues.socialScoreRange || '',
      social_score_suggestion: formValues.socialScoreRecommendation || '',
      socialscore_final_report: formValues.socialScoreFinalReport || ''
    };
  };

  /**
   * Get social score assessment
   */
  getSocialScoreAssessment = (score) => {
    if (score >= 750) return { level: 'Excellent', color: 'green' };
    if (score >= 650) return { level: 'Good', color: 'blue' };
    if (score >= 550) return { level: 'Fair', color: 'yellow' };
    if (score >= 500) return { level: 'Poor', color: 'orange' };
    return { level: 'Very Poor', color: 'red' };
  };

  /**
   * Validate score input
   */
  validateScore = (score) => {
    const numScore = parseInt(score);
    if (isNaN(numScore)) {
      throw new Error('Score must be a number');
    }
    if (numScore < 300 || numScore > 900) {
      throw new Error('Score must be between 300-900');
    }
    return true;
  };

  /**
   * Handle API errors consistently
   */
  handleApiError = (error, context) => {
    if (error.name === 'ValidationError') {
      toast.error(error.message);
      return;
    }

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
  };
}

// Create and export singleton instance
export const socialScoreVerificationService = new SocialScoreVerificationService();