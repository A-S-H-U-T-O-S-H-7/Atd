import api from "@/utils/axiosInstance";

export const alternateNumbersService = {
    // Save first alternate number
    saveAlternateNumber1: (data) =>
        api.post("/crm/appraisal/personal/mobile/first", data),

    // Save second alternate number
    saveAlternateNumber2: (data) =>
        api.post("/crm/appraisal/personal/mobile/second", data)
};