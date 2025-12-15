import api from "@/utils/axiosInstance";
import { toast } from 'react-hot-toast';

class PersonalVerificationService {
  // ==================== API ENDPOINTS ====================
  
  // Alternate Numbers APIs
  saveAlternateNumber1 = (data) => 
    api.post("/crm/appraisal/personal/mobile/first", data);
    
  saveAlternateNumber2 = (data) => 
    api.post("/crm/appraisal/personal/mobile/second", data);

  // Reference APIs  
  saveAdditionalReferences = (data) => 
    api.post("/crm/appraisal/personal/reference", data);

  getReferences = (applicationId) => 
    api.get(`/crm/appraisal/refference/${applicationId}`);

  // Personal Info APIs
  updatePersonalInfo = (data) => 
    api.post("/crm/appraisal/personal", data);
    
  savePersonalRemarks = (data) => 
    api.post("/crm/appraisal/personal/remark", data);
    
  savePersonalFinalVerification = (data) => 
    api.post("/crm/appraisal/personal/final-verification", data);

  // Document Verification APIs
  verifyPAN = (data) => 
    api.post("/crm/appraisal/pan/verification", data);
    
  verifyAadhar = (data) => 
    api.post("/crm/appraisal/aadhar/verification", data);


  // ==================== PERSONAL INFORMATION ====================

  /**
   * Save personal information (father name and addresses)
   */
  savePersonalInfo = async (data) => {
    try {
      if (!data.user_id || !data.address_id) {
        toast.error('User ID and Address ID are required');
        return Promise.resolve();
      }

      const response = await this.updatePersonalInfo(data);
      // Toast shown in component layer to avoid duplicates
      return response;
    } catch (error) {
      if (error.response?.status === 422) {
        const message = error.response.data?.message || 'Validation failed - please check your data';
        toast.error(message);
      } else if (error.response) {
        const message = error.response.data?.message || 'Failed to save personal information';
        toast.error(message);
      } else {
        toast.error('Failed to save personal information');
      }
      
      return Promise.resolve();
    }
  };

  /**
   * Save personal remarks
   */
  savePersonalRemark = async (data) => {
    try {
      if (!data.application_id) {
        toast.error('Application ID is required');
        return Promise.resolve();
      }

      const response = await this.savePersonalRemarks(data);
      // Toast shown in component layer to avoid duplicates
      return response;
    } catch (error) {
      if (error.response?.status === 422) {
        const message = error.response.data?.message || 'Validation failed - please check your data';
        toast.error(message);
      } else if (error.response) {
        const message = error.response.data?.message || 'Failed to save remark';
        toast.error(message);
      } else {
        toast.error('Failed to save remark');
      }
      
      return Promise.resolve();
    }
  };

  // ==================== ALTERNATIVE NUMBERS ====================

  /**
   * Save alternative phone numbers
   */
  saveAlternativeNumbers = async (data) => {
    try {
      if (!data.application_id) {
        toast.error('Application ID is required');
        return Promise.resolve();
      }

      const promises = [];

      // Save first alternate number if provided
      if (data.alternate_no1) {
        promises.push(
          this.saveAlternateNumber1({
            application_id: data.application_id,
            alternate_no1: data.alternate_no1
          })
        );
      }

      // Save second alternate number if provided
      if (data.alternate_no2) {
        promises.push(
          this.saveAlternateNumber2({
            application_id: data.application_id,
            alternate_no2: data.alternate_no2
          })
        );
      }

      // Save remark if provided
      if (data.remarks) {
        promises.push(
          this.savePersonalRemarks({
            application_id: data.application_id,
            remarks: data.remarks
          })
        );
      }

      await Promise.all(promises);
      // Toast shown in component layer to avoid duplicates
      return { success: true };
    } catch (error) {
      if (error.response?.status === 422) {
        const message = error.response.data?.message || 'Validation failed - please check your data';
        toast.error(message);
      } else if (error.response) {
        const message = error.response.data?.message || 'Failed to save alternative numbers';
        toast.error(message);
      } else {
        toast.error('Failed to save alternative numbers');
      }
      
      return Promise.resolve();
    }
  };

  // ==================== REFERENCE VERIFICATION ====================

 /**
 * Save additional references
 */
saveReferences = async (data) => {
  try {
    const { application_id, crnno, additionalRefs } = data;

    if (!application_id) {
      return Promise.resolve();
    }

    // Prepare references data for API
    const referencesData = {
      application_id: parseInt(application_id),
      crnno: crnno || '',
    };

    // Validate and format each reference
    let validReferencesCount = 0;

    for (let i = 0; i < 5; i++) {
      const ref = additionalRefs[i] || {};
      const num = i + 1;

      // Phone must be exactly 10 digits
      const isValidPhone = ref.phone && ref.phone.trim().length === 10 && /^\d{10}$/.test(ref.phone.trim());
      const isValidEmail = !ref.email || !ref.email.trim() || (ref.email.includes('@') && ref.email.includes('.'));
      
      const hasMinimumData = ref.name && ref.name.trim().length > 0 && isValidPhone && isValidEmail;

      if (hasMinimumData) {
        validReferencesCount++;

        referencesData[`add_ref_name_${num}`] = ref.name.trim();
        referencesData[`add_ref_email_${num}`] = ref.email?.trim() || '';
        referencesData[`add_ref_phone_${num}`] = ref.phone.trim(); 
        referencesData[`add_ref_relation_${num}`] = ref.relation || '';
        referencesData[`add_ref_verify_${num}`] = ref.verified || false;
      } else {
        // Check for partially filled references (invalid state)
        const hasAnyData = (ref.name && ref.name.trim()) || 
                         (ref.email && ref.email.trim()) || 
                         (ref.phone && ref.phone.trim()) || 
                         ref.relation;

        if (hasAnyData) {
          // Specific validation messages
          if (ref.phone && ref.phone.trim()) {
            const phoneDigits = ref.phone.trim();
            if (phoneDigits.length !== 10 || !/^\d{10}$/.test(phoneDigits)) {
              toast.error(`Reference ${num}: Phone must be exactly 10 digits`);
              return Promise.resolve();
            }
          }
          
          if (ref.email && ref.email.trim()) {
            if (!ref.email.includes('@') || !ref.email.includes('.')) {
              toast.error(`Reference ${num}: Email must contain @ and .`);
              return Promise.resolve();
            }
          }
          
          toast.error(`Reference ${num}: Please complete both name and phone (10 digits), or clear all fields`);
          return Promise.resolve();
        }

        // Send empty data for unused slots
        referencesData[`add_ref_name_${num}`] = '';
        referencesData[`add_ref_email_${num}`] = '';
        referencesData[`add_ref_phone_${num}`] = '';
        referencesData[`add_ref_relation_${num}`] = '';
        referencesData[`add_ref_verify_${num}`] = false;
      }
    }

    // Save to API
    const response = await this.saveAdditionalReferences(referencesData);
    // Toast shown in component layer to avoid duplicates
    return response;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 422) {
        const message = error.response.data?.message || 'Validation failed - please check reference data';
        toast.error(message);
      } else {
        const message = error.response.data?.message || 'Failed to save references';
        toast.error(message);
      }
    } else if (error.request) {
      toast.error('Network error - please check your connection');
    } else {
      toast.error('Failed to save references');
    }
    
    return Promise.resolve();
  }
};

  // ==================== DOCUMENT VERIFICATION ====================


/**
 * Verify PAN card - HANDLES INVALID PAN ERRORS
 */
verifyPAN = async (data) => {
  console.log('🔧 verifyPAN service method called with data:', data);
  
  try {
    if (!data.application_id) {
      console.error('❌ Service: Application ID missing');
      toast.error('Application ID is required');
      return { success: false, message: 'Application ID is required' };
    }

    if (!data.pan_no) {
      console.error('❌ Service: PAN number missing');
      toast.error('PAN number is required');
      return { success: false, message: 'PAN number is required' };
    }

    // Validate PAN format before making API call
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(data.pan_no)) {
      console.error('❌ Service: Invalid PAN format');
      toast.error('Invalid PAN format. Expected format: ABCDE1234F');
      return { 
        success: false, 
        message: 'Invalid PAN format. Expected format: ABCDE1234F',
        data: null 
      };
    }

    console.log('📤 Service: Making API request to /crm/appraisal/pan/verification');
    
    // Make the API call
    const response = await api.post("/crm/appraisal/pan/verification", data);
    
    console.log('📥 Service: API response received:', response);
    console.log('📥 Service: Response data:', response.data);
    
    // Handle different response structures
    if (response.data) {
      // CASE 1: Direct success response (previous structure)
      if (response.data.pan_number) {
        console.log('✅ Service: PAN verification successful - direct data structure');
        return {
          success: true,
          message: 'PAN verification completed successfully',
          data: response.data,
          status: 'Positive'
        };
      }
      // CASE 2: Standard success response
      else if (response.data.success === true) {
        console.log('✅ Service: PAN verification successful - standard structure');
        toast.success(response.data.message);
        return {
          success: true,
          message: response.data.message,
          data: response.data.data || response.data,
          status: 'Positive'
        };
      }
      // CASE 3: Error response with details (your current case)
      else if (response.data.success === false && response.data.details) {
        console.log('⚠️ Service: PAN verification failed with details');
        
        try {
          // Parse the details JSON string
          const details = JSON.parse(response.data.details);
          console.log('📋 Service: Parsed error details:', details);
          
          // Extract meaningful error message
          let errorMessage = 'PAN verification failed';
          
          if (details.message === 'Invalid PAN') {
            errorMessage = 'Invalid PAN number. Please check the PAN number and try again.';
          } else if (details.message) {
            errorMessage = details.message;
          } else if (response.data.message) {
            errorMessage = response.data.message;
          }
          
          toast.error(errorMessage);
          
          return {
            success: false,
            message: errorMessage,
            data: details, // Include the parsed error details
            errorDetails: details,
            isInvalidPan: details.message === 'Invalid PAN'
          };
        } catch (parseError) {
          console.error('❌ Service: Failed to parse error details:', parseError);
          toast.error(response.data.message || 'PAN verification failed');
          return {
            success: false,
            message: response.data.message || 'PAN verification failed',
            data: null
          };
        }
      }
      // CASE 4: Simple error response
      else if (response.data.success === false) {
        console.log('⚠️ Service: PAN verification failed');
        toast.error(response.data.message || 'PAN verification failed');
        return {
          success: false,
          message: response.data.message || 'PAN verification failed',
          data: null
        };
      }
    }
    
    // Default error case
    console.warn('⚠️ Service: PAN verification failed - unexpected response structure');
    toast.error('PAN verification failed - unexpected response');
    return {
      success: false,
      message: 'PAN verification failed',
      data: null
    };
    
  } catch (error) {
    console.error('💥 Service: PAN verification error:', error);
    console.error('Service error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    const errorMessage = error.response?.data?.message || 'PAN verification failed. Please try again.';
    toast.error(errorMessage);
    return {
      success: false,
      message: errorMessage,
      data: null
    };
  }
};

/**
 * Verify Aadhar card - HANDLES BOTH SUCCESS AND ERROR RESPONSES
 */
verifyAadhar = async (data) => {
  console.log('🔧 verifyAadhar service method called with data:', data);
  
  try {
    if (!data.application_id) {
      console.error('❌ Service: Application ID missing');
      toast.error('Application ID is required');
      return { success: false, message: 'Application ID is required' };
    }

    if (!data.aadhar_no) {
      console.error('❌ Service: Aadhar number missing');
      toast.error('Aadhar number is required');
      return { success: false, message: 'Aadhar number is required' };
    }

    // Clean Aadhar number
    const cleanAadhar = data.aadhar_no?.replace(/\D/g, '');
    if (!cleanAadhar || cleanAadhar.length !== 12) {
      console.error('❌ Service: Invalid Aadhar format');
      toast.error('Invalid Aadhar format. Expected 12 digits.');
      return { success: false, message: 'Invalid Aadhar format' };
    }

    const aadharData = { ...data, aadhar_no: cleanAadhar };
    
    console.log('📤 Service: Making API request to /crm/appraisal/aadhar/verification');
    console.log('📤 Service: Request data:', aadharData);
    
    // Make the API call
    const response = await api.post("/crm/appraisal/aadhar/verification", aadharData);
    
    console.log('📥 Service: API response received:', response);
    console.log('📥 Service: Response data:', response.data);
    
    // Handle different response structures
    if (response.data) {
      // CASE 1: Direct success response (previous structure)
      if (response.data.aadhaar_number) {
        console.log('✅ Service: Aadhar verification successful - direct data structure');
        return {
          success: true,
          message: 'Aadhar verification completed successfully',
          data: response.data,
          status: 'Positive'
        };
      }
      // CASE 2: Standard success response
      else if (response.data.success === true) {
        console.log('✅ Service: Aadhar verification successful - standard structure');
        toast.success(response.data.message || 'Aadhar verification completed successfully!');
        return {
          success: true,
          message: response.data.message,
          data: response.data.data || response.data,
          status: 'Positive'
        };
      }
      // CASE 3: Error response with details (your current case)
      else if (response.data.success === false && response.data.details) {
        console.log('⚠️ Service: Aadhar verification failed with details');
        
        try {
          // Parse the details JSON string
          const details = JSON.parse(response.data.details);
          console.log('📋 Service: Parsed error details:', details);
          
          // Extract meaningful error message
          let errorMessage = response.data.message || 'Aadhar verification failed';
          if (details.remarks) {
            errorMessage += ` - ${details.remarks}`;
          } else if (details.message) {
            errorMessage = details.message;
          }
          
          toast.error(errorMessage);
          
          return {
            success: false,
            message: errorMessage,
            data: details, // Include the parsed error details
            errorDetails: details
          };
        } catch (parseError) {
          console.error('❌ Service: Failed to parse error details:', parseError);
          toast.error(response.data.message || 'Aadhar verification failed');
          return {
            success: false,
            message: response.data.message || 'Aadhar verification failed',
            data: null
          };
        }
      }
      // CASE 4: Simple error response
      else if (response.data.success === false) {
        console.log('⚠️ Service: Aadhar verification failed');
        toast.error(response.data.message || 'Aadhar verification failed');
        return {
          success: false,
          message: response.data.message || 'Aadhar verification failed',
          data: null
        };
      }
    }
    
    // Default error case
    console.warn('⚠️ Service: Aadhar verification failed - unexpected response structure');
    toast.error('Aadhar verification failed - unexpected response');
    return {
      success: false,
      message: 'Aadhar verification failed',
      data: null
    };
    
  } catch (error) {
    console.error('💥 Service: Aadhar verification error:', error);
    console.error('Service error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    const errorMessage = error.response?.data?.message || 'Aadhar verification failed. Please try again.';
    toast.error(errorMessage);
    return {
      success: false,
      message: errorMessage,
      data: null
    };
  }
};



  /**
 * Save complete document verification
 */
saveDocumentVerificationData = async (data) => {
  try {
    const documentData = this.formatDocumentVerificationData(data.application_id, data);
    const response = await this.savePersonalFinalVerification(documentData);
    return response;

  } catch (error) {
    
    if (error.response?.status === 422) {
      const message = error.response.data?.message || 'Server validation failed - please check your data';
      toast.error(message);
    } else if (error.response) {
      const message = error.response.data?.message || 'Failed to save document verification';
      toast.error(message);
    } else if (error.request) {
      toast.error('Network error - please check your connection');
    } else {
      toast.error('Failed to save document verification');
    }
    
    return Promise.resolve();
  }
};

  
 /**
 * Format document verification data for API - SIMPLIFIED
 */
formatDocumentVerificationData = (applicationId, formValues) => {
  return {
    application_id: parseInt(applicationId),
    personal_phone: formValues.personal_phone || '',
    phone_status: formValues.phone_status || '',
    personal_pan: formValues.personal_pan || '',
    pan_status: formValues.pan_status || '',
    personal_aadhar: formValues.personal_aadhar || '',
    aadhar_status: formValues.aadhar_status || '',
    personal_ref_name: formValues.personal_ref_name || '',
    personal_ref_mobile: formValues.personal_ref_mobile || '',
    personal_ref_email: formValues.personal_ref_email || '',
    personal_ref_relation: formValues.personal_ref_relation || '',
    personal_final_report: formValues.personal_final_report || ''
  };
};

}

// Create and export singleton instance
const personalVerificationService = new PersonalVerificationService();
export default personalVerificationService;