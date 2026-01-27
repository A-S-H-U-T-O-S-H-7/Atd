
export const DATABASE_FIELDS = {
  PHOTO: 'selfie',
  PAN_CARD: 'pan_proof',
  ADDRESS_PROOF: 'address_proof',
  ID_PROOF: 'id_proof',
  SALARY_SLIP_1: 'salary_slip',
  SALARY_SLIP_2: 'second_salary_slip',
  SALARY_SLIP_3: 'third_salary_slip',
  BANK_STATEMENT: 'bank_statement',
  BANK_STATEMENT_2: 'second_bank_statement',
  BANK_VERIFICATION_REPORT: 'bank_verif_report',
  BANK_FRAUD_REPORT: 'bank_fraud_report',
  CAM_SHEET: 'cam_sheet',
  SOCIAL_SCORE_REPORT: 'social_score_report',
  CIBIL_SCORE_REPORT: 'cibil_score_report',
  NACH_FORM: 'nach_form',       
  PDC: 'pdc',                   
  AGREEMENT: 'aggrement',       
  VIDEO: 'video',
  SANCTION_LETTER: 'sanction_letter'
};

// UI field names (what your React components use)
export const UI_FIELDS = {
  PHOTO: 'photo',
  PAN_CARD: 'panCard',
  ADDRESS_PROOF: 'addressProof',
  ID_PROOF: 'idProof',
  SALARY_SLIP_1: 'salarySlip1',
  SALARY_SLIP_2: 'salarySlip2',
  SALARY_SLIP_3: 'salarySlip3',
  BANK_STATEMENT: 'bankStatement',
  BANK_STATEMENT_2: 'bankStatement2',
  BANK_VERIFICATION_REPORT: 'bankVerificationReport',
  BANK_FRAUD_REPORT: 'bankFraudAnalysisReport',
  CAM_SHEET: 'camSheet',
  SOCIAL_SCORE_REPORT: 'socialScoreReport',
  CIBIL_SCORE_REPORT: 'cibilScoreReport',
  NACH_FORM: 'nachForm',
  PDC: 'pdc',
  AGREEMENT: 'agreement',
  VIDEO: 'video',
  SANCTION_LETTER: 'sanctionLetter'
};

// Firebase Storage folder mappings (NEW structure)
export const FIREBASE_FOLDERS = {
  'selfie': 'photo',
  'pan_proof': 'pan',
  'address_proof': 'address',
  'id_proof': 'idproof',
  'salary_slip': 'first_salaryslip',
  'second_salary_slip': 'second_salaryslip',
  'third_salary_slip': 'third_salaryslip',
  'bank_statement': 'bank-statement',
  'second_bank_statement': 'bank-statement',
  'bank_verif_report': 'bank-verification-report',  
  'bank_fraud_report': 'bank-verification-report',  
  'cam_sheet': 'cam-sheet',                         
  'social_score_report': 'social-score-report',     
  'cibil_score_report': 'cibil-score-report',       
  'nach_form': 'nach',                              
  'pdc': 'pdc-report',                              
  'aggrement': 'aggreement',                        
  'video': 'video',
  'sanction_letter': 'sanctionletter'
};

// UI to Database field mapping (for backward compatibility)
export const UI_TO_DB_MAPPING = {
  photo: 'selfie',
  panCard: 'pan_proof',
  addressProof: 'address_proof',
  idProof: 'id_proof',
  salarySlip1: 'salary_slip',
  salarySlip2: 'second_salary_slip',
  salarySlip3: 'third_salary_slip',
  bankStatement: 'bank_statement',
  bankStatement2: 'second_bank_statement',
  bankVerificationReport: 'bank_verif_report',
  bankFraudAnalysisReport: 'bank_fraud_report',
  camSheet: 'cam_sheet',
  socialScoreReport: 'social_score_report',
  cibilScoreReport: 'cibil_score_report',
  nachForm: 'nach_form',
  pdc: 'pdc',
  agreement: 'aggrement',
  video: 'video',
  sanctionLetter: 'sanction_letter'
};

// Database to UI field mapping (reverse)
export const DB_TO_UI_MAPPING = Object.fromEntries(
  Object.entries(UI_TO_DB_MAPPING).map(([ui, db]) => [db, ui])
);

// Document configuration for forms
export const DOCUMENT_CONFIG = [
  { name: 'photo', label: 'Photo', required: true },
  { name: 'panCard', label: 'PAN Proof', required: true },
  { name: 'addressProof', label: 'Address Proof', required: true },
  { name: 'idProof', label: 'ID Proof', required: true },
  { name: 'salarySlip1', label: '1st Month Salary Slip', required: false },
  { name: 'salarySlip2', label: '2nd Month Salary Slip', required: false },
  { name: 'salarySlip3', label: '3rd Month Salary Slip', required: false },
  { name: 'bankStatement', label: 'Bank Statement', required: false },
  { name: 'bankStatement2', label: '2nd Bank Statement', required: false },
  { name: 'bankVerificationReport', label: 'Banking Verification Report', required: false },
  { name: 'bankFraudAnalysisReport', label: 'Bank Fraud Analysis Report', required: false },
  { name: 'camSheet', label: 'CAM Sheet', required: false },
  { name: 'nachForm', label: 'NACH Form', required: false },
  { name: 'socialScoreReport', label: 'Social Score Report', required: false },
  { name: 'cibilScoreReport', label: 'CIBIL Score Report', required: false },
  { name: 'pdc', label: 'PDC', required: false },
  { name: 'agreement', label: 'Agreement', required: false },
  { name: 'video', label: 'Video', required: false }
];