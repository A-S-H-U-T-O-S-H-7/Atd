import * as Yup from "yup";

export const RegistrationValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Only letters and spaces allowed')
    .min(2, 'Minimum 2 characters')
    .max(50, 'Maximum 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Only letters and spaces allowed')
    .min(2, 'Minimum 2 characters')
    .max(50, 'Maximum 50 characters')
    .required('Last name is required'),
  phoneNumber: Yup.string()
    .matches(/^[6-9][0-9]{9}$/, 'Phone number must be 10 digits starting with 6-9')
    .required('Phone number is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  panNumber: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g., ABCDE1234F)')
    .required('PAN number is required'),
  aadharNumber: Yup.string()
    .matches(/^[2-9][0-9]{11}$/, 'Aadhar number must be 12 digits starting with 2-9')
    .required('Aadhar number is required'),
  companyName: Yup.string()
    .min(2, 'Minimum 2 characters')
    .max(255, 'Maximum 255 characters')
    .required('Company name is required'),
  netSalary: Yup.number()
    .min(18000, 'Minimum salary is ₹18,000')
    .required('Net salary is required'),
  dob: Yup.date()
    .max(new Date(), 'Date cannot be in future')
    .test('age', 'You must be at least 18 years old', function(value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 18;
    })
    .required('Date of birth is required'),
  agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to terms and conditions')
});

export const formatMobileNumber = (value) => value.replace(/\D/g, "").slice(0, 10);
export const formatAadharNumber = (value) => value.replace(/\D/g, "").slice(0, 12);
export const formatPanNumber = (value) => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);