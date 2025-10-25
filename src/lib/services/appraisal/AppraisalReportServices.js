import api from "@/utils/axiosInstance";

export const appraisalCoreService = {
    // Get appraisal report data
    getAppraisalReport: (applicationId) =>
        api.get(`/crm/appraisal/edit/${applicationId}`),

    // Get appraisal PDF
    getAppraisalPDF: (applicationId) =>
        api.get(`/crm/appraisal/pdf/${applicationId}`),

    saveFinalVerification: (data) =>
    api.post("/crm/appraisal/final-verification", {
      application_id: data.applicationId || data.application_id,
      total_final_report: data.finalReport || "Recommended"
    }),

  // Reject application
  rejectApplication: (data) =>
    api.post("/crm/appraisal/reject", {
      application_id: data.applicationId || data.application_id,
      remark: data.remark || "Application rejected"
    })
};