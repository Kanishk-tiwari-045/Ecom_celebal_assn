import express from 'express';
import { initiatePayUPayment, payuSuccess, payuFailure } from '../controllers/paymentController.js';

const router = express.Router();

// Correct: Use the real controller for payment initiation
router.post('/payu/initiate', initiatePayUPayment);

router.post('/payu/success', payuSuccess);
router.post('/payu/failure', payuFailure);

export default router;
