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
    reward_amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    onBoarding: {
      type: Boolean,
      default: false,
    },
    transaction_flow: {
      debitOrCredit: String,
      min_amount: Number,
    },
    transaction: {
      transaction_type: [String],
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

// Add a virtual to dynamically compute `status`
campaignSchema.virtual('dynamicStatus').get(function () {
  const currentDate = new Date();
  if (currentDate >= this.start_date && currentDate <= this.end_date) {
    return 'active';
  } else if (currentDate > this.end_date) {
    return 'completed';
  }
  return 'inactive';
});

// Ensure `dynamicStatus` is included when converting to JSON
campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Campaign', campaignSchema);
