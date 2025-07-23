require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');

const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  const intent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to paise
    currency: 'inr',
    metadata: { userId: req.user._id.toString() },
  });

  await Transaction.create({
    user: req.user._id,
    amount,
    currency: 'INR',
    status: 'created',
    paymentIntentId: intent.id,
  });

  res.json({ clientSecret: intent.client_secret });
};

const getTransactions = async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { user: req.user._id };
  const transactions = await Transaction.find(query).populate('user', 'email');
  res.json(transactions);
};

module.exports = { createPaymentIntent, getTransactions };
