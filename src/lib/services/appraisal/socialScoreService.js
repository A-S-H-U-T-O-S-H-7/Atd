import api from "@/utils/axiosInstance";

export const socialScoreService = {
    // Save social remarks
    saveSocialRemarks: (data) =>
        api.post("/crm/appraisal/social/remarks", data),

    // Save social verification
    saveSocialVerification: (data) =>
        api.post("/crm/appraisal/social/verification", data)
};