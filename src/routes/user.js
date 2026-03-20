const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsersProfile, forgotPassword, resetPassword } = require('../controllers/userLogic');

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile
router.get('/profile', getUsersProfile);

// Update user profile
// router.put('/profile', updateProfile);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password/:token', (req, res) => {
  resetPassword(req, res);
});

module.exports = router;