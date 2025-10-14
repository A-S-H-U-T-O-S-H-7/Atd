import api from "@/utils/axiosInstance";

export const incomeVerificationService = {
    // Add household income
    addHouseHoldIncome: (data) =>
        api.post("/crm/appraisal/add/house-hold-income", data),

    // Save salary remarks
    saveSalaryRemarks: (data) =>
        api.post("/crm/appraisal/salary/remarks", data),

    // Save salary verification
    saveSalaryVerification: (data) =>
        api.post("/crm/appraisal/salary/verification", data)
};