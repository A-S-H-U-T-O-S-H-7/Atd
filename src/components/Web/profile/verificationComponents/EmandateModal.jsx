// components/Web/profile/EMandateModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const EMandateModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [mode, setMode] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paynimoReady, setPaynimoReady] = useState(false);

  // Check if Paynimo libraries are loaded
  useEffect(() => {
    let checkCount = 0;
    const maxChecks = 20;
    let interval = null;
    
    const checkPaynimo = () => {
      if (typeof window !== 'undefined') {
        const jQueryAvailable = typeof window.$ !== 'undefined';
        const pnCheckoutAvailable = window.$?.pnCheckout !== undefined;
        const isReady = jQueryAvailable && pnCheckoutAvailable;
        
        checkCount++;
        
        setPaynimoReady(isReady);
        
        if (isReady) {
          console.log('[EmandateModal] ✓ Payment gateway ready!');
          if (interval) clearInterval(interval);
        } else if (checkCount >= maxChecks) {
          console.error('[EmandateModal] ✗ Timeout waiting for payment gateway');
          if (interval) clearInterval(interval);
        }
      }
    };
    
    checkPaynimo();
    interval = setInterval(checkPaynimo, 500);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Fetch banks when mode changes
  useEffect(() => {
    if (mode) {
      fetchBanks(mode);
    } else {
      setBanks([]);
      setBankCode('');
    }
  }, [mode]);

  // Get user token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    }
    return null;
  };

  // Create axios instance with token
  const getAxiosConfig = () => {
    const token = getToken();
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.atdmoney.in/api/';
    
    return {
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'X-App-Version': '1.0.0',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      timeout: 10000
    };
  };

  const fetchBanks = async (selectedMode) => {
    try {
      setIsLoading(true);
      
      const config = getAxiosConfig();
      const response = await axios.get(`user/enach/bank/${selectedMode}`, config);
      
      if (response.data.success) {
        setBanks(response.data.data || []);
        toast.success('Banks loaded successfully');
      } else {
        toast.error('No banks available for selected mode');
        setBanks([]);
      }
    } catch (error) {
      console.error('[EmandateModal] Error fetching banks:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please login again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        toast.error(`Failed to load banks: ${error.response?.data?.message || error.message}`);
      }
      
      setBanks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = (res) => {
    console.log('[EmandateModal] Payment Response:', res);
    
    if (
      typeof res !== 'undefined' &&
      typeof res.paymentMethod !== 'undefined' &&
      typeof res.paymentMethod.paymentTransaction !== 'undefined' &&
      typeof res.paymentMethod.paymentTransaction.statusCode !== 'undefined'
    ) {
      const statusCode = res.paymentMethod.paymentTransaction.statusCode;
      
      if (statusCode === '0300') {
        // Success - user will be redirected to thank you page
        toast.success('E-Mandate completed successfully!');
        console.log('[EmandateModal] ✓ E-Mandate completed successfully!');
        onSuccess();
        onClose();
      } else if (statusCode === '0398') {
        // Initiated
        toast.loading('E-Mandate initiated. Please complete the process.');
        console.log('[EmandateModal] ⏳ E-Mandate initiated');
      } else {
        // Error
        toast.error(`E-Mandate failed. Status: ${statusCode}`);
        console.error('[EmandateModal] ✗ E-Mandate failed. Status code:', statusCode);
      }
    } else {
      toast.warning('E-Mandate process was cancelled');
      console.warn('[EmandateModal] E-Mandate process was cancelled or incomplete.');
    }
  };

  const initiateEMandateProcess = async () => {
    console.log('[EmandateModal] Initiating E-Mandate process...');
    
    if (!mode) {
      toast.error('Please select payment mode');
      return;
    }

    if (!paynimoReady || !window.$ || !window.$.pnCheckout) {
      toast.error('Payment gateway is loading. Please wait...');
      return;
    }

    try {
      setIsLoading(true);
      toast.loading('Initiating E-Mandate process...');

      const config = getAxiosConfig();
      
      // Get initiation data
      const response = await axios.get('user/enach/initiate/2', config);
      console.log('[EmandateModal] API Response:', response.data);
      
      // Check for success or status field (API might return either)
      const isSuccess = response.data.success === true || response.data.status === true;
      
      if (isSuccess && response.data.data) {
        console.log('[EmandateModal] E-Mandate data received:', response.data.data);
        
        const {
          subscription_id,
          loan_no,
          subscription_name,
          subscription_email,
          subscription_phone,
          bank_name,
          account_no,
          ifsc_code,
          debit_start_date,
          max_end_date,
          amount,
          frequency,
          token
        } = response.data.data;

        // Determine payment mode and subtype based on selected mode
        const mandateSubType = mode === 'net' ? 'eNACHBank' : 'eNACHBankCard';
        const paymentMode = mode === 'net' ? 'netBanking' : 'all';
        
        console.log('[EmandateModal] Payment configuration:', {
          mode,
          mandateSubType,
          paymentMode,
          bankCode,
          subscriptionId: subscription_id
        });

        // Senior's updated config from emandate.md
        const configJson = {
          tarCall: false,
          features: {
            showPGResponseMsg: true,
            enableAbortResponse: true,
            enableNewWindowFlow: false, // Changed to false as per senior
            enableExpressPay: true,
            payDetailsAtMerchantEnd: true,
            siDetailsAtMerchantEnd: true,
            enableSI: true
          },
          consumerData: {
            deviceId: 'WEBSH2',
            token: token,
            returnUrl: 'https://api.atdmoney.in/api/user/enach/report', // Backend endpoint
            responseHandler: handleResponse,
            paymentMode: paymentMode,
            merchantLogoUrl: 'https://atdmoney.com/atdlogo.png',
            merchantId: 'L815953',
            currency: 'INR',
            consumerId: loan_no,
            consumerMobileNo: subscription_phone,
            consumerEmailId: subscription_email,
            txnId: subscription_id,
            mandateSubType: [mandateSubType],
            items: [
              {
                itemId: 'FIRST',
                amount: '2',
                comAmt: '0'
              }
            ],
            customStyle: {
              PRIMARY_COLOR_CODE: '#00A651',
              SECONDARY_COLOR_CODE: '#FFFFFF',
              BUTTON_COLOR_CODE_1: '#AB2327',
              BUTTON_COLOR_CODE_2: '#FFFFFF'
            },
            bankCode: mode === 'net' ? bankCode : undefined, // Only for net banking
            accountNo: account_no,
            accountHolderName: subscription_name,
            accountType: 'Saving',
            ifscCode: ifsc_code,
            debitStartDate: debit_start_date,
            debitEndDate: max_end_date || '31-12-2030',
            maxAmount: amount || '200000',
            amountType: 'M',
            frequency: frequency || 'ADHOCC'
          }
        };

        console.log('[EmandateModal] Config prepared:', configJson);
        
        toast.dismiss();
        toast.loading('Opening payment gateway...');
        
        // Initialize payment
        try {
          console.log('[EmandateModal] Calling window.$.pnCheckout...');
          window.$.pnCheckout(configJson);
          console.log('[EmandateModal] pnCheckout called successfully');
          
          // Only open new window if enabled
          if (configJson.features.enableNewWindowFlow && window.pnCheckoutShared) {
            window.pnCheckoutShared.openNewWindow();
          }
          
          setTimeout(() => {
            toast.dismiss();
            toast.success('Payment gateway opened');
          }, 1000);
        } catch (pnError) {
          console.error('[EmandateModal] Paynimo error:', pnError);
          toast.dismiss();
          toast.error('Payment gateway error. Please contact support.');
          throw pnError;
        }

      } else {
        // FIX: Updated error handling for new response structure
        console.error('[EmandateModal] Invalid API response:', response.data);
        throw new Error(response.data.message || 'Failed to initiate E-Mandate');
      }
    } catch (error) {
      console.error('[EmandateModal] E-Mandate initiation error:', error);
      toast.dismiss();
      toast.error(error.message || 'Failed to initiate E-Mandate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setMode('');
    setBankCode('');
    setBanks([]);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-bold text-center">E-Mandate</h2>
          <p className="text-sm text-center mt-1">
            Please do not press back button or close or refresh
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Mode Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={isLoading}
            >
              <option value="">Select Mode</option>
              <option value="net">Net Banking</option>
              <option value="debit">Debit Card</option>
            </select>
          </div>

          {/* Bank Selection (only for net banking) */}
          {mode === 'net' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Bank
              </label>
              <select
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                disabled={isLoading}
              >
                <option value="">Select Bank</option>
                {banks.map((bank) => (
                  <option key={bank.bankcode} value={bank.bankcode}>
                    {bank.bankname}
                  </option>
                ))}
              </select>
              {isLoading && (
                <p className="text-sm text-gray-500 mt-1">Loading banks...</p>
              )}
            </div>
          )}

          {/* Info for Debit Card */}
          {mode === 'debit' && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                For Debit Card mode, you will be redirected to select your bank and card details in the payment gateway.
              </p>
            </div>
          )}

          {/* Payment Gateway Status */}
          {!paynimoReady && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700 flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading payment gateway...
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={initiateEMandateProcess}
              disabled={isLoading || !mode || (mode === 'net' && !bankCode) || !paynimoReady}
              className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMandateModal;