import * as Yup from 'yup';

export const bankFormValidationSchema = Yup.object().shape({
  bankAutoVerification: Yup.string().required('Auto verification is required'),
  bankAutoVerificationStatus: Yup.string().required('Auto verification status is required'),
  
  bankIsSalaryAccount: Yup.string().required('Salary account verification is required'),
  bankIsSalaryAccountStatus: Yup.string().required('Salary account status is required'),
  
  bankSalaryCreditedRegular: Yup.string().required('Regular interval status is required'),
  bankSalaryCreditedRegularStatus: Yup.string().required('Regular interval status is required'),
  
  bankVerificationFinalReport: Yup.string().required('Final report is required'),
  
  // EMI fields
  bankAnyEmiDebited: Yup.string().required('EMI debit status is required'),
  bankEmiAmountInStatement: Yup.number()
    .when('bankAnyEmiDebited', {
      is: 'Yes',
      then: (schema) => schema.required('EMI amount is required when EMI is debited').min(1, 'EMI amount must be greater than 0'),
      otherwise: (schema) => schema.optional().default(0)
    }),
  bankIsEmiWithBankStatement: Yup.string()
    .required('EMI with bank statement verification is required') 
    .oneOf(['Yes', 'No'], 'Please select EMI with bank statement status'),
});