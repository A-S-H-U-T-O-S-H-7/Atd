// lib/services/appraisal/cibilValidationSchemas.js
import * as Yup from 'yup';

export const cibilRemarkSchema = Yup.object().shape({
  remarks: Yup.string()
    .min(5, 'Remark must be at least 5 characters')
    .max(500, 'Remark cannot exceed 500 characters')
    .required('Remark is required')
});

export const cibilVerificationSchema = Yup.object().shape({
  cibil_score: Yup.number()
    .min(300, 'CIBIL score must be between 300-900')
    .max(900, 'CIBIL score must be between 300-900')
    .required('CIBIL score is required'),
  score_status: Yup.string().required('Score status is required'),
  total_active_amount: Yup.number().min(0, 'Active loans cannot be negative').required('Active loans field is required'),
  total_active_amount_status: Yup.string().required('Active loans status is required'),
  total_closed_amount: Yup.number().min(0, 'Closed loans cannot be negative').required('Closed loans field is required'),
  total_closed_amount_status: Yup.string().required('Closed loans status is required'),
  write_off_settled: Yup.number().min(0, 'Write-offs cannot be negative').required('Write-offs field is required'),
  write_off_settled_status: Yup.string().required('Write-offs status is required'),
  overdue: Yup.number().min(0, 'Overdue cannot be negative').required('Overdue field is required'),
  overdue_status: Yup.string().required('Overdue status is required'),
  dpd: Yup.string().required('DPD status is required'),
  dpd_status: Yup.string().required('DPD verification status is required'),
  cibil_final_report: Yup.string().required('Final report is required'),
  comment: Yup.string() 
    .required('Comments are required')
    .min(1, 'Comments cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters')

});

export const cibilScoreAssessmentSchema = Yup.object().shape({
  cibil_score: Yup.number().min(300).max(900),
  dpd: Yup.string(),
  write_off_settled: Yup.number().min(0)
});