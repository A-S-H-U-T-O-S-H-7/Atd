import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://api.atdmoney.in/api",
  timeout: 10000,
  headers: {
    Accept: "application/json"
  }
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

// Helper function to process queued requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// REQUEST INTERCEPTOR - Automatically add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR - Handle 401 errors and auto-refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get 401 (unauthorized) and haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentToken = localStorage.getItem("adminToken");
        if (!currentToken) {
          throw new Error("No token available");
        }

        // Try to refresh the token
        const refreshResponse = await axios.get(
          "https://api.atdmoney.in/api/crm/refresh",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${currentToken}`
            }
          }
        );

        if (refreshResponse.data.success) {
          const newToken = refreshResponse.data.token;
          localStorage.setItem("adminToken", newToken);

          // Update original request with new token
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          // Process all queued requests
          processQueue(null, newToken);

          // Retry the original request
          return api(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        processQueue(refreshError, null);

        // Clear storage and redirect to login
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        if (typeof window !== "undefined") {
          window.location.href = "/admin_login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// =============================================================================
// BLOG API FUNCTIONS - Updated to match API documentation
// =============================================================================

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

  // Delete post
  deletePost: (id) => api.delete(`/crm/posts/${id}`),

  // Bulk operations
  bulkDelete: (ids) => api.post("/crm/posts/bulk-delete", { ids }),
  bulkUpdateStatus: (ids, status) =>
    api.post("/crm/posts/bulk-status", { ids, status })
};

// Convert API status number to readable status - Updated to match API
export const getStatusText = (status) => {
  const statusStr = String(status).toLowerCase();
  switch (statusStr) {
    case "1":
    case "draft":
      return "draft";
    case "2":
    case "published":
      return "published";
    default:
      return "draft";
  }
};

// Convert readable status to API status number
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

// Format blog data from API response for UI - Updated to match API structure
export const formatBlogForUI = (blog) => {
  return {
    id: blog.id,
    title: blog.title,
    status: getStatusText(blog.status),
    publicationDate: blog.publication_date,
    views: blog.views || 0,
    excerpt: blog.content ? blog.content.substring(0, 150) + "..." : "",
    // Handle featured image - API returns relative path in list, full URL in single post
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
    // Handle author data - from API documentation structure
    author: blog.author || {
      id: blog.author_id,
      name: blog.author_name,
      email: blog.author_email
    },
    createdAt: blog.created_at,
    updatedAt: blog.updated_at
  };
};

export default api;