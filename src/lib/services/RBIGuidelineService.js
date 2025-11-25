import api from "@/utils/axiosInstance";

// Document type mapping - MUST match backend exactly
const DOCUMENT_TYPE_MAP = {
  'rbi-guidelines': 'RBI Guideline',
  'resolution': 'Resolution'
};

export const rbiGuidelineService = {
  // Get all RBI guidelines with filters and pagination
  getGuidelines: async (params = {}) => {
    try {
      const response = await api.get('/crm/rbi/guidline/lists', { params });
      return response;
    } catch (error) {
      console.error('Error fetching RBI guidelines:', error);
      throw error;
    }
  },

  // Get guideline by ID for editing
  getGuidelineById: async (guidelineId) => {
    try {
      const response = await api.get(`/crm/rbi/guidline/edit/${guidelineId}`);
      return response;
    } catch (error) {
      console.error('Error fetching guideline:', error);
      throw error;
    }
  },

  // Add new RBI guideline
  addGuideline: async (guidelineData) => {
    try {
      const response = await api.post('/crm/rbi/guidline/add', guidelineData);
      return response;
    } catch (error) {
      console.error('Error adding RBI guideline:', error);
      throw error;
    }
  },

  // Update RBI guideline
  updateGuideline: async (guidelineId, guidelineData) => {
    try {
      const response = await api.put(`/crm/rbi/guidline/update/${guidelineId}`, guidelineData);
      return response;
    } catch (error) {
      console.error('Error updating RBI guideline:', error);
      throw error;
    }
  },

  // Update guideline status
updateStatus: async (guidelineId, status, remarks = "") => {
  try {
    // Based on your successful API call, it only needs status
    const requestData = { status };
    
    const response = await api.put(`/crm/rbi/guidline/status/${guidelineId}`, requestData);
    return response;
  } catch (error) {
    console.error('Error updating guideline status:', error);
    
    // Enhanced error handling
    let errorMessage = 'Failed to update status';
    
    if (error.response) {
      errorMessage = error.response.data?.message || 
                    error.response.data?.error || 
                    error.response.statusText ||
                    'Server error occurred';
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your connection.';
    }
    
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    throw enhancedError;
  }
},

  // Upload document for guideline
  uploadDocument: async (guidelineId, documentType, file) => {
    try {
      // Validate inputs
      if (!guidelineId) {
        throw new Error('Guideline ID is required');
      }
      if (!documentType) {
        throw new Error('Document type is required');
      }
      if (!file) {
        throw new Error('File is required');
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }

      // Ensure documentType is valid
      const validTypes = ['RBI Guideline', 'Resolution'];
      if (!validTypes.includes(documentType)) {
        const mappedType = DOCUMENT_TYPE_MAP[documentType];
        if (mappedType) {
          documentType = mappedType;
        } else {
          throw new Error(`Invalid document type: ${documentType}`);
        }
      }

      // Create FormData
      const formData = new FormData();
      formData.append('guideline_id', guidelineId.toString());
      formData.append('document_type', documentType);
      formData.append('document', file, file.name);

      const response = await api.post('/crm/rbi/guidline/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });

      return response;

    } catch (error) {
      if (error.response) {
        const serverError = error.response.data?.error || 
                          error.response.data?.message || 
                          error.response.statusText ||
                          'Server error occurred';
        
        const enhancedError = new Error(serverError);
        enhancedError.response = error.response;
        enhancedError.serverMessage = serverError;
        enhancedError.statusCode = error.response.status;
        
        throw enhancedError;
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw error;
      }
    }
  },

  
};

// Format guideline data for UI
export const formatGuidelineForUI = (guideline) => {
  const lastModify = guideline.updated_at || guideline.created_at;
  
  let documents = [];
  if (guideline.documents && Array.isArray(guideline.documents)) {
    documents = guideline.documents.map(doc => ({
      id: doc.id,
      document_type: doc.type || doc.document_type,
      document_url: doc.document_url,
      document: doc.document
    }));
  }

  return {
    id: guideline.id,
    guidelineDate: guideline.rbi_date,
    referenceNo: guideline.reference_no,
    subject: guideline.subject,
    cautionAdviceNo: guideline.advice_no,
    remarks: guideline.remarks,
    status: guideline.status,
    addedBy: guideline.admin?.name || 'N/A',
    lastModify: lastModify,
    createdDate: guideline.created_at,
    documents: documents,
    admin: guideline.admin
  };
};

// Format guideline data for API (when creating/updating)
export const formatGuidelineForAPI = (formData) => {
  const apiData = {
    rbi_date: formData.guidelineDate,
    reference_no: formData.referenceNo,
    subject: formData.subject,
    advice_no: formData.cautionAdviceNo,
    remarks: formData.remarks
  };

  if (formData.status) {
    apiData.status = formData.status;
  }

  return apiData;
};