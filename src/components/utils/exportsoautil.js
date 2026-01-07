export const exportSoaToExcel = (data, filename, customerInfo = {}) => {
  if (!filename.toLowerCase().endsWith('.xls') && !filename.toLowerCase().endsWith('.xlsx')) {
    filename += '.xls';
  }
  
  let tableHTML = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ';
  tableHTML += 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
  tableHTML += 'xmlns="http://www.w3.org/TR/REC-html40">';
  tableHTML += '<head>';
  tableHTML += '<meta charset="UTF-8">';
  tableHTML += '<meta name="ProgId" content="Excel.Sheet">';
  tableHTML += '<!--[if gte mso 9]>';
  tableHTML += '<xml>';
  tableHTML += '<x:ExcelWorkbook>';
  tableHTML += '<x:ExcelWorksheets>';
  tableHTML += '<x:ExcelWorksheet>';
  tableHTML += '<x:Name>Statement of Account</x:Name>';
  tableHTML += '<x:WorksheetOptions>';
  tableHTML += '<x:DisplayGridlines/>';
  tableHTML += '<x:Print>';
  tableHTML += '<x:ValidPrinterInfo/>';
  tableHTML += '</x:Print>';
  tableHTML += '</x:WorksheetOptions>';
  tableHTML += '</x:ExcelWorksheet>';
  tableHTML += '</x:ExcelWorksheets>';
  tableHTML += '</x:ExcelWorkbook>';
  tableHTML += '</xml>';
  tableHTML += '<![endif]-->';
  tableHTML += '<style>';
  tableHTML += 'td { mso-number-format:\\@; font-family: Calibri, Arial, sans-serif; }';
  tableHTML += 'th { font-weight: bold; text-align: center; }';
  tableHTML += '.title { font-size: 16pt; font-weight: bold; text-align: center; }';
  tableHTML += '.customer-info { font-size: 10pt; }';
  tableHTML += '.header-section { background-color: #D9E1F2; font-weight: bold; }';
  tableHTML += '.table-header { background-color: #4472C4; color: white; font-weight: bold; text-align: center; }';
  tableHTML += '.charges-header { background-color: #F4B084; font-weight: bold; }';
  tableHTML += '.collection-received-header { background-color: #FFD966; font-weight: bold; }';
  tableHTML += '.adjusted-header { background-color: #C6E0B4; font-weight: bold; }';
  tableHTML += '.o/s-header { background-color: #B4C7E7; font-weight: bold; }';
  tableHTML += '.total-header { background-color: #BFBFBF; font-weight: bold; }';
  tableHTML += '</style>';
  tableHTML += '</head>';
  tableHTML += '<body>';
  tableHTML += '<table border="1" cellspacing="0" cellpadding="4" style="border-collapse: collapse;">';
  
  tableHTML += '<tr>';
  tableHTML += `<td colspan="14" class="title" style="padding: 10px;">STATEMENT OF ACCOUNT</td>`;
  tableHTML += '</tr>';
  
  tableHTML += '<tr><td colspan="14" style="padding: 10px;"></td></tr>';
  tableHTML += '<tr>';
  tableHTML += `<td colspan="4" class="customer-info"><strong>Customer Name:</strong> ${customerInfo.fullname || ''}</td>`;
  tableHTML += `<td colspan="5" class="customer-info"><strong>Loan No:</strong> ${customerInfo.loan_no || ''}</td>`;
  tableHTML += `<td colspan="5" class="customer-info"><strong>CRN No:</strong> ${customerInfo.crnno || ''}</td>`;
  tableHTML += '</tr>';
  
  tableHTML += '<tr>';
  tableHTML += `<td colspan="4" class="customer-info"><strong>Sanction Amount:</strong> ${customerInfo.sanction_amount || ''}</td>`;
  tableHTML += `<td colspan="5" class="customer-info"><strong>Disburse Amount:</strong> ${customerInfo.disburse_amount || ''}</td>`;
  tableHTML += `<td colspan="5" class="customer-info"><strong>Ledger Balance:</strong> ${customerInfo.ledger_balance || ''}</td>`;
  tableHTML += '</tr>';
  
  tableHTML += '<tr><td colspan="14" style="padding: 5px;"></td></tr>';
  
  tableHTML += '<tr>';
  
  tableHTML += '<th class="table-header" style="width: 40px;">SN</th>';
  tableHTML += '<th class="table-header" style="width: 140px;">Date</th>';
  tableHTML += '<th colspan="3" class="charges-header">CHARGES LEVIED</th>';
  tableHTML += '<th class="collection-received-header">COLLECTION RECEIVED</th>';
  tableHTML += '<th colspan="4" class="adjusted-header">COLLECTION ADJUSTED WITH</th>';
  tableHTML += '<th colspan="4" class="o/s-header">O/s BALANCE AFTER COLLECTION ADJUSTMENT</th>';
  tableHTML += '<th class="total-header" style="width: 100px;">Total O/s</th>';
  
  tableHTML += '</tr>';
  
  tableHTML += '<tr>';
  tableHTML += '<td class="header-section"></td>';
  tableHTML += '<td class="header-section"></td>';
  
  tableHTML += '<td class="header-section">Normal Int Charged</td>';
  tableHTML += '<td class="header-section">Penal int Charged</td>';
  tableHTML += '<td class="header-section">Penalty Charged</td>';
  tableHTML += '<td class="header-section">Collection Received</td>';
  
  tableHTML += '<td class="header-section">Principle</td>';
  tableHTML += '<td class="header-section">Normal Int</td>';
  tableHTML += '<td class="header-section">Penal Int</td>';
  tableHTML += '<td class="header-section">Penalty</td>';
  
  tableHTML += '<td class="header-section">Principle</td>';
  tableHTML += '<td class="header-section">Normal Int</td>';
  tableHTML += '<td class="header-section">Penal Int</td>';
  tableHTML += '<td class="header-section">Penalty</td>';
  
  tableHTML += '<td class="header-section"></td>';
  
  tableHTML += '</tr>';
  
  data.forEach((row, index) => {
    tableHTML += '<tr>';
    
    row.forEach((cell, cellIndex) => {
      let cellContent = cell !== null && cell !== undefined ? String(cell) : '';
      
      if (cellIndex > 1) {
        if (cellContent && !isNaN(cellContent) && cellContent.trim() !== '') {
          cellContent = parseFloat(cellContent).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        }
      }
      
      cellContent = cellContent.replace(/&/g, '&amp;')
                               .replace(/</g, '&lt;')
                               .replace(/>/g, '&gt;');
      
      let cellClass = '';
      if (cellIndex === 0 || cellIndex === 1) {
        cellClass = 'style="text-align: center;"';
      } else if (cellIndex >= 2 && cellIndex <= 4) {
        cellClass = 'style="text-align: right; background-color: #FCE4D6;"';
      } else if (cellIndex === 5) {
        cellClass = 'style="text-align: right; background-color: #FFF2CC;"';
      } else if (cellIndex >= 6 && cellIndex <= 9) {
        cellClass = 'style="text-align: right; background-color: #C6E0B4;"';
      } else if (cellIndex >= 10 && cellIndex <= 13) {
        cellClass = 'style="text-align: right; background-color: #B4C7E7;"';
      } else if (cellIndex === 14) {
        cellClass = 'style="text-align: right; font-weight: bold; background-color: #F2F2F2;"';
      }
      
      tableHTML += `<td ${cellClass}>${cellContent}</td>`;
    });
    
    tableHTML += '</tr>';
  });
  
  tableHTML += '<tr><td colspan="14" style="padding: 10px;"></td></tr>';
  tableHTML += '<tr>';
  tableHTML += `<td colspan="9" style="font-size: 9pt; font-style: italic;">Exported on: ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}</td>`;
  tableHTML += '<td colspan="5" style="text-align: right; font-size: 9pt; font-style: italic;">Generated by Loan Management System</td>';
  tableHTML += '</tr>';
  
  tableHTML += '</table>';
  tableHTML += '</body>';
  tableHTML += '</html>';
  
  const blob = new Blob([tableHTML], { 
    type: 'application/vnd.ms-excel;charset=utf-8' 
  });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => URL.revokeObjectURL(url), 100);
};