"use client";
import api from '@/utils/axiosInstance';
import Swal from 'sweetalert2';

export const blacklistService = {
  blacklistApplication: async (applicationId, options = {}) => {
    const {
      showConfirmation = true,
      isDark = false,
      onSuccess,
      onError
    } = options;

    try {
      // Show confirmation dialog if enabled
      if (showConfirmation) {
        const result = await Swal.fire({
          title: 'Blacklist Application?',
          text: 'This action cannot be undone. The user will be added to blacklist.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Yes, Blacklist!',
          cancelButtonText: 'Cancel',
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
        });

        if (!result.isConfirmed) {
          return { cancelled: true };
        }
      }

      console.log('🔄 Attempting to blacklist application ID:', applicationId);
      console.log('📝 Full URL:', `/crm/application/black-list/${applicationId}`);

      // Make API call
      const response = await api.put(`/crm/application/black-list/${applicationId}`);
      
      console.log('✅ API Response:', response);
      console.log('✅ Response Data:', response.data);

      // FIX: Check response.success instead of response.data.success
      if (!response.success) {
        console.error('❌ API returned success: false');
        console.error('❌ API message:', response.message);
        throw new Error(response.message || 'Blacklist failed');
      }

      console.log('🎯 Blacklist successful');

      // Show success message
      if (showConfirmation) {
        await Swal.fire({
          title: 'Application Blacklisted!',
          text: response.message || 'Application has been blacklisted successfully.',
          icon: 'success',
          confirmButtonColor: '#ef4444',
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
        });
      }

      if (onSuccess) {
        onSuccess(response);
      }

      return response;

    } catch (error) {
      console.error('💥 Blacklist error details:');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to blacklist application. Please try again.';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Application not found. Please check the application ID.';
        } else if (error.response.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to blacklist applications.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.message) {
          errorMessage = error.response.message;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (showConfirmation) {
        await Swal.fire({
          title: 'Blacklist Failed!',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
        });
      }

      if (onError) {
        onError(error, errorMessage);
      }

      throw error;
    }
  },

  isBlacklisted: (application) => {
    return application.blacklist === 1 || application.isBlacklisted === true;
  },

  getBlacklistDate: (application) => {
    return application.blacklistdate || application.blacklistDate || null;
  }
};

// Add debug function that uses the imported api
export const debugBlacklist = async (applicationId) => {
  console.log('🔍 === BLACKLIST DEBUG START ===');
  console.log('Application ID:', applicationId);
  console.log('ID Type:', typeof applicationId);
  
  try {
    // Use the imported api instance
    const testResponse = await api.put(`/crm/application/black-list/${applicationId}`);
    console.log('✅ Manual test response:', testResponse);
    console.log('✅ Manual test response data:', testResponse.data);
    return testResponse;
  } catch (testError) {
    console.log('❌ Manual test error:', testError);
    console.log('❌ Manual test error response:', testError.response?.data);
    throw testError;
  }
};

export default blacklistService;