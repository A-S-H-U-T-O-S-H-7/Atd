import * as yup from 'yup';

export const documentVerificationSchema = yup.object({
  // USE CORRECT FIELD NAMES:
  personal_phone: yup.string().required('Phone verification status is required'),
  phone_status: yup.string().required('Phone status is required'),
  
  personal_pan: yup.string().required('PAN verification status is required'),
  pan_status: yup.string().required('PAN status is required'),
  
  personal_aadhar: yup.string().required('Aadhar verification status is required'),
  aadhar_status: yup.string().required('Aadhar status is required'),
  
  // Reference fields (keep as they are correct)
  personal_ref_name: yup.string().required('Reference name verification is required'),
  personal_ref_mobile: yup.string().required('Reference phone verification is required'),
  personal_ref_email: yup.string().required('Reference email verification is required'),
  personal_ref_relation: yup.string().required('Reference relation verification is required'),
  
  // Final report 
  personal_final_report: yup.string().required('Final report is required'),
});