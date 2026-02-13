const TOKEN_KEYS = {
  USER: 'user_auth_token',
  ADMIN_VIEW: 'admin_view_token',
  USER_DATA: 'user_data',
  ADMIN_VIEW_DATA: 'admin_view_data' 
};

export const TokenManager = {
  setUserToken: (token, userData) => {
    if (typeof window !== 'undefined') {
      // Clear session storage when user logs in
      sessionStorage.clear(); 
      
      // Clear only user-related tokens from localStorage
      localStorage.removeItem(TOKEN_KEYS.ADMIN_VIEW);
      localStorage.removeItem(TOKEN_KEYS.ADMIN_VIEW_DATA);
      
      localStorage.setItem(TOKEN_KEYS.USER, token);
      localStorage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(userData));
    } 
  },
  
  // Admin viewing user profile
  setAdminViewToken: (token, userData) => {
    if (typeof window !== 'undefined') {
      // Clear only user tokens, NOT all localStorage
      localStorage.removeItem(TOKEN_KEYS.USER);
      localStorage.removeItem(TOKEN_KEYS.USER_DATA);
      
      sessionStorage.setItem(TOKEN_KEYS.ADMIN_VIEW, token);
      sessionStorage.setItem(TOKEN_KEYS.ADMIN_VIEW_DATA, JSON.stringify(userData));
    }
  },
  
  getToken: () => {
    if (typeof window === 'undefined') {
      return { token: null, type: 'none', data: {} };
    }
    
    const adminViewToken = sessionStorage.getItem(TOKEN_KEYS.ADMIN_VIEW);
    if (adminViewToken) {
      return {
        token: adminViewToken,
        type: 'admin_view',
        data: JSON.parse(sessionStorage.getItem(TOKEN_KEYS.ADMIN_VIEW_DATA) || '{}')
      };
    }
    
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
      Object.values(TOKEN_KEYS).forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    }
  },
  
  isAdminView: () => {
    if (typeof window === 'undefined') return false;
    return !!sessionStorage.getItem(TOKEN_KEYS.ADMIN_VIEW);
  } 
};