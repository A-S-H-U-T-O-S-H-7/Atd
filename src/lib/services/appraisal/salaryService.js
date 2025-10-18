// lib/services/appraisal/salaryService.js
import api from "@/utils/axiosInstance";

export const salaryService = {
  // Save salary remarks
  saveSalaryRemark: (data) => 
    api.post('/crm/appraisal/salary/remarks', data),

  // Add household income (multiple family members)
  addHouseholdIncome: (data) => 
    api.post('/crm/appraisal/add/house-hold-income', data),

  // Save salary verification
  saveSalaryVerification: (data) => 
    api.post('/crm/appraisal/salary/verification', data),
};

export default salaryService;