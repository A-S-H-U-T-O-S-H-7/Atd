// components/PaymentModal.jsx
import { useState, useEffect, useRef } from 'react';
import { X, Info } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, outstandingAmount = 8123.00 }) => {
  const [paymentMethod, setPaymentMethod] = useState('cashfree');
  const [selectedBank, setSelectedBank] = useState('');
  const [gatewayCharges, setGatewayCharges] = useState(0);
  const [payableAmount, setPayableAmount] = useState(outstandingAmount);
  const modalRef = useRef(null);

  // Calculate gateway charges (2% for CashFree)
  useEffect(() => {
    if (paymentMethod === 'cashfree') {
      const charges = outstandingAmount * 0.02;
      setGatewayCharges(charges);
      setPayableAmount(parseFloat((outstandingAmount + charges).toFixed(2)));
    } else {
      setGatewayCharges(0);
      setPayableAmount(outstandingAmount);
    }
  }, [paymentMethod, outstandingAmount]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Kotak Mahindra Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'IndusInd Bank'
  ];

  const handlePayment = () => {
    if (paymentMethod === 'neft' && !selectedBank) {
      alert('Please select a bank for NEFT transfer');
      return;
    }
    
    console.log('Processing payment:', {
      paymentMethod,
      selectedBank,
      outstandingAmount,
      gatewayCharges,
      payableAmount
    });
    
    // Add your payment processing logic here
    alert(`Payment initiated via ${paymentMethod === 'cashfree' ? 'Debit Card/Net Banking' : 'NEFT'}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-800">Payment Detail</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Payment Methods */}
        <div className="p-4 space-y-4">
          {/* CashFree Option */}
          <div className="border border-gray-300 rounded-lg p-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cashfree"
                checked={paymentMethod === 'cashfree'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="mb-2">
                  <span className="font-semibold text-gray-800 text-sm">
                    Debit Card, Net Banking (CashFree):
                  </span>
                </div>
                <div className="flex items-start space-x-1 text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded">
                  <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>If you want to use CashFree mode of payment, You will be charged transaction charges 2% of the transaction amount extra.</span>
                </div>
              </div>
            </label>
          </div>

          {/* Amount Section */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total outstanding Amount:</span>
              <span className="font-semibold text-gray-800">₹{outstandingAmount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-200 pt-2">
              <span className="text-gray-800 font-medium">
                Payable Amount{paymentMethod === 'cashfree' && '(Including Payment Gateway Charges)'}:
              </span>
              <span className="font-bold text-gray-800">₹{payableAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* NEFT Option */}
          <div className="border border-gray-300 rounded-lg p-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="neft"
                checked={paymentMethod === 'neft'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="mb-2">
                  <span className="font-semibold text-gray-800 text-sm">NEFT:</span>
                </div>
                <p className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded mb-3">
                  If you want to use NEFT method of payment, No transaction charges shall be charged extra.
                </p>
                
                {/* Bank Details - Always show for NEFT option */}
                <div className="bg-gray-50 border border-gray-200 rounded p-2 mb-3">
                  <div className="text-xs space-y-1 text-gray-600">
                    <p><span className="font-medium">NAME:-</span> ATD FINANCIAL SERVICES PVT LTD</p>
                    <p><span className="font-medium">Account No.:-</span> 025305005395</p>
                    <p><span className="font-medium">IFSC Code:-</span> ICIC0000253</p>
                    <p><span className="font-medium">BANK NAME:-</span> ICICI BANK</p>
                    <p><span className="font-medium">BRANCH:-</span> SECTOR-61 NOIDA</p>
                  </div>
                </div>
                
                {/* Bank Selection - Only show when NEFT is selected */}
                {paymentMethod === 'neft' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Select Bank:
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">--Select Bank--</option>
                      {banks.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={handlePayment}
            disabled={paymentMethod === 'neft' && !selectedBank}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;