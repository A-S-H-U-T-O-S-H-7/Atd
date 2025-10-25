// lib/services/appraisal/socialScoreValidationSchemas.js
import * as Yup from 'yup';

export const socialScoreRemarkSchema = Yup.object().shape({
  remarks: Yup.string()
    .min(2, 'Remark must be at least 2 characters')
    .max(500, 'Remark cannot exceed 500 characters')
    .required('Remark is required')
});

export const socialScoreVerificationSchema = Yup.object().shape({
  social_score: Yup.number()
    .min(300, 'Social score must be between 300-900')
    .max(900, 'Social score must be between 300-900')
    .required('Social score is required'),
  social_score_status: Yup.string().required('Score status is required'),
  social_score_suggestion: Yup.string().required('Recommendation is required'),
  socialscore_final_report: Yup.string().required('Final report is required')
});

export const socialScoreAssessmentSchema = Yup.object().shape({
  social_score: Yup.number().min(300).max(900),
  social_score_status: Yup.string(),
  social_score_suggestion: Yup.string()
});