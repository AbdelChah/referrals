// Helpers/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Loads environment variables from a .env file

// Create a transporter using your SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,         // e.g., "smtp.gmail.com"
  port: parseInt(process.env.SMTP_PORT), // e.g., 465 or 587
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,         // your email address
    pass: process.env.SMTP_PASS          // your email password or app-specific password
  }
});

/**
 * Send an email using Nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient's email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email content
 * @param {string} [options.html] - HTML email content (optional)
 */
async function sendEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: process.env.SMTP_FROM, // e.g., "Your App Name <no-reply@yourdomain.com>"
    to,
    subject,
    text,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
}

module.exports = { sendEmail };
