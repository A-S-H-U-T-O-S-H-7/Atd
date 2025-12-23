import { useState, useEffect, useRef } from 'react';
import { X, Info, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useCashfree } from '@/hooks/useCashfree';
import { TokenManager } from '@/utils/tokenManager';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, applicationId, router }) => {
  const [paymentMethod, setPaymentMethod] = useState('cashfree'); 
  const [selectedBank, setSelectedBank] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const { cashfree, initiatePayment } = useCashfree();
  const modalRef = useRef(null);

  const getAuthHeaders = () => {
    const tokenData = TokenManager.getToken();
    if (!tokenData.token) {
      toast.error('Please login to continue');
      throw new Error('No auth token');
    }
    return {
      'Accept': 'application/json',
      'Authorization': `Bearer ${tokenData.token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    if (isOpen) fetchPaymentDetails();
  }, [isOpen]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const tokenData = TokenManager.getToken();
      if (!tokenData.token) {
        toast.error('Please login to continue');
        onClose();
        return;
      }

      const response = await fetch(
        `https://api.atdmoney.in/api/user/cashfree/initiate/${applicationId}`,
        { method: 'GET', headers: getAuthHeaders() }
      );

      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        TokenManager.clearAllTokens();
        router.push('/userlogin');
        onClose();
        return;
      }

      const data = await response.json();
      if (data.success) {
        setPaymentDetails(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch payment details');
        onClose();
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Network error occurred');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const calculatePayableAmount = () => {
    if (!paymentDetails) return 0;
    const outstandingAmount = paymentDetails.payable?.total_due_amount || 0;
    if (paymentMethod === 'cashfree') {
      const gatewayCharges = outstandingAmount * 0.02;
      return parseFloat((outstandingAmount + gatewayCharges).toFixed(2));
    }
    return outstandingAmount;
  };

  const handleCashfreePayment = async () => {
    if (!paymentDetails || !cashfree) {
      toast.error('Payment details not loaded');
      return;
    }

    try {
      setLoading(true);
      const outstandingAmount = paymentDetails.payable?.total_due_amount || 0;
      const payableAmount = calculatePayableAmount();

      const orderData = {
        id: applicationId, 
        outstanding_amount: outstandingAmount,
        payable_amount: payableAmount,
        platform: 'Desktop'
      };

      console.log('Sending order data:', orderData);

      const orderResponse = await fetch(
        'https://api.atdmoney.in/api/user/cashfree/create-order',
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(orderData)
        }
      );

      console.log('Order response status:', orderResponse.status);
      
      const orderResult = await orderResponse.json();
      console.log('Order result:', orderResult);

      if (!orderResult.success) {
        console.error('Order creation failed:', {
          success: orderResult.success,
          message: orderResult.message,
          errors: orderResult.errors,
          data: orderResult.data
        });
        throw new Error(orderResult.message || 'Failed to create order');
      }

      // COMPLETE THE PAYMENT FLOW - This was missing
      const paymentResult = await initiatePayment(
        orderResult.payment_session_id,
        orderResult.order_id
      );

      if (paymentResult.success) {
        setPaymentStatus('processing');
        setTimeout(() => {
          setPaymentStatus('success');
          setTimeout(() => {
            onClose();
            if (router) router.push('/profile');
          }, 2000);
        }, 2000);
      } else {
        throw new Error(paymentResult.error?.message || 'Payment failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'neft') {
      if (!selectedBank) {
        toast.error('Please select a bank for NEFT transfer');
        return;
      }
      toast.success('NEFT instructions displayed. Please complete transfer.');
      onClose();
    } else {
      handleCashfreePayment();
    }
  };

  const PaymentStatusScreen = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[10000]">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
              <Loader className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h3>
              <p className="text-gray-600">Please wait...</p>
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[10000]">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-3">Payment Successful! 🎉</h3>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-lg font-semibold text-green-800">
                  ₹{paymentDetails?.payable?.total_due_amount?.toFixed(2) || '0.00'}
                </p>
                <p className="text-gray-600 text-sm mt-1">Payment completed</p>
              </div>
              <p className="text-gray-500 text-sm animate-pulse">Redirecting...</p>
            </div>
          </div>
        );
      case 'failed':
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[10000]">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-3">Payment Failed</h3>
              <p className="text-gray-600 mb-6">Please try again.</p>
              <div className="flex gap-3">
                <button onClick={() => setPaymentStatus(null)} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                  Try Again
                </button>
                <button onClick={() => { setPaymentStatus(null); onClose(); }} className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;
  if (loading && !paymentDetails) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  const outstandingAmount = paymentDetails?.payable?.total_due_amount || 0;
  const gatewayCharges = paymentMethod === 'cashfree' ? outstandingAmount * 0.02 : 0;
  const payableAmount = calculatePayableAmount();

  return (
    <>
      <PaymentStatusScreen />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
        <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" disabled={loading}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
              <div className="text-center">
                <Loader className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-600">Processing payment...</p>
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Outstanding Amount:</span>
                  <span className="font-semibold text-gray-800">₹{outstandingAmount.toFixed(2)}</span>
                </div>
                {paymentMethod === 'cashfree' && gatewayCharges > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Gateway Charges (2%):</span>
                    <span className="font-semibold text-amber-600">+ ₹{gatewayCharges.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                  <span className="text-gray-800 font-bold">Total Payable Amount:</span>
                  <span className="text-xl font-bold text-blue-600">₹{payableAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`border-2 rounded-xl p-4 transition-all ${paymentMethod === 'cashfree' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <label className="flex items-start space-x-4 cursor-pointer">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cashfree" 
                    checked={paymentMethod === 'cashfree'} 
                    onChange={(e) => setPaymentMethod(e.target.value)} 
                    className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500" 
                    disabled={loading} 
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">Debit Card / Net Banking / UPI</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">CashFree</span>
                    </div>
                    <div className="flex items-start space-x-2 text-amber-700 text-sm bg-amber-50 px-3 py-2 rounded-lg">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>2% transaction charges apply</span>
                    </div>
                  </div>
                </label>
              </div>

              <div className={`border-2 rounded-xl p-4 transition-all ${paymentMethod === 'neft' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <label className="flex items-start space-x-4 cursor-pointer">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="neft" 
                    checked={paymentMethod === 'neft'} 
                    onChange={(e) => setPaymentMethod(e.target.value)} 
                    className="mt-1 w-5 h-5 text-green-600 focus:ring-green-500" 
                    disabled={loading} 
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">NEFT Transfer</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">No Charges</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                      <h4 className="font-medium text-gray-700 mb-2">Bank Details:</h4>
                      <div className="text-sm space-y-1.5 text-gray-600">
                        <p><span className="font-medium">Name:</span> ATD FINANCIAL SERVICES PVT LTD</p>
                        <p><span className="font-medium">Account No.:</span> 025305005395</p>
                        <p><span className="font-medium">IFSC Code:</span> ICIC0000253</p>
                        <p><span className="font-medium">Bank:</span> ICICI BANK</p>
                        <p><span className="font-medium">Branch:</span> SECTOR-61 NOIDA</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Bank:</label>
                      <select 
                        value={selectedBank} 
                        onChange={(e) => setSelectedBank(e.target.value)} 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        disabled={loading}
                      >
                        <option value="">-- Select Your Bank --</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="pnb">Punjab National Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                        <option value="bob">Bank of Baroda</option>
                        <option value="canara">Canara Bank</option>
                      </select>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <button 
              onClick={handlePayment} 
              disabled={loading || (paymentMethod === 'neft' && !selectedBank)} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Pay ₹${payableAmount.toFixed(2)}`}
            </button>
            {paymentMethod === 'neft' && (
              <p className="text-center text-sm text-gray-500 mt-3">Share transaction details with support after transfer</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;