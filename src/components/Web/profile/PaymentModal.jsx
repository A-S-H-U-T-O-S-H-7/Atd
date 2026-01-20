import { useState, useEffect, useRef } from 'react';
import { X, Info, CheckCircle, XCircle, Loader, Calendar, Banknote, Clock, AlertCircle, CreditCard, TrendingUp, Wallet } from 'lucide-react';
import { useCashfree } from '@/hooks/useCashfree';
import { TokenManager } from '@/utils/tokenManager';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, applicationId, router }) => {
  const [paymentMethod, setPaymentMethod] = useState('cashfree');
  const [selectedBank, setSelectedBank] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const { cashfree, initiatePayment } = useCashfree();
  const modalRef = useRef(null);
  const isOpeningRef = useRef(false);

  const getAuthHeaders = () => {
    const tokenData = TokenManager.getToken();
    if (!tokenData.token) {
      throw new Error('No auth token');
    }
    return {
      'Accept': 'application/json',
      'Authorization': `Bearer ${tokenData.token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    if (isOpen) {
      isOpeningRef.current = true;
      const timer = setTimeout(() => {
        isOpeningRef.current = false;
      }, 500);
      
      fetchPaymentDetails();
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://live.atdmoney.com/api/user/cashfree/initiate/${applicationId}`,
        { method: 'GET', headers: getAuthHeaders() }
      );

      if (response.status === 401) {
        TokenManager.clearAllTokens();
        if (router) router.push('/userlogin');
        onClose();
        return;
      }

      const data = await response.json();
      if (data.success) {
        setPaymentDetails(data.data);
        const totalAmount = calculateTotalOutstanding(data.data);
        setCustomAmount(totalAmount.toString());
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Fetch error:', error);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (isOpeningRef.current) return;
    onClose();
  };

  const calculateTotalOutstanding = (details) => {
    if (!details) return 0;
    
    const {
      principal_amount = 0,
      normal_interest_before = 0,
      normal_interest_after = 0,
      penal_interest_before = 0,
      penal_interest_after = 0,
      penalty_before = 0,
      penalty_after = 0,
      bounce_amount = 0,
      
    } = details;

    const total = (
      Number(principal_amount || 0) +
      Number(normal_interest_before || 0) +
      Number(normal_interest_after || 0) +
      Number(penal_interest_before || 0) +
      Number(penal_interest_after || 0) +
      Number(penalty_before || 0) +
      Number(penalty_after || 0) +
      Number(bounce_amount || 0) 
      
    );

    return isNaN(total) ? 0 : total;
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const maxAmount = calculateTotalOutstanding(paymentDetails);
      const numValue = parseFloat(value) || 0;
      if (numValue <= maxAmount) {
        setCustomAmount(value);
      }
    }
  };

  const calculatePayableAmount = () => {
    const amount = parseFloat(customAmount) || 0;
    if (paymentMethod === 'cashfree') {
      const gatewayCharges = amount * 0.02;
      return parseFloat((amount + gatewayCharges).toFixed(2));
    }
    return amount;
  };

  const handleCashfreePayment = async () => {
    if (!paymentDetails) return;

    const paymentAmount = parseFloat(customAmount) || 0;
    if (paymentAmount <= 0) return;

    const maxAmount = calculateTotalOutstanding(paymentDetails);
    if (paymentAmount > maxAmount) return;

    try {
      setLoading(true);
      const payableAmount = calculatePayableAmount();

      const orderData = {
        id: applicationId,
        outstanding_amount: paymentAmount,
        payable_amount: payableAmount,
        platform: 'Desktop'
      };

      const orderResponse = await fetch(
        'https://live.atdmoney.com/api/user/cashfree/create-order',
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(orderData)
        }
      );

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        throw new Error(orderResult.message || 'Failed to create order');
      }

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
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    const paymentAmount = parseFloat(customAmount) || 0;
    if (paymentAmount <= 0) return;

    if (paymentMethod === 'neft') {
      if (!selectedBank) return;
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
                  ₹{(parseFloat(customAmount) || 0).toFixed(2)}
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
          <p className="text-gray-600 text-sm">Loading payment details...</p>
        </div>
      </div>
    );
  }

  const totalOutstanding = calculateTotalOutstanding(paymentDetails);
  const paymentAmount = parseFloat(customAmount) || totalOutstanding;
  const gatewayCharges = paymentMethod === 'cashfree' ? paymentAmount * 0.02 : 0;
  const payableAmount = calculatePayableAmount();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount)) return '₹0.00';
    return `₹${numAmount.toFixed(2)}`;
  };

  const getFormattedAmounts = () => {
    return {
      totalOutstanding: formatCurrency(totalOutstanding),
      paymentAmount: formatCurrency(paymentAmount),
      gatewayCharges: formatCurrency(gatewayCharges),
      payableAmount: formatCurrency(payableAmount)
    };
  };

  const amounts = getFormattedAmounts();

  return (
    <>
      <PaymentStatusScreen />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[99999]">
        <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative z-[100000]">
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 z-10 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Payment Details</h2>
              <button onClick={handleClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" disabled={loading}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20 rounded-2xl">
              <div className="text-center">
                <Loader className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Processing payment...</p>
              </div>
            </div>
          )}

          <div className=" p-2 md:p-5 space-y-3 md:space-y-5">
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-1 md:p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs text-blue-700 font-medium">Disburse Date</span>
                </div>
                <p className="font-semibold text-sm text-gray-800">{formatDate(paymentDetails?.transaction_date)}</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-1 md:p-3 rounded-lg border border-amber-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs text-amber-700 font-medium">Due Date</span>
                </div>
                <p className="font-semibold text-sm text-gray-800">{formatDate(paymentDetails?.due_date)}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-1 md:p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs text-green-700 font-medium">Last Payment</span>
                </div>
                <p className="font-semibold text-sm text-gray-800">{formatDate(paymentDetails?.last_collection_date)}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-100/50 p-2 md:p-4 rounded-lg md:rounded-xl border-2 border-indigo-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm text-indigo-700 font-medium">Total Outstanding Amount</span>
                </div>
                <span className="text-xl font-bold text-indigo-900">{amounts.totalOutstanding}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-lg md:rounded-xl p-2 md:p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-slate-600" />
                <h4 className="font-semibold text-sm text-gray-800">Amount Breakdown</h4>
              </div>
              <div className="space-y-1.5 text-xs">
                {paymentDetails?.principal_amount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Principal Amount</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(paymentDetails.principal_amount)}</span>
                  </div>
                )}
                {(paymentDetails?.normal_interest_before > 0 || paymentDetails?.normal_interest_after > 0) && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Normal Interest</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency((paymentDetails.normal_interest_before || 0) + (paymentDetails.normal_interest_after || 0))}
                    </span>
                  </div>
                )}
                {(paymentDetails?.penal_interest_before > 0 || paymentDetails?.penal_interest_after > 0) && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Penal Interest</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency((paymentDetails.penal_interest_before || 0) + (paymentDetails.penal_interest_after || 0))}
                    </span>
                  </div>
                )}
                {(paymentDetails?.penalty_before > 0 || paymentDetails?.penalty_after > 0) && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Penalty</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency((paymentDetails.penalty_before || 0) + (paymentDetails.penalty_after || 0))}
                    </span>
                  </div>
                )}
                {paymentDetails?.bounce_amount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bounce Charges</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(paymentDetails.bounce_amount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2 border-t border-slate-300">
                  <span className="font-semibold text-gray-700">Total Outstanding</span>
                  <span className="font-bold text-blue-600">{amounts.totalOutstanding}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-gray-700">
                  Enter Payment Amount
                </label>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Max: {amounts.totalOutstanding}
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Banknote className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="pl-12 pr-12 block w-full px-4 py-3.5 border-2 border-blue-200 rounded-xl text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800"
                  placeholder="Enter amount"
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-blue-600 font-bold text-lg">₹</span>
                </div>
              </div>
              <div className="flex gap-2">
                {[500, 1000, 5000, totalOutstanding].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setCustomAmount(amount.toString())}
                    className="flex-1 px-2 py-2 text-xs font-medium border-2 border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    disabled={loading}
                  >
                    {amount === totalOutstanding ? 'Full' : `₹${amount}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-800">Payment Method</h3>
              
              <div className={`border-2 rounded-xl p-3 transition-all ${paymentMethod === 'cashfree' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cashfree" 
                    checked={paymentMethod === 'cashfree'} 
                    onChange={(e) => setPaymentMethod(e.target.value)} 
                    className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500" 
                    disabled={loading} 
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-sm text-gray-800">Card / NetBanking / UPI</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">CashFree</span>
                    </div>
                    <div className="flex items-start space-x-1.5 text-amber-700 text-xs bg-amber-50 px-2 py-1.5 rounded-lg border border-amber-200">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>2% transaction charges apply</span>
                    </div>
                  </div>
                </label>
              </div>

              <div className={`border-2 rounded-xl p-3 transition-all ${paymentMethod === 'neft' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="neft" 
                    checked={paymentMethod === 'neft'} 
                    onChange={(e) => setPaymentMethod(e.target.value)} 
                    className="mt-0.5 w-4 h-4 text-green-600 focus:ring-green-500" 
                    disabled={loading} 
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-gray-800">NEFT Transfer</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">No Charges</span>
                    </div>
                   
                    {paymentMethod === 'neft' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Select Your Bank:</label>
                        <select 
                          value={selectedBank} 
                          onChange={(e) => setSelectedBank(e.target.value)} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                          disabled={loading}
                        >
                          <option value="">-- Select Bank --</option>
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
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200 shadow-sm">
              <h4 className="font-bold text-sm text-gray-800 mb-3">Payment Summary</h4>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Payment Amount</span>
                  <span className="font-semibold text-sm text-gray-800">{amounts.paymentAmount}</span>
                </div>
                {paymentMethod === 'cashfree' && gatewayCharges > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Gateway Charges (2%)</span>
                    <span className="font-semibold text-sm text-amber-600">+ {formatCurrency(gatewayCharges)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t-2 border-blue-300 pt-2.5">
                  <span className="text-sm text-gray-800 font-bold">Total Payable</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{amounts.payableAmount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-4 rounded-b-2xl">
            <button 
              onClick={handlePayment} 
              disabled={loading || (paymentMethod === 'neft' && !selectedBank) || paymentAmount <= 0} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-6 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Pay ${amounts.payableAmount}`}
            </button>
            {paymentMethod === 'neft' && (
              <p className="text-center text-xs text-gray-500 mt-2">Share transaction details with support after transfer</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;