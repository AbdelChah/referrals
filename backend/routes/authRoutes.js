const express = require('express');
const {
  login,
  logout,
  refreshToken,
  register,
  authenticateToken,
  verifyOtp,
  resetPassword
} = require('../controllers/authController');

const router = express.Router();

// Public routes (no token required)
router.post('/register', register); // Register admin
router.post('/login', login); // Admin login -- OTP sent to email
router.post('/refresh', refreshToken); // Refresh access token
router.post('/verifyOTP', verifyOtp); // Verify OTP
router.post('/resetPassword',authenticateToken, resetPassword); // Reset password -- OTP sent to email

// Protected routes (require valid access token)
router.post('/logout', authenticateToken, logout); // Admin logout

module.exports = router;
