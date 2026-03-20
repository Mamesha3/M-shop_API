const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProduct, 
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts
} = require('../controllers/productLogic');

// Public routes
router.get('/', getProducts);

// Search products
router.get('/search', searchProducts);

// Get featured products
router.get('/featured', getFeaturedProducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Get single product
router.get('/:id', getProduct);

module.exports = router;
