import { useState, useEffect, useRef } from 'react';
import { X, Info, CheckCircle, XCircle, Loader, Calendar, Banknote, Clock, AlertCircle, CreditCard, TrendingUp, Wallet, ChevronDown, ChevronUp, QrCode, Building, Smartphone, Landmark, Copy, Check } from 'lucide-react';
import { useCashfree } from '@/hooks/useCashfree';
import { TokenManager } from '@/utils/tokenManager';
import toast from 'react-hot-toast';
import Image from 'next/image';

const PaymentModal = ({ isOpen, onClose, applicationId, router }) => {
  const [paymentMethod, setPaymentMethod] = useState('cashfree');
  const [selectedBank, setSelectedBank] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const { cashfree, initiatePayment } = useCashfree();
  const modalRef = useRef(null);
  const isOpeningRef = useRef(false);

  // Bank details for different methods
  const bankDetails = {
    neft: {
      bank: "ICICI Bank",
      accountName: "ATD FINANCIAL SERVICES PVT LTD",
      accountNo: "025305005395",
      ifsc: "ICIC0000253"
    },
    virtual: {
      bank: "ICICI Bank",
      accountName: "ATD FINANCIAL SERVICES PVT LTD",
      accountNo: "ATDMON9569584126",
      ifsc: "ICIC0000106"
    },
    upi: {
      id: "atdfinancialsnoida@icici"
    }
  };

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
        orderResult.order_id,
        payableAmount
      );

      if (paymentResult.success) {
        setPaymentStatus('processing');
      } else {
        throw new Error(paymentResult.error?.message || 'Payment failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      setLoading(false);
    }
  };

  const handleCopyDetails = async (methodId) => {
    let textToCopy = '';
    
    switch (methodId) {
      case 'neft':
        textToCopy = `Bank: ${bankDetails.neft.bank}\nAccount Name: ${bankDetails.neft.accountName}\nAccount No: ${bankDetails.neft.accountNo}\nIFSC: ${bankDetails.neft.ifsc}`;
        break;
      case 'virtual':
        textToCopy = `Bank: ${bankDetails.virtual.bank}\nAccount Name: ${bankDetails.virtual.accountName}\nAccount No: ${bankDetails.virtual.accountNo}\nIFSC: ${bankDetails.virtual.ifsc}`;
        break;
      case 'upi':
        textToCopy = bankDetails.upi.id;
        break;
      default:
        return;
    }
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(methodId);
      toast.success('Details copied to clipboard!');
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy details');
    }
  };

  const handlePayment = () => {
    const paymentAmount = parseFloat(customAmount) || 0;
    if (paymentAmount <= 0) return;

    if (paymentMethod === 'cashfree') {
      handleCashfreePayment();
    } else {
      handleCopyDetails(paymentMethod);
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

  // Payment method options
  const paymentOptions = [
    {
      id: 'cashfree',
      title: 'Card / NetBanking / UPI',
      subtitle: 'Instant Payment',
      icon: CreditCard,
      color: 'blue',
      charges: '2% charges apply',
      showInput: true
    },
    {
      id: 'neft',
      title: 'NEFT Transfer',
      subtitle: 'Bank Transfer',
      icon: Building,
      color: 'green',
      charges: 'No charges',
      showInput: false
    },
    {
      id: 'virtual',
      title: 'Virtual Account',
      subtitle: 'Dedicated Account',
      icon: Landmark,
      color: 'purple',
      charges: 'No charges',
      showInput: false
    },
    {
      id: 'qr',
      title: 'QR Code',
      subtitle: 'Scan & Pay',
      icon: QrCode,
      color: 'orange',
      charges: 'No charges',
      showInput: false
    },
    {
      id: 'upi',
      title: 'UPI ID',
      subtitle: 'Direct UPI Payment',
      icon: Smartphone,
      color: 'indigo',
      charges: 'No charges',
      showInput: false
    }
  ];

  return (
    <>
      <PaymentStatusScreen />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[99999]">
        <style jsx>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideDown {
            animation: slideDown 0.2s ease-out;
          }
        `}</style>
        
        <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative z-[100000]">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 z-10 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Payment Details</h2>
                <p className="text-blue-100 text-xs mt-0.5">Application ID: {applicationId}</p>
              </div>
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

          {/* Main Content */}
          <div className="p-5 space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-700 font-medium">Disburse Date</span>
                </div>
                <p className="font-semibold text-sm text-gray-800">{formatDate(paymentDetails?.transaction_date)}</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-3 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-xs text-amber-700 font-medium">Due Date</span>
                </div>
                <p className="font-semibold text-sm text-gray-800">{formatDate(paymentDetails?.due_date)}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-3 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700 font-medium">Last Payment</span>
                </div>
                <p className="font-semibold text-sm text-gray-800">{formatDate(paymentDetails?.last_collection_date)}</p>
              </div>
            </div>

            {/* Outstanding Amount */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-100/50 p-4 rounded-xl border-2 border-indigo-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm text-indigo-700 font-medium">Total Outstanding Amount</span>
                </div>
                <span className="text-xl font-bold text-indigo-900">{amounts.totalOutstanding}</span>
              </div>
            </div>

            {/* Amount Breakdown Toggle */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-sm text-gray-800">Amount Breakdown</span>
                </div>
                {showBreakdown ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
              
              {showBreakdown && paymentDetails && (
                <div className="px-3 pb-3 space-y-2">
                  {paymentDetails.principal_amount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Principal Amount</span>
                      <span className="font-semibold text-xs text-gray-800">{formatCurrency(paymentDetails.principal_amount)}</span>
                    </div>
                  )}
                  {(paymentDetails.normal_interest_before > 0 || paymentDetails.normal_interest_after > 0) && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Normal Interest</span>
                      <span className="font-semibold text-xs text-gray-800">
                        {formatCurrency((paymentDetails.normal_interest_before || 0) + (paymentDetails.normal_interest_after || 0))}
                      </span>
                    </div>
                  )}
                  {(paymentDetails.penal_interest_before > 0 || paymentDetails.penal_interest_after > 0) && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Penal Interest</span>
                      <span className="font-semibold text-xs text-gray-800">
                        {formatCurrency((paymentDetails.penal_interest_before || 0) + (paymentDetails.penal_interest_after || 0))}
                      </span>
                    </div>
                  )}
                  {(paymentDetails.penalty_before > 0 || paymentDetails.penalty_after > 0) && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Penalty</span>
                      <span className="font-semibold text-xs text-gray-800">
                        {formatCurrency((paymentDetails.penalty_before || 0) + (paymentDetails.penalty_after || 0))}
                      </span>
                    </div>
                  )}
                  {paymentDetails.bounce_amount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Bounce Charges</span>
                      <span className="font-semibold text-xs text-gray-800">{formatCurrency(paymentDetails.bounce_amount)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm text-gray-700">Total Outstanding</span>
                      <span className="font-bold text-sm text-blue-600">{amounts.totalOutstanding}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-gray-700">
                  Quick Select Amount
                </label>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Max: {amounts.totalOutstanding}
                </span>
              </div>
              <div className="flex gap-2">
                {[2000, 3000, 5000, totalOutstanding].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setCustomAmount(amount.toString())}
                    className="flex-1 px-3 py-2 text-xs font-medium border-2 border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer"
                    disabled={loading}
                  >
                    {amount === totalOutstanding ? 'Full Amount' : `₹${amount}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-800">Choose Payment Method</h3>
              
              <div className="grid gap-2">
                {paymentOptions.map((option) => (
                  <div key={option.id} className={`border-2 rounded-xl overflow-hidden transition-all ${
                    paymentMethod === option.id 
                      ? `border-${option.color}-500 bg-${option.color}-50` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <label className="flex items-start p-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={option.id} 
                        checked={paymentMethod === option.id} 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                        className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                        disabled={loading} 
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <option.icon className={`w-4 h-4 text-${option.color}-600`} />
                            <span className="font-semibold text-sm text-gray-800">{option.title}</span>
                          </div>
                          <span className={`text-xs bg-${option.color}-100 text-${option.color}-700 px-2 py-0.5 rounded font-medium`}>
                            {option.charges}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{option.subtitle}</p>
                        
                        {/* Method-specific details */}
                        {paymentMethod === option.id && (
                          <div className="mt-2 space-y-3 animate-slideDown">
                            {option.id === 'cashfree' && (
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <div className="space-y-3">
                                  <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Enter Payment Amount
                                    </label>
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Banknote className="h-5 w-5 text-blue-500" />
                                      </div>
                                      <input
                                        type="text"
                                        value={customAmount}
                                        onChange={handleCustomAmountChange}
                                        className="pl-10 pr-12 block w-full px-4 py-3 border-2 border-blue-200 rounded-xl text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 cursor-text"
                                        placeholder="Enter amount"
                                        disabled={loading}
                                      />
                                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-blue-600 font-bold text-lg">₹</span>
                                      </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                      <span>Min: ₹1</span>
                                      <span>Max: {amounts.totalOutstanding}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="pt-2 border-t border-gray-200">
                                    <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                      <AlertCircle className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
                                      2% transaction charges will be added to your payment
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {option.id === 'neft' && (
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <h4 className="text-xs font-semibold text-gray-700 mb-2">Bank Transfer Details:</h4>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Bank:</span>
                                    <span className="font-semibold">{bankDetails.neft.bank}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Account Name:</span>
                                    <span className="font-semibold">{bankDetails.neft.accountName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Account No:</span>
                                    <span className="font-semibold">{bankDetails.neft.accountNo}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">IFSC:</span>
                                    <span className="font-semibold">{bankDetails.neft.ifsc}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleCopyDetails('neft')}
                                  className={`mt-3 w-full py-2.5 text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                    copiedId === 'neft'
                                      ? 'bg-green-600 text-white hover:bg-green-700'
                                      : 'bg-green-600 text-white hover:bg-green-700'
                                  }`}
                                >
                                  {copiedId === 'neft' ? (
                                    <>
                                      <Check className="w-4 h-4" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4" />
                                      Copy Bank Details
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                            
                            {option.id === 'virtual' && (
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <h4 className="text-xs font-semibold text-gray-700 mb-2">Virtual Account Details:</h4>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Bank:</span>
                                    <span className="font-semibold">{bankDetails.virtual.bank}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Account Name:</span>
                                    <span className="font-semibold">{bankDetails.virtual.accountName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Account No:</span>
                                    <span className="font-semibold">{bankDetails.virtual.accountNo}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">IFSC:</span>
                                    <span className="font-semibold">{bankDetails.virtual.ifsc}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleCopyDetails('virtual')}
                                  className={`mt-3 w-full py-2.5 text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                    copiedId === 'virtual'
                                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                                      : 'bg-purple-600 text-white hover:bg-purple-700'
                                  }`}
                                >
                                  {copiedId === 'virtual' ? (
                                    <>
                                      <Check className="w-4 h-4" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4" />
                                      Copy Account Details
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                            
                            {option.id === 'qr' && (
  <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
    <h4 className="text-xs font-semibold text-gray-700 mb-3">Scan QR Code to Pay</h4>
    <div className="bg-gray-50 p-1 rounded-lg mb-3 border border-gray-200">
      <div className="w-40 h-40 mx-auto bg-white p-1 rounded-lg shadow-sm flex items-center justify-center">
        <img 
          src="/atd_payment-qr.jpeg" 
          alt="ATD Payment QR Code" 
          className="w-full h-full object-contain"
          width={160}
          height={160}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `
              <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded">
                <QrCode class="w-16 h-16 text-gray-400 mb-2" />
                <span class="text-xs text-gray-500">QR Code</span>
              </div>
            `;
          }}
        />
      </div>
    </div>
    <p className="text-xs text-gray-500 mb-2">Scan using any UPI app</p>
    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
      Amount to pay: {amounts.paymentAmount}
    </div>
  </div>
)}
                            
                            {option.id === 'upi' && (
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <h4 className="text-xs font-semibold text-gray-700 mb-2">UPI Payment Details:</h4>
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg mb-3 border border-indigo-100">
                                  <div className="flex items-center justify-between">
                                    <p className="font-mono text-sm font-bold text-indigo-700">{bankDetails.upi.id}</p>
                                    <button
                                      onClick={() => handleCopyDetails('upi')}
                                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                                        copiedId === 'upi' 
                                          ? 'text-green-600 hover:text-green-700' 
                                          : 'text-indigo-500 hover:text-indigo-600'
                                      }`}
                                    >
                                      {copiedId === 'upi' ? (
                                        <Check className="w-4 h-4" />
                                      ) : (
                                        <Copy className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleCopyDetails('upi')}
                                  className={`w-full py-2.5 text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                    copiedId === 'upi'
                                      ? 'bg-green-600 text-white hover:bg-green-700'
                                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                  }`}
                                >
                                  {copiedId === 'upi' ? (
                                    <>
                                      <Check className="w-4 h-4" />
                                      UPI ID Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4" />
                                      Copy UPI ID
                                    </>
                                  )}
                                </button>
                                <p className="text-xs text-gray-500 text-center mt-2">
                                  Send exact amount: {amounts.paymentAmount}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200">
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

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-4 rounded-b-2xl">
            <button 
              onClick={handlePayment} 
              disabled={loading || paymentAmount <= 0 || (paymentMethod === 'cashfree' && !customAmount)} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-6 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : paymentMethod === 'cashfree' ? (
                `Pay ${amounts.payableAmount}`
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Details
                </>
              )}
            </button>
            {paymentMethod !== 'cashfree' && (
              <p className="text-center text-xs text-gray-500 mt-2">
                Copy the details and complete payment through your bank/UPI app
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;