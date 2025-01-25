const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { authenticateToken } = require('../controllers/authController');

// Campaign routes
router.post('/', authenticateToken, campaignController.createCampaign); // Create a campaign
router.get('/', authenticateToken, campaignController.getAllCampaigns); // Get all campaigns
router.get('/meta', authenticateToken, campaignController.getMetaData); // Get metadata for reports
router.get('/:campaignId', authenticateToken, campaignController.getCampaignById); // Get a specific campaign by ID
router.get('/:campaignId/export', authenticateToken, campaignController.exportCampaignCsv); // Export campaign report as CSV
router.put('/:campaignId', authenticateToken, campaignController.updateCampaign); // Update a campaign
router.delete('/:campaignId', authenticateToken, campaignController.deleteCampaign); // Delete a campaign

module.exports = router;
