"use client";
import api from "@/utils/axiosInstance";

export const ledgerAPI = {
  getLedgerData: async (params = {}) => {
    try {
      const response = await api.get("/crm/ledger/get", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getLedgerDetails: async (applicationId) => {
    try {
      const response = await api.get(`/crm/ledger/detail/${applicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  settleLoanAccount: async (applicationId, settleData = null) => {
    try {
      const response = await api.get(`/crm/ledger/settle/${applicationId}`, settleData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  submitAdjustment: async (applicationId, adjustmentData) => {
    try {
      const response = await api.put(`/crm/ledger/adjustment/${applicationId}`, adjustmentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  submitRenewal: async (applicationId, renewalData) => {
    try {
      const response = await api.put(`/crm/ledger/renewal/${applicationId}`, renewalData);
      return response;
    } catch (error) {
      throw error;
    }
  }

};

export const formatLedgerDataForUI = (ledger) => {
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
    id: ledger.application_id,
    application_id: ledger.application_id,
    userId: ledger.user_id,
    user_id: ledger.user_id,
    loanNo: ledger.loan_no || "N/A",
    dueDate: formatDate(ledger.duedate || ledger.due_date),
    name: ledger.name || "N/A",
    address: ledger.address ? `${ledger.address}, ${ledger.city || ''}, ${ledger.state || ''}` : "N/A",
    phone: ledger.phone || "N/A",
    email: ledger.email || "N/A",
    balance: ledger.balance || 0,
    over_due: ledger.over_due || 0,
    settled: (ledger.Settled === 1 || ledger.settled === 1),
    passed_days: ledger.passed_days || 0, 
    crnno: ledger.crnno || "N/A",
    city: ledger.city || "",
    state: ledger.state || "",
    loan_status: ledger.loan_status
  };
};

export const formatLedgerDetailsForUI = (ledgerDetails) => {
  if (!ledgerDetails || !ledgerDetails.ledger) return { transactions: [], summary: {} };

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

  const transactions = ledgerDetails.ledger.map((transaction, index) => ({
    id: transaction.id || index,
    date: formatDate(transaction.create_date),
    particular: transaction.particular || "Transaction",
    debit: transaction.trx_type === 'debit' ? parseFloat(transaction.trx_amount || 0) : 0,
    credit: transaction.trx_type === 'credit' ? parseFloat(transaction.trx_amount || 0) : 0,
    diff_days: transaction.diff_days || 0,
    balance: 0
  }));

  let runningBalance = 0;
  transactions.forEach(transaction => {
    runningBalance = runningBalance + transaction.debit - transaction.credit;
    transaction.balance = runningBalance;
  });

  return {
    transactions: transactions,
    summary: ledgerDetails.summary || {}
  };
};

const formatDatePDF = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  } catch {
    return dateString;
  }
};

const createLedgerHTML = (response, applicationId, applicantData = null) => {
  let customerInfo = {};
  let transactions = [];
  let summary = {};
  
  const responseData = response?.data || response;
  
  if (applicantData) {
    customerInfo = {
      name: applicantData.name || 'N/A',
      address: applicantData.address || '',
      city: applicantData.city || '',
      state: applicantData.state || '',
      loan_no: applicantData.loanNo || 'N/A',
      crnno: applicantData.crnno || 'N/A',
      duedate: applicantData.dueDate || '',
      phone: applicantData.phone || '',
      email: applicantData.email || ''
    };
  }
  
  if (Array.isArray(responseData)) {
    transactions = responseData;
  } else if (responseData && typeof responseData === 'object') {
    transactions = responseData.ledger || [];
    
    summary = {
      total_debits: responseData.summary?.total_debits || 0,
      total_credits: responseData.summary?.total_credits || 0,
      balance: responseData.summary?.balance || 0
    };
  }
  
  let runningBalance = 0;
  const transactionsWithBalance = transactions.map(transaction => {
    const amount = parseFloat(transaction.trx_amount || 0);
    const trxType = (transaction.trx_type || 'debit').toLowerCase();
    
    if (trxType === 'debit') {
      runningBalance += amount;
    } else if (trxType === 'credit') {
      runningBalance -= amount;
    }
    
    return {
      ...transaction,
      particular: transaction.particular || 'Transaction',
      trx_amount: amount,
      trx_type: trxType,
      create_date: transaction.create_date,
      balance: runningBalance
    };
  });

  if (transactionsWithBalance.length > 0) {
    if (!summary.total_debits) {
      summary.total_debits = transactionsWithBalance
        .filter(t => t.trx_type === 'debit')
        .reduce((sum, t) => sum + t.trx_amount, 0);
    }
    if (!summary.total_credits) {
      summary.total_credits = transactionsWithBalance
        .filter(t => t.trx_type === 'credit')
        .reduce((sum, t) => sum + t.trx_amount, 0);
    }
    if (!summary.balance) {
      summary.balance = transactionsWithBalance[transactionsWithBalance.length - 1].balance;
    }
  }

  const customerName = customerInfo.name || 'N/A';
  
  let fullAddress = 'N/A';
  if (customerInfo.address) {
    const addressParts = [customerInfo.address, customerInfo.city, customerInfo.state]
      .filter(part => part && part.trim() !== '');
    fullAddress = addressParts.join(', ');
  }
  
  const loanNo = customerInfo.loan_no || 'N/A';
  const crnNo = customerInfo.crnno || 'N/A';
  const dueDate = customerInfo.duedate ? formatDatePDF(customerInfo.duedate) : 'N/A';

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
              ${transactionsWithBalance.length > 0 ? transactionsWithBalance.map(transaction => `
                <tr>
                  <td>${formatDatePDF(transaction.create_date)}</td>
                  <td>${transaction.particular}${transaction.diff_days > 0 && (transaction.particular === 'NORMAL INTEREST' || transaction.particular === 'PENAL INTEREST') ? ` (${transaction.diff_days} day${transaction.diff_days !== 1 ? 's' : ''})` : ''}</td>
                  <td class="debit-amount">${transaction.trx_type === 'debit' ? transaction.trx_amount.toFixed(2) : '-'}</td>
                  <td class="credit-amount">${transaction.trx_type === 'credit' ? transaction.trx_amount.toFixed(2) : '-'}</td>
                  <td class="balance-amount">${transaction.balance.toFixed(2)}</td>
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
              <div class="summary-amount">₹${summary.total_debits.toFixed(2)}</div>
            </div>
            
            <div class="summary-card credit">
              <div class="summary-label">Total Credits</div>
              <div class="summary-amount">₹${summary.total_credits.toFixed(2)}</div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 16px; padding: 12px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 11px; color: #64748b; margin-bottom: 4px;">
              <strong>Current Balance:</strong> 
              <span style="color: #2563eb; font-size: 14px; font-weight: bold;">₹${summary.balance.toFixed(2)}</span>
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

export const pdfService = {
  downloadPDF: async (applicationId, applicantData = null) => {
    try {
      const response = await ledgerAPI.getLedgerDetails(applicationId);
      
      if (response && (response.data || response.status === true)) {
        const ledgerData = response.data || response;
        const htmlContent = createLedgerHTML(ledgerData, applicationId, applicantData);
        
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();
        }
        
        return { success: true, message: 'Ledger statement opened in new tab' };
      }
      
      if (response && response.message) {
        throw new Error(response.message);
      }
      
      throw new Error('No data available for this ledger');
    } catch (error) {
      console.error("Download PDF Error:", error);
      throw new Error(error.message || 'Failed to generate ledger statement. Please try again.');
    }
  },

  printPDF: async (applicationId, applicantData = null) => {
    try {
      const response = await ledgerAPI.getLedgerDetails(applicationId);
      
      if (response && (response.data || response.status === true)) {
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
      
      if (response && response.message) {
        throw new Error(response.message);
      }
      
      throw new Error('No data available for this ledger');
    } catch (error) {
      console.error("Print PDF Error:", error);
      throw new Error(error.message || 'Failed to print ledger statement. Please try again.');
    }
  }
};

export const adjustmentService = {
  submitAdjustment: async (applicationId, adjustmentData) => {
    try {
      const formattedData = {
        create_date: adjustmentData.date,
        adjustment_type: adjustmentData.type?.toLowerCase() || 'adjustment',
        particular: adjustmentData.remark || 'Adjustment',
        trx_amount: parseFloat(adjustmentData.amount || 0),
        trx_type: adjustmentData.type?.toLowerCase() || 'adjustment'
      };
      
      const response = await ledgerAPI.submitAdjustment(applicationId, formattedData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to submit adjustment');
    }
  }
};

export const renewalService = {
  submitRenewal: async (applicationId, renewalData) => {
    try {
      const formattedData = {
        renewal_date: renewalData.renewal_date,
        renewal_amount: parseFloat(renewalData.renewal_amount || 0)
      };
      
      const response = await ledgerAPI.submitRenewal(applicationId, formattedData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to submit renewal');
    }
  }
};

export const settleService = {
  submitSettle: async (applicationId) => {
    try {
      const response = await ledgerAPI.settleLoanAccount(applicationId, {
        settle_date: new Date().toISOString().split('T')[0]
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to settle loan account');
    }
  }
};