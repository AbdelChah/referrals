const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true, // Removes whitespace from both ends
      lowercase: true, // Converts to lowercase before saving
      minlength: 3, // Minimum 3 characters
      maxlength: 30, // Maximum 30 characters
      
    },
    email: { // New email field
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email must be valid.'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Ensures password is at least 8 characters
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
adminSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
