const express = require('express');
const router = express.Router();

// Root route - simple health check
router.get('/', (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Root endpoint accessed from: ${req.ip}`);
  
  res.status(200).json({
    message: 'Welcome to M-Shop API',
    status: 'Running',
    version: '1.0.0',
    timestamp: timestamp,
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      products: '/api/products',
      users: '/api/users',
      orders: '/api/orders',
      ratings: '/api/ratings',
      payments: '/api/payments',
      admin: '/api/admin'
    },
    cors: {
      origin: process.env.CLIENT_URL || 'Not configured',
      credentials: 'enabled'
    }
  });
});

module.exports = router;
