import api from "@/utils/axiosInstance";

export const bankVerificationService = {
    // Save bank remarks
    saveBankRemarks: (data) =>
        api.post("/crm/appraisal/bank/statement/remarks", data),

    // Save bank verification
    saveBankVerification: (data) =>
        api.post("/crm/appraisal/bank/statement/verification", data)
};