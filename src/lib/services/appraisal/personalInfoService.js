import api from "@/utils/axiosInstance";

export const personalInfoService = {
    // Update personal information (father name and addresses)
    updatePersonalInfo: (data) =>
        api.post("/crm/appraisal/personal", data),

    // Save personal remarks
    savePersonalRemarks: (data) =>
        api.post("/crm/appraisal/personal/remark", data),

    // Save personal final verification
    savePersonalFinalVerification: (data) =>
        api.post("/crm/appraisal/personal/final-verification", data)
};