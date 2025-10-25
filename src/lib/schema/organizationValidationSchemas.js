import * as Yup from 'yup';

export const organizationFormValidationSchema = Yup.object().shape({
  // Organization Verification
  organizationVerificationStatus: Yup.string().required('Online verification status is required'),
  organizationVerificationMethod: Yup.string().required('Online verification method is required'),
  
  // Company Phone
  companyPhoneVerificationStatus: Yup.string().required('Company phone verification is required'),
  companyPhoneVerificationMethod: Yup.string().required('Company phone status is required'),
  
  // HR Phone
  hrPhoneVerificationStatus: Yup.string().required('HR phone verification is required'),
  hrPhoneVerificationMethod: Yup.string().required('HR phone status is required'),
  
  // HR Contact
  hrContactVerificationStatus: Yup.string().required('HR contact verification is required'),
  
  // HR Email
  hrEmailVerificationStatus: Yup.string().required('HR email verification is required'),
  hrEmailVerificationMethod: Yup.string().required('HR email status is required'),
  
  // Company Website
  companyWebsiteStatus: Yup.string().required('Company website status is required'),
  
  // Final Report
  organizationFinalReport: Yup.string().required('Final report is required')
});

export const organizationRemarkSchema = Yup.object().shape({
  remarks: Yup.string()
    .min(5, 'Remark must be at least 5 characters')
    .max(500, 'Remark cannot exceed 500 characters')
    .required('Remark is required')
});