const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
  deleteUser,
  getRecentActivity
} = require('../controllers/adminController');
const { protect, adminAuth } = require('../middleware/auth');

// Apply authentication and admin authorization to all routes
router.use(protect);
router.use(adminAuth);

// Dashboard stats
router.get('/dashboard/stats', getDashboardStats);

// Users management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Orders management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Products management
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Activity
router.get('/activity', getRecentActivity);

module.exports = router;
