"use client";
import api from "@/utils/axiosInstance";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from '@/lib/firebase';

// Allowed document fields mapping
export const DOCUMENT_FIELDS_MAPPING = {
  // Required Documents
  photo: 'selfie',
  panCard: 'pan_proof', 
  addressProof: 'address_proof',
  idProof: 'id_proof',
  
  // Salary Slips
  salarySlip1: 'salary_slip',
  salarySlip2: 'second_salary_slip',
  salarySlip3: 'third_salary_slip',
  
  // Bank Documents
  bankStatement: 'bank_statement',
  bankVerificationReport: 'bank_verif_report',
  
  // Reports
  camSheet: 'cam_sheet',
  socialScoreReport: 'social_score_report',
  cibilScoreReport: 'cibil_score_report',
  
  // Other Documents
  nachForm: 'nach_form',
  pdc: 'pdc',
  agreement: 'aggrement',
  video: 'video'
};

// Reverse mapping for API field to UI field
export const REVERSE_DOCUMENT_MAPPING = Object.fromEntries(
  Object.entries(DOCUMENT_FIELDS_MAPPING).map(([key, value]) => [value, key])
);

// Folder mappings for Firebase storage
export const FOLDER_MAPPINGS = {
  'selfie': 'photo',
  'pan_proof': 'pan',
  'address_proof': 'address',
  'id_proof': 'idproof',
  'salary_slip': 'first_salaryslip',
  'second_salary_slip': 'second_salaryslip',
  'third_salary_slip': 'third_salaryslip',
  'bank_statement': 'bank-statement',
  'bank_verif_report': 'reports',
  'cam_sheet': 'reports',
  'social_score_report': 'reports',
  'cibil_score_report': 'reports',
  'nach_form': 'documents',
  'pdc': 'documents',
  'aggrement': 'documents',
  'video': 'video'
};

export const kycService = {
  // Get KYC details for an application
  getKYCDetails: async (applicationId) => {
    try {
      const response = await api.get(`/crm/application/kyc/edit/${applicationId}`);
      
      // Handle different response structures
      if (response.status && response.data) {
        return formatKYCDataForUI(response.data);
      } else if (response.data?.status && response.data?.data) {
        return formatKYCDataForUI(response.data.data);
      } else if (response.data) {
        // Try to format whatever data we got
        return formatKYCDataForUI(response.data);
      }
      
      throw new Error(response.data?.message || response.message || 'Failed to fetch KYC details');
    } catch (error) {
      
      // Better error messages
      if (error.response?.status === 404) {
        throw new Error('KYC record not found for this application');
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      }
      
      throw new Error('Failed to fetch KYC details. Please try again.');
    }
  },

  // Update KYC document
  updateKYCDocument: async (documentId, field, fileName) => {
    try {
      // Validate field
      if (!Object.values(DOCUMENT_FIELDS_MAPPING).includes(field)) {
        throw new Error(`Invalid document field: ${field}`);
      }

      const payload = {
        field: field,
        value: fileName
      };

      const response = await api.put(`/crm/application/kyc/update/${documentId}`, payload);
      
      // Check if the message indicates success
      const successMessage = response.data?.message || response.message || '';
      const isSuccess = successMessage.toLowerCase().includes('updated successfully') || 
                        successMessage.toLowerCase().includes('success');
      
      // Handle different response structures
      if (response.status === 200 || response.data?.status === true || response.data?.status === 'success' || isSuccess) {
        return {
          success: true,
          message: successMessage || 'Document updated successfully',
          fileName: response.data?.file || fileName
        };
      }
      
      throw new Error(response.data?.message || response.message || 'Failed to update document');
    } catch (error) {
      // If the error message itself indicates success, don't treat it as an error
      const errorMessage = error.message || error.response?.data?.message || '';
      if (errorMessage.toLowerCase().includes('updated successfully')) {
        return {
          success: true,
          message: errorMessage,
          fileName: fileName
        };
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw error;
    }
  },

  // Upload file to Firebase Storage
  uploadFileToStorage: async (file, documentType) => {
    try {
      const apiField = DOCUMENT_FIELDS_MAPPING[documentType];
      if (!apiField) {
        throw new Error(`Invalid document type: ${documentType}`);
      }

      const folder = FOLDER_MAPPINGS[apiField];
      if (!folder) {
        throw new Error(`Folder mapping not found for: ${apiField}`);
      }

      // Generate unique file name
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      
      const filePath = `${folder}/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        fileName: fileName,
        downloadURL: downloadURL,
        filePath: filePath
      };
    } catch (error) {
      console.error('Error uploading file to storage:', error);
      throw error;
    }
  },

  // View/download file from Firebase Storage
  viewFile: async (fileName, documentType) => {
    try {
      if (!fileName) {
        throw new Error('No file available');
      }

      const apiField = DOCUMENT_FIELDS_MAPPING[documentType];
      if (!apiField) {
        throw new Error(`Invalid document type: ${documentType}`);
      }

      const folder = FOLDER_MAPPINGS[apiField];
      if (!folder) {
        throw new Error(`Folder mapping not found for: ${apiField}`);
      }
      
      const filePath = `${folder}/${fileName}`;
      const fileRef = ref(storage, filePath);
      const url = await getDownloadURL(fileRef);
      
      return url;
    } catch (error) {
      console.error('Error viewing file:', error);
      throw error;
    }
  },

  // Complete file upload and update process
  uploadAndUpdateDocument: async (file, documentType, documentId) => {
    try {
      // Step 1: Upload to Firebase Storage
      const uploadResult = await kycService.uploadFileToStorage(file, documentType);
      
      // Step 2: Update KYC record with new file name
      const apiField = DOCUMENT_FIELDS_MAPPING[documentType];
      const updateResult = await kycService.updateKYCDocument(
        documentId, 
        apiField, 
        uploadResult.fileName
      );
      
      return {
        ...updateResult,
        uploadData: uploadResult
      };
    } catch (error) {
      console.error('Error in upload and update process:', error);
      throw error;
    }
  },

  // Validate file before upload
  validateFile: (file) => {
    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'video/mp4',
      'video/avi',
      'video/mov'
    ];
    
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload PDF, JPG, PNG, or MP4 files.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 10MB.');
    }

    return true;
  }
};

// Format KYC API data for UI
export const formatKYCDataForUI = (apiData) => {
  if (!apiData) {
    throw new Error('No data received from API');
  }
  
  const kycDocuments = {};

  // Map all document fields
  Object.entries(DOCUMENT_FIELDS_MAPPING).forEach(([uiField, apiField]) => {
    const fileName = apiData[apiField];
    kycDocuments[uiField] = {
      available: !!fileName,
      fileName: fileName || null,
      apiField: apiField,
      newFile: null
    };
  });

  return {
    userId: apiData.user_id || apiData.userId,
    applicationId: apiData.application_id || apiData.applicationId,
    documentId: apiData.document_id || apiData.documentId || apiData.id,
    fullName: apiData.full_name || apiData.fullName || apiData.name || 'N/A',
    crnNo: apiData.crnno || apiData.crnNo || 'N/A',
    kycDocuments: kycDocuments,
    rawData: apiData // Keep original data for reference
  };
};

// Format UI data for KYC update
export const formatUIForKYCUpdate = (uiData) => {
  const updateData = {};
  
  Object.entries(uiData).forEach(([uiField, document]) => {
    if (document.newFile) {
      const apiField = DOCUMENT_FIELDS_MAPPING[uiField];
      if (apiField) {
        updateData[apiField] = document.newFile.name; 
      }
    }
  });
  
  return updateData;
};

// Document configuration for UI
export const DOCUMENT_CONFIG = [
  { name: 'photo', label: 'Photo', required: true },
  { name: 'panCard', label: 'PAN Proof', required: true },
  { name: 'addressProof', label: 'Address Proof', required: true },
  { name: 'idProof', label: 'ID Proof', required: true },
  { name: 'salarySlip1', label: '1st Month Salary Slip', required: false },
  { name: 'salarySlip2', label: '2nd Month Salary Slip', required: false },
  { name: 'salarySlip3', label: '3rd Month Salary Slip', required: false },
  { name: 'bankStatement', label: 'Bank Statement', required: false },
  { name: 'bankVerificationReport', label: 'Banking Verification Report', required: false },
  { name: 'camSheet', label: 'CAM Sheet', required: false },
  { name: 'nachForm', label: 'NACH Form', required: false },
  { name: 'socialScoreReport', label: 'Social Score Report', required: false },
  { name: 'cibilScoreReport', label: 'CIBIL Score Report', required: false },
  { name: 'pdc', label: 'PDC', required: false },
  { name: 'agreement', label: 'Agreement', required: false },
  { name: 'video', label: 'Video', required: false }
];

// Export for use in components
export default kycService;