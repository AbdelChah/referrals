// controllers/authController.js

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Admin = require('../models/Admin');
const Token = require('../models/Token'); // Model to store refresh tokens securely
const Otp = require('../models/OTP');     // Model to store OTPs

/**
 * Helper Functions for Standardized Responses
 */

/**
 * Success Response Formatter
 * @param {String} message - Success message
 * @param {Object} data - Optional data to include in the response
 * @returns {Object} - Formatted success response
 */
const formatSuccessResponse = (message, data = {}) => ({
    res: true,
    response: {
        msg: message,
        data,
    },
});

/**
 * Error Response Formatter
 * @param {String} msg - Error message
 * @param {String} errCode - Application-specific error code
 * @param {String} msgAPI - API-specific error message
 * @returns {Object} - Formatted error response
 */
const formatErrorResponse = (msg, errCode, msgAPI) => ({
    res: false,
    responseError: {
        msg,
        errCode,
        msgAPI,
    },
});

/**
 * Generate OTP
 * @returns {String} - A 6-digit OTP
 */
const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
};

/**
 * Send OTP via Email
 * @param {String} email - Recipient's email address
 * @param {String} otp - OTP to send
 * @returns {Promise}
 */



const sendOtpEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "live.smtp.mailtrap.io",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: "api",
                pass: "2851ae4b683878ceb63816a561ee6a00",
            },
        });

        // Verify transporter configuration
        await transporter.verify();
        console.log('SMTP configuration is correct.');

        // Email options
        const mailOptions = {
            from: 'info@demomailtrap.com',
            to: email,
            subject: 'Your One-Time Password (OTP)',
            text: `Your OTP is: ${otp}. It is valid for ${process.env.OTP_EXPIRATION_MINUTES || 10} minutes.`,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        // Throw a new error with the original error's message for further handling
        throw new Error(error.response || 'Failed to send OTP email.');
    }
};

/**
 * Login Function
 * Authenticates the user's credentials and sends an OTP for further verification.
 */
exports.login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Input Validation
        if ((!username && !email) || !password) {
            return res.status(400).json(
                formatErrorResponse(
                    'Username or email and password are required.',
                    '19010',
                    'Missing required fields.'
                )
            );
        }

        // 2. Construct Query Based on Provided Credentials
        let query = {};
        if (username) {
            query.username = username.toLowerCase();
        } else if (email) {
            query.email = email.toLowerCase();
        }

        // 3. Find Admin by Username or Email (Case-Insensitive)
        const admin = await Admin.findOne(query);
        if (!admin) {
            return res.status(401).json(
                formatErrorResponse(
                    'Invalid credentials.',
                    '19011',
                    'Authentication failed.'
                )
            );
        }

        // 4. Compare Passwords
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json(
                formatErrorResponse(
                    'Invalid credentials.',
                    '19011',
                    'Authentication failed.'
                )
            );
        }

        // 5. Check for Existing Active Refresh Token
        const existingToken = await Token.findOne({ adminId: admin._id });
        if (existingToken) {
            return res.status(403).json(
                formatErrorResponse(
                    'An active session already exists. Please log out from other devices or refresh your token.',
                    '19012',
                    'Active session detected.'
                )
            );
        }

        // 6. Generate OTP
        const otp = generateOtp();
        const otpExpirationMinutes = parseInt(process.env.OTP_EXPIRATION_MINUTES) || 10;
        const expiresAt = new Date(Date.now() + otpExpirationMinutes * 60 * 1000);

        // 7. Store OTP in the Database
        await Otp.create({
            adminId: admin._id,
            otp,
            expiresAt,
        });

        // 8. Respond with OTP (for testing or development purposes)
        return res.status(200).json(
            formatSuccessResponse('OTP has been generated successfully.', {
                otp,
                otpExpirationMinutes,
            })
        );

    } catch (error) {
        console.error('Login error:', error);

        // General Internal Server Error
        return res.status(500).json(
            formatErrorResponse(
                'Internal server error.',
                '19014',
                isDevelopment ? error.message : 'Login failed due to a server error.'
            )
        );
    }
};
// Generate tokens
const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' });
};





// REGISTER
exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body; // Extract email

        // 1. Input Validation
        if (!username || !password || !email) { // Check for email
            return res.status(400).json(
                formatErrorResponse(
                    'Username, email, and password are required.',
                    '19001',
                    'Missing required fields.'
                )
            );
        }

        // 2. Validate Email Format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json(
                formatErrorResponse(
                    'Invalid email format.',
                    '19005',
                    'Email validation failed.'
                )
            );
        }

        // 3. Enforce Password Strength (Optional but Recommended)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json(
                formatErrorResponse(
                    'Password must be at least 8 characters long and include both letters and numbers.',
                    '19002',
                    'Weak password.'
                )
            );
        }

        // 4. Check if Username or Email Already Exists (Case-Insensitive)
        const existingAdmin = await Admin.findOne({
            $or: [
                { username: username.toLowerCase() },
                { email: email.toLowerCase() }
            ]
        });
        if (existingAdmin) {
            let conflictField = existingAdmin.username === username.toLowerCase() ? 'Username' : 'Email';
            return res.status(409).json(
                formatErrorResponse(
                    `${conflictField} already exists.`,
                    '19003',
                    `Duplicate ${conflictField.toLowerCase()}.`
                )
            );
        }

        // 5. Create and Save New Admin
        const newAdmin = new Admin({
            username: username.toLowerCase(), // Ensure consistency in storage
            email: email.toLowerCase(),       // Ensure consistency in storage
            password,                         // Password will be hashed by pre-save hook
        });

        await newAdmin.save();

        // 6. Successful Registration Response
        return res.status(201).json(
            formatSuccessResponse('Admin registered successfully.', {
                username: newAdmin.username,
                email: newAdmin.email,
                created_at: newAdmin.created_at,
            })
        );
    } catch (error) {
        console.error('Registration error:', error);

        // Handle Duplicate Key Error (Race Condition)
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            return res.status(409).json(
                formatErrorResponse(
                    `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists.`,
                    '19003',
                    `Duplicate ${duplicateField}.`
                )
            );
        }

        // General Internal Server Error
        return res.status(500).json(
            formatErrorResponse(
                'Internal server error.',
                '19004',
                'Registration failed due to a server error.'
            )
        );
    }
};




exports.verifyOtp = async (req, res, next) => {
    try {
      const { username, otp } = req.body;
  
      // 1. Input Validation
      if (!username || !otp) {
        return res.status(400).json(
          formatErrorResponse(
            'Username and OTP are required.',
            '19016',
            'Missing required fields.'
          )
        );
      }
  
      // 2. Find Admin by Username (Case-Insensitive)
      const admin = await Admin.findOne({ username: username.toLowerCase() });
      if (!admin) {
        return res.status(401).json(
          formatErrorResponse(
            'Invalid credentials.',
            '19017',
            'Authentication failed.'
          )
        );
      }
  
      // 3. Find OTP in the Database
      const storedOtp = await Otp.findOne({ adminId: admin._id, otp });
      if (!storedOtp) {
        return res.status(403).json(
          formatErrorResponse(
            'Invalid OTP.',
            '19018',
            'OTP verification failed.'
          )
        );
      }
  
      // 4. Check if OTP is expired
      if (storedOtp.expiresAt < new Date()) {
        // Delete expired OTP
        await storedOtp.deleteOne();
        return res.status(403).json(
          formatErrorResponse(
            'OTP has expired.',
            '19019',
            'OTP verification failed.'
          )
        );
      }
  
      // 5. Delete OTP after successful verification to prevent reuse
      await storedOtp.deleteOne();
  
      // 6. Generate Tokens
      const payload = { id: admin._id };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
  
      // 7. Save Refresh Token to the Database
      await Token.create({ token: refreshToken, adminId: admin._id });
  
      // 8. Respond with Tokens
      return res.status(200).json(
        formatSuccessResponse('Authentication successful.', {
          accessToken,
          refreshToken,
        })
      );
    } catch (error) {
      console.error('OTP Verification error:', error);
      next(error);
    }
  };

// Token refresh
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        const storedToken = await Token.findOne({ token: refreshToken });
        if (!storedToken) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, admin) => {
            if (err) return res.status(403).json({ error: 'Invalid refresh token' });

            const accessToken = generateAccessToken({ id: admin.id });
            res.json({ accessToken });
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        await Token.deleteOne({ token: refreshToken });
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Middleware to authenticate access tokens
exports.authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
      console.error('Authentication Error: Token is missing.');
      return res.status(401).json({ error: 'Token is missing' });
  }

  jwt.verify(token, process.env.ACCESS_SECRET, (err, admin) => {
      if (err) {
          console.error('Authentication Error: Invalid or expired token.', {
              error: err.message,
              token,
          });
          return res.status(403).json({ error: 'Invalid or expired token' });
      }

      console.info('Authentication Success:', { adminId: admin.id });
      req.user = admin;
      next();
  });
};
