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

// Basic Registration/Signup
export const registrationAPI = {
  sendOTP: (userData) => api.post("/registration/otp/send", userData),
  verifyOTP: (otpData) => api.post("/registration/otp/verify", otpData),
  
  resendOTP: (resendData) => api.post("/registration/otp/resend", resendData)
};



