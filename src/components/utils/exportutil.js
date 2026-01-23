export const exportToExcel = (data, filename) => {
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
      // Check if cell is a number to avoid green triangle
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