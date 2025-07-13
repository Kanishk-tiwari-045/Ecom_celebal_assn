import express from 'express';
import { initiatePayUPayment, payuSuccess, payuFailure } from '../controllers/paymentController.js';

const router = express.Router();

// Initiate PayU payment
router.post('/payu/initiate', initiatePayUPayment);

// PayU Success Callback - Handle both formats
router.get('/payu/success', payuSuccess);
router.post('/payu/success', payuSuccess);
router.get('/payu/success/:txnid', payuSuccess);

// PayU Failure Callback - Handle both formats
router.get('/payu/failure', payuFailure);
router.post('/payu/failure', payuFailure);
router.get('/payu/failure/:txnid', payuFailure);

export default router;
