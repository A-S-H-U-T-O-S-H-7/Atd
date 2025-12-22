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
        // Check if we're in browser environment
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        // Load Cashfree SDK
        const cashfreeInstance = await load({
          mode: process.env.NEXT_PUBLIC_CASHFREE_ENV || 'sandbox',
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

  const initiatePayment = async (paymentSessionId, orderId) => {
    if (!cashfree || typeof window === 'undefined') {
      throw new Error('Cashfree SDK not loaded or not in browser environment');
    }

    const checkoutOptions = {
      paymentSessionId,
      returnUrl: `${window.location.origin}/payment/callback?order_id=${orderId}`,
    };

    try {
      // Use the correct Cashfree method based on your version
      // Method 1: For newer versions that return a Promise
      if (typeof cashfree.checkout === 'function') {
        const result = await cashfree.checkout(checkoutOptions);
        
        if (result && result.error) {
          console.error('Payment error:', result.error);
          return { success: false, error: result.error };
        }
        
        return { success: true, redirect: result?.redirect || true };
      }
      
      // Method 2: For older versions that redirect directly
      if (typeof cashfree.redirect === 'function') {
        cashfree.redirect(checkoutOptions);
        return { success: true, redirect: true };
      }
      
      throw new Error('No valid checkout method found');
      
    } catch (err) {
      console.error('Payment initiation failed:', err);
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