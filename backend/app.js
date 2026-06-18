const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Global Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP restrictions for development / API usage simplicity
}));

app.use(cors({
  origin: '*', // Allow all origins for development dashboard connections
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(morgan('dev'));

// Rate Limiter to prevent brute force and DOS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Apply rate limiter to API routes
app.use('/api/', apiLimiter);

// Route mountings
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/reminders', require('./routes/reminders'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}

// Centralized error handling
app.use(errorHandler);

module.exports = app;
