// models/PerformanceMetric.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const performanceMetricSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  total_referrals: {
    type: Number,
    required: true,
  },
  successful_referrals: {
    type: Number,
    required: true,
  },
  conversion_rate: {
    type: mongoose.Decimal128,
    required: true,
  },
  rewards_issued: {
    type: Number,
    required: true,
  },
  total_rewards_amount: {
    type: mongoose.Decimal128,
    required: true,
  },
});

module.exports = mongoose.model('PerformanceMetric', performanceMetricSchema);
