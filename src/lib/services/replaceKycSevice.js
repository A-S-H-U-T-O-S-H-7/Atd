"use client";
import api from "@/utils/axiosInstance";
import fileService from "./fileService";
import { UI_TO_DB_MAPPING,FIREBASE_FOLDERS, DOCUMENT_CONFIG  } from "../documentMappings";

// Make sure these are defined as const at the top level
const DOCUMENT_FIELDS_MAPPING = UI_TO_DB_MAPPING;

const REVERSE_DOCUMENT_MAPPING = Object.fromEntries(
  Object.entries(DOCUMENT_FIELDS_MAPPING).map(([key, value]) => [value, key])
);

const FOLDER_MAPPINGS = FIREBASE_FOLDERS;

const kycService = {
  DOCUMENT_FIELDS_MAPPING,
  FOLDER_MAPPINGS,
  DOCUMENT_CONFIG,

  getKYCDetails: async (applicationId) => {
    try {
      const response = await api.get(`/crm/application/kyc/edit/${applicationId}`);
      
      if (response.status && response.data) {
        return formatKYCDataForUI(response.data);
      } else if (response.data?.status && response.data?.data) {
        return formatKYCDataForUI(response.data.data);
      } else if (response.data) {
        return formatKYCDataForUI(response.data);
      }
      
      throw new Error('Failed to fetch KYC details');
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('KYC record not found');
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Failed to fetch KYC details');
    }
  },

  updateKYCDocument: async (documentId, field, fileName) => {
    try {
      console.log('updateKYCDocument called with:', { documentId, field, fileName });
      
      // Get all valid API fields from the mapping
      const validApiFields = Object.values(DOCUMENT_FIELDS_MAPPING);
      console.log('Valid API fields:', validApiFields);
      console.log('Field to check:', field);
      console.log('Is field valid?', validApiFields.includes(field));
      
      if (!validApiFields.includes(field)) {
        throw new Error(`Invalid field name: "${field}". Valid fields are: ${validApiFields.join(', ')}`);
      }

      const payload = { field: field, value: fileName };
      console.log('Sending payload:', payload);
      
      const response = await api.put(`/crm/application/kyc/update/${documentId}`, payload);
      
      console.log('Update response:', response);
      
      const successMessage = response.data?.message || response.message || '';
      const isSuccess = successMessage.toLowerCase().includes('updated successfully') || 
                        successMessage.toLowerCase().includes('success');
      
      if (response.status === 200 || response.data?.status === true || isSuccess) {
        return {
          success: true,
          message: successMessage || 'Document updated successfully',
          fileName: response.data?.file || fileName
        };
      }
      
      throw new Error('Failed to update document');
    } catch (error) {
      console.error('Update error details:', error);
      const errorMessage = error.message || error.response?.data?.message || '';
      if (errorMessage.toLowerCase().includes('updated successfully')) {
        return { success: true, message: errorMessage, fileName: fileName };
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw error;
    }
  },

  uploadFileToStorage: async (file, documentType) => {
    try {
      // Use the centralized fileService
      return await fileService.uploadFileFromUI(file, documentType);
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  viewFile: async (fileName, documentType) => {
    try {
      if (!fileName) throw new Error('No file available');
      
      // Use the centralized fileService
      return await fileService.viewFile(fileName, documentType);
    } catch (error) {
      console.error('View error:', error);
      throw error;
    }
  },

  uploadAndUpdateDocument: async (file, documentType, documentId) => {
    try {
      console.log('uploadAndUpdateDocument starting:', { documentType, documentId, fileName: file.name });
      
      // Use centralized fileService for upload
      const uploadResult = await fileService.uploadFileFromUI(file, documentType);
      console.log('File uploaded to storage:', uploadResult.fileName);
      
      const apiField = DOCUMENT_FIELDS_MAPPING[documentType];
      console.log('UI field to API field mapping:', `${documentType} -> ${apiField}`);
      
      const updateResult = await kycService.updateKYCDocument(documentId, apiField, uploadResult.fileName);
      console.log('Database updated successfully');
      
      return { ...updateResult, uploadData: uploadResult };
    } catch (error) {
      console.error('Upload and update error:', error);
      throw error;
    }
  },

  validateFile: (file, documentType = null) => {
    const getAcceptedTypes = (type) => {
      if (type === 'bankVerificationReport' || type === 'bankFraudAnalysisReport') {
        return ['.xlsx', '.xls', '.csv'];
      }
      return ['.pdf', '.jpg', '.jpeg', '.png', '.mp4', '.avi', '.mov'];
    };

    const getMimeTypes = (type) => {
      if (type === 'bankVerificationReport' || type === 'bankFraudAnalysisReport') {
        return [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'text/csv',
          'application/csv',
          'text/x-csv',
          'application/x-csv'
        ];
      }
      return [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'video/mp4',
        'video/avi',
        'video/mov'
      ];
    };

    const maxSize = 10 * 1024 * 1024;
    const acceptedExtensions = getAcceptedTypes(documentType);
    const mimeTypes = getMimeTypes(documentType);
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!mimeTypes.includes(file.type) && !acceptedExtensions.includes(fileExtension)) {
      const allowedFiles = (documentType === 'bankVerificationReport' || documentType === 'bankFraudAnalysisReport') 
        ? 'Excel (XLSX, XLS) or CSV' 
        : 'PDF, JPG, PNG, MP4';
      throw new Error(`Invalid file type. Please upload ${allowedFiles} files.`);
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 10MB.');
    }

    return true;
  },

  // Helper method to get folder for a UI field
  getFolderForUIField: (uiField) => {
    const dbField = UI_TO_DB_MAPPING[uiField];
    if (!dbField) {
      throw new Error(`No mapping found for UI field: ${uiField}`);
    }
    return FIREBASE_FOLDERS[dbField];
  },

  // Helper method to get DB field for a UI field
  getDbFieldForUIField: (uiField) => {
    const dbField = UI_TO_DB_MAPPING[uiField];
    if (!dbField) {
      throw new Error(`No mapping found for UI field: ${uiField}`);
    }
    return dbField;
  },

  // Helper method to get UI field for a DB field
  getUIFieldForDbField: (dbField) => {
    const uiField = REVERSE_DOCUMENT_MAPPING[dbField];
    if (!uiField) {
      throw new Error(`No mapping found for DB field: ${dbField}`);
    }
    return uiField;
  }
};

const formatKYCDataForUI = (apiData) => {
  if (!apiData) throw new Error('No data received from API');
  
  const kycDocuments = {};

  Object.entries(DOCUMENT_FIELDS_MAPPING).forEach(([uiField, apiField]) => {
    const fileName = apiData[apiField];
    kycDocuments[uiField] = {
      available: !!fileName,
      fileName: fileName || null,
      apiField: apiField,
      uiField: uiField,
      folder: FIREBASE_FOLDERS[apiField] || 'unknown',
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
    rawData: apiData
  };
};

const formatUIForKYCUpdate = (uiData) => {
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

// Export everything
export {
  DOCUMENT_FIELDS_MAPPING,
  REVERSE_DOCUMENT_MAPPING,
  FOLDER_MAPPINGS,
  DOCUMENT_CONFIG,
  formatKYCDataForUI,
  formatUIForKYCUpdate
};

export default kycService;