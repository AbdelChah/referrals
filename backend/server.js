require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Database connection logic

// Import routes
const referralRoutes = require('./routes/referralRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize the app
const app = express();

// Database connection
connectDB();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL , // env value
  'http://localhost:3000' || 'http://localhost:5173', // different local devs (Pamela + Vite)
  'https://referrals.bank-juno.com', // Deployed frontend https
  'http://referrals.bank-juno.com', // Deployed frontend http (testing with Pamela)
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.use(express.json()); // Parse incoming JSON requests

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);


app.use('/apiCallbacks/juno', referralRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/performance', performanceRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
