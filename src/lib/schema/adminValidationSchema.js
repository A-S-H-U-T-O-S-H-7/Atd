import * as Yup from 'yup';

// Updated validation schema based on API
export const adminSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .trim(),
  password: Yup.string()
    .when('$isEditMode', (isEditMode, schema) => {
      return isEditMode ? schema : schema.required('Password is required');
    })
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  name: Yup.string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: Yup.string()
    .email('Please enter a valid email address')
    .nullable()
    .transform((value) => value === '' ? null : value),
  phone: Yup.string()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .matches(/^[0-9+\s()-]*$/, 'Please enter a valid phone number'),
  type: Yup.string()
    .required('Admin type is required')
    .oneOf(['user', 'verifier', 'account', 'manager', 'admin', 'superadmin', 'collection', 'agency'], 'Please select a valid admin type'),
  isActive: Yup.string()
    .required('Status is required')
    .oneOf(['1', '0'], 'Please select status'),
  selfie: Yup.mixed()
    .nullable()
    .test('fileSize', 'File too large', (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value) return true;
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(value.type);
    })
});

// Type options for dropdown
export const adminTypes = [
  { value: 'user', label: 'User' },
  { value: 'verifier', label: 'Verifier' },
  { value: 'account', label: 'Account' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Super Admin' },
  { value: 'collection', label: 'Collection' },
  { value: 'agency', label: 'Agency' }
];

// Status options for dropdown
export const statusOptions = [
  { value: '1', label: 'Active' },
  { value: '0', label: 'Inactive' }
];