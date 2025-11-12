// validationSchema.js
import * as Yup from 'yup';

export const applicationValidationSchema = Yup.object({ 
  // Personal Details
  name: Yup.string().required('Full Name is required'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  fatherName: Yup.string().required("Father's Name is required"),
  phoneNo: Yup.string()
    .required('Phone No is required')
    .matches(/^[0-9]{10}$/, 'Phone No must be 10 digits'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  gender: Yup.string().required('Gender is required'),
  dob: Yup.object({
    day: Yup.string().required('Day is required'),
    month: Yup.string().required('Month is required'),
    year: Yup.string().required('Year is required'),
  }),

  // Current Address
  currentHouseNo: Yup.string().required('House/Building No is required'),
  currentAddress: Yup.string().required('Address is required'),
  currentState: Yup.string().required('State is required'),
  currentCity: Yup.string().required('City is required'),
  currentPinCode: Yup.string()
    .required('Pin Code is required')
    .matches(/^[0-9]{6}$/, 'Pin Code must be 6 digits'),
  currentAddressType: Yup.string().required('Address Type is required'),
  currentAddressCode: Yup.string().required('Address Code is required'),
  currentStateCode: Yup.string().required('State Code is required'),

  // Permanent Address
  permanentHouseNo: Yup.string().required('House/Building No is required'),
  permanentAddress: Yup.string().required('Address is required'),
  permanentState: Yup.string().required('State is required'),
  permanentCity: Yup.string().required('City is required'),
  permanentPinCode: Yup.string()
    .required('Pin Code is required')
    .matches(/^[0-9]{6}$/, 'Pin Code must be 6 digits'),
  permanentAddressType: Yup.string().required('Address Type is required'),
  permanentAddressCode: Yup.string().required('Address Code is required'),
  permanentStateCode: Yup.string().required('State Code is required'),

  // Organization Details
  organisationName: Yup.string().required('Organization Name is required'),
  organisationAddress: Yup.string().required('Organization Address is required'),
  designation: Yup.string().required('Designation is required'),
  grossMonthlySalary: Yup.number().required('Gross Monthly Salary is required').positive(),

  // Loan Details
  amountApplied: Yup.number().required('Amount Applied is required').positive(),
  amountApproved: Yup.number().required('Amount Approved is required').positive(),
  tenure: Yup.number().required('Tenure is required').positive(),
  roi: Yup.number().required('ROI is required').positive(),
  administrationFeePercent: Yup.string().required('Administration Fee % is required'),

  // Bank Details
  bankName: Yup.string().required('Bank Name is required'),
  branchName: Yup.string().required('Branch Name is required'),
  accountType: Yup.string().required('Account Type is required'),
  accountNo: Yup.string().required('Account Number is required'),
  ifscCode: Yup.string()
    .required('IFSC Code is required')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC Code'),
  panNo: Yup.string()
    .required('PAN Number is required')
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Number'),
  aadharNo: Yup.string()
    .required('Aadhar Number is required')
    .matches(/^[0-9]{12}$/, 'Aadhar must be 12 digits'),

  // Reference Details
  referenceName: Yup.string().required('Reference Name is required'),
  referenceMobile: Yup.string()
    .required('Reference Mobile is required')
    .matches(/^[0-9]{10}$/, 'Mobile must be 10 digits'),
  referenceRelation: Yup.string().required('Reference Relation is required'),
});