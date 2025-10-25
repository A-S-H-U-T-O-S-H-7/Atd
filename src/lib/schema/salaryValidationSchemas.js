  // lib/services/appraisal/salaryValidationSchemas.js
  import * as Yup from 'yup';

  export const salaryRemarkSchema = Yup.object().shape({
    remarks: Yup.string()
      .min(5, 'Remark must be at least 5 characters')
      .max(500, 'Remark cannot exceed 500 characters')
      .required('Remark is required')
  });

  export const householdIncomeSchema = Yup.object().shape({
    unit: Yup.string().required('Family unit is required'),
    annualIncome: Yup.number()
      .min(0, 'Income cannot be negative')
      .required('Annual income is required')
  });


  export const incomeVerificationSchema = Yup.object().shape({
    // Organization same as applied - both fields required
    organizationSameAsApplied: Yup.string().required('Organization verification is required'),
    organizationSameAsAppliedStatus: Yup.string().required('Organization status is required'),
    
    // Gross Salary - both fields required
    grossAmountSalary: Yup.string().required('Gross salary verification is required'),
    grossAmountSalaryStatus: Yup.string().required('Gross salary status is required'),
    
    // Net Salary - both fields required
    netAmountSalary: Yup.string().required('Net salary verification is required'),
    netAmountSalaryStatus: Yup.string().required('Net salary status is required'),
    
    // Salary Date - required
    salaryDate: Yup.string().required('Salary date is required'),
    
    // Final Report - required
    incomeVerificationFinalReport: Yup.string().required('Final report is required'),

   monthsOfEmployment: Yup.number()
    .required('Months of employment is required')
    .min(1, 'Months of employment over last one year must be at least 1')  
    .max(12, 'Months cannot exceed 12'),
  
  selfReportedMonthlyIncome: Yup.number()
    .required('Self-reported monthly income is required')
    .min(1, 'Self-reported monthly income must be greater than 0')  
    .positive('Self-reported monthly income be positive'),
    
    // Optional fields
    availabilityOfBasicAmenities: Yup.string().optional(),
    availabilityOfOtherAssets: Yup.string().optional(),
    primarySourceOfIncome: Yup.string().optional(),
    natureOfWork: Yup.string().optional(),
    frequencyOfIncome: Yup.string().optional()
  });