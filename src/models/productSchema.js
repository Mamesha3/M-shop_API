const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food', 'Beverages', 'Desserts', 'Snacks', 'Electronics', 'Clothing', 'Other']
  },
  image: {
    type: String,
    required: false,
    default: function() {
      const seed = Math.random().toString(36).substr(2, 9);
      return `https://picsum.photos/seed/${seed}/400/300.jpg`;
    }
  },
  imagePublicId: {
    type: String,
    required: false,
    default: function() {
      return `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
