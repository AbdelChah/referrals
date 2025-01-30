// controllers/authController.js

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Admin = require('../models/Admin');
const Token = require('../models/Token'); // Model to store refresh tokens securely
const Otp = require('../models/OTP');     // Model to store OTPs
const bcrypt = require('bcryptjs');
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
 * Login Function
 */
exports.login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Input Validation
        if ((!username && !email) || !password) {
            return res.status(400).json(
                formatErrorResponse(
                    'Username or email and password are required.',
                    '19010',
                    'Missing required fields.'

                )
            );
        }

        let query = {};
        if (username) {
            query.username = username.toLowerCase();
        } else if (email) {
            query.email = email.toLowerCase();
        }

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

        const existingToken = await Token.findOne({ adminId: admin._id });
        if (existingToken) {
            await existingToken.deleteOne(); // Invalidate the old session
        }

        const otp = generateOtp();
        const otpExpirationMinutes = parseInt(process.env.OTP_EXPIRATION_MINUTES) || 10;
        const expiresAt = new Date(Date.now() + otpExpirationMinutes * 60 * 1000);

        await Otp.create({
            adminId: admin._id,
            otp,
            expiresAt,
        });

        return res.status(200).json(
            formatSuccessResponse('OTP has been generated successfully.', {
                otp,
                otpExpirationMinutes,
            })
        );
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json(
            formatErrorResponse(
                'Internal server error.',
                '19014',
                'Login failed due to a server error.'
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
        const { username, password, email } = req.body;

        // 1. Input Validation
        if (!username || !password || !email) {
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

        // 3. Enforce Password Strength
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
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password,
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

        // Handle Duplicate Key Error
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



/**
 * Verify OTP
 */
exports.verifyOtp = async (req, res) => {
    try {
        const { username, otp } = req.body;

        if (!username || !otp) {
            return res.status(400).json(
                formatErrorResponse(
                    'Username and OTP are required.',
                    '19016',
                    'Missing required fields.'
                )
            );
        }

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

        if (storedOtp.expiresAt < new Date()) {
            await storedOtp.deleteOne();
            return res.status(403).json(
                formatErrorResponse(
                    'OTP has expired.',
                    '19019',
                    'OTP verification failed.'
                )
            );
        }

        await storedOtp.deleteOne();

        const payload = { id: admin._id };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await Token.create({ token: refreshToken, adminId: admin._id });

        return res.status(200).json(
            formatSuccessResponse('Authentication successful.', {
                accessToken,
                refreshToken,
            })
        );
    } catch (error) {
        console.error('OTP Verification error:', error);
        return res.status(500).json(
            formatErrorResponse(
                'Internal server error.',
                '19020',
                'Failed to verify OTP due to server error.'
            )
        );
    }
};

/**
 * Refresh Token
 */
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json(
                formatErrorResponse(
                    'Refresh token is required.',
                    '19020',
                    'Token is missing.'
                )
            );
        }

        const storedToken = await Token.findOne({ token: refreshToken });
        if (!storedToken) {
            return res.status(403).json(
                formatErrorResponse(
                    'Invalid refresh token.',
                    '19021',
                    'Token does not exist in the database.'
                )
            );
        }

        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, admin) => {
            if (err) {
                return res.status(403).json(
                    formatErrorResponse(
                        'Invalid or expired refresh token.',
                        '19022',
                        'Token verification failed.'
                    )
                );
            }

            const accessToken = generateAccessToken({ id: admin.id });
            return res.status(200).json(
                formatSuccessResponse('Token refreshed successfully.', { accessToken })
            );
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        return res.status(500).json(
            formatErrorResponse(
                'Internal server error.',
                '19023',
                'Failed to refresh token due to server error.'
            )
        );
    }
};


/**
 * Logout
 */
exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json(
                formatErrorResponse(
                    'Refresh token is required to logout.',
                    '19030',
                    'Missing refresh token.'
                )
            );
        }

        const deletedToken = await Token.deleteOne({ token: refreshToken });
        if (!deletedToken.deletedCount) {
            return res.status(404).json(
                formatErrorResponse(
                    'Token not found or already invalidated.',
                    '19031',
                    'Logout failed.'
                )
            );
        }

        return res.status(200).json(
            formatSuccessResponse('Logout successful.')
        );
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json(
            formatErrorResponse(
                'Internal server error during logout.',
                '19032',
                'Logout failed due to server error.'
            )
        );
    }
};

// Middleware to authenticate access tokens
exports.authenticateToken = (req, res, next) => {   
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
      console.error('Authentication Error: Token is missing.');
      return res.status(401).json(            formatErrorResponse(
                'Token is missing.',
                '19032',
                'Logout failed due to server error.'
            ));
  }

  jwt.verify(token, process.env.ACCESS_SECRET, (err, admin) => {
      if (err) {
          console.error('Authentication Error: Invalid or expired token.', {
              error: err.message,
              token,
          });
          return res.status(403).json(            formatErrorResponse(
            'Invalid or expired token.',
            '19032',
            'Logout failed due to server error.'
        ));
      }

      console.info('Authentication Success:', { adminId: admin.id });
      req.user = admin;
      next();
  });
}


// Reset Password Endpoint
exports.resetPassword = async (req, res) => {
    try {
        const { username, email, newPassword } = req.body;

        // 1. Input Validation
        if (!username || !email || !newPassword) {
            return res.status(400).json(
                formatErrorResponse(
                    'Username, email, and new password are required.',
                    '19040',
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
                    '19042',
                    'Email validation failed.'
                )
            );
        }

        // 3. Enforce Password Strength
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json(
                formatErrorResponse(
                    'Password must be at least 8 characters long and include both letters and numbers.',
                    '19041',
                    'Weak password.'
                )
            );
        }

        // 4. Find Admin by Username and Email (Case-Insensitive)
        const admin = await Admin.findOne({
            username: username.toLowerCase(),
            email: email.toLowerCase(),
        });

        if (!admin) {
            return res.status(404).json(
                formatErrorResponse(
                    'Admin not found. Please check the provided username and email.',
                    '19043',
                    'Admin not found.'
                )
            );
        }

        // 5. Hash the New Password and Update

        admin.password = newPassword;
        await admin.save();

        // 6. Successful Password Reset Response
        return res.status(200).json(
            formatSuccessResponse('Password reset successfully.', {
                username: admin.username,
                email: admin.email,
                updated_at: admin.updatedAt,
            })
        );
    } catch (error) {
        console.error('Password Reset Error:', error);

        // General Internal Server Error
        return res.status(500).json(
            formatErrorResponse(
                'Internal server error during password reset.',
                '19044',
                'Password reset failed due to a server error.'
            )
        );
    }
};
