const TOKEN_KEYS = {
  USER: 'user_auth_token',
  ADMIN_VIEW: 'admin_view_token',
  USER_DATA: 'user_data',
  ADMIN_VIEW_DATA: 'admin_view_data'
};

export const TokenManager = {
  setUserToken: (token, userData) => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear(); 
      
      localStorage.setItem(TOKEN_KEYS.USER, token);
      localStorage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(userData));
    }
  },
  
  // Admin viewing user profile
  setAdminViewToken: (token, userData) => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      
      sessionStorage.setItem(TOKEN_KEYS.ADMIN_VIEW, token);
      sessionStorage.setItem(TOKEN_KEYS.ADMIN_VIEW_DATA, JSON.stringify(userData));
    }
  },
  
  // Get current token
  getToken: () => {
    if (typeof window === 'undefined') {
      return { token: null, type: 'none', data: {} };
    }
    
    // First check if admin view token exists (sessionStorage)
    const adminViewToken = sessionStorage.getItem(TOKEN_KEYS.ADMIN_VIEW);
    if (adminViewToken) {
      return {
        token: adminViewToken,
        type: 'admin_view',
        data: JSON.parse(sessionStorage.getItem(TOKEN_KEYS.ADMIN_VIEW_DATA) || '{}')
      };
    }
    
    // Otherwise use normal user token (localStorage)
    const userToken = localStorage.getItem(TOKEN_KEYS.USER);
    return {
      token: userToken,
      type: 'user',
      data: JSON.parse(localStorage.getItem(TOKEN_KEYS.USER_DATA) || '{}')
    };
  },
  
  // Clear all tokens
  clearAllTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
  },
  
  // Check token type
  isAdminView: () => {
    if (typeof window === 'undefined') return false;
    return !!sessionStorage.getItem(TOKEN_KEYS.ADMIN_VIEW);
  }
};