"use client";
import api from "@/utils/axiosInstance";

export const reviewAPI = {
    getReviews: (params = {}) => {
        return api.get("/crm/review/list", { params });
    },

    updateReviewStatus: (reviewId, status, comment) => {
        return api.post("/crm/review/status", {
            review_id: reviewId,
            status: getReviewStatusNumber(status),
            comment: comment
        });
    }
};

export const formatReviewForUI = (review) => {
    return {
        id: review.id,
        crnNo: review.crnno,
        review: review.reviews,
        rating: review.rating,
        reply: review.reply,
        status: getReviewStatusText(review.status),
        date: new Date(review.created_at).toLocaleDateString('en-GB'),
        approvedBy: review.approvedBy,
        name: review.name || "Customer",
        email: review.email || "",
        phone: review.mobile || "",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        createdAt: review.created_at
    };
};

const getReviewStatusText = (status) => {
    switch (Number(status)) {
        case 0: return "pending";
        case 1: return "approved";
        case 2: return "rejected";
        default: return "pending";
    }
};

export const getReviewStatusNumber = (status) => {
    switch (String(status).toLowerCase()) {
        case "pending": return 0;
        case "approved": return 1;
        case "rejected": return 2;
        default: return 0;
    }
};