
const BUCKET_NAME = 'atd-money-6faea.firebasestorage.app'; 

// Map document types to folders (matching your CRM structure)
const FOLDER_MAP = {
  'cibilScoreReport': 'reports',
  'social_score_report': 'reports',
  'bankVerificationReport': 'reports',
  'camSheet': 'reports',
  'photo': 'photo',
  'panCard': 'pan',
  'addressProof': 'address',
  'idProof': 'idproof',
  'salarySlip1': 'first_salaryslip',
  'salarySlip2': 'second_salaryslip',
  'salarySlip3': 'third_salaryslip',
  'bankStatement': 'bank-statement',
  'nachForm': 'nach-form',
  'pdc': 'pdc',
  'agreement': 'agreement',
  'video': 'video-kyc'
};

export const getUserFileUrl = (fileName, documentType = 'cibilScoreReport') => {
  if (!fileName) throw new Error('No file available');
  
  const folder = FOLDER_MAP[documentType] || 'reports';
  const encodedFileName = encodeURIComponent(fileName);
  
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${folder}%2F${encodedFileName}?alt=media`;
};

/**
 * Specifically for CIBIL reports
 */
export const getCibilReportUrl = (fileName) => {
  return getUserFileUrl(fileName, 'cibilScoreReport');
};

export default {
  getUserFileUrl,
  getCibilReportUrl
};