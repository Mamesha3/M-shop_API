const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      required: true
    }
  }],
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'US'
    }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'paypal', 'stripe']
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  itemsPrice: {
    type: Number,
    required: true,
    min: 0
  },
  taxPrice: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  shippingPrice: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: String
}, {
  timestamps: true
});

// Calculate total price before saving
orderSchema.pre('save', function(next) {
  try {
    // Only calculate if orderItems exist
    if (this.orderItems && this.orderItems.length > 0) {
      this.itemsPrice = this.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      this.totalPrice = this.itemsPrice + (this.taxPrice || 0) + (this.shippingPrice || 0);
    }
    // next();
  } catch (error) {
    console.error('Error in order pre-save hook:', error);
    next(error);
  }
});

// Virtual for formatted total price
orderSchema.virtual('formattedTotalPrice').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.totalPrice);
});

// Index for user orders
orderSchema.index({ user: 1, createdAt: -1 });

// Index for order status
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
