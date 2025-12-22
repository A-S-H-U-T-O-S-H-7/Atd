import { mockTickets, formatDate, formatDateOnly } from '@/lib/schema/ticketSchema';

// Generate next ticket ID
const generateTicketId = () => {
  const currentYear = new Date().getFullYear();
  const lastTicket = mockTickets[0]; // Assuming sorted by latest
  if (!lastTicket) return `ATD-${currentYear}-001`;
  
  const match = lastTicket.ticketId.match(/ATD-(\d+)-(\d+)/);
  if (match) {
    const year = parseInt(match[1]);
    const number = parseInt(match[2]);
    if (year === currentYear) {
      return `ATD-${currentYear}-${(number + 1).toString().padStart(3, '0')}`;
    }
  }
  return `ATD-${currentYear}-001`;
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const ticketService = {
  // Get all tickets with filters
  getTickets: async (params = {}) => {
    await delay(500); // Simulate network delay
    
    let filteredTickets = [...mockTickets];
    
    // Apply search
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.subject.toLowerCase().includes(searchTerm) ||
        ticket.ticketId.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm) ||
        ticket.createdBy.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (params.status && params.status !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === params.status);
    }
    
    // Apply priority filter
    if (params.priority && params.priority !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === params.priority);
    }
    
    // Apply type filter
    if (params.type && params.type !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.type === params.type);
    }
    
    // Apply category filter
    if (params.category && params.category !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.category === params.category);
    }
    
    // Sort by latest first
    filteredTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Pagination
    const page = params.page || 1;
    const perPage = params.perPage || 10;
    const startIndex = (page - 1) * perPage;
    const paginatedTickets = filteredTickets.slice(startIndex, startIndex + perPage);
    
    return {
      success: true,
      data: paginatedTickets,
      pagination: {
        total: filteredTickets.length,
        current_page: page,
        per_page: perPage,
        total_pages: Math.ceil(filteredTickets.length / perPage)
      }
    };
  },
  
  // Get single ticket by ID
  getTicketById: async (id) => {
    await delay(300);
    
    const ticket = mockTickets.find(t => t.id === parseInt(id) || t.ticketId === id);
    
    if (ticket) {
      return {
        success: true,
        data: ticket
      };
    }
    
    return {
      success: false,
      message: 'Ticket not found'
    };
  },
  
  // Create new ticket
  createTicket: async (ticketData) => {
    await delay(800);
    
    const newTicket = {
      id: mockTickets.length + 1,
      ticketId: generateTicketId(),
      ...ticketData,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
      attachments: []
    };
    
    // In real implementation, this would be saved to backend
    // For mock, we'll just return success
    return {
      success: true,
      data: newTicket,
      message: 'Ticket created successfully'
    };
  },
  
  // Update ticket status
  updateTicketStatus: async (id, status, userId) => {
    await delay(400);
    
    const ticket = mockTickets.find(t => t.id === parseInt(id) || t.ticketId === id);
    
    if (ticket) {
      const oldStatus = ticket.status;
      ticket.status = status;
      ticket.updatedAt = new Date().toISOString();
      
      // Add status change message
      ticket.messages.push({
        id: ticket.messages.length + 1,
        user: { id: userId, name: 'System' },
        message: `Status changed from ${oldStatus} to ${status}`,
        createdAt: new Date().toISOString(),
        type: 'status_change',
        metadata: { from: oldStatus, to: status }
      });
      
      return {
        success: true,
        data: ticket,
        message: 'Ticket status updated'
      };
    }
    
    return {
      success: false,
      message: 'Ticket not found'
    };
  },
  
  // Assign ticket
  assignTicket: async (id, assigneeId, userId) => {
    await delay(400);
    
    const ticket = mockTickets.find(t => t.id === parseInt(id) || t.ticketId === id);
    
    if (ticket) {
      const oldAssignee = ticket.assignedTo;
      ticket.assignedTo = assigneeId ? { id: assigneeId, name: 'Developer Name' } : null;
      ticket.updatedAt = new Date().toISOString();
      
      // Add assignment message
      ticket.messages.push({
        id: ticket.messages.length + 1,
        user: { id: userId, name: 'System' },
        message: assigneeId 
          ? `Ticket assigned to Developer Name` 
          : 'Ticket unassigned',
        createdAt: new Date().toISOString(),
        type: 'assignment',
        metadata: { from: oldAssignee?.name || 'Unassigned', to: assigneeId ? 'Developer Name' : 'Unassigned' }
      });
      
      return {
        success: true,
        data: ticket,
        message: 'Ticket assignment updated'
      };
    }
    
    return {
      success: false,
      message: 'Ticket not found'
    };
  },
  
  // Add message to ticket
  addMessage: async (id, messageData) => {
    await delay(400);
    
    const ticket = mockTickets.find(t => t.id === parseInt(id) || t.ticketId === id);
    
    if (ticket) {
      const newMessage = {
        id: ticket.messages.length + 1,
        user: messageData.user,
        message: messageData.message,
        createdAt: new Date().toISOString(),
        type: 'message',
        attachments: messageData.attachments || []
      };
      
      ticket.messages.push(newMessage);
      ticket.updatedAt = new Date().toISOString();
      
      return {
        success: true,
        data: newMessage,
        message: 'Message added successfully'
      };
    }
    
    return {
      success: false,
      message: 'Ticket not found'
    };
  },
  
  
};

// Format ticket for UI
export const formatTicketForUI = (ticket) => {
  return {
    id: ticket.id,
    ticketId: ticket.ticketId,
    subject: ticket.subject,
    description: ticket.description,
    priority: ticket.priority,
    type: ticket.type,
    category: ticket.category,
    status: ticket.status,
    createdBy: ticket.createdBy,
    assignedTo: ticket.assignedTo,
    createdAt: formatDate(ticket.createdAt),
    updatedAt: formatDate(ticket.updatedAt),
    createdDate: formatDateOnly(ticket.createdAt),
    messageCount: ticket.messages?.length || 0,
    hasUnread: false
  };
};