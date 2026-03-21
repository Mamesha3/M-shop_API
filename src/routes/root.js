const express = require('express');
const router = express.Router();

// Root route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to M-Shop API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/health',
      products: '/api/products',
      users: '/api/users',
      orders: '/api/orders',
      ratings: '/api/ratings',
      payments: '/api/payments',
      admin: '/api/admin'
    },
    documentation: 'https://github.com/Mamesha3/M-shop_API'
  });
});

module.exports = router;
