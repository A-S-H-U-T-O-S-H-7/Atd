export const getDocumentPath = (fileName, documentType) => {
  if (!fileName) return null;
  
  const pathMappings = {
    // Selfie/Photo files
    photo: `photo/${fileName}`,
    selfie: `photo/${fileName}`,
    
    // PAN card files
    pancard: `pan/${fileName}`,
    pan_proof: `pan/${fileName}`,
    
    // Aadhar proof files
    idproof: `idproof/${fileName}`,
    aadhar_proof: `idproof/${fileName}`,
    id_proof: `idproof/${fileName}`,
    
    // Address proof files
    addressproof: `address/${fileName}`,
    address_proof: `address/${fileName}`,
    
    // Salary slips
    salaryproof: `first_salaryslip/${fileName}`,
    salary_slip: `first_salaryslip/${fileName}`,
    second_salary_slip: `second_salaryslip/${fileName}`,
    third_salary_slip: `third_salaryslip/${fileName}`,
    
    // Bank statements
    bankstatement: `bank-statement/${fileName}`,
    bank_statement: `bank-statement/${fileName}`,
    
    // Default fallback
    default: `documents/${fileName}`
  };

  return pathMappings[documentType] || pathMappings.default;
};

export const documentTypes = {
  PHOTO: 'photo',
  PAN_CARD: 'pan_proof',
  ADDRESS_PROOF: 'address_proof',
  ID_PROOF: 'aadhar_proof',
  SALARY_PROOF: 'salary_slip',
  BANK_STATEMENT: 'bank_statement',
  BANK_VERIFICATION: 'bank_verif_report',
  SOCIAL_SCORE: 'social_score_report',
  CIBIL_SCORE: 'cibil_score_report'
};