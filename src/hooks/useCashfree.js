// src/hooks/useCashfree.js
import { useState, useEffect } from 'react';
import { load } from '@cashfreepayments/cashfree-js';

export const useCashfree = () => {
  const [cashfree, setCashfree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeCashfree = async () => { 
      try {
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        const cashfreeInstance = await load({
          mode: "production",
        });
        
        setCashfree(cashfreeInstance);
      } catch (err) {
        console.error('Failed to load Cashfree SDK:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initializeCashfree();
  }, []);

  const initiatePayment = async (paymentSessionId, orderId, amount) => {
    if (!cashfree || typeof window === 'undefined') {
      throw new Error('Cashfree SDK not loaded or not in browser environment');
    }

    // Store amount for callback page
    if (amount) {
      localStorage.setItem(`amount_${orderId}`, amount);
    }

    // Enhanced return URL with more parameters for better detection
    const checkoutOptions = {
      paymentSessionId,
      returnUrl: `${window.location.origin}/payment/callback?order_id=${orderId}&source=cashfree&timestamp=${Date.now()}`,
      redirectTarget: "_self"
    };

    try {
      // Newer SDK versions with Promise
      if (typeof cashfree.checkout === 'function') {
        const result = await cashfree.checkout(checkoutOptions);
        
        if (result && result.error) {
          console.error('Payment error:', result.error);
          return { success: false, error: result.error };
        }
        
        // Store payment attempt in localStorage for fallback
        localStorage.setItem(`payment_attempt_${orderId}`, 'initiated');
        
        return { success: true, redirect: result?.redirect || true };
      }
      
      // Older SDK versions
      if (typeof cashfree.redirect === 'function') {
        localStorage.setItem(`payment_attempt_${orderId}`, 'initiated');
        cashfree.redirect(checkoutOptions);
        return { success: true, redirect: true };
      }
      
      throw new Error('No valid checkout method found');
      
    } catch (err) {
      console.error('Payment initiation failed:', err);
      localStorage.removeItem(`payment_attempt_${orderId}`);
      return { success: false, error: err };
    }
  };

  return { 
    cashfree, 
    loading: loading || !cashfree, 
    error, 
    initiatePayment 
  };
};