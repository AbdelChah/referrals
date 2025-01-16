// models/Rewards.js

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const rewardSchema = new Schema({
  reward_id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  referral_id: {
    type: String,
    required: true,
    ref: 'Referral',
  },
  reward_type: {
    type: String,
    enum: ['cashback', 'voucher', 'points'],
    required: true,
  },
  amount: {
    type: mongoose.Decimal128,
    required: true,
  },
  reward_status: {
    type: String,
    enum: ['pending', 'awarded', 'claimed'],
    default: 'pending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Rewards', rewardSchema);
