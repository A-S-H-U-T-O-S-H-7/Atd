import api from "@/utils/axiosInstance";

export const expenseService = {
  // Add new expense
  addExpense: async (expenseData) => {
    try {
      const formattedData = {
        month: getMonthNumber(expenseData.month), // ✅ Changed from 'months' to 'month'
        year: parseInt(expenseData.year),
        salary: parseFloat(expenseData.salary) || 0,
        mobile_expenses: parseFloat(expenseData.mobileExpenses) || 0,
        convence: parseFloat(expenseData.convence) || 0,
        interest: parseFloat(expenseData.interest) || 0,
        electricity: parseFloat(expenseData.electricity) || 0,
        rent: parseFloat(expenseData.rent) || 0,
        promotion: parseFloat(expenseData.promotionAdvertisement) || 0,
        cibil: parseFloat(expenseData.cibil) || 0,
        others: parseFloat(expenseData.others) || 0
      };


      const response = await api.post('/crm/expenses/add', formattedData);
      return response;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  },

  // Get all expenses with pagination and filters
  getExpenses: async (params = {}) => {
    try {
      const response = await api.get('/crm/expenses/manage', { params });
      return response;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  // Get expense by ID for editing
  getExpenseById: async (expenseId) => {
    try {
      const response = await api.get(`/crm/expenses/edit/${expenseId}`);
      return response;
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw error;
    }
  },

  // Update expense
  updateExpense: async (expenseId, expenseData) => {
    try {
      const formattedData = {
        month: getMonthNumber(expenseData.month), // ✅ Changed from 'months' to 'month'
        year: String(expenseData.year), // ✅ Convert to string as API expects
        salary: parseFloat(expenseData.salary) || 0,
        mobile_expenses: parseFloat(expenseData.mobileExpenses) || 0,
        convence: parseFloat(expenseData.convence) || 0,
        interest: parseFloat(expenseData.interest) || 0,
        electricity: parseFloat(expenseData.electricity) || 0,
        rent: parseFloat(expenseData.rent) || 0,
        promotion: parseFloat(expenseData.promotionAdvertisement) || 0,
        cibil: parseFloat(expenseData.cibil) || 0,
        others: parseFloat(expenseData.others) || 0
      };

      console.log('Sending to API (Update):', formattedData); // Debug log

      const response = await api.put(`/crm/expenses/update/${expenseId}`, formattedData);
      return response;
    } catch (error) {
      console.error('Error updating expense:', error);
      console.error('Error response:', error.response?.data); // Debug log
      throw error;
    }
  },

  // Get profit and loss data
  getProfitLoss: async (params = {}) => {
    try {
      const response = await api.get('/crm/expenses/profit-loss', { params });
      return response;
    } catch (error) {
      console.error('Error fetching profit-loss data:', error);
      throw error;
    }
  },

  // Validate expense data
  validateExpenseData: (formData) => {
    const errors = {};

    if (!formData.month?.trim()) {
      errors.month = 'Month is required';
    }

    if (!formData.year) {
      errors.year = 'Year is required';
    }

    if (!formData.salary || parseFloat(formData.salary) < 0) {
      errors.salary = 'Valid salary amount is required';
    }

    // Validate all numeric fields are non-negative
    const numericFields = [
      'mobileExpenses', 'convence', 'interest', 'electricity', 
      'rent', 'promotionAdvertisement', 'cibil', 'others'
    ];

    numericFields.forEach(field => {
      const value = parseFloat(formData[field]);
      if (formData[field] && value < 0) {
        errors[field] = 'Amount cannot be negative';
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

// Helper function to convert month name to number
const getMonthNumber = (monthName) => {
  // ✅ Handle empty or undefined month
  if (!monthName) {
    console.error('Month name is empty or undefined');
    return '01';
  }

  const months = {
    'january': '01',
    'february': '02',
    'march': '03',
    'april': '04',
    'may': '05',
    'june': '06',
    'july': '07',
    'august': '08',
    'september': '09',
    'october': '10',
    'november': '11',
    'december': '12'
  };

  // ✅ Convert to lowercase and get month number
  const monthKey = monthName.toLowerCase();
  const monthNum = months[monthKey];
  
  if (!monthNum) {
    console.error('Invalid month name:', monthName);
    return '01'; // Default fallback
  }
  
  return monthNum;
};

// Helper function to convert month number to name
const getMonthName = (monthNumber) => {
  const months = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
  };
  
  // Handle range format like "01-01/01-31" or "07-01/07-31"
  if (monthNumber && monthNumber.includes('-')) {
    const monthPart = monthNumber.split('-')[0];
    return months[monthPart] || monthNumber;
  }
  
  return months[monthNumber] || monthNumber;
};

// Format expense data for UI
export const formatExpenseForUI = (expense) => {
  return {
    id: expense.id,
    month: getMonthName(expense.month),
    year: parseInt(expense.year),
    salary: parseFloat(expense.salary) || 0,
    mobileExpenses: parseFloat(expense.mobile_expenses) || 0,
    convence: parseFloat(expense.convence) || 0,
    interest: parseFloat(expense.interest) || 0,
    electricity: parseFloat(expense.electricity) || 0,
    rent: parseFloat(expense.rent) || 0,
    promotionAdvertisement: parseFloat(expense.promotion) || 0,
    cibil: parseFloat(expense.cibil) || 0,
    others: parseFloat(expense.others) || 0,
    total: parseFloat(expense.total) || 0,
    created_at: expense.created_at,
    added_by: expense.added_by
  };
};

export const formatProfitLossForUI = (apiResponse) => {
  console.log('Formatting profit-loss data:', apiResponse);
  
  if (!apiResponse || !apiResponse.data || apiResponse.data.length === 0) {
    return null; // Return null instead of empty structure
  }

  const data = apiResponse.data[0]; // Get first item from array
  
  // Calculate total expenses (excluding salary which might be revenue/income in some cases)
  const totalExpenses = parseFloat(data.total) || 0;
  
  // The profit_or_loss from API
  const profitOrLoss = parseFloat(data.profit_or_loss) || 0;
  
  // Calculate total income (profit_or_loss + expenses)
  const totalIncome = profitOrLoss + totalExpenses;
  
  // Break down expenses by category
  const expenseBreakdown = {
    salary: parseFloat(data.salary) || 0,
    mobileExpenses: parseFloat(data.mobile_expenses) || 0,
    convence: parseFloat(data.convence) || 0,
    interest: parseFloat(data.interest) || 0,
    electricity: parseFloat(data.electricity) || 0,
    rent: parseFloat(data.rent) || 0,
    promotion: parseFloat(data.promotion) || 0,
    cibil: parseFloat(data.cibil) || 0,
    others: parseFloat(data.others) || 0
  };

  return {
    // Since API doesn't provide income breakdown, we'll show calculated values
    processFee: { 
      actual: 0, // Not provided by API
      total: 0,  // Not provided by API
      gst: 0     // Not provided by API
    },
    penalty: { 
      actual: 0, // Not provided by API
      total: 0,  // Not provided by API
      gst: 0     // Not provided by API
    },
    interest: 0,        // Not provided by API
    penalInterest: 0,   // Not provided by API
    totalIncome: totalIncome,
    totalExpenses: totalExpenses,
    profitLoss: profitOrLoss,
    expenseBreakdown: expenseBreakdown, // ✅ Added expense breakdown
    month: data.month,
    year: data.year,
    addedBy: data.added_by
  };
};