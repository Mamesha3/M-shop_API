const Payment = require('../models/paymentSchema');

// Initialize Stripe with proper error handling
let stripe;
try {
  stripe = require('stripe')(process.env.Stripe_Secret_key);
  console.log('Stripe initialized successfully');
} catch (error) {
  console.error('Error initializing Stripe:', error.message);
  stripe = null;
}

// Create payment intent for cart checkout
exports.createPaymentIntent = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: 'Stripe is not properly configured'
      });
    }

    const { cartItems, totalAmount, currency = 'USD', receiptEmail } = req.body;
    
    // Validate required fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Cart items are required' 
      });
    }
    
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid total amount is required' 
      });
    }
    
    // Convert amount to cents
    const amountInCents = Math.round(totalAmount * 100);
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      receipt_email: receiptEmail,
      metadata: {
        cartItems: JSON.stringify(cartItems),
        itemCount: cartItems.length.toString()
      }
    });
    
    // Save payment to database
    const payment = await Payment.create({
      user: req.user ? req.user.id : null,
      order: null, // Will be set when order is created
      amount: amountInCents,
      currency: currency.toUpperCase(),
      paymentMethod: 'card',
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: 'pending'
    });
    
    res.status(201).json({
      success: true,
      message: 'Payment intent created successfully',
      data: {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: totalAmount,
        currency: currency.toUpperCase(),
        paymentId: payment._id,
        publishableKey: 'pk_test_51T9h8WCONKNEhHfVz0Mvx4TA8wlKzE0qcYxSGBXX9aFlQ8JEdT51a9WrdwW5F96BBHaurKmsKbGc4aEdVMRLcTVy00xqvDtzPj'
      }
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create payment intent',
      error: error.message 
    });
  }
};

// Confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: 'Stripe is not properly configured'
      });
    }

    const { paymentIntentId } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({ 
        success: false,
        message: 'Payment intent ID is required' 
      });
    }
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        success: false,
        message: 'Payment not successful',
        status: paymentIntent.status 
      });
    }
    
    // Update payment in database
    const payment = await Payment.findOneAndUpdate(
      { paymentIntentId },
      { status: 'succeeded' },
      { new: true }
    );
    
    if (!payment) {
      return res.status(404).json({ 
        success: false,
        message: 'Payment not found' 
      });
    }
    
    // Parse cart items from metadata
    let cartItems = [];
    try {
      cartItems = JSON.parse(paymentIntent.metadata.cartItems || '[]');
    } catch (error) {
      console.error('Error parsing cart items:', error);
    }
    
    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        paymentId: payment._id,
        status: 'succeeded',
        amount: payment.amount / 100,
        currency: payment.currency,
        cartItems: cartItems
      }
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to confirm payment',
      error: error.message 
    });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({ 
        success: false,
        message: 'Payment not found' 
      });
    }
    
    res.json({
      success: true,
      data: {
        paymentId: payment._id,
        status: payment.status,
        amount: payment.amount / 100,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        createdAt: payment.createdAt
      }
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get payment status',
      error: error.message 
    });
  }
};
