import { useState } from 'react';
import toast from 'react-hot-toast';
import kycService, { DOCUMENT_FIELDS_MAPPING } from '@/lib/services/replaceKycSevice';

export const useFileUpload = (documents, resetNewFiles, onBack, enquiry) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const filesToUpload = Object.entries(documents)
      .filter(([_, doc]) => doc.newFile)
      .map(([documentType, doc]) => ({
        documentType,
        file: doc.newFile,
        apiField: doc.apiField
      }));
    
    if (filesToUpload.length === 0) {
      toast.error('No new files to upload');
      return;
    }

    // Enhanced debug log
    console.log('=== UPLOAD DEBUG START ===');
    console.log('Document ID:', enquiry.documentId || enquiry.kycDocuments?.documentId);
    console.log('Available mappings:', DOCUMENT_FIELDS_MAPPING);
    console.log('Files to upload:');
    
    filesToUpload.forEach(({ documentType, file, apiField }) => {
      console.log(`- ${documentType} (UI) -> ${apiField} (API): ${file.name} (${file.type})`);
      
      // Check if apiField is valid using imported mapping
      const validApiFields = Object.values(DOCUMENT_FIELDS_MAPPING);
      const isValid = validApiFields.includes(apiField);
      console.log(`  API Field valid? ${isValid} (Available fields: ${validApiFields.join(', ')})`);
      
      // Also check what the mapping says
      const expectedApiField = DOCUMENT_FIELDS_MAPPING[documentType];
      console.log(`  Expected mapping: ${documentType} -> ${expectedApiField}`);
      console.log(`  Actual apiField in doc: ${apiField}`);
    });
    console.log('=== UPLOAD DEBUG END ===');

    setSubmitting(true);
    const uploadToast = toast.loading(`Uploading ${filesToUpload.length} file(s)...`);

    try {
      const documentId = enquiry.documentId || enquiry.kycDocuments?.documentId;
      
      if (!documentId) {
        throw new Error('Document ID not found');
      }

      // Upload all files sequentially
      const uploadPromises = filesToUpload.map(async ({ documentType, file }) => {
        try {
          console.log(`Validating ${documentType}: ${file.name}`);
          
          // Validate file
          kycService.validateFile(file, documentType);
          
          console.log(`Uploading ${documentType}: ${file.name}`);
          
          // Upload and update
          const result = await kycService.uploadAndUpdateDocument(
            file, 
            documentType, 
            documentId
          );
          
          console.log(`Successfully uploaded ${documentType}: ${file.name}`);
          
          return {
            documentType,
            success: true,
            result
          };
        } catch (error) {
          console.error(`Failed to upload ${documentType}:`, error.message);
          return {
            documentType,
            success: false,
            error: error.message
          };
        }
      });

      const results = await Promise.all(uploadPromises);
      
      // Check for failures
      const failedUploads = results.filter(result => !result.success);
      
      if (failedUploads.length > 0) {
        const errorMessage = failedUploads.length === filesToUpload.length 
          ? 'All uploads failed' 
          : `${failedUploads.length} of ${filesToUpload.length} uploads failed`;
        
        toast.dismiss(uploadToast);
        toast.error(errorMessage);
        
        // Show specific errors for failed uploads
        failedUploads.slice(0, 3).forEach(failed => {
          toast.error(`Failed to upload ${failed.documentType}: ${failed.error}`);
        });
        
        return;
      }

      // All uploads successful
      const successCount = results.filter(result => result.success).length;
      
      toast.dismiss(uploadToast);
      toast.success(`Successfully uploaded ${successCount} file(s)`);
      
      // Reset new files after successful upload
      resetNewFiles();

      // Navigate back after success
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (error) {
      console.error('Upload error:', error);
      toast.dismiss(uploadToast);
      toast.error(error.message || 'Failed to upload files. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    handleSubmit,
    submitting
  };
};