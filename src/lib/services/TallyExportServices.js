import api from "@/utils/axiosInstance";

export const tallyExportAPI = {
  // Get Tally Export Data
  getTallyExportData: async (params = {}) => {
    try {
      // POST request with date range
      const response = await api.post("crm/tally-ledger-export", params);
      return response;
    } catch (error) {
      console.error("Error fetching tally export:", error);
      throw error;
    }
  }
};

// Format data for CSV export
export const formatTallyExportForCSV = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) {
    return [];
  }
  
  // Flatten the nested array structure
  const allEntries = apiData.flat();
  
  return allEntries.map(entry => ({
    "Voucher Type": entry.voucher_type || '',
    "Date": entry.date || '',
    "Invoice Number": entry.invoice_number || '',
    "Ledger Dr 1": entry.ledger_dr_1 || '',
    "Ledger Cr 1": entry.ledger_cr_1 || '',
    "Ledger Cr 2": entry.ledger_cr_2 || '',
    "Ledger Cr 3": entry.ledger_cr_3 || '',
    "Dr amount 1": entry.dr_amount_1 || '',
    "Cr amount 1": entry.cr_amount_1 || '',
    "Cr amount 2": entry.cr_amount_2 || '',
    "Cr amount 3": entry.cr_amount_3 || '',
    "Roundoff": entry.roundoff || '',
    "Naration": entry.naration || '',
    "p2": entry.p2 || '',
    "sub group1": entry.sub_group1 || '',
    "sub group2": entry.sub_group2 || '',
    "main group": entry.main_group || '',
    "PAN NO": entry.pan_no || '',
    "ADHAR NO": entry.adhar_no || '',
    "ADD1": entry.add1 || '',
    "ADD2": entry.add2 || '',
    "PINCODE": entry.pincode || '',
    "STATE": entry.state || '',
    "LOAN AMOUNT": entry.loan_amount || '',
    "TENURE (DAYS):": entry.tenure_days || '',
    "DATE OF MATURITY/DUE DATE": entry.due_date || '',
    "Collection Bank": entry.collection_bank || ''
  }));
};

// Create CSV content from formatted data
export const createTallyExportCSV = (formattedData) => {
  if (!formattedData || formattedData.length === 0) {
    return '';
  }
  
  // Define headers in the exact order you want
  const headers = [
    'Voucher Type',
    'Date',
    'Invoice Number',
    'Ledger Dr 1',
    'Ledger Cr 1',
    'Ledger Cr 2',
    'Ledger Cr 3',
    'Dr amount 1',
    'Cr amount 1',
    'Cr amount 2',
    'Cr amount 3',
    'Roundoff',
    'Naration',
    'p2',
    'sub group1',
    'sub group2',
    'main group',
    'PAN NO',
    'ADHAR NO',
    'ADD1',
    'ADD2',
    'PINCODE',
    'STATE',
    'LOAN AMOUNT',
    'TENURE (DAYS)',
    'DATE OF MATURITY/DUE DATE',
    'Collection Bank'
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