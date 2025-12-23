import api from "@/utils/axiosInstance";

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString || 'N/A';
  }
};

export const ticketAPI = {
  getTickets: async (params = {}) => {
    try {
      const response = await api.get("/crm/help/manage", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getTicketById: async (ticketId) => {
    try {
      const response = await api.get(`/crm/help/edit/${ticketId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createTicket: async (formData) => {
    try {
      const response = await api.post("/crm/help/create-help", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateTicketStatus: async (ticketId, statusData) => {
    try {
      const response = await api.put(`/crm/help/status/${ticketId}`, statusData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  assignTicket: async (ticketId, assignData) => {
    try {
      const response = await api.put(`/crm/help/assign/${ticketId}`, assignData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  addMessage: async (ticketId, messageData) => {
    try {
      const response = await api.post(`/crm/help/update/${ticketId}`, messageData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getUsers: async () => {
    try {
      const response = await api.get("/crm/help/users");
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export const formatTicketForUI = (ticket) => {
  if (!ticket) return null;

  const getFileName = (url) => {
    if (!url) return '';
    return url.split('/').pop() || 'file';
  };

  return {
    id: ticket.id,
    ticketId: ticket.token || `TKT-${ticket.id}`,
    subject: ticket.subject || '',
    description: ticket.description || '',
    priority: ticket.priority || 'medium',
    type: ticket.type || 'issue',
    category: ticket.category || 'other',
    status: ticket.status || 'Pending',
    createdBy: {
      id: ticket.admin?.id,
      name: ticket.admin?.username || ticket.created_by || 'Unknown',
      email: null
    },
    assignedTo: ticket.assigned_to ? {
      id: ticket.assigned_to.id,
      name: ticket.assigned_to.username || 'Unassigned',
      email: ticket.assigned_to.email || null
    } : null,
    createdAt: ticket.created_at,
    updatedAt: ticket.updated_at,
    messages: ticket.replies || [],
    messageCount: ticket.replies?.length || 0,
    createdDate: formatDate(ticket.created_at),
    attachments: ticket.documents || [],
    admin: ticket.admin
  };
};

export const ticketService = {
  updateStatus: async (ticketId, status, userId) => {
    const statusData = {
      status: status,
      updated_by: userId
    };
    return await ticketAPI.updateTicketStatus(ticketId, statusData);
  },

  assignTicket: async (ticketId, assigneeId, userId) => {
    const assignData = {
      assign_to: assigneeId,
      assigned_by: userId
    };
    return await ticketAPI.assignTicket(ticketId, assignData);
  },

  addMessage: async (ticketId, messageData) => {
    return await ticketAPI.addMessage(ticketId, messageData);
  }
};

export default {
  ticketAPI,
  formatTicketForUI,
  ticketService,
  formatDate
};