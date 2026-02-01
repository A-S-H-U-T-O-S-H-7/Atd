import api from '@/utils/axiosInstance';

export const complaintService = {
  async searchCustomer(loanNumber) {
    try {
      const response = await api.get(`/crm/complaint/search/${loanNumber}`);
      return response;
    } catch (error) {
      console.error('Error searching customer:', error);
      return null;
    }
  },

  // Add new complaint with file upload
  async addComplaint(complaintData) {
    try {
      const formData = new FormData();
      
      // Append all form data
      formData.append('customer_loan_no', complaintData.loanAcNo);
      formData.append('complaint_date', complaintData.complaintDate);
      formData.append('customer_name', complaintData.customerName);
      formData.append('customer_mobile', complaintData.mobileNo);
      formData.append('customer_email', complaintData.email);
      formData.append('complaint_belong', complaintData.loanProvider);
      
      if (complaintData.complaintDetails) {
        formData.append('complaint_details', complaintData.complaintDetails);
      }
      
      // Append files
      if (complaintData.complaintFiles && complaintData.complaintFiles.length > 0) {
        complaintData.complaintFiles.forEach((file, index) => {
          formData.append('complaint_docs', file);
        });
      }

      const response = await api.post('/crm/complaint/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      console.error('Error adding complaint:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add complaint. Please try again.';
      throw new Error(errorMessage);
    }
  },

  // Get all complaints with pagination
  async getComplaints(page = 1, search = '', status = '') {
    try {
      const params = {
        page,
        ...(search && { search }),
        ...(status && status !== 'all' && { status })
      };

      const response = await api.get('/crm/complaint/lists', { params });
      return response;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  },

  async getUsers() {
    try {
      const response = await api.get('/crm/complaint/user');
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Assign complaint
  async assignComplaint(complaintId, assignData) {
    try {
      const payload = {
        id: complaintId,
        complaintdetails: assignData.complaintDetails,
        complaintfor: assignData.complaintFor,
        complaintassignto: assignData.assignedTo
      };

      const response = await api.post('/crm/complaint/assign', payload);
      return response;
    } catch (error) {
      console.error('Error assigning complaint:', error);
      const errorMessage = error.response?.data?.message || 'Failed to assign complaint.';
      throw new Error(errorMessage);
    }
  },

  // Close complaint with resolution
  async closeComplaint(complaintId, resolutionData) {
    try {
      const payload = {
        id: complaintId,
        resolutionrekarms: resolutionData.resolutionRemarks,
        closedate: resolutionData.closeDate
      };

      const response = await api.post('/crm/complaint/resolution', payload);
      return response;
    } catch (error) {
      console.error('Error closing complaint:', error);
      const errorMessage = error.response?.data?.message || 'Failed to close complaint.';
      throw new Error(errorMessage);
    }
  },

  // Add final remarks
  async addFinalRemarks(complaintId, finalRemarks) {
    try {
      const payload = {
        id: complaintId,
        finel_remarks: finalRemarks
      };

      const response = await api.post('/crm/complaint/final-remarks', payload);
      return response;
    } catch (error) {
      console.error('Error adding final remarks:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add final remarks.';
      throw new Error(errorMessage);
    }
  },

  // Upload document
  async uploadDocument(complaintId, file, documentType) {
    try {
      const formData = new FormData();
      formData.append('id', complaintId.toString());
      formData.append('document_type', documentType);
      formData.append('file', file);

      const response = await api.post('/crm/complaint/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error uploading document:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload document.';
      throw new Error(errorMessage);
    }
  },
};

export default complaintService;