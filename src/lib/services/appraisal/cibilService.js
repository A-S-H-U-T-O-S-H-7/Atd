import api from "@/utils/axiosInstance";

export const cibilService = {
    // Save CIBIL remarks
    saveCibilRemarks: (data) =>
        api.post("/crm/appraisal/cibil/remarks", data),

    // Save CIBIL verification
    saveCibilVerification: (data) =>
        api.post("/crm/appraisal/cibil/verification", data)
};