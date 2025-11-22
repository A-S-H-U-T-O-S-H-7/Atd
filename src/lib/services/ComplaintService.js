// services/complaintService.js
import api from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';

export const complaintService = {
  // Add new complaint
  async addComplaint(complaintData) {
    try {
      const payload = {
        complaintdate: complaintData.complaintDate,
        customername: complaintData.customerName,
        customerphone: complaintData.mobileNo,
        customeremail: complaintData.email,
        customerloan: complaintData.loanAcNo,
        loan_belong_to: complaintData.loanProvider
      };

      const response = await api.post('/crm/complaint/add', payload);
      toast.success('Complaint added successfully!');
      return response;
    } catch (error) {
      console.error('Error adding complaint:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add complaint. Please try again.';
      toast.error(errorMessage);
      throw error;
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
      toast.error('Failed to fetch complaints');
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