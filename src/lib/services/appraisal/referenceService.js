import api from "@/utils/axiosInstance";

export const referenceService = {
    // Save additional references
    saveAdditionalReferences: (data) =>
        api.post("/crm/appraisal/personal/reference", data)
};