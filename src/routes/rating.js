const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addRating,
  getProductRatings,
  getUserRating,
  deleteRating
} = require('../controllers/ratingController');

// Add/update rating (protected)
router.post('/', protect, addRating);

// Get product ratings (public)
router.get('/product/:productId', getProductRatings);

// Get user's rating for a product (protected)
router.get('/user/:productId', protect, getUserRating);

// Delete rating (protected)
router.delete('/:ratingId', protect, deleteRating);

module.exports = router;
