// components/CRNLink.js
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TokenManager } from '@/utils/tokenManager';

const CRNLink = ({ crnNo, userId, className = '', onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleCRNClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const api = (await import('@/utils/axiosInstance')).default;
      const response = await api.get(`crm/application/profile/${userId}`);

      if (response.success) {
        // Use TokenManager instead of direct sessionStorage
        TokenManager.setAdminViewToken(response.access_token, response.user);
        
        if (onSuccess) {
          onSuccess(response);
        }
        
        window.open('/userProfile', '_blank');
      } else {
        throw new Error(response.message || 'Failed to fetch user profile');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch user profile';
      console.error('Error fetching user profile:', err);
      
      if (onError) {
        onError(errorMessage);
      } else {
        alert(`Error: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCRNClick}
      disabled={loading}
      className={`inline-flex font-bold cursor-pointer items-center gap-1 text-emerald-400 hover:text-emerald-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      title="Click to view user profile"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{crnNo}</span>
        </>
      ) : (
        <span className="font-semibold text-sm ">{crnNo}</span>
      )}
    </button>
  );
};

export default CRNLink;