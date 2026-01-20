"use client";
import api from "@/utils/axiosInstance";

export const referralAPI = {
    getReferrals: async (params = {}) => {
        try {
            const requestParams = {
                page: params.page || 1,
                per_page: params.per_page || 10,
                ...params
            };
            
            const data = await api.get("/crm/referral/show", { params: requestParams });
            return {
                success: data.success,
                data: data.data || [],
                pagination: data.pagination,
                message: data.message
            };
        } catch (error) {
            console.error("Error fetching referrals:", error);
            return {
                success: false,
                data: [],
                pagination: { total: 0, current_page: 1, per_page: 10, total_pages: 0 },
                message: error.message || "Failed to fetch referrals"
            };
        }
    },

    // Simple export - gets all data matching current search
    exportReferrals: async (searchQuery = "") => {
        try {
            let allData = [];
            let page = 1;
            let hasMore = true;
            
            while (hasMore) {
                const params = {
                    page: page,
                    per_page: 100, // Fetch 100 per page for efficiency
                    ...(searchQuery.trim() && { search: searchQuery.trim() })
                };
                
                const data = await api.get("/crm/referral/show", { params });
                
                if (data.success && data.data && data.data.length > 0) {
                    allData = [...allData, ...data.data];
                    
                    // Check if there are more pages
                    if (page >= data.pagination.total_pages) {
                        hasMore = false;
                    } else {
                        page++;
                    }
                } else {
                    hasMore = false;
                }
                
                // Small delay to avoid overwhelming server
                if (hasMore) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
            
            return {
                success: true,
                data: allData,
                message: `Fetched ${allData.length} records for export`
            };
        } catch (error) {
            console.error("Error exporting referrals:", error);
            return {
                success: false,
                data: [],
                message: error.message || "Failed to export referrals"
            };
        }
    }
};

export const formatReferralForUI = (referral) => {
    return {
        id: referral.id,
        referBy: referral.referby,
        referenceName: referral.inv_name,
        referenceEmail: referral.inv_email,
        referenceMobile: referral.inv_mobile,
        date: new Date(referral.created_at).toLocaleDateString('en-GB'),
        senderCrnNo: referral.sender_crnno,
        userId: referral.user_id,
        createdAt: referral.created_at
    }; 
};