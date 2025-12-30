"use client";
import api from "@/utils/axiosInstance";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from '@/lib/firebase';

export const DOCUMENT_FIELDS_MAPPING = {
  photo: 'selfie',
  panCard: 'pan_proof', 
  addressProof: 'address_proof',
  idProof: 'id_proof',
  salarySlip1: 'salary_slip',
  salarySlip2: 'second_salary_slip',
  salarySlip3: 'third_salary_slip',
  bankStatement: 'bank_statement',
  bankStatement2: 'second_bank_statement',
  bankVerificationReport: 'bank_verif_report',
  bankFraudAnalysisReport: 'bank_fraud_report',
  camSheet: 'cam_sheet',
  socialScoreReport: 'social_score_report',
  cibilScoreReport: 'cibil_score_report',
  nachForm: 'nach_form',
  pdc: 'pdc',
  agreement: 'aggrement',
  video: 'video'
};

export const REVERSE_DOCUMENT_MAPPING = Object.fromEntries(
  Object.entries(DOCUMENT_FIELDS_MAPPING).map(([key, value]) => [value, key])
);

export const FOLDER_MAPPINGS = {
  'selfie': 'photo',
  'pan_proof': 'pan',
  'address_proof': 'address',
  'id_proof': 'idproof',
  'salary_slip': 'first_salaryslip',
  'second_salary_slip': 'second_salaryslip',
  'third_salary_slip': 'third_salaryslip',
  'bank_statement': 'bank-statement',
  'second_bank_statement': 'bank-statement',
  'bank_verif_report': 'reports',
  'bank_fraud_report': 'reports',
  'cam_sheet': 'reports',
  'social_score_report': 'reports',
  'cibil_score_report': 'reports',
  'nach_form': 'nach-form',
  'pdc': 'pdc',
  'aggrement': 'agreement',
  'video': 'video-kyc'
};

export const kycService = {
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
      if (!Object.values(DOCUMENT_FIELDS_MAPPING).includes(field)) {
        throw new Error(`Invalid document field: ${field}`);
      }

      const payload = { field: field, value: fileName };
      const response = await api.put(`/crm/application/kyc/update/${documentId}`, payload);
      
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
      const apiField = DOCUMENT_FIELDS_MAPPING[documentType];
      if (!apiField) throw new Error(`Invalid document type: ${documentType}`);

      const folder = FOLDER_MAPPINGS[apiField];
      if (!folder) throw new Error(`Folder mapping not found for: ${apiField}`);

      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      
      const filePath = `${folder}/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { fileName, downloadURL, filePath };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  viewFile: async (fileName, documentType) => {
    try {
      if (!fileName) throw new Error('No file available');

      const apiField = DOCUMENT_FIELDS_MAPPING[documentType];
      if (!apiField) throw new Error(`Invalid document type: ${documentType}`);

      const folder = FOLDER_MAPPINGS[apiField];
      if (!folder) throw new Error(`Folder mapping not found for: ${apiField}`);
      
      const filePath = `${folder}/${fileName}`;
      const fileRef = ref(storage, filePath);
      const url = await getDownloadURL(fileRef);
      
      return url;
    } catch (error) {
      console.error('View error:', error);
      throw error;
    }
  },

  uploadAndUpdateDocument: async (file, documentType, documentId) => {
    try {
      const uploadResult = await kycService.uploadFileToStorage(file, documentType);
      const apiField = DOCUMENT_FIELDS_MAPPING[documentType];
      const updateResult = await kycService.updateKYCDocument(documentId, apiField, uploadResult.fileName);
      
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
  }
};

export const formatKYCDataForUI = (apiData) => {
  if (!apiData) throw new Error('No data received from API');
  
  const kycDocuments = {};

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
    rawData: apiData
  };
};

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

export const DOCUMENT_CONFIG = [
  { name: 'photo', label: 'Photo', required: true },
  { name: 'panCard', label: 'PAN Proof', required: true },
  { name: 'addressProof', label: 'Address Proof', required: true },
  { name: 'idProof', label: 'ID Proof', required: true },
  { name: 'salarySlip1', label: '1st Month Salary Slip', required: false },
  { name: 'salarySlip2', label: '2nd Month Salary Slip', required: false },
  { name: 'salarySlip3', label: '3rd Month Salary Slip', required: false },
  { name: 'bankStatement', label: 'Bank Statement', required: false },
  { name: 'bankStatement2', label: '2nd Bank Statement', required: false },
  { name: 'bankVerificationReport', label: 'Banking Verification Report', required: false },
  { name: 'bankFraudAnalysisReport', label: 'Bank Fraud Analysis Report', required: false },
  { name: 'camSheet', label: 'CAM Sheet', required: false },
  { name: 'nachForm', label: 'NACH Form', required: false },
  { name: 'socialScoreReport', label: 'Social Score Report', required: false },
  { name: 'cibilScoreReport', label: 'CIBIL Score Report', required: false },
  { name: 'pdc', label: 'PDC', required: false },
  { name: 'agreement', label: 'Agreement', required: false },
  { name: 'video', label: 'Video', required: false }
];

export default kycService;