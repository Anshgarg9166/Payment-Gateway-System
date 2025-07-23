require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

const createPaymentIntent = async (req, res) => {
  // amount is sent in paise from frontend
  const { amount } = req.body;

  const intent = await stripe.paymentIntents.create({
    amount: amount, // paise for Stripe
    currency: 'inr',
    metadata: { userId: req.user._id.toString() }, // always set userId
  });

  // Store amount in rupees for DB (for display)
  await Transaction.create({
    user: req.user._id,
    amount: amount / 100, // store in rupees
    currency: 'INR',
    status: 'created',
    paymentIntentId: intent.id,
  });

  res.json({ clientSecret: intent.client_secret });
};

const getTransactions = async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { user: req.user._id };
  // Populate both name and email
  const transactions = await Transaction.find(query).populate('user', 'name email');
  res.json(transactions);
};

// Stripe webhook to update transaction status
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripeWebhook = async (req, res) => {
  try {
    let event = req.body;
    console.log('Received webhook event:', event.type, event.id);

    if (endpointSecret) {
      // Only verify if secret is set
      const sig = req.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      let result = await Transaction.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { status: 'succeeded' },
        { new: true }
      );
      if (!result) {
        result = await Transaction.create({
          user: paymentIntent.metadata.userId ? mongoose.Types.ObjectId(paymentIntent.metadata.userId) : undefined,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency ? paymentIntent.currency.toUpperCase() : 'INR',
          status: 'succeeded',
          paymentIntentId: paymentIntent.id,
        });
        console.log('Webhook: payment_intent.succeeded - created new transaction', paymentIntent.id, 'Result:', result);
      } else {
        console.log('Webhook: payment_intent.succeeded - updated transaction', paymentIntent.id, 'Result:', result);
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      let result = await Transaction.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { status: 'failed' },
        { new: true }
      );
      if (!result) {
        result = await Transaction.create({
          user: paymentIntent.metadata.userId ? mongoose.Types.ObjectId(paymentIntent.metadata.userId) : undefined,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency ? paymentIntent.currency.toUpperCase() : 'INR',
          status: 'failed',
          paymentIntentId: paymentIntent.id,
        });
        console.log('Webhook: payment_intent.payment_failed - created new transaction', paymentIntent.id, 'Result:', result);
      } else {
        console.log('Webhook: payment_intent.payment_failed - updated transaction', paymentIntent.id, 'Result:', result);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { createPaymentIntent, getTransactions, stripeWebhook };
