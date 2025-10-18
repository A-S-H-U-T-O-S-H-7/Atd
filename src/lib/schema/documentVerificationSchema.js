import * as yup from 'yup';

export const documentVerificationSchema = yup.object({
  // Phone Verification
  phoneVerified: yup.string().required('Phone verification status is required'),
  phoneStatus: yup.string().required('Phone status is required'),
  
  // PAN Verification
  panVerified: yup.string().required('PAN verification status is required'),
  panStatus: yup.string().required('PAN status is required'),
  
  // Aadhar Verification
  aadharVerified: yup.string().required('Aadhar verification status is required'),
  aadharStatus: yup.string().required('Aadhar status is required'),
  aadharPanLinked: yup.string().required('Aadhar-PAN link status is required'),
  
  // Reference Verification
  refNameVerified: yup.string().required('Reference name verification is required'),
  refPhoneVerified: yup.string().required('Reference phone verification is required'),
  refEmailVerified: yup.string().required('Reference email verification is required'),
  refRelationVerified: yup.string().required('Reference relation verification is required'),
  
  // Final Report
  finalReport: yup.string().required('Final report is required'),
});