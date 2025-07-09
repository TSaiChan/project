require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/users');

// CORS configuration for both development and production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',  // Local development
      'http://localhost:3001',  // Alternative local port
      process.env.FRONTEND_URL  // Production frontend URL
    ].filter(Boolean); // Remove undefined values

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Mount routers
app.use('/api', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

// Test endpoint
app.get('/api/test', (req, res) =>
  res.json({
    success: true,
    message: 'Server is running!',
    environment: process.env.NODE_ENV || 'development'
  })
);

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});