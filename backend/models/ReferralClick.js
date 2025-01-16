const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const referralClickSchema = new mongoose.Schema({
  click_id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  referral_id: {
    type: String,
    required: true,
    ref: 'Referral',
  },
  clicked_at: {
    type: Date,
    default: Date.now,
  },
  ip_address: {
    type: String,
  },
  user_agent: {
    type: String,
  },
});

module.exports = mongoose.model('ReferralClick', referralClickSchema);
