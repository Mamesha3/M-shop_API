const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'alipay', 'paypal', 'apple_pay', 'google_pay', 'bank_transfer']
  },
  paymentIntentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded'],
    default: 'pending'
  },
  clientSecret: {
    type: String,
    required: true
  },
  paymentMethodId: String,
  receiptEmail: String,
  metadata: {
    orderId: String,
    customerName: String,
    customerEmail: String
  },
  failureReason: String,
  refundedAmount: {
    type: Number,
    default: 0
  },
  refundReason: String
}, {
  timestamps: true
});

// Index for user payments
paymentSchema.index({ user: 1, createdAt: -1 });

// Index for payment status
paymentSchema.index({ status: 1 });

// Index for payment intent ID (unique)
paymentSchema.index({ paymentIntentId: 1 }, { unique: true });

paymentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount / 100); // Stripe uses cents
});

module.exports = mongoose.model('Payment', paymentSchema);
