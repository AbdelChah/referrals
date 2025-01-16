const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');
const { authenticateToken } = require('../controllers/authController');

// Performance metrics routes
router.get('/metrics', authenticateToken, performanceController.getPerformanceMetrics); // Fetch overall metrics
router.get('/referral-summary', authenticateToken, performanceController.getReferralSummary); // Fetch referral summary
router.post('/reports/generate', authenticateToken, performanceController.generateReport); // Generate a report
router.get('/reports/:reportId', authenticateToken, performanceController.getGeneratedReport); // Fetch a specific report

module.exports = router;
