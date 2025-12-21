import * as Yup from 'yup';

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
  confirmPassword: Yup.string()
    .when('password', (password, schema) => {
      return password ? schema.required('Please confirm password') : schema;
    })
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  name: Yup.string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9+\s()-]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .trim(),
  type: Yup.string()
    .required('Admin type is required')
    .oneOf(['Super Admin', 'Admin'], 'Please select a valid admin type'),
  roleId: Yup.string()
    .required('Role ID is required')
    .trim(),
  providerId: Yup.string()
    .required('Provider ID is required')
    .trim(),
  isActive: Yup.string()
    .required('Status is required')
    .oneOf(['yes', 'no'], 'Please select status'),
  photo: Yup.mixed()
    .nullable()
    .test('fileSize', 'File too large', (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value) return true;
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(value.type);
    }),
  permissions: Yup.array().of(
    Yup.object().shape({
      page: Yup.string().required(),
      actions: Yup.array().of(Yup.string())
    })
  ).optional()
});

// Mock data
export const mockAdmins = [
  {
    id: 1,
    username: 'superadmin',
    name: 'Ashutosh',
    email: 'ashutosh@gamil.com',
    phone: '+91 9876543210',
    type: 'Super Admin',
    roleId: 'ROLE001',
    providerId: 'PROV001',
    isActive: 'yes',
    photo: null,
    addedBy: 'System',
    createdAt: '2024-01-15T10:30:00Z',
    permissions: [
      { page: 'Dashboard', actions: ['view', 'edit', 'delete'] },
      { page: 'Users', actions: ['view', 'add', 'edit', 'delete'] },
      { page: 'Reports', actions: ['view', 'generate'] }
    ]
  },
  {
    id: 2,
    username: 'admin1',
    name: 'Malay',
    email: 'malay@gmail.com',
    phone: '+91 8765432109',
    type: 'Admin',
    roleId: 'ROLE002',
    providerId: 'PROV002',
    isActive: 'yes',
    photo: null,
    addedBy: 'superadmin',
    createdAt: '2024-01-20T14:45:00Z',
    permissions: [
      { page: 'Dashboard', actions: ['view'] },
      { page: 'Users', actions: ['view', 'add'] }
    ]
  },
  // Add more mock data as needed
];