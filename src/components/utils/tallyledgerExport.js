import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export const exportDataToExcel = async (data, baseFilename, isDark, options = {}) => {
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
    // Ensure filename has .xls extension
    let filename = baseFilename;
    if (!filename.toLowerCase().endsWith('.xls') && !filename.toLowerCase().endsWith('.xlsx')) {
      filename += '.xls';
    }

    // Prepare headers from first object or use custom mapping
    let headers = [];
    if (columnMapping) {
      headers = Object.values(columnMapping);
    } else if (data.length > 0) {
      headers = Object.keys(data[0]).map(key => 
        key.split(/(?=[A-Z])/).join(' ') 
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
      );
    }

    // Prepare rows
    const rows = data.map(item => {
      const row = [];
      const keys = columnMapping ? Object.keys(columnMapping) : Object.keys(data[0]);
      keys.forEach(key => {
        const value = item[key] !== undefined ? item[key] : '';
        row.push(value);
      });
      return row;
    });

    // Create HTML table structure for Excel
    let tableHTML = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ';
    tableHTML += 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
    tableHTML += 'xmlns="http://www.w3.org/TR/REC-html40">';
    tableHTML += '<head>';
    tableHTML += '<meta charset="UTF-8">';
    tableHTML += '<style>';
    tableHTML += 'th { background-color: #4472C4; color: white; font-weight: bold; text-align: center; padding: 8px; }';
    tableHTML += 'td { padding: 5px; border: 1px solid #ddd; }';
    tableHTML += 'table { border-collapse: collapse; width: 100%; }';
    tableHTML += '</style>';
    tableHTML += '<!--[if gte mso 9]>';
    tableHTML += '<xml>';
    tableHTML += '<x:ExcelWorkbook>';
    tableHTML += '<x:ExcelWorksheets>';
    tableHTML += '<x:ExcelWorksheet>';
    tableHTML += '<x:Name>Sheet1</x:Name>';
    tableHTML += '<x:WorksheetOptions>';
    tableHTML += '<x:DisplayGridlines/>';
    tableHTML += '</x:WorksheetOptions>';
    tableHTML += '</x:ExcelWorksheet>';
    tableHTML += '</x:ExcelWorksheets>';
    tableHTML += '</x:ExcelWorkbook>';
    tableHTML += '</xml>';
    tableHTML += '<![endif]-->';
    tableHTML += '</head>';
    tableHTML += '<body>';
    tableHTML += '<table border="1">';
    
    // Add header row with inline bgcolor attribute (works in Excel)
    tableHTML += '<thead><tr>';
    headers.forEach(header => {
      const cellContent = header !== null && header !== undefined ? 
        String(header).replace(/&/g, '&amp;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;') : '';
      tableHTML += `<th bgcolor="#4472C4" style="color: white; font-weight: bold; text-align: center;">${cellContent}</th>`;
    });
    tableHTML += '</tr></thead>';
    
    // Add data rows
    tableHTML += '<tbody>';
    rows.forEach(row => {
      tableHTML += '<tr>';
      row.forEach(cell => {
        const cellValue = cell !== null && cell !== undefined ? cell : '';
        const cellContent = String(cellValue).replace(/&/g, '&amp;')
                                           .replace(/</g, '&lt;')
                                           .replace(/>/g, '&gt;');
        const isNumber = !isNaN(cellValue) && cellValue !== '' && 
                        !isNaN(parseFloat(cellValue)) && 
                        !String(cellValue).includes(',');
        tableHTML += `<td${isNumber ? ' style="mso-number-format:0"' : ''}>${cellContent}</td>`;
      });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody>';
    
    tableHTML += '</table>';
    tableHTML += '</body>';
    tableHTML += '</html>';
    
    // Create blob and download
    const blob = new Blob([tableHTML], { 
      type: 'application/vnd.ms-excel' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    toast.success('Data exported successfully!', {
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

export const formatLedgerDataForExport = (ledgerData) => {
  return ledgerData.map(item => ({
    'SN': item.sn || '',
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

export const generateExportFilename = (prefix = 'data') => {
  const today = new Date().toISOString().split('T')[0];
  return `${prefix}-${today}`;
};

export const exportToExcel = (data, filename) => {
  // Ensure the filename has .xls extension
  if (!filename.toLowerCase().endsWith('.xls') && !filename.toLowerCase().endsWith('.xlsx')) {
    filename += '.xls';
  }
  
  // Create HTML table structure that Excel can recognize
  let tableHTML = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ';
  tableHTML += 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
  tableHTML += 'xmlns="http://www.w3.org/TR/REC-html40">';
  tableHTML += '<head>';
  tableHTML += '<meta charset="UTF-8">';
  tableHTML += '<!--[if gte mso 9]>';
  tableHTML += '<xml>';
  tableHTML += '<x:ExcelWorkbook>';
  tableHTML += '<x:ExcelWorksheets>';
  tableHTML += '<x:ExcelWorksheet>';
  tableHTML += '<x:Name>Sheet1</x:Name>';
  tableHTML += '<x:WorksheetOptions>';
  tableHTML += '<x:DisplayGridlines/>';
  tableHTML += '</x:WorksheetOptions>';
  tableHTML += '</x:ExcelWorksheet>';
  tableHTML += '</x:ExcelWorksheets>';
  tableHTML += '</x:ExcelWorkbook>';
  tableHTML += '</xml>';
  tableHTML += '<![endif]-->';
  tableHTML += '</head>';
  tableHTML += '<body>';
  tableHTML += '<table border="1">';
  
  // Add header row with inline bgcolor attribute (works in Excel)
  tableHTML += '<thead><tr>';
  data[0].forEach(cell => {
    const cellContent = cell !== null && cell !== undefined ? String(cell).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
    tableHTML += `<th bgcolor="#4472C4" style="color: white; font-weight: bold; text-align: center;">${cellContent}</th>`;
  });
  tableHTML += '</tr></thead>';
  
  // Add data rows (skip first row as it's the header)
  tableHTML += '<tbody>';
  data.slice(1).forEach(row => {
    tableHTML += '<tr>';
    row.forEach(cell => {
      // Escape HTML and handle special characters
      const cellContent = cell !== null && cell !== undefined ? String(cell).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
      const isNumber = !isNaN(cell) && cell !== null && cell !== undefined && cell !== '';
      tableHTML += `<td${isNumber ? ' style="mso-number-format:0"' : ''}>${cellContent}</td>`;
    });
    tableHTML += '</tr>';
  });
  tableHTML += '</tbody>';
  
  tableHTML += '</table>';
  tableHTML += '</body>';
  tableHTML += '</html>';
  
  // Create blob with Excel MIME type
  const blob = new Blob([tableHTML], { 
    type: 'application/vnd.ms-excel' 
  });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
};


export const exportToCSV = async (data, filename) => {
  try {
    if (data.length === 0) return;
    
    // Prepare headers
    const headers = Object.keys(data[0] || {});
    
    // Prepare data rows
    const csvRows = data.map(item => {
      return headers.map(header => {
        const value = item[header];
        
        if (value === null || value === undefined) return '';
        
        const strValue = String(value);
        const needsQuotes = strValue.includes(',') || 
                           strValue.includes('"') || 
                           strValue.includes('\n') || 
                           strValue.includes('\r');
        
        if (needsQuotes) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        
        return strValue;
      });
    });
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');
    
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Download
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    return true;
  } catch (error) {
    console.error("CSV export error:", error);
    throw error;
  }
};