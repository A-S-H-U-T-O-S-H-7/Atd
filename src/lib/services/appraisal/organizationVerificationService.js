import api from "@/utils/axiosInstance";

export const organizationVerificationService = {
    // Save organization remarks
    saveOrganizationRemarks: (data) =>
        api.post("/crm/appraisal/organisation/remarks", data),

    // Save organization verification
    saveOrganizationVerification: (data) =>
        api.post("/crm/appraisal/organisation/verification", data)
};