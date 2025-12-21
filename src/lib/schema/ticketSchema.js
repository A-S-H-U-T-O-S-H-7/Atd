import * as Yup from 'yup';

// Validation schema for ticket creation
export const ticketSchema = Yup.object().shape({
  subject: Yup.string()
    .required('Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim(),
  priority: Yup.string()
    .required('Priority is required')
    .oneOf(['low', 'medium', 'high', 'critical'], 'Please select valid priority'),
  type: Yup.string()
    .required('Type is required')
    .oneOf(['bug', 'feature', 'question', 'enhancement'], 'Please select valid type'),
  category: Yup.string()
    .required('Category is required')
    .oneOf(['ui_ux', 'backend', 'mobile', 'payment', 'database', 'other'], 'Please select valid category'),
  attachments: Yup.array()
    .of(
      Yup.mixed()
        .test('fileSize', 'File too large', (value) => {
          if (!value) return true;
          return value.size <= 5 * 1024 * 1024; // 5MB
        })
        .test('fileType', 'Unsupported file format', (value) => {
          if (!value) return true;
          return [
            'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
            'application/pdf', 'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain', 'application/zip'
          ].includes(value.type);
        })
    )
    .max(5, 'Maximum 5 files allowed')
});

// Mock data
export const mockTickets = [
  {
    id: 1,
    ticketId: "ATD-2024-001",
    subject: "Payment gateway not working on mobile",
    description: "Users are unable to complete payments when using the mobile app. The payment button shows loading but never processes.",
    priority: "high",
    type: "bug",
    category: "payment",
    status: "in_progress",
    createdBy: { id: 1, name: "Manoranjan", email: "manoranjan@atdgroup.in" },
    assignedTo: { id: 2, name: "Rajesh Kumar", email: "rajesh@atdgroup.in" },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:45:00Z",
    messages: [
      {
        id: 1,
        user: { id: 1, name: "Manoranjan", avatar: null },
        message: "Having this issue since yesterday. Please check ASAP.",
        createdAt: "2024-01-15T10:30:00Z",
        type: "message"
      },
      {
        id: 2,
        user: { id: 2, name: "Rajesh Kumar", avatar: null },
        message: "Looking into it. Can you share the error logs?",
        createdAt: "2024-01-15T11:15:00Z",
        type: "message"
      },
      {
        id: 3,
        user: { id: 1, name: "Manoranjan", avatar: null },
        message: "Sent the logs to your email. Let me know if you need anything else.",
        createdAt: "2024-01-15T11:45:00Z",
        type: "message"
      },
      {
        id: 4,
        user: { id: 2, name: "Rajesh Kumar", avatar: null },
        message: "Found the issue. Fixing it now.",
        createdAt: "2024-01-16T09:30:00Z",
        type: "status_change",
        metadata: { from: "open", to: "in_progress" }
      }
    ],
    attachments: []
  },
  {
    id: 2,
    ticketId: "ATD-2024-002",
    subject: "Add dark mode feature",
    description: "Users have requested dark mode for better night-time usage. Should be toggleable in settings.",
    priority: "medium",
    type: "feature",
    category: "ui_ux",
    status: "open",
    createdBy: { id: 3, name: "Abhishek", email: "abhishek@atdgroup.in" },
    assignedTo: null,
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
    messages: [
      {
        id: 1,
        user: { id: 3, name: "Abhishek", avatar: null },
        message: "This feature would improve user experience significantly.",
        createdAt: "2024-01-14T09:15:00Z",
        type: "message"
      }
    ],
    attachments: []
  },
  {
    id: 3,
    ticketId: "ATD-2024-003",
    subject: "Dashboard performance slow",
    description: "The CRM dashboard takes too long to load, especially with large datasets. Need optimization.",
    priority: "high",
    type: "bug",
    category: "backend",
    status: "open",
    createdBy: { id: 4, name: "Kisan", email: "kisan@atdgroup.in" },
    assignedTo: null,
    createdAt: "2024-01-13T14:20:00Z",
    updatedAt: "2024-01-13T14:20:00Z",
    messages: [],
    attachments: []
  },
  {
    id: 4,
    ticketId: "ATD-2023-156",
    subject: "User registration form validation",
    description: "Need to add better validation for phone numbers in registration form.",
    priority: "low",
    type: "enhancement",
    category: "ui_ux",
    status: "resolved",
    createdBy: { id: 1, name: "Manoranjan", email: "manoranjan@atdgroup.in" },
    assignedTo: { id: 5, name: "Priya Sharma", email: "priya@atdgroup.in" },
    createdAt: "2023-12-20T11:10:00Z",
    updatedAt: "2023-12-22T16:30:00Z",
    messages: [
      {
        id: 1,
        user: { id: 1, name: "Manoranjan", avatar: null },
        message: "Current validation accepts invalid phone numbers.",
        createdAt: "2023-12-20T11:10:00Z",
        type: "message"
      },
      {
        id: 2,
        user: { id: 5, name: "Priya Sharma", avatar: null },
        message: "Working on adding proper regex validation.",
        createdAt: "2023-12-21T10:15:00Z",
        type: "message"
      },
      {
        id: 3,
        user: { id: 5, name: "Priya Sharma", avatar: null },
        message: "Fixed and deployed. Please test.",
        createdAt: "2023-12-22T16:30:00Z",
        type: "status_change",
        metadata: { from: "in_progress", to: "resolved" }
      }
    ],
    attachments: []
  },
  {
    id: 5,
    ticketId: "ATD-2023-142",
    subject: "Database backup schedule",
    description: "Question about current database backup frequency and retention policy.",
    priority: "low",
    type: "question",
    category: "database",
    status: "closed",
    createdBy: { id: 6, name: "Rahul Verma", email: "rahul@atdgroup.in" },
    assignedTo: { id: 7, name: "Admin System", email: "admin@atdgroup.in" },
    createdAt: "2023-11-28T15:45:00Z",
    updatedAt: "2023-11-29T10:20:00Z",
    messages: [
      {
        id: 1,
        user: { id: 6, name: "Rahul Verma", avatar: null },
        message: "What's the current backup schedule?",
        createdAt: "2023-11-28T15:45:00Z",
        type: "message"
      },
      {
        id: 2,
        user: { id: 7, name: "Admin System", avatar: null },
        message: "Daily at 2 AM, retained for 30 days.",
        createdAt: "2023-11-29T10:20:00Z",
        type: "message"
      },
      {
        id: 3,
        user: { id: 7, name: "Admin System", avatar: null },
        message: "Marking as closed.",
        createdAt: "2023-11-29T10:20:00Z",
        type: "status_change",
        metadata: { from: "resolved", to: "closed" }
      }
    ],
    attachments: []
  }
];

// Priority options
export const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800', darkColor: 'bg-gray-700 text-gray-300' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', darkColor: 'bg-yellow-700 text-yellow-300' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', darkColor: 'bg-orange-700 text-orange-300' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800', darkColor: 'bg-red-700 text-red-300' }
];

// Status options
export const statusOptions = [
  { value: 'open', label: 'Open', color: 'bg-blue-100 text-blue-800', darkColor: 'bg-blue-700 text-blue-300' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', darkColor: 'bg-yellow-700 text-yellow-300' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800', darkColor: 'bg-green-700 text-green-300' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800', darkColor: 'bg-gray-700 text-gray-300' }
];

// Type options
export const typeOptions = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'question', label: 'Question' },
  { value: 'enhancement', label: 'Enhancement' }
];

// Category options
export const categoryOptions = [
  { value: 'ui_ux', label: 'UI/UX' },
  { value: 'backend', label: 'Backend' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'payment', label: 'Payment' },
  { value: 'database', label: 'Database' },
  { value: 'other', label: 'Other' }
];

// Format date helper
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
  } catch (error) {
    return 'Invalid Date';
  }
};

// Format date only (without time)
export const formatDateOnly = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};