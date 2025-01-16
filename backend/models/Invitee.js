// models/Invitee.js

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const inviteeSchema = new Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  referral_id: {
    type: String,
    required: true,
    ref: 'Referral',
  },
  invitee_id: {
    type: String,
    required: true,
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  eligibility_met: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Invitee', inviteeSchema);
