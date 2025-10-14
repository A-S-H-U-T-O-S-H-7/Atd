// src/lib/services/appraisal/index.js

// Core Appraisal Services
export { appraisalCoreService } from './AppraisalReportServices.js';
export { personalInfoService } from './personalInfoService';
export { alternateNumbersService } from './alternateNumbersService';
export { referenceService } from './referenceService';
export { documentVerificationService } from './documentVerificationService';
export { incomeVerificationService } from './incomeVerificationService';
export { organizationVerificationService } from './organizationVerificationService';
export { bankVerificationService } from './bankVerificationService';
export { socialScoreService } from './socialScoreService';
export { cibilService } from './cibilService';

// Helper utilities (re-export from utils)
export { 
    formatAppraisalForUI, 
    getVerificationStatusText, 
    getVerificationStatusNumber,
    isAppraisalComplete,
    getOverallAppraisalStatus,
    getAppraisalCompletionPercentage
} from '../../../utils/appraisalHelpers';
