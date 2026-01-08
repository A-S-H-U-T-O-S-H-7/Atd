import api from "@/utils/axiosInstance";

export const tallyExportAPI = {
  getTallyExportData: async (params = {}) => {
    try {
      const response = await api.post("crm/tally-ledger-export", params);
      return response;
    } catch (error) {
      console.error("Error fetching tally export:", error);
      throw error;
    }
  }
};

export const formatTallyExportForExcel = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) return [];
  
  const allEntries = apiData.flat();
  
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
  
  const rows = [headers];
  
  allEntries.forEach(entry => {
    const row = [
      entry.voucher_type || '',
      formatDate(entry.date),
      entry.invoice_number || '',
      entry.ledger_dr_1 || '',
      entry.ledger_cr_1 || '',
      entry.ledger_cr_2 || '',
      entry.ledger_cr_3 || '',
      formatNumber(entry.dr_amount_1),
      formatNumber(entry.cr_amount_1),
      formatNumber(entry.cr_amount_2),
      formatNumber(entry.cr_amount_3),
      formatNumber(entry.roundoff),
      entry.naration || '',
      entry.p2 || '',
      entry.sub_group1 || '',
      entry.sub_group2 || '',
      entry.main_group || '',
      entry.pan_no || '',
      entry.adhar_no || '',
      entry.add1 || '',
      entry.add2 || '',
      entry.pincode || '',
      entry.state || '',
      formatNumber(entry.loan_amount),
      entry.tenure_days || '',
      formatDate(entry.due_date),
      entry.collection_bank || ''
    ];
    rows.push(row);
  });
  
  return rows;
};

export const exportToExcel = (data, filename) => {
  if (!filename.toLowerCase().endsWith('.xls')) {
    filename += '.xls';
  }
  
  const tableHTML = createExcelTable(data);
  const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => URL.revokeObjectURL(url), 100);
  return true;
};

export const exportTallyDataToExcel = (apiData, dateRange) => {
  const formattedData = formatTallyExportForExcel(apiData);
  
  if (formattedData.length <= 1) {
    throw new Error('No valid data to export');
  }
  
  const start = dateRange.start ? dateRange.start.replace(/-/g, '') : 'start';
  const end = dateRange.end ? dateRange.end.replace(/-/g, '') : 'end';
  const filename = `ATD_Tally_Export_${start}_${end}.xls`;
  
  exportToExcel(formattedData, filename);
  
  return {
    success: true,
    filename,
    count: formattedData.length - 1
  };
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    // Handle DD/MM/YYYY format
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    // Handle YYYY-MM-DD format
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return dateString;
  }
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const num = parseFloat(value);
  return isNaN(num) ? value : num.toFixed(2);
};

const escapeHtml = (text) => {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const createExcelTable = (data) => {
  let tableHTML = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
                   xmlns:x="urn:schemas-microsoft-com:office:excel" 
                   xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <style>
        /* Beautiful gradient header */
        th { 
          background: linear-gradient(135deg, #4472C4 0%, #2E5599 50%, #1E3A73 100%);
          color: white; 
          font-weight: bold; 
          padding: 14px 12px; 
          border: 1px solid #8EA9DB; 
          text-align: center;
          font-size: 13pt;
          font-family: 'Segoe UI', Calibri, Arial;
          white-space: nowrap;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        /* Table body styles */
        td { 
          padding: 10px 12px; 
          border: 1px solid #D9E1F2; 
          font-family: Calibri, Arial; 
          font-size: 11pt; 
          vertical-align: top;
          color: #2D2D2D;
        }
        
        /* Number cells */
        .number { 
          mso-number-format:"#\\,\\#\\#0\\.00"; 
          text-align: right; 
          font-family: 'Consolas', 'Monaco', monospace;
          color: #1E4E8C;
          font-weight: 500;
        }
        
        /* Date cells */
        .date { 
          mso-number-format:"Short Date"; 
          color: #2D7738;
        }
        
        /* Text cells */
        .text { 
          mso-number-format:"\\@"; 
        }
        
        /* Table styling */
        table { 
          border-collapse: collapse; 
          width: 100%; 
          border: 2px solid #4472C4;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* Alternating row colors */
        tr:nth-child(even) { 
          background-color: #F8FAFF; 
        }
        
        tr:nth-child(odd) { 
          background-color: #FFFFFF; 
        }
        
        /* Hover effect */
        tr:hover { 
          background-color: #E8F4FF; 
          transition: background-color 0.2s ease;
        }
        
        /* Beautiful title */
        .excel-header {
          font-size: 20pt;
          font-weight: 700;
          background: linear-gradient(135deg, #4A90E2 0%, #2E5599 50%, #1E3A73 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          padding: 20px 0;
          text-align: center;
          font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
          border-bottom: 3px solid linear-gradient(135deg, #4A90E2 0%, #2E5599 100%);
        }
        
        /* Excel metadata */
        .excel-meta {
          text-align: right;
          font-size: 9pt;
          color: #7F7F7F;
          font-family: Calibri, Arial;
          padding: 10px;
          border-top: 1px solid #E0E0E0;
          margin-top: 20px;
        }
        
        /* Excel worksheet styles */
        body {
          margin: 40px;
          font-family: 'Segoe UI', Calibri, Arial;
        }
      </style>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>ATD Money Tally Export</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
                <x:FreezePanes/>
                <x:FrozenNoSplit/>
                <x:SplitHorizontal>1</x:SplitHorizontal>
                <x:TopRowVisible>1</x:TopRowVisible>
                <x:Selected/>
                <x:ProtectContents>False</x:ProtectContents>
                <x:ProtectObjects>False</x:ProtectObjects>
                <x:ProtectScenarios>False</x:ProtectScenarios>
                <x:PageSetup>
                  <x:Header x:Margin="0.3"/>
                  <x:Footer x:Margin="0.3"/>
                  <x:PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
                </x:PageSetup>
                <x:Print>
                  <x:ValidPrinterInfo/>
                  <x:HorizontalResolution>600</x:HorizontalResolution>
                  <x:VerticalResolution>600</x:VerticalResolution>
                </x:Print>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
    </head>
    <body>
      <div class="excel-header">ATD Money Tally Export Report</div>
      <table>`;
  
  data.forEach((row, rowIndex) => {
    tableHTML += '<tr>';
    row.forEach((cell, cellIndex) => {
      let cellContent = escapeHtml(cell !== null && cell !== undefined ? String(cell) : '');
      
      if (rowIndex === 0) {
        tableHTML += `<th>${cellContent}</th>`;
      } else {
        const header = data[0][cellIndex]?.toLowerCase() || '';
        let cellClass = 'text';
        
        if (header.includes('amount') || 
            header.includes('dr') || 
            header.includes('cr') || 
            header.includes('roundoff') ||
            header.includes('loan amount')) {
          cellClass = 'number';
        } else if (header.includes('date') || 
                  header.includes('due date') || 
                  header.includes('maturity')) {
          cellClass = 'date';
        }
        
        tableHTML += `<td class="${cellClass}">${cellContent}</td>`;
      }
    });
    tableHTML += '</tr>';
  });
  
  // Add footer with metadata
  tableHTML += `
      </table>
      <div class="excel-meta">
        Generated on ${new Date().toLocaleDateString()} | Total Records: ${data.length - 1}
      </div>
    </body>
  </html>`;
  
  return tableHTML;
};