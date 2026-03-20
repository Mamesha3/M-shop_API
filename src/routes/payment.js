const express = require('express');
const router = express.Router();
const { 
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus
} = require('../controllers/paymentController');

// Public routes
router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/status/:paymentId', getPaymentStatus);

module.exports = router;
