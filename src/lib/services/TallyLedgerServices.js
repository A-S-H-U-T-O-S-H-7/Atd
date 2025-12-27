import api from "@/utils/axiosInstance";

// Helper function to format date for PDF
const formatDatePDF = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    // Handle DD/MM/YYYY format from API
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${day}-${month}-${year}`;
    }
    
    // Handle YYYY-MM-DD format
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateString;
  }
};

export const tallyLedgerAPI = {
  // Get Tally Ledger Data
  getTallyLedgerData: async (params = {}) => {
    try {
      const response = await api.get("crm/tally-ledger/get", { params });
      return response;
    } catch (error) {
      console.error("Error fetching tally ledger:", error);
      throw error;
    }
  },

  // Export Tally Ledger Data
  exportTallyLedgerData: async (params = {}) => {
    try {
      const response = await api.get("crm/tally-ledger/export", { params });
      return response;
    } catch (error) {
      console.error("Error exporting tally ledger:", error);
      throw error;
    }
  },

  // Add Tally Ledger Entry (Update Other Charges)
  addTallyLedgerEntry: async (applicationId, data) => {
    try {
      const response = await api.put(`crm/tally-ledger/add/${applicationId}`, data);
      return response;
    } catch (error) {
      console.error("Error adding tally ledger entry:", error);
      throw error;
    }
  },

  // Get Tally Ledger Details for a specific application
  getTallyLedgerDetails: async (applicationId) => {
    try {
      const response = await api.get(`crm/tally-ledger/detail/${applicationId}`);
      return response;
    } catch (error) {
      console.error("Error fetching tally ledger details:", error);
      throw error;
    }
  }
};

// In TallyLedgerServices.js
export const formatTallyLedgerDataForUI = (ledger, index, page, perPage) => {
  if (!ledger) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  return {
    id: ledger.application_id || ledger.id,
    sn: (page - 1) * perPage + index + 1,
    application_id: ledger.application_id,
    user_id: ledger.user_id,
    loanNo: ledger.loan_no || "N/A",
    disburseDate: formatDate(ledger.transaction_date || ledger.disburse_date),
    dueDate: formatDate(ledger.duedate || ledger.due_date),
    name: ledger.name || "N/A",
    address: ledger.address || "N/A",
    phoneNo: ledger.phone || ledger.phoneNo || "N/A",
    email: ledger.email || "N/A",
    balance: ledger.balance || 0,
    crnno: ledger.crnno || ledger.crn_no || "N/A",
    ledgerDetails: ledger.ledgers || []
  };
};

// Format Ledger Details for Customer Transaction Modal
export const formatLedgerDetailsForUI = (ledgerDetails) => {
  if (!ledgerDetails || !Array.isArray(ledgerDetails)) {
    return { transactions: [], summary: {} };
  }

  let runningBalance = 0;
  let totalDebit = 0;
  let totalCredit = 0;

  const transactions = ledgerDetails.map((transaction, index) => {
    if (Array.isArray(transaction)) {
      const [dateStr, particular, debitStr, creditStr, balance] = transaction;
      
      // Parse amounts
      const debit = parseFloat(debitStr) || 0;
      const credit = parseFloat(creditStr) || 0;
      
      // Update totals
      totalDebit += debit;
      totalCredit += credit;
      
      // Use provided balance or calculate
      let currentBalance;
      if (balance !== undefined && balance !== null && balance !== '') {
        currentBalance = parseFloat(balance);
        runningBalance = currentBalance;
      } else {
        runningBalance = runningBalance + debit - credit;
        currentBalance = runningBalance;
      }

      // Format date from DD/MM/YYYY to DD-MM-YYYY
      let formattedDate = 'N/A';
      if (dateStr) {
        formattedDate = dateStr.replace(/\//g, '-');
      }

      return {
        id: index,
        date: formattedDate,
        particular: particular || "Transaction",
        debit: debit,
        credit: credit,
        balance: currentBalance
      };
    }
    
    return null;
  }).filter(Boolean);

  const finalBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;

  return {
    transactions: transactions,
    summary: {
      total_debits: totalDebit,
      total_credits: totalCredit,
      balance: finalBalance
    }
  };
};

// Create HTML for PDF with your design - FIXED VERSION
export const createLedgerHTML = (ledgerData, applicationId, applicantData = null) => {
  const responseData = ledgerData || {};
  
  let customerInfo = {};
  let transactions = [];
  let totalDebit = 0;
  let totalCredit = 0;
  let runningBalance = 0;
  
  if (applicantData) {
    customerInfo = {
      name: applicantData.name || 'N/A',
      address: applicantData.address || '',
      loan_no: applicantData.loanNo || 'N/A',
      crnno: applicantData.crnno || 'N/A',
      duedate: applicantData.dueDate || '',
      phone: applicantData.phoneNo || applicantData.phone || '',
      email: applicantData.email || ''
    };
  }
  
  // Handle the transaction data from API
  if (Array.isArray(responseData.ledgers)) {
    const ledgerArray = responseData.ledgers;
    
    // Process transactions and calculate totals
    transactions = ledgerArray.map((transaction) => {
      if (Array.isArray(transaction)) {
        const [dateStr, particular, debitStr, creditStr, balance] = transaction;
        
        const debit = parseFloat(debitStr) || 0;
        const credit = parseFloat(creditStr) || 0;
        
        totalDebit += debit;
        totalCredit += credit;
        
        let currentBalance;
        if (balance !== undefined && balance !== null && balance !== '') {
          currentBalance = parseFloat(balance);
          runningBalance = currentBalance;
        } else {
          runningBalance = runningBalance + debit - credit;
          currentBalance = runningBalance;
        }
        
        return {
          date: dateStr ? dateStr.replace(/\//g, '-') : '',
          particular: particular || 'Transaction',
          debit: debit,
          credit: credit,
          balance: currentBalance
        };
      }
      return null;
    }).filter(Boolean);
  } else if (Array.isArray(responseData)) {
    // If response is direct array
    const ledgerArray = responseData;
    
    transactions = ledgerArray.map((transaction) => {
      if (Array.isArray(transaction)) {
        const [dateStr, particular, debitStr, creditStr, balance] = transaction;
        
        const debit = parseFloat(debitStr) || 0;
        const credit = parseFloat(creditStr) || 0;
        
        totalDebit += debit;
        totalCredit += credit;
        
        let currentBalance;
        if (balance !== undefined && balance !== null && balance !== '') {
          currentBalance = parseFloat(balance);
          runningBalance = currentBalance;
        } else {
          runningBalance = runningBalance + debit - credit;
          currentBalance = runningBalance;
        }
        
        return {
          date: dateStr ? dateStr.replace(/\//g, '-') : '',
          particular: particular || 'Transaction',
          debit: debit,
          credit: credit,
          balance: currentBalance
        };
      }
      return null;
    }).filter(Boolean);
  }
  
  // If no transactions found but have applicant data with ledgerDetails
  if (transactions.length === 0 && applicantData && applicantData.ledgerDetails) {
    const ledgerArray = applicantData.ledgerDetails;
    
    transactions = ledgerArray.map((transaction) => {
      if (Array.isArray(transaction)) {
        const [dateStr, particular, debitStr, creditStr, balance] = transaction;
        
        const debit = parseFloat(debitStr) || 0;
        const credit = parseFloat(creditStr) || 0;
        
        totalDebit += debit;
        totalCredit += credit;
        
        let currentBalance;
        if (balance !== undefined && balance !== null && balance !== '') {
          currentBalance = parseFloat(balance);
          runningBalance = currentBalance;
        } else {
          runningBalance = runningBalance + debit - credit;
          currentBalance = runningBalance;
        }
        
        return {
          date: dateStr ? dateStr.replace(/\//g, '-') : '',
          particular: particular || 'Transaction',
          debit: debit,
          credit: credit,
          balance: currentBalance
        };
      }
      return null;
    }).filter(Boolean);
  }
  
  const customerName = customerInfo.name || responseData.name || 'N/A';
  const fullAddress = customerInfo.address || responseData.address || 'N/A';
  const loanNo = customerInfo.loan_no || responseData.loan_no || 'N/A';
  const crnNo = customerInfo.crnno || responseData.crnno || 'N/A';
  const dueDate = customerInfo.duedate || responseData.duedate ? 
    formatDatePDF(customerInfo.duedate || responseData.duedate) : 'N/A';
  
  const finalBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ledger Statement - ${loanNo}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: white;
          padding: 0;
          font-size: 11px;
          line-height: 1.4;
        }
        
        .container {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          page-break-after: avoid;
        }
        
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 16px;
          text-align: center;
        }
        
        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }
        
        .logo {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .header h1 {
          font-size: 18px;
          margin-bottom: 2px;
          font-weight: 600;
        }
        
        .header .subtitle {
          font-size: 12px;
          opacity: 0.95;
        }
        
        .content {
          padding: 16px;
        }
        
        .info-section {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 16px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .info-row:last-child {
          margin-bottom: 0;
        }
        
        .info-item {
          flex: 1;
          display: flex;
          gap: 6px;
        }
        
        .info-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: #64748b;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .info-value {
          font-size: 11px;
          color: #0f172a;
          font-weight: 500;
          word-break: break-word;
        }
        
        .info-value.highlight {
          color: #10b981;
          font-weight: 600;
        }
        
        .due-date {
          background: #fef3c7;
          color: #92400e;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
        }
        
        .section-title {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 2px solid #10b981;
        }
        
        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
          font-size: 10px;
        }
        
        .transaction-table thead {
          background: #10b981;
          color: white;
        }
        
        .transaction-table th {
          padding: 6px 4px;
          text-align: left;
          font-weight: 600;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        
        .transaction-table th:nth-child(3),
        .transaction-table th:nth-child(4),
        .transaction-table th:nth-child(5) {
          text-align: right;
        }
        
        .transaction-table tbody tr {
          border-bottom: 1px solid #e2e8f0;
        }
        
        .transaction-table tbody tr:nth-child(even) {
          background-color: #f8fafc;
        }
        
        .transaction-table td {
          padding: 6px 4px;
          color: #334155;
        }
        
        .transaction-table td:nth-child(3),
        .transaction-table td:nth-child(4),
        .transaction-table td:nth-child(5) {
          text-align: right;
          font-weight: 500;
        }
        
        .debit-amount {
          color: #dc2626;
        }
        
        .credit-amount {
          color: #10b981;
        }
        
        .balance-amount {
          color: #2563eb;
          font-weight: 600;
        }
        
        .summary-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .summary-card {
          padding: 8px;
          border-radius: 6px;
          text-align: center;
          color: white;
        }
        
        .summary-card.debit {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        }
        
        .summary-card.credit {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        }
        
        .summary-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          opacity: 0.95;
          margin-bottom: 4px;
        }
        
        .summary-amount {
          font-size: 18px;
          font-weight: 700;
        }
        
        .footer {
          background: #f8fafc;
          padding: 12px;
          text-align: center;
          font-size: 9px;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
        }
        
        .footer p {
          margin-bottom: 2px;
        }
        
        .footer .generated {
          color: #10b981;
          font-weight: 600;
          margin-top: 4px;
        }
        
        .no-data {
          text-align: center;
          padding: 20px;
          color: #64748b;
          font-style: italic;
        }
        
        @media print {
          body {
            background: white;
          }
          
          .container {
            max-width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-container">
            <div class="logo">
              <img src="/atdlogo.png" alt="ATD" onerror="this.parentElement.innerHTML='<div style=\\'font-weight:bold;font-size:16px;color:#10b981;padding:10px\\'>ATD</div>'">
            </div>
          </div>
          <h1>Manage Ledger - ATD Money Admin</h1>
          <div class="subtitle">Loan Account Statement</div>
        </div>
        
        <div class="content">
          <div class="info-section">
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">Customer Name</span>
                <span class="info-value">${customerName}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Loan Account Number</span>
                <span class="info-value highlight">${loanNo}</span>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">Address</span>
                <span class="info-value">${fullAddress}</span>
              </div>
              <div class="info-item">
                <span class="info-label">CRN Number</span>
                <span class="info-value highlight">${crnNo}</span>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">Due Date</span>
                <span class="due-date">${dueDate}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Statement Generated</span>
                <span class="info-value">${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
          
          <h2 class="section-title">Transaction Details</h2>
          
          <table class="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Particular</th>
                <th>Amount Debit (INR)</th>
                <th>Amount Credit (INR)</th>
                <th>Balance (INR)</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.length > 0 ? transactions.map(transaction => `
                <tr>
                  <td>${transaction.date || ''}</td>
                  <td>${transaction.particular}</td>
                  <td class="debit-amount">${transaction.debit > 0 ? transaction.debit.toFixed(2) : '-'}</td>
                  <td class="credit-amount">${transaction.credit > 0 ? transaction.credit.toFixed(2) : '-'}</td>
                  <td class="balance-amount">${transaction.balance ? transaction.balance.toFixed(2) : '0.00'}</td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="5" class="no-data">No transactions found</td>
                </tr>
              `}
            </tbody>
          </table>
          
          <div class="summary-section">
            <div class="summary-card debit">
              <div class="summary-label">Total Debits</div>
              <div class="summary-amount">₹${totalDebit.toFixed(2)}</div>
            </div>
            
            <div class="summary-card credit">
              <div class="summary-label">Total Credits</div>
              <div class="summary-amount">₹${totalCredit.toFixed(2)}</div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 16px; padding: 12px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 11px; color: #64748b; margin-bottom: 4px;">
              <strong>Current Balance:</strong> 
<span style="color: ${finalBalance < 0 ? '#dc2626' : '#2563eb'}; font-size: 14px; font-weight: bold;">
  ${finalBalance < 0 ? '-₹' : '₹'}${Math.abs(finalBalance).toFixed(2)}
</span>
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an auto-generated ledger statement from ATD Money System</p>
          <p>For any discrepancies, please contact customer support</p>
          <p class="generated">Generated on: ${new Date().toLocaleString('en-GB', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p style="margin-top: 4px; font-style: italic;">Powered By: ALL Time Data</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Updated PDF Service
export const pdfService = {
  downloadPDF: async (applicationId, applicantData = null) => {
    try {
      console.log("Downloading PDF for application ID:", applicationId);
      console.log("Applicant data available:", !!applicantData);
      
      // Always use applicantData if available (it already has ledgerDetails)
      if (applicantData) {
        console.log("Using applicant data for PDF generation");
        
        const ledgerData = {
          name: applicantData.name,
          loan_no: applicantData.loanNo,
          address: applicantData.address,
          crnno: applicantData.crnno,
          duedate: applicantData.dueDate,
          phone: applicantData.phoneNo,
          email: applicantData.email,
          ledgers: applicantData.ledgerDetails || []
        };
        
        const htmlContent = createLedgerHTML(ledgerData, applicationId, applicantData);
        
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();
        }
        
        return { success: true, message: 'Ledger statement opened in new tab' };
      }
      
      // Fallback to API if no applicant data
      console.log("Fetching ledger details from API");
      const response = await tallyLedgerAPI.getTallyLedgerDetails(applicationId);
      
      if (response && (response.data || response.success)) {
        const ledgerData = response.data || response;
        const htmlContent = createLedgerHTML(ledgerData, applicationId, applicantData);
        
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();
        }
        
        return { success: true, message: 'Ledger statement opened in new tab' };
      }
      
      throw new Error('No ledger data available for this application');
      
    } catch (error) {
      console.error("Download PDF Error:", error);
      throw new Error(error.message || 'Failed to generate ledger statement. Please try again.');
    }
  },

  printPDF: async (applicationId, applicantData = null) => {
    try {
      console.log("Printing PDF for application ID:", applicationId);
      
      // Always use applicantData if available
      if (applicantData) {
        const ledgerData = {
          name: applicantData.name,
          loan_no: applicantData.loanNo,
          address: applicantData.address,
          crnno: applicantData.crnno,
          duedate: applicantData.dueDate,
          phone: applicantData.phoneNo,
          email: applicantData.email,
          ledgers: applicantData.ledgerDetails || []
        };
        
        const htmlContent = createLedgerHTML(ledgerData, applicationId, applicantData);
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        setTimeout(() => {
          printWindow.print();
        }, 500);
        
        return { success: true, message: 'Ledger statement opened for printing' };
      }
      
      // Fallback to API
      const response = await tallyLedgerAPI.getTallyLedgerDetails(applicationId);
      
      if (response && (response.data || response.success)) {
        const ledgerData = response.data || response;
        const htmlContent = createLedgerHTML(ledgerData, applicationId, applicantData);
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        setTimeout(() => {
          printWindow.print();
        }, 500);
        
        return { success: true, message: 'Ledger statement opened for printing' };
      }
      
      throw new Error('No ledger data available for this application');
      
    } catch (error) {
      console.error("Print PDF Error:", error);
      throw new Error(error.message || 'Failed to print ledger statement. Please try again.');
    }
  }
};

// Adjustment Service
export const adjustmentService = {
  submitAdjustment: async (applicationId, adjustmentData) => {
    try {
      console.log("Adjustment service called with:", { applicationId, adjustmentData });
      
      const formattedData = {
        create_date: adjustmentData.date,
        trx_type: adjustmentData.trx_type, 
        particular: adjustmentData.particular, 
        trx_amount: parseFloat(adjustmentData.amount || 0)
      };
      
      console.log("Formatted data for API:", formattedData);
      
      const response = await tallyLedgerAPI.addTallyLedgerEntry(applicationId, formattedData);
      console.log("API Response:", response);
      
      return response;
    } catch (error) {
      console.error("Adjustment service error:", error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to submit adjustment');
    }
  }
};