"use client";
import api from "@/utils/axiosInstance";

export const referralAPI = {
    getReferrals: (params = {}) => {
        return api.get("/crm/referral/show", { params });
    },

    exportReferrals: () => {
        return api.get("/crm/referral/export");
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