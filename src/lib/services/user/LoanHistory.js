const API_BASE_URL = 'https://api.atdmoney.in/api';

/**
 * Fetch loan history for authenticated user
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Response object with success flag and loans array
 */
export const fetchLoanHistory = async (token) => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  try {
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const response = await fetch(`${API_BASE_URL}/user/loans/history`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch loan history: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching loan history:', error);
    throw error;
  }
};
