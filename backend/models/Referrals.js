/************************************************
 * models/referralModel.js
 ************************************************/
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
      status: { type: Boolean, default: false }, // True if meets all campaign criteria

      actions: [
        {
          type: {
            type: String,
            enum: ['onBoarding', 'transaction'],
            required: true,
          },
          details: { type: Object },
          date: { type: Date, default: Date.now },
        },
      ],
      rewards: {
        onBoarding: { type: Boolean, default: false },      // EKYC completed
        transaction_flow: { type: Boolean, default: false },// Debit/Credit + min_amount
        transaction_count: { type: Number, default: 0 },    // How many valid typed transactions
        transaction_type: { type: Boolean, default: false },// True if transaction_count >= min_count
      },
    },
  ],
  total_rewards: {
    type: Number,
    default: 0,
  },
  reward_claimed: { 
    type: Boolean, 
    default: false, // Tracks if the referrer has claimed the reward
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Referral', referralSchema);
