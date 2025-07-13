import { generatePayUHash } from '../utils/payu.js';

export const initiatePayUPayment = async (req, res) => {
  try {
    const { txnid, amount, productinfo, firstname, email, phone } = req.body;
    const { PAYU_MERCHANT_KEY, PAYU_MERCHANT_SALT, PAYU_BASE_URL } = process.env;

    if (!txnid || !amount || !productinfo || !firstname || !email || !phone) {
      return res.status(400).json({ success: false, message: "Missing required payment fields" });
    }

    // CRITICAL: Format URLs to accept query parameters
    const payuParams = {
      key: PAYU_MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl: `${process.env.BACKEND_URL}/api/payments/payu/success/${txnid}`,
      furl: `${process.env.BACKEND_URL}/api/payments/payu/failure/${txnid}`,
      service_provider: 'payu_paisa',
      udf1: '',
      udf2: '',
      udf3: '',
      udf4: '',
      udf5: '',
    };

    const hash = generatePayUHash(payuParams, PAYU_MERCHANT_SALT);
    console.log('Request Hash String:', [
      payuParams.key,
      payuParams.txnid,
      payuParams.amount,
      payuParams.productinfo,
      payuParams.firstname,
      payuParams.email,
      payuParams.udf1 || '',
      payuParams.udf2 || '',
      payuParams.udf3 || '',
      payuParams.udf4 || '',
      payuParams.udf5 || '',
      '', '', '', '', '',
      PAYU_MERCHANT_SALT
    ].join('|'));

    res.json({
      success: true,
      payuParams: { ...payuParams, hash, action: `${PAYU_BASE_URL}/_payment` }
    });
  } catch (error) {
    console.error("PayU Initiate Error:", error);
    res.status(500).json({ success: false, message: error.message || "Payment initiation failed" });
  }
};

export const payuSuccess = async (req, res) => {
  try {
    console.log('=== PayU SUCCESS CALLBACK ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    console.log('Params:', req.params);
    
    // Extract transaction ID from URL path or query
    let txnid = req.query.txnid || req.params.txnid;
    
    // If still no txnid, try to extract from URL
    if (!txnid) {
      const urlParts = req.url.split('?')[0].split('/');
      txnid = urlParts[urlParts.length - 1];
    }

    console.log('Extracted txnid:', txnid);

    if (!txnid) {
      console.log('❌ No transaction ID found in success callback');
      return res.redirect(`${process.env.FRONTEND_URL}/checkout?status=failure&error=no_txnid`);
    }

    // Update order in database
    const Order = (await import('../models/Order.js')).default;
    const order = await Order.findById(txnid);
    
    if (!order) {
      console.log(`❌ Order not found: ${txnid}`);
      return res.redirect(`${process.env.FRONTEND_URL}/checkout?status=failure&error=order_not_found`);
    }

    // Update order status to success
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.transactionId = req.query.mihpayid || txnid;
    await order.save();

    console.log(`✅ Order ${order._id} updated successfully - Status: ${order.paymentStatus}`);

    // Redirect to success page
    res.redirect(`${process.env.FRONTEND_URL}/orders?success=true&orderId=${txnid}`);
  } catch (error) {
    console.error('❌ PayU Success Handler Error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/checkout?status=failure&error=server_error`);
  }
};

export const payuFailure = async (req, res) => {
  try {
    console.log('=== PayU FAILURE CALLBACK ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    console.log('Params:', req.params);
    
    // Extract transaction ID from URL path or query
    let txnid = req.query.txnid || req.params.txnid;
    
    // If still no txnid, try to extract from URL
    if (!txnid) {
      const urlParts = req.url.split('?')[0].split('/');
      txnid = urlParts[urlParts.length - 1];
    }

    console.log('Extracted txnid:', txnid);

    if (!txnid) {
      console.log('❌ No transaction ID in failure callback');
      return res.redirect(`${process.env.FRONTEND_URL}/checkout?status=failure&error=no_txnid`);
    }

    // Update order status to failed
    const Order = (await import('../models/Order.js')).default;
    const order = await Order.findById(txnid);
    
    if (order) {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      await order.save();
      console.log(`❌ Order ${order._id} marked as failed`);
    }

    // Redirect to checkout with failure status
    res.redirect(`${process.env.FRONTEND_URL}/checkout?status=failure&error=payment_failed`);
  } catch (error) {
    console.error('❌ PayU Failure Handler Error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/checkout?status=failure&error=server_error`);
  }
};
