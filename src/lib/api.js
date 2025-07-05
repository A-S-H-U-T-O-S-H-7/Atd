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

// =============================================================================
// REFERENCE API FUNCTIONS 
// =============================================================================

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
    userId: referral.user_id
  };
};

export default api;

// =============================================================================
// Review API FUNCTIONS 
// =============================================================================

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

// Add helper functions for status conversion
export const getReviewStatusText = (status) => {
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

// Format review data from API
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
    // Use placeholder data since API doesn't return user details
    name: review.name || "Customer",
    email: review.email || "",
    phone: review.mobile || "",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  };
};

// =============================================================================
// All Enquiry API FUNCTIONS 
// =============================================================================

export const enquiryAPI = {
  getAllEnquiries: (params = {}) => {
    return api.get("/crm/application/all-application", { params });
  },

  exportEnquiries: () => {
    return api.get("/crm/application/export/all-application");
  },
  
  getApplicationForEdit: (id) => {
    return api.get(`/crm/application/edit/${id}`);
  },

  updateApplication: (id, data) => {
    return api.put(`/crm/application/update/${id}`, data);
  },
 
};

export const formatEnquiryForUI = (enquiry) => {
  const getStatusText = (status) => {
    switch (Number(status)) {
      case 1: return "Pending";
      case 2: return "Approved"; 
      case 3: return "Rejected";
      default: return "Pending";
    }
  };

  return {
    // Basic identifiers
    id: enquiry.application_id,
    srNo: enquiry.application_id, 
    enquirySource: enquiry.enquiry_type ,
    crnNo: enquiry.crnno,
    accountId: enquiry.accountId,
    
    // Date and time (assuming you have created_at field, otherwise use current date)
    enquiryDate: enquiry.created_at ? new Date(enquiry.created_at).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
    enquiryTime: enquiry.created_at ? new Date(enquiry.created_at).toLocaleTimeString('en-GB') : new Date().toLocaleTimeString('en-GB'),
    
    // Personal information
    name: `${enquiry.fname} ${enquiry.lname}`,
    firstName: enquiry.fname,
    lastName: enquiry.lname,
    dob: enquiry.dob,
    gender: enquiry.gender,
    
    // Address information
    currentAddress: enquiry.current_address,
    currentState: enquiry.current_state,
    currentCity: enquiry.current_city,
    currentPincode: enquiry.current_pincode,
    currentHouseNo: enquiry.current_house_no,
    address: enquiry.address,
    state: enquiry.state,
    city: enquiry.city,
    pincode: enquiry.pincode,
    houseNo: enquiry.house_no,
    
    // Contact information
    phoneNo: enquiry.phone,
    email: enquiry.email,
    
    // Loan information
    appliedLoan: enquiry.applied_amount,
    loanAmount: enquiry.approved_amount,
    appliedAmount: enquiry.applied_amount,
    approvedAmount: enquiry.approved_amount,
    roi: `${(enquiry.roi) }%`,
    tenure: `${enquiry.tenure} days`,
    loanTerm: enquiry.loan_term === 4 ? "One Time Payment" : "Daily",
    
    // Document availability flags
    hasPhoto: !!enquiry.selfie,
    hasPanCard: !!enquiry.pan_proof,
    hasAddressProof: !!enquiry.address_proof,
    hasIdProof: !!enquiry.aadhar_proof,
    hasSalaryProof: !!enquiry.salary_slip,
    hasSecondSalaryProof: !!enquiry.second_salary_slip,
    hasThirdSalaryProof: !!enquiry.third_salary_slip,
    hasBankStatement: !!enquiry.bank_statement,
    hasBankVerificationReport: !!enquiry.bank_verif_report,
    hasSocialScoreReport: !!enquiry.social_score_report,
    hasCibilScoreReport: !!enquiry.cibil_score_report,
    
    // Document file names for Firebase
    photoFile: enquiry.selfie,
    panCardFile: enquiry.pan_proof,
    addressProofFile: enquiry.address_proof,
    idProofFile: enquiry.aadhar_proof,
    salarySlip1: enquiry.salary_slip,
    salarySlip2: enquiry.second_salary_slip,
    salarySlip3: enquiry.third_salary_slip,
    bankStatementFile: enquiry.bank_statement,
    bankVerificationFile: enquiry.bank_verif_report,
    socialScoreFile: enquiry.social_score_report,
    cibilScoreFile: enquiry.cibil_score_report,
    
    // Status and approval information
    approvalNote: enquiry.approval_note,
    status: getStatusText(enquiry.loan_status),
    loanStatus: enquiry.loan_status,
    
    // Application stage information
    isVerified: enquiry.verify === 1,
    isReportChecked: enquiry.report_check === 1,
    isFinalStage: enquiry.verify === 1 && enquiry.report_check === 1,
    verifyStatus: enquiry.verify,
    reportCheckStatus: enquiry.report_check,
    
    // Final report information
    hasAppraisalReport: !!enquiry.totl_final_report,
    finalReportStatus: enquiry.totl_final_report,
    isRecommended: enquiry.totl_final_report === "Recommended",
    
    // Mail information
    mailCounter: enquiry.mail_counter,
    mailerDate: enquiry.mailer_date,
    
    
  };
};



// =============================================================================
// ELIGIBILITY API FUNCTIONS - Add these to your existing api.js file
// =============================================================================

export const eligibilityAPI = {
  // Get eligibility data for a specific enquiry
  getEligibilityData: (id) => {
    return api.get(`/crm/eligibity/get/${id}`);
  },

  // Update eligibility with approved amount and max limit
  updateEligibility: (data) => {
    return api.post("/crm/eligibity/update", {
      id: data.id,
      approved_amount: data.approved_amount,
      max_limit: data.max_limit
    });
  },

  // Get rejection status options
  getRejectionStatuses: () => {
    return api.get("/crm/reject/status");
  },

  // Reject loan application
  rejectLoan: (data) => {
    return api.post("/crm/eligibity/reject", {
      id: data.id,
      remark: data.remark
    });
  }
};

// Format eligibility data from API response for UI
export const formatEligibilityForUI = (eligibilityData) => {
  const data = eligibilityData.data;
  return {
    id: data.id,
    crnNo: data.crnno,
    name: data.name,
    grossSalary: data.gross_salary,
    netSalary: data.net_salary,
    totalExitingEMI: data.emi_amount || 0,
    balance: data.balance,
    min20PercentOfBalance: data.minBalance,
    max30PercentOfBalance: data.maxBalance,
    maximumLimit: data.max_limit || '',
    finalRecommended: data.final_report || ''
  };
};

// Format rejection status options for dropdown
export const formatRejectionStatusForUI = (statusData) => {
  return statusData.data.map(status => ({
    id: status.id,
    reason: status.reason
  }));
};
