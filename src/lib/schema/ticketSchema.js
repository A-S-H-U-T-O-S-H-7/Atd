import * as Yup from 'yup';

export const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

export const typeOptions = [
  { value: 'issue', label: 'Issue' },
  { value: 'request', label: 'Request' },
  { value: 'complaint', label: 'Complaint' }
];

export const statusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Open', label: 'Open' },
  { value: 'Process', label: 'Process' },
  { value: 'Closed', label: 'Closed' }
];

export const categoryOptions = [
  { value: 'ui_ux', label: 'UI/UX' },
  { value: 'backend', label: 'Backend' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'payment', label: 'Payment' },
  { value: 'database', label: 'Database' },
  { value: 'other', label: 'Other' }
];

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
    .oneOf(['low', 'medium', 'high'], 'Please select valid priority'),
  type: Yup.string()
    .required('Type is required')
    .oneOf(['issue', 'request', 'complaint'], 'Please select valid type'),
  category: Yup.string()
    .required('Category is required')
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must be less than 50 characters')
    .trim()
});