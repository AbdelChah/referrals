// services/emailService.js

const nodemailer = require('nodemailer');

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., Gmail, SendGrid, Mailgun
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

/**
 * Sends an email.
 * @param {String} to - Recipient's email address.
 * @param {String} subject - Email subject.
 * @param {String} text - Plain text email body.
 * @returns {Promise} - Resolves when email is sent.
 */
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmail,
};
