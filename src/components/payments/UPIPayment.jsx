import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const UPI_APPS = [
  { name: 'Paytm', url: 'https://paytm.com/' },
  { name: 'PhonePe', url: 'https://www.phonepe.com/' },
  { name: 'Google Pay', url: 'https://pay.google.com/' },
  { name: 'BHIM', url: 'https://www.bhimupi.org.in/' }
];

const UPI_REGEX = /^[\w.-]+@[\w.-]+$/;

export default function UPIPayment({ amount, orderId, onSuccess, onFailure }) {
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, success, failed

  // UPI deep link (for demo, static payee address)
  const payeeVPA = 'yourpayee@upi';
  const payeeName = 'ShopHub Store';
  const upiUrl = `upi://pay?pa=${payeeVPA}&pn=${encodeURIComponent(payeeName)}&am=${amount}&tn=Order%20${orderId}`;

  const handlePay = () => {
    if (!UPI_REGEX.test(upiId)) {
      setError('Please enter a valid UPI ID (e.g., username@bank)');
      return;
    }
    setError('');
    setShowQR(true);
    // In real app, trigger backend payment request here
  };

  // Simulate payment confirmation (for demo)
  const handleSimulateSuccess = () => {
    setPaymentStatus('success');
    if (onSuccess) onSuccess();
  };
  const handleSimulateFailure = () => {
    setPaymentStatus('failed');
    if (onFailure) onFailure();
  };

  return (
    <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">Pay via UPI</h3>
      {paymentStatus === 'pending' && (
        <>
          <label className="block text-sm font-medium text-secondary-300 mb-2">
            Enter your UPI ID
          </label>
          <input
            type="text"
            value={upiId}
            onChange={e => setUpiId(e.target.value)}
            placeholder="e.g. username@bank"
            className="input mb-2"
            disabled={showQR}
          />
          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
          <button
            onClick={handlePay}
            className="btn btn-primary btn-md mb-4"
            disabled={showQR}
          >
            Pay Now
          </button>
        </>
      )}

      {showQR && paymentStatus === 'pending' && (
        <div className="text-center">
          <p className="text-secondary-300 mb-2">Scan this QR code with your UPI app:</p>
          <div className="inline-block bg-white p-2 rounded-lg mb-4">
            <QRCode value={upiUrl} size={180} />
          </div>
          <p className="text-secondary-400 text-sm mb-2">Or use UPI ID: <span className="text-primary-400">{payeeVPA}</span></p>
          <div className="flex justify-center gap-2 mb-4">
            {UPI_APPS.map(app => (
              <a
                key={app.name}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                {app.name}
              </a>
            ))}
          </div>
          {/* Simulate payment for demo */}
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={handleSimulateSuccess} className="btn btn-success btn-sm">Simulate Success</button>
            <button onClick={handleSimulateFailure} className="btn btn-accent btn-sm">Simulate Failure</button>
          </div>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="text-center">
          <p className="text-green-400 font-semibold mb-2">Payment Successful!</p>
          <p className="text-secondary-300">Thank you for your purchase.</p>
        </div>
      )}
      {paymentStatus === 'failed' && (
        <div className="text-center">
          <p className="text-red-400 font-semibold mb-2">Payment Failed.</p>
          <p className="text-secondary-300">Please try again or use a different UPI app.</p>
        </div>
      )}
    </div>
  );
}
