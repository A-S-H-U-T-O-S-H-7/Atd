"use client";
import api from '@/utils/axiosInstance';
import Swal from 'sweetalert2';

export const blacklistService = {
  blacklistApplication: async (userId, options = {}) => {
    const {
      showConfirmation = true,
      isDark = false,
      onSuccess,
      onError
    } = options;

    try {
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

      const responseData = await api.put(`/crm/application/black-list/${userId}`);

      if (!responseData.success) {
        throw new Error(responseData.message || 'Blacklist failed');
      }

      if (showConfirmation) {
        await Swal.fire({
          title: 'Application Blacklisted!',
          text: responseData.message || 'Application has been blacklisted successfully.',
          icon: 'success',
          confirmButtonColor: '#ef4444',
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
        });
      }

      if (onSuccess) {
        onSuccess(responseData);
      }

      return responseData;

    } catch (error) {
      let errorMessage = 'Failed to blacklist application. Please try again.';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'User not found. Please check the user ID.';
        } else if (error.response.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to blacklist users.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
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

export default blacklistService;