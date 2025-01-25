/*******************************
 * models/Campaign.js
 ******************************/
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
  min_referees: {
    type: Number,
    required: true,
  },
  reward_criteria: {
    // The numerical reward amount for the campaign
    reward_amount: {
      type: Number,
      required: true,
    },
    // The currency used for the reward (to be validated dynamically)
    currency: {
      type: String,
      required: true,
    },
    // Boolean indicating if onBoarding (eKYC) is required
    onBoarding: {
      type: Boolean,
      default: false,
    },
    // Transaction flow eligibility
    transaction_flow: {
      debitOrCredit: String, // validated dynamically
      min_amount: Number,    // validated if provided
    },
    // Transaction-type eligibility
    transaction: {
      transaction_type: [String], // validated dynamically
      min_count: Number,
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
