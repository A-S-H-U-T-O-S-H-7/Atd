"use client";
import api from "@/utils/axiosInstance"; 

export const blogAPI = {
    getPosts: (params = {}) => {
        return api.get("/crm/posts", { params });
    },

    getPost: (id) => api.get(`/crm/posts/${id}`),

    createPost: (formData) =>
        api.post("/crm/posts", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }),

    updatePost: (id, formData) => {
        formData.append("_method", "PUT");
        return api.post(`/crm/posts/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },
    deletePost: (id) => api.delete(`/crm/posts/${id}`),
    bulkDelete: (ids) => api.post("/crm/posts/bulk-delete", { ids }),
    bulkUpdateStatus: (ids, status) =>
        api.post("/crm/posts/bulk-status", { ids, status })
};

export const formatBlogForUI = (blog) => {
    return {
        id: blog.id,
        title: blog.title,
        status: getStatusText(blog.status),
        publicationDate: blog.publication_date,
        views: blog.views || 0,
        excerpt: blog.content ? blog.content.substring(0, 150) + "..." : "",
        image: blog.featured
            ? (blog.featured.startsWith("http")
                ? blog.featured
                : `https://api.atdmoney.in/storage/${blog.featured}`)
            : "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
        url: blog.url,
        metatitle: blog.metatitle,
        metadesc: blog.metadesc,
        metakeword: blog.metakeword,
        content: blog.content,
        author: blog.author || {
            id: blog.author_id,
            name: blog.author_name,
            email: blog.author_email
        },
        createdAt: blog.created_at,
        updatedAt: blog.updated_at
    };
};
const getStatusText = (status) => {
    switch (Number(status)) {
        case 1: return "Pending";
        case 2: return "Approved";
        case 3: return "Rejected";
        default: return "Pending";
    }
};

export const getStatusNumber = (status) => {
    switch (String(status).toLowerCase()) {
        case "draft":
            return "1";
        case "published":
            return "2";
        default:
            return "1";
    }
};