import { generatePayUHash } from '../utils/payu.js';

export const initiatePayUPayment = async (req, res) => {
  try {
    const { txnid, amount, productinfo, firstname, email, phone } = req.body;
    const { PAYU_MERCHANT_KEY, PAYU_MERCHANT_SALT, PAYU_SUCCESS_URL, PAYU_FAILURE_URL, PAYU_BASE_URL } = process.env;

    // Validate required fields
    if (!txnid || !amount || !productinfo || !firstname || !email || !phone) {
      return res.status(400).json({ success: false, message: "Missing required payment fields" });
    }

    // Prepare PayU payment params
    const payuParams = {
      key: PAYU_MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl: PAYU_SUCCESS_URL,
      furl: PAYU_FAILURE_URL,
      service_provider: 'payu_paisa',
      udf1: '',
      udf2: '',
      udf3: '',
      udf4: '',
      udf5: '',
    };

    // Generate hash
    const hash = generatePayUHash(payuParams, PAYU_MERCHANT_SALT);

    // Send params to frontend to auto-submit to PayU
    res.json({
      success: true,
      payuParams: { ...payuParams, hash, action: `${PAYU_BASE_URL}/_payment` }
    });
  } catch (error) {
    console.error("PayU Initiate Error:", error);
    res.status(500).json({ success: false, message: error.message || "Payment initiation failed" });
  }
};

// PayU success/failure callback handlers (optional, for order status update)
export const payuSuccess = (req, res) => {
  // Handle success, update order status in DB if needed
  res.send('Payment successful');
};

export const payuFailure = (req, res) => {
  // Handle failure, update order status in DB if needed
  res.send('Payment failed');
};
