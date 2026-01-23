import Swal from 'sweetalert2';
import toast from 'react-hot-toast';


export const exportToExcel = async (data, baseFilename, isDark, options = {}) => {
  const {
    title = 'Export Data',
    message = 'This will export the data to Excel format.',
    columnMapping = null
  } = options;

  // Check if data is empty
  if (!data || data.length === 0) {
    Swal.fire({
      title: 'No Data to Export',
      text: 'There is no data to export.',
      icon: 'warning',
      confirmButtonColor: '#10b981',
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    });
    return false;
  }

  // Confirm export
  const result = await Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Export',
    cancelButtonText: 'Cancel',
    background: isDark ? "#1f2937" : "#ffffff",
    color: isDark ? "#f9fafb" : "#111827",
  });

  if (!result.isConfirmed) return false;

  try {
    // Prepare filename with .xls extension
    let filename = baseFilename || `export-${new Date().toISOString().split('T')[0]}`;
    if (!filename.toLowerCase().endsWith('.xls') && !filename.toLowerCase().endsWith('.xlsx')) {
      filename += '.xls';
    }

    // Prepare headers
    const headers = prepareHeaders(data, columnMapping);
    
    // Prepare rows
    const rows = prepareRows(data, columnMapping);
    
    // Generate Excel HTML
    const excelHTML = generateExcelHTML(headers, rows);
    
    // Create and download file
    downloadExcelFile(excelHTML, filename);
    
    // Show success toast
    toast.success('ledger data exported successfully!', {
      position: "top-right",
      autoClose: 3000,
    });
    
    return true;
  } catch (error) {
    console.error("Export error:", error);
    
    Swal.fire({
      title: 'Export Failed!',
      text: 'Failed to export data. Please try again.',
      icon: 'error',
      confirmButtonColor: '#ef4444',
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    });
    
    return false;
  }
};

/**
 * Prepare headers from data or column mapping
 */
const prepareHeaders = (data, columnMapping) => {
  if (columnMapping) {
    return Object.values(columnMapping);
  }
  
  if (data.length === 0) return [];
  
  return Object.keys(data[0]).map(key => 
    key
      .split(/(?=[A-Z])/)
      .join(' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  );
};

/**
 * Prepare rows from data
 */
const prepareRows = (data, columnMapping) => {
  if (data.length === 0) return [];
  
  const keys = columnMapping ? Object.keys(columnMapping) : Object.keys(data[0]);
  
  return data.map(item => {
    return keys.map(key => {
      const value = item[key];
      return value !== undefined && value !== null ? value : '';
    });
  });
};

/**
 * Generate Excel-compatible HTML
 */
const generateExcelHTML = (headers, rows) => {
  // Start HTML with Excel namespaces
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <style>
        th { background-color: #4472C4; color: white; font-weight: bold; text-align: center; padding: 8px; }
        td { padding: 5px; border: 1px solid #ddd; }
        table { border-collapse: collapse; width: 100%; }
      </style>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Sheet1</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
    </head>
    <body>
      <table border="1">
        <thead>
          <tr>
  `;
  
  // Add headers
  headers.forEach(header => {
    const escapedHeader = escapeHTML(header);
    html += `<th bgcolor="#4472C4" style="color: white; font-weight: bold; text-align: center;">${escapedHeader}</th>`;
  });
  
  html += `
          </tr>
        </thead>
        <tbody>
  `;
  
  // Add data rows
  rows.forEach(row => {
    html += '<tr>';
    row.forEach(cell => {
      const escapedCell = escapeHTML(cell);
      const isNumber = !isNaN(cell) && cell !== '' && !isNaN(parseFloat(cell)) && !String(cell).includes(',');
      const numberStyle = isNumber ? ' style="mso-number-format:0"' : '';
      html += `<td${numberStyle}>${escapedCell}</td>`;
    });
    html += '</tr>';
  });
  
  // Close HTML
  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  return html;
};

/**
 * Escape HTML special characters
 */
const escapeHTML = (value) => {
  if (value === null || value === undefined) return '';
  
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Create and trigger file download
 */
const downloadExcelFile = (htmlContent, filename) => {
  const blob = new Blob([htmlContent], { 
    type: 'application/vnd.ms-excel' 
  });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up URL after download
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
 * Format ledger data for export
 */
export const formatLedgerDataForExport = (ledgerData) => {
  return ledgerData.map((item, index) => ({
    'SN': index + 1,
    'Loan No.': item.loanNo || 'N/A',
    'Disburse Date': item.disburseDate || '',
    'Due Date': item.dueDate || '',
    'Name': item.name || 'N/A',
    'CRN No': item.crnno || 'N/A',
    'Address': item.address || 'N/A',
    'Phone No.': item.phoneNo || 'N/A',
    'Email': item.email || 'N/A',
    'Balance': item.balance || 0,
    'Principal Due': item.principalDue || 0,
    'Interest Due': item.interestDue || 0,
    'Penalty Due': item.penaltyDue || 0,
    'Total Due': item.totalDue || 0
  }));
};

/**
 * Generate export filename with date
 */
export const generateExportFilename = (prefix = 'export') => {
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}-${date}`;
};


export const quickExportToExcel = (data, filename = 'export.xls', columnMapping = null) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return false;
  }
  
  try {
    const headers = prepareHeaders(data, columnMapping);
    const rows = prepareRows(data, columnMapping);
    const excelHTML = generateExcelHTML(headers, rows);
    downloadExcelFile(excelHTML, filename);
    return true;
  } catch (error) {
    console.error('Quick export failed:', error);
    return false;
  }
};