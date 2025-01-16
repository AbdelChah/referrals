const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { Schema } = mongoose;
const referralSchema = new Schema({
  referral_id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  referral_code: {
    type: String,
    required: true,
    unique: true,
  },
  referrer_phone: {
    type: String,
    required: true,
  },
  campaign_id: {
    type: String,
    required: true,
    ref: 'Campaign',
  },
  referees: [
    {
      referee_phone: { type: String, required: true },
      actions: [
        {
          type: { type: String, enum: ['onBoarding', 'transaction'], required: true },
          details: { type: Object }, // For transaction-specific details
          date: { type: Date, default: Date.now },
          status: { type: String, enum: ['pending', 'rewarded', 'rejected'], default: 'pending' }, // Status of the action
        },
      ],
      rewards: {
        onBoarding: { type: Boolean, default: false }, // Tracks if onboarding reward is claimed
        transaction: { type: Boolean, default: false }, // Tracks if transaction reward is claimed
      },
    },
  ],
  total_rewards: {
    type: Number,
    default: 0, // Tracks cumulative rewards dispatched for this referral
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Referral', referralSchema);
