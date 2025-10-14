import api from "@/utils/axiosInstance";

export const appraisalCoreService = {
    // Get appraisal report data
    getAppraisalReport: (applicationId) =>
        api.get(`/crm/appraisal/edit/${applicationId}`),

    // Get appraisal PDF
    getAppraisalPDF: (applicationId) =>
        api.get(`/crm/appraisal/pdf/${applicationId}`),

    // Save final verification
    saveFinalVerification: (data) =>
        api.post("/crm/appraisal/final-verification", data),

    // Reject application
    rejectApplication: (data) =>
        api.post("/crm/appraisal/reject", data)
};