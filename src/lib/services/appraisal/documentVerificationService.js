import api from "@/utils/axiosInstance";

export const documentVerificationService = {
    // PAN verification
    verifyPAN: (data) =>
        api.post("/crm/appraisal/pan/verification", data),

    // Aadhar verification
    verifyAadhar: (data) =>
        api.post("/crm/appraisal/aadhar/verification", data)
};