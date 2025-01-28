const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');


// Referral routes
router.post('/generateReferralCode', referralController.generateReferralCode);
router.post('/validateReferralCode', referralController.validateReferralCode);
router.post('/refereeAction', referralController.refereeAction);
router.post('/refereesStatus', referralController.getRefereesStatus);
router.get('/getReferrals', referralController.getReferrals);
router.get('/getReferralReport', referralController.getReferralReport);
module.exports = router;


