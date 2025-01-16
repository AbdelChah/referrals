const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');


// Referral routes
router.post('/generateReferralCode', referralController.generateReferralCode);
router.post('/validateReferralCode', referralController.validateReferralCode);
router.post('/refereeAction', referralController.refereeAction);
router.post('/refereesStatus', referralController.getRefereesStatus);
module.exports = router;
