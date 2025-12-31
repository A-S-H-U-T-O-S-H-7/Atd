import { useState, useEffect } from 'react';
import { DOCUMENT_CONFIG, DOCUMENT_FIELDS_MAPPING } from '@/lib/services/replaceKycSevice';

export const useDocuments = (enquiry) => {
  const [documents, setDocuments] = useState({});

  // Initialize documents from enquiry data
  useEffect(() => {
    if (enquiry?.kycDocuments) {
      setDocuments(enquiry.kycDocuments);
    } else {
      // Initialize empty documents structure with correct apiField
      const initialDocuments = {};
      DOCUMENT_CONFIG.forEach(field => {
        initialDocuments[field.name] = {
          available: false,
          fileName: null,
          newFile: null,
          apiField: DOCUMENT_FIELDS_MAPPING[field.name] 
        };
      });
      setDocuments(initialDocuments);
    }
  }, [enquiry]);

  const updateDocument = (documentName, file) => {
    setDocuments(prev => ({
      ...prev,
      [documentName]: {
        ...prev[documentName],
        newFile: file,
        // Ensure apiField is set correctly
        apiField: prev[documentName]?.apiField || DOCUMENT_FIELDS_MAPPING[documentName]
      }
    }));
  };

  const removeNewFile = (documentName) => {
    setDocuments(prev => ({
      ...prev,
      [documentName]: {
        ...prev[documentName],
        newFile: null
      }
    }));
  };

  const resetNewFiles = () => {
    setDocuments(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        if (updated[key].newFile) {
          updated[key] = {
            ...updated[key],
            available: true,
            fileName: updated[key].newFile.name,
            newFile: null
          };
        }
      });
      return updated;
    });
  };

  return {
    documents,
    updateDocument,
    removeNewFile,
    resetNewFiles
  };
};