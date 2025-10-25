import api from "@/utils/axiosInstance";
import { toast } from 'react-hot-toast';

class OrganizationVerificationService {
  // ==================== API ENDPOINTS ====================
  
  saveOrganizationRemarks = (data) => 
    api.post("/crm/appraisal/organisation/remarks", data);

  saveOrganizationVerification = (data) => 
    api.post("/crm/appraisal/organisation/verification", data);

  // ==================== BUSINESS LOGIC METHODS ====================
  
  /**
   * Format website URL to ensure it has proper protocol
   */
  formatWebsiteUrl = (url) => {
    if (!url || url === 'N/A') return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  /**
   * Handle sending mail to HR
   */
  handleSendMailToHR = async (hrEmail, organizationName) => {
    if (!hrEmail || hrEmail === 'N/A') {
      throw new Error('HR email is not available');
    }
    
    const subject = `Verification Request - ${organizationName || 'Organization'}`;
    const body = `Dear HR Team,\n\nWe are conducting verification for one of your employees. Please provide the necessary details.\n\nThank you.\n\nBest regards,\nVerification Team`;
    
    return `mailto:${hrEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  /**
   * Save organization remark
   */
  saveOrganizationRemark = async (data) => {
    try {
      if (!data.application_id) {
        toast.error('Application ID is required');
        return Promise.resolve();
      }

      const response = await this.saveOrganizationRemarks(data);
      toast.success('Organization remark saved successfully!');
      return response;
    } catch (error) {
      if (error.response?.status === 422) {
        const message = error.response.data?.message || 'Validation failed - please check your data';
        toast.error(message);
      } else if (error.response) {
        const message = error.response.data?.message || 'Failed to save organization remark';
        toast.error(message);
      } else {
        toast.error('Failed to save organization remark');
      }
      
      return Promise.resolve();
    }
  };

  /**
   * Save complete organization verification
   */
  saveOrganizationVerificationData = async (data) => {
    try {
      if (!data.application_id) {
        toast.error('Application ID is required');
        return Promise.resolve();
      }

      // Auto-assess final report based on verification status
      const assessedData = this.assessOrganizationFinalReport(data);
      
      const response = await this.saveOrganizationVerification(assessedData);
      toast.success('Organization verification completed successfully!');
      return response;
    } catch (error) {
      
      if (error.response?.status === 422) {
        const message = error.response.data?.message || 'Validation failed - please check all required fields';
        toast.error(message);
      } else if (error.response) {
        const message = error.response.data?.message || 'Failed to save organization verification';
        toast.error(message);
      } else if (error.request) {
        toast.error('Network error - please check your connection');
      } else {
        toast.error('Failed to save organization verification');
      }
      
      return Promise.resolve();
    }
  };

  /**
   * Auto-assess final report based on verification data
   */
  assessOrganizationFinalReport = (data) => {
    const allVerifiedYes = [
      data.online_verification,
      data.company_phone,
      data.company_mobile,
      data.hr_mail
    ].every(status => status === 'Yes');
    
    const allStatusPositive = [
      data.online_verification_status,
      data.company_phone_status,
      data.company_mobile_status,
      data.hr_mail_status
    ].every(status => status === 'Positive');

    let finalReport = data.organization_final_report;
    
    if (allVerifiedYes && allStatusPositive && !finalReport) {
      finalReport = 'Positive';
    }
    
    return {
      ...data,
      organization_final_report: finalReport || data.organization_final_report
    };
  };

  /**
   * Format organization verification data for API
   */
  formatOrganizationVerificationData = (applicationId, formValues) => {
    return {
      application_id: parseInt(applicationId),
      online_verification: formValues.organizationVerificationStatus || '',
      online_verification_status: formValues.organizationVerificationMethod || '',
      company_phone: formValues.companyPhoneVerificationStatus || '',
      company_phone_status: formValues.companyPhoneVerificationMethod || '',
      company_mobile: formValues.hrPhoneVerificationStatus || '',
      company_mobile_status: formValues.hrPhoneVerificationMethod || '',
      contact_status: formValues.hrContactVerificationStatus || '',
      hr_mail: formValues.hrEmailVerificationStatus || '',
      hr_mail_status: formValues.hrEmailVerificationMethod || '',
      organization_final_report: formValues.organizationFinalReport || '',
      website_status: formValues.companyWebsiteStatus || '',
    };
  };
}

// Create and export singleton instance
export const organizationVerificationService = new OrganizationVerificationService();