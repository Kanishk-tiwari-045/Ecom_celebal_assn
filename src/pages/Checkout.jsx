import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  ArrowLeft, 
  Check, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  Shield,
  Truck,
  Package,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn, formatPrice, isValidEmail, isValidPhone } from '../utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, tax, shipping, total, discount, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [payuParams, setPayuParams] = useState(null);

  // Form data
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  // For PayU, only basic info is needed
  const payuFormRef = useRef(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  // Auto-submit the PayU form when params are set
  useEffect(() => {
    if (payuParams && payuFormRef.current) {
      payuFormRef.current.submit();
    }
  }, [payuParams]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Validate shipping information
      if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
      else if (!isValidEmail(shippingInfo.email)) newErrors.email = 'Invalid email format';
      if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!isValidPhone(shippingInfo.phone)) newErrors.phone = 'Invalid phone number';
      if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
      if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
      if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
      if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  // PayU Payment Handler
  const handlePayUPayment = async () => {
    setIsProcessing(true);
    setErrors({});
    try {
      // Prepare order info for backend
      const orderId = 'ORD-' + Date.now();
      const productInfo = items.map(item => item.name).join(', ');
      const payload = {
        txnid: orderId,
        amount: total.toFixed(2),
        productinfo: productInfo,
        firstname: shippingInfo.firstName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
      };

      const response = await fetch('/api/payments/payu/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success && data.payuParams) {
        setPayuParams(data.payuParams);
        // Cart will be cleared after payment success via redirect
      } else {
        setErrors({ payment: 'Failed to initiate payment. Please try again.' });
      }
    } catch (error) {
      setErrors({ payment: 'Payment initiation failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: 'Shipping', description: 'Delivery information' },
    { number: 2, title: 'Payment', description: 'PayU / Google Pay / UPI' },
    { number: 3, title: 'Review', description: 'Order confirmation' }
  ];

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Checkout
            </h1>
            <p className="text-secondary-400">
              Complete your order in {steps.length} easy steps
            </p>
          </div>
          <Link 
            to="/cart"
            className="btn btn-ghost btn-md group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Cart</span>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                    currentStep > step.number
                      ? 'bg-green-500 text-white'
                      : currentStep === step.number
                      ? 'bg-primary-500 text-white'
                      : 'bg-secondary-700 text-secondary-400'
                  )}>
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      'text-sm font-medium',
                      currentStep >= step.number ? 'text-white' : 'text-secondary-400'
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-secondary-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-16 h-0.5 mx-4 transition-colors duration-300',
                    currentStep > step.number ? 'bg-green-500' : 'bg-secondary-700'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm animate-slide-up">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-primary-400" />
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                      className={cn(
                        'input',
                        errors.firstName && 'input-error'
                      )}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                      className={cn(
                        'input',
                        errors.lastName && 'input-error'
                      )}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      className={cn(
                        'input',
                        errors.email && 'input-error'
                      )}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className={cn(
                        'input',
                        errors.phone && 'input-error'
                      )}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className={cn(
                        'input',
                        errors.address && 'input-error'
                      )}
                      placeholder="Enter street address"
                    />
                    {errors.address && (
                      <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className={cn(
                        'input',
                        errors.city && 'input-error'
                      )}
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      className={cn(
                        'input',
                        errors.state && 'input-error'
                      )}
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="text-red-400 text-sm mt-1">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                      className={cn(
                        'input',
                        errors.zipCode && 'input-error'
                      )}
                      placeholder="Enter ZIP code"
                    />
                    {errors.zipCode && (
                      <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Country
                    </label>
                    <select
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                      className="input"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNextStep}
                    className="btn btn-primary btn-lg"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment (PayU/UPI/Google Pay) */}
            {currentStep === 2 && (
              <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm animate-slide-up">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-primary-400" />
                  Payment - UPI / Google Pay / PayU
                </h2>
                <div className="space-y-6">
                  <div className="bg-secondary-700/30 rounded-lg p-6 text-center">
                    <p className="text-lg text-white mb-4">
                      You will be redirected to PayU to complete your payment using UPI, Google Pay, or any supported method.
                    </p>
                    <button
                      onClick={handlePayUPayment}
                      disabled={isProcessing}
                      className="btn btn-primary btn-lg"
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" color="white" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          <span>Proceed to PayU</span>
                        </>
                      )}
                    </button>
                    {errors.payment && (
                      <p className="text-red-400 text-sm mt-4">{errors.payment}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handlePreviousStep}
                    className="btn btn-secondary btn-lg"
                  >
                    Back to Shipping
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="btn btn-primary btn-lg"
                    disabled
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Order Review */}
            {currentStep === 3 && (
              <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm animate-slide-up">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-primary-400" />
                  Order Review
                </h2>
                {/* ... same as your previous code ... */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.cartId} className="flex items-center space-x-4 p-4 bg-secondary-700/30 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{item.name}</h4>
                        <p className="text-secondary-400 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-primary-400 font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                {/* ... shipping/payment summary ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-white font-medium mb-3">Shipping Address</h3>
                    <div className="text-secondary-300 text-sm space-y-1">
                      <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                      <p>{shippingInfo.country}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-3">Payment Method</h3>
                    <div className="text-secondary-300 text-sm space-y-1">
                      <p>PayU / UPI / Google Pay</p>
                    </div>
                  </div>
                </div>
                {errors.payment && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                    <p className="text-red-400">{errors.payment}</p>
                  </div>
                )}
                <div className="flex justify-between">
                  <button
                    onClick={handlePreviousStep}
                    className="btn btn-secondary btn-lg"
                  >
                    Back to Payment
                  </button>
                  <button
                    className="btn btn-primary btn-lg min-w-[200px]"
                    disabled
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    <span>Place Order (Pay at PayU)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Hidden PayU Form (auto-submitted) */}
            {payuParams && (
              <form
                ref={payuFormRef}
                action={payuParams.action}
                method="POST"
                style={{ display: 'none' }}
              >
                {Object.entries(payuParams).map(([key, value]) =>
                  key !== 'action' ? (
                    <input key={key} type="hidden" name={key} value={value} />
                  ) : null
                )}
              </form>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-secondary-300">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-secondary-300">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-secondary-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-secondary-700 pt-3">
                  <div className="flex justify-between text-white text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Security Features */}
            <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Secure Checkout</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-secondary-300 text-sm">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-3 text-secondary-300 text-sm">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center space-x-3 text-secondary-300 text-sm">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
