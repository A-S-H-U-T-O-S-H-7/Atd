import api from "@/utils/axiosInstance";
import { toast } from 'react-hot-toast';

class BankVerificationService {
  // ==================== API ENDPOINTS ====================
  
  saveBankRemarks = (data) => 
    api.post("/crm/appraisal/bank/statement/remarks", data);

  saveBankVerification = (data) => 
    api.post("/crm/appraisal/bank/statement/verification", data);

  // ==================== BUSINESS LOGIC METHODS ====================
  
  /**
   * Save bank verification remark
   */
  saveBankRemark = async (data) => {
    try {
      if (!data.application_id) {
        toast.error('Application ID is required');
        return Promise.resolve();
      }

      const response = await this.saveBankRemarks(data);
      // Toast shown in component layer to avoid duplicates
      return response;
    } catch (error) {
      console.error('Error saving bank remark:', error);
      
      if (error.response?.status === 422) {
        const message = error.response.data?.message || 'Validation failed - please check your data';
        toast.error(message);
      } else if (error.response) {
        const message = error.response.data?.message || 'Failed to save bank remark';
        toast.error(message);
      } else {
        toast.error('Failed to save bank remark');
      }
      
      return Promise.resolve();
    }
  };

  /**
   * Save complete bank verification
   */
  saveBankVerificationData = async (data) => {
    try {
      if (!data.application_id) {
        toast.error('Application ID is required');
        return Promise.resolve();
      }

      const response = await this.saveBankVerification(data);
      // Toast shown in component layer to avoid duplicates
      return response;
    } catch (error) {
      console.error('Error saving bank verification:', error);
      
      if (error.response?.status === 422) {
        const message = error.response.data?.message || 'Validation failed - please check all required fields';
        toast.error(message);
      } else if (error.response) {
        const message = error.response.data?.message || 'Failed to save bank verification';
        toast.error(message);
      } else if (error.request) {
        toast.error('Network error - please check your connection');
      } else {
        toast.error('Failed to save bank verification');
      }
      
      return Promise.resolve();
    }
  };


 //Format bank verification data for API
 
formatBankVerificationData = (applicationId, formValues, existingEmi = 0) => {
  return {
    application_id: parseInt(applicationId),
    auto_verification: formValues.bankAutoVerification || '',
    auto_verification_status: formValues.bankAutoVerificationStatus || '',
    is_salary_account: formValues.bankIsSalaryAccount || '',
    is_salary_account_status: formValues.bankIsSalaryAccountStatus || '',
    regural_interval: formValues.bankSalaryCreditedRegular || '',
    regural_interval_status: formValues.bankSalaryCreditedRegularStatus || '',
    salary_date: formValues.bankSalaryDate || '',
    salary_remark: formValues.bankSalaryCreditRemark || '', 
    emi_debit: formValues.bankAnyEmiDebited || '',
    emi_amount: parseInt(formValues.bankEmiAmountInStatement) || 0,
    emi_with_bank_statement: formValues.bankIsEmiWithBankStatement || '',
    bankstatement_final_report: formValues.bankVerificationFinalReport || ''
  };
};

  /**
   * Extract bank data from application response
   */
  extractBankData = (applicationData) => {
    if (!applicationData || !applicationData.account_no) {
      return null;
    }

    return {
      bankName: applicationData.bank_name || '',
      accountNumber: applicationData.account_no || '',
      accountType: applicationData.account_type || '',
      ifscCode: applicationData.ifsc_code || '',
      branchName: applicationData.branch_name || '',
      existingEmi: parseFloat(applicationData.existing_emi) || 0,
      bankStatement: applicationData.bank_statement || ''
    };
  };
}

// Create and export singleton instance
export const bankVerificationService = new BankVerificationService();