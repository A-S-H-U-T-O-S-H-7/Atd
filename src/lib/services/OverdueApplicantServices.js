// services/overdueApplicantService.js
import api from "@/utils/axiosInstance";

export const overdueApplicantService = {
  // Get overdue applicants with pagination and filters
  getOverdueApplicants: async (params = {}) => {
    try {
      const {
        search_by = "",
        search_value = "",
        from_date = "",
        to_date = "",
        per_page = 10,
        page = 1,
      } = params;

      const response = await api.get("/crm/overdue/applicant", {
        params: {
          search_by,
          search_value,
          from_date,
          to_date,
          per_page,
          page,
        },
      });

      return response;
    } catch (error) {
      console.error("Error fetching overdue applicants:", error);
      throw error;
    }
  },

  // Export overdue applicants
  exportOverdueApplicants: async (params = {}) => {
    try {
      const response = await api.get("/crm/overdue/applicant", {
        params: {
          ...params,
          per_page: 1000, // Get all data for export
        },
      });
      return response;
    } catch (error) {
      console.error("Error exporting overdue applicants:", error);
      throw error;
    }
  },
};