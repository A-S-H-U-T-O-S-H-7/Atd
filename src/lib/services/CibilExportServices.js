import api from "@/utils/axiosInstance";

export const cibilExportAPI = {
  // Get CIBIL Export Data
  getCibilExportData: async (params = {}) => {
    try {
      // POST request with date range
      const response = await api.post("crm/cibil/export", params);
      return response;
    } catch (error) {
      console.error("Error fetching CIBIL export:", error);
      throw error;
    }
  },

  // Import CIBIL CSV File
  importCibilCSV: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      // POST request with FormData
      const response = await api.post("crm/cibil/import", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error("Error importing CIBIL CSV:", error);
      throw error;
    }
  }
};

// Format data for CSV export (mapping API fields to CSV column names)
export const formatCibilExportForCSV = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) {
    return [];
  }
  
  return apiData.map((item, index) => ({
    // Map API fields to CSV column names
    "S.N": item.sn || index + 1,
    "Consumer Name": item.consumer_name || '',
    "Father Name": item.father_name || '',
    "Date of Birth": formatDateForCSV(item.dob),
    "Gender": getGenderText(item.gender),
    "Income Tax ID Number": item.pan || '',
    "Passport Number": item.passport_no || '',
    "Passport Issue Date": formatDateForCSV(item.passport_issue_date),
    "Passport Expiry Date": formatDateForCSV(item.passport_expiry_date),
    "Voter ID Number": item.voter_id || '',
    "Driving License Number": item.driving_license_no || '',
    "Driving License Issue Date": formatDateForCSV(item.dl_issue_date),
    "Driving License Expiry Date": formatDateForCSV(item.dl_expiry_date),
    "Ration Card Number": item.ration_card || '',
    "Universal ID Number": item.universal_id || '',
    "Additional ID #1": item.additional_id_1 || '',
    "Additional ID #2": item.additional_id_2 || '',
    "Telephone No.Mobile": item.mobile || '',
    "Telephone No.Residence": item.residence_phone || '',
    "Telephone No.Office": item.office_phone || '',
    "Extension Office": item.office_extension || '',
    "Telephone No.Other": item.other_phone || '',
    "Extension Other": item.other_extension || '',
    "Email ID 1": item.email_1 || '',
    "Email ID 2": item.email_2 || '',
    "Address Line 1": item.address_1 || '',
    "State Code 1": item.state_code_1 || '',
    "PIN Code 1": item.pin_code_1 || '',
    "Address Category 1": item.address_category_1 || '',
    "Residence Code 1": item.residence_code_1 || '',
    "Address Line 2": item.address_2 || '',
    "State Code 2": item.state_code_2 || '',
    "PIN Code 2": item.pin_code_2 || '',
    "Address Category 2": item.address_category_2 || '',
    "Residence Code 2": item.residence_code_2 || '',
    "Current/New Member Code": item.member_code || '',
    "Current/New Member Short Name": item.member_short_name || '',
    "Curr/New Account No": item.account_no || '',
    "Account Type": item.account_type || '',
    "Ownership Indicator": item.ownership_indicator || '',
    "Date Opened/Disbursed": formatDateForCSV(item.date_opened),
    "Date of Last Payment": formatDateForCSV(item.last_payment_date),
    "Date Closed": formatDateForCSV(item.date_closed),
    "Date Reported": formatDateForCSV(item.date_reported),
    "High Credit/Sanctioned Amt": item.sanctioned_amount || '',
    "Current Balance": item.current_balance || '',
    "Amt Overdue": item.amount_overdue || '',
    "No of Days Past Due": item.dpd || '',
    "Loan No": item.loan_no || '',
    "Status": item.status || '',
    "Old Mbr Code": item.old_member_code || '',
    "Old Mbr Short Name": item.old_member_short_name || '',
    "Old Acc No": item.old_account_no || '',
    "Old Acc Type": item.old_account_type || '',
    "Old Ownership Indicator": item.old_ownership_indicator || '',
    "Suit Filed / Wilful Default": item.suit_filed_status || '',
    "Written-off and Settled Status": item.written_off_status || '',
    "Asset Classification": item.asset_classification || '',
    "Value of Collateral": item.collateral_value || '',
    "Type of Collateral": item.collateral_type || '',
    "Credit Limit": item.credit_limit || '',
    "Cash Limit": item.cash_limit || '',
    "Rate of Interest": item.interest_rate || '',
    "RepaymentTenure": item.repayment_tenure || '',
    "EMI Amount": item.emi_amount || '',
    "Written- off Amount (Total)": item.written_off_total || '',
    "Written- off Principal Amount": item.written_off_principal || '',
    "Settlement Amt": item.settlement_amount || '',
    "Payment Frequency": item.payment_frequency || '',
    "Actual Payment Amt": item.actual_payment_amount || '',
    "Occupation Code": item.occupation_code || '',
    "Income": item.income || '',
    "Net/Gross Income Indicator": item.income_type || '',
    "Monthly/Annual Income Indicator": item.income_period || ''
  }));
};

// Helper functions
const formatDateForCSV = (dateStr) => {
  if (!dateStr || dateStr === '') return '';
  
  // Handle dates like '20251211' or "'20251211"
  try {
    const cleanDate = dateStr.toString().replace(/'/g, '');
    
    // Check if it's in YYYYMMDD format
    if (/^\d{8}$/.test(cleanDate)) {
      const year = cleanDate.substring(0, 4);
      const month = cleanDate.substring(4, 6);
      const day = cleanDate.substring(6, 8);
      return `${day}/${month}/${year}`;
    }
    
    // Check if it's in YYYYMMDD HH:MM:SS format
    if (/^\d{8}\s\d{2}:\d{2}:\d{2}$/.test(cleanDate)) {
      const datePart = cleanDate.substring(0, 8);
      const year = datePart.substring(0, 4);
      const month = datePart.substring(4, 6);
      const day = datePart.substring(6, 8);
      return `${day}/${month}/${year}`;
    }
    
    return cleanDate;
  } catch {
    return dateStr;
  }
};

const getGenderText = (genderCode) => {
  switch (parseInt(genderCode)) {
    case 1: return 'Female';
    case 2: return 'Male';
    case 3: return 'Other';
    default: return '';
  }
};

// Create CSV content from formatted data
export const createCibilExportCSV = (formattedData) => {
  if (!formattedData || formattedData.length === 0) {
    return '';
  }
  
  // Define headers in the exact order from your HTML table
  const headers = [
    'S.N',
    'Consumer Name',
    'Father Name',
    'Date of Birth',
    'Gender',
    'Income Tax ID Number',
    'Passport Number',
    'Passport Issue Date',
    'Passport Expiry Date',
    'Voter ID Number',
    'Driving License Number',
    'Driving License Issue Date',
    'Driving License Expiry Date',
    'Ration Card Number',
    'Universal ID Number',
    'Additional ID #1',
    'Additional ID #2',
    'Telephone No.Mobile',
    'Telephone No.Residence',
    'Telephone No.Office',
    'Extension Office',
    'Telephone No.Other',
    'Extension Other',
    'Email ID 1',
    'Email ID 2',
    'Address Line 1',
    'State Code 1',
    'PIN Code 1',
    'Address Category 1',
    'Residence Code 1',
    'Address Line 2',
    'State Code 2',
    'PIN Code 2',
    'Address Category 2',
    'Residence Code 2',
    'Current/New Member Code',
    'Current/New Member Short Name',
    'Curr/New Account No',
    'Account Type',
    'Ownership Indicator',
    'Date Opened/Disbursed',
    'Date of Last Payment',
    'Date Closed',
    'Date Reported',
    'High Credit/Sanctioned Amt',
    'Current Balance',
    'Amt Overdue',
    'No of Days Past Due',
    'Loan No',
    'Status',
    'Old Mbr Code',
    'Old Mbr Short Name',
    'Old Acc No',
    'Old Acc Type',
    'Old Ownership Indicator',
    'Suit Filed / Wilful Default',
    'Written-off and Settled Status',
    'Asset Classification',
    'Value of Collateral',
    'Type of Collateral',
    'Credit Limit',
    'Cash Limit',
    'Rate of Interest',
    'RepaymentTenure',
    'EMI Amount',
    'Written- off Amount (Total)',
    'Written- off Principal Amount',
    'Settlement Amt',
    'Payment Frequency',
    'Actual Payment Amt',
    'Occupation Code',
    'Income',
    'Net/Gross Income Indicator',
    'Monthly/Annual Income Indicator'
  ];
  
  // CSV escape function
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '';
    
    const strValue = String(value);
    
    // Check if needs quoting
    const needsQuotes = strValue.includes(',') || 
                       strValue.includes('"') || 
                       strValue.includes('\n') || 
                       strValue.includes('\r');
    
    if (needsQuotes) {
      return `"${strValue.replace(/"/g, '""')}"`;
    }
    
    return strValue;
  };
  
  // Create rows
  const rows = formattedData.map(item => 
    headers.map(header => escapeCSV(item[header] || '')).join(',')
  );
  
  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n');
};

// Download CSV file
export const downloadCSV = (csvContent, filename) => {
  try {
    // Add UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = filename;
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    return true;
  } catch (error) {
    console.error("Error downloading CSV:", error);
    return false;
  }
};