// models/Campaign.js

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const campaignSchema = new Schema({
  campaign_id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  reward_criteria: {
    onBoarding: { reward: Number },
    transaction: {
      minAmount: Number,
      reward: Number,
      currency: String,
      transaction_type: String,
      debitOrCredit: String, // Field to specify debit or credit
    },
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Campaign', campaignSchema);
