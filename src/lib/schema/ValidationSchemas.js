// lib/services/appraisal/validationSchemas.js
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';

// Common validation messages
const validationMessages = {
  required: 'This field is required',
  invalidPhone: 'Please enter a valid 10-digit Indian mobile number starting with 6-9',
  invalidEmail: 'Please enter a valid email address',
  invalidPAN: 'Invalid PAN format. Expected: ABCDE1234F',
  invalidAadhar: 'Invalid Aadhar format. Expected 12 digits',
  minLength: (field, length) => `${field} must be at least ${length} characters`,
  maxLength: (field, length) => `${field} must not exceed ${length} characters`
};

// Phone validation schema
export const phoneSchema = Yup.string()
  .matches(/^[6-9]\d{9}$/, validationMessages.invalidPhone)
  .required(validationMessages.required);

// Email validation schema
export const emailSchema = Yup.string()
  .email(validationMessages.invalidEmail)
  .optional();

// PAN validation schema
export const panSchema = Yup.string()
  .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, validationMessages.invalidPAN)
  .required(validationMessages.required);

// Aadhar validation schema
export const aadharSchema = Yup.string()
  .matches(/^\d{12}$/, validationMessages.invalidAadhar)
  .required(validationMessages.required);

// Name validation schema
export const nameSchema = Yup.string()
  .min(2, validationMessages.minLength('Name', 2))
  .max(100, validationMessages.maxLength('Name', 100))
  .required(validationMessages.required);

// Address validation schema
export const addressSchema = Yup.string()
  .min(10, validationMessages.minLength('Address', 10))
  .max(500, validationMessages.maxLength('Address', 500))
  .required(validationMessages.required);

// Reference validation schema
export const referenceSchema = Yup.object().shape({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  relation: Yup.string().optional(),
  verified: Yup.boolean().default(false)
});

// Personal information validation schema
export const personalInfoSchema = Yup.object().shape({
  fatherName: nameSchema,
  currentAddress: addressSchema,
  permanentAddress: addressSchema
});

// Alternative numbers validation schema
export const alternativeNumbersSchema = Yup.object().shape({
  alternateMobileNo1: phoneSchema.optional(),
  alternateMobileNo2: phoneSchema.optional(),
  remark: Yup.string().max(1000, validationMessages.maxLength('Remark', 1000)).optional()
});

// Document verification validation schema
export const documentVerificationSchema = Yup.object().shape({
  phoneVerified: Yup.string().oneOf(['Yes', 'No'], 'Please select verification status'),
  phoneStatus: Yup.string().oneOf(['Positive', 'Negative'], 'Please select phone status'),
  panVerified: Yup.string().oneOf(['Yes', 'No'], 'Please select PAN verification status'),
  panStatus: Yup.string().oneOf(['Positive', 'Negative'], 'Please select PAN status'),
  aadharVerified: Yup.string().oneOf(['Yes', 'No'], 'Please select Aadhar verification status'),
  aadharStatus: Yup.string().oneOf(['Positive', 'Negative'], 'Please select Aadhar status'),
  finalReport: Yup.string().oneOf(['Positive', 'Negative'], 'Please select final report status')
});

// Relation Reference validation schema
export const relationReferenceSchema = Yup.object().shape({
  name: Yup.string().required(validationMessages.required),
  phone: phoneSchema,
  email: emailSchema,
  relation: Yup.string().required(validationMessages.required)
});

// Relation Reference Verification schema
export const relationReferenceVerificationSchema = Yup.object().shape({
  refNameVerified: Yup.string().oneOf(['Yes', 'No'], 'Please select name verification status'),
  refPhoneVerified: Yup.string().oneOf(['Yes', 'No'], 'Please select phone verification status'),
  refEmailVerified: Yup.string().oneOf(['Yes', 'No'], 'Please select email verification status'),
  refRelationVerified: Yup.string().oneOf(['Yes', 'No'], 'Please select relation verification status')
});

// Helper function to show validation errors as toasts
export const showValidationError = (error) => {
  if (error instanceof Yup.ValidationError) {
    toast.error(error.message);
    return error.message;
  }
  return null;
};

// Helper function to validate form data
export const validateFormData = async (schema, data) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: null };
  } catch (error) {
    const errors = {};
    error.inner.forEach(err => {
      errors[err.path] = err.message;
    });
    return { isValid: false, errors };
  }
};