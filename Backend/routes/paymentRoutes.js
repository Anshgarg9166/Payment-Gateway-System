const express = require('express');
const { createPaymentIntent, getTransactions } = require('../controllers/paymentController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/create-payment-intent', protect, createPaymentIntent);
router.get('/transactions', protect, getTransactions);

module.exports = router;
