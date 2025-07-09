require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/users');

// Database setup route - for initial deployment
app.get('/setup-database', async (req, res) => {
  try {
    console.log('🔧 Setting up database tables...');

    // Complete SQL schema
    const setupSQL = `
      -- Drop existing tables if they exist
      DROP TABLE IF EXISTS visitor_logs, community_expenses, maintenance_requests, notifications, payments, users_login, residents, flats, plots, streets, organisation CASCADE;

      -- Organisation Table
      CREATE TABLE organisation (
          org_id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          gst_no VARCHAR(20)
      );

      INSERT INTO organisation (name, gst_no) VALUES ('Green Valley Residency', 'GSTIN123456');

      -- Streets
      CREATE TABLE streets (
          street_id SERIAL PRIMARY KEY,
          org_id INTEGER REFERENCES organisation(org_id),
          street_name VARCHAR(100) NOT NULL
      );

      INSERT INTO streets (org_id, street_name) VALUES
      (1, 'Rosewood Lane'), (1, 'Sunset Boulevard'), (1, 'Oak Avenue'), (1, 'Maple Drive'), (1, 'Cedar Court'),
      (1, 'Elm Street'), (1, 'Willow Way'), (1, 'Magnolia Circle'), (1, 'Birch Lane'), (1, 'Pine Grove');

      -- Plots
      CREATE TABLE plots (
          plot_id SERIAL PRIMARY KEY,
          org_id INTEGER REFERENCES organisation(org_id),
          street_id INTEGER REFERENCES streets(street_id),
          plot_type VARCHAR(20) CHECK (plot_type IN ('Individual', 'Flats')),
          plot_no VARCHAR(50) NOT NULL
      );

      INSERT INTO plots (org_id, street_id, plot_type, plot_no) VALUES
      (1, 1, 'Individual', 'P-101'), (1, 2, 'Flats', 'P-102'), (1, 3, 'Individual', 'P-103'),
      (1, 4, 'Flats', 'P-104'), (1, 5, 'Individual', 'P-105'), (1, 6, 'Flats', 'P-106'),
      (1, 7, 'Individual', 'P-107'), (1, 8, 'Flats', 'P-108'), (1, 9, 'Individual', 'P-109'), (1, 10, 'Flats', 'P-110');

      -- Flats
      CREATE TABLE flats (
          flat_id SERIAL PRIMARY KEY,
          plot_id INTEGER REFERENCES plots(plot_id),
          flat_no VARCHAR(50),
          eb_card VARCHAR(50)
      );

      INSERT INTO flats (plot_id, flat_no, eb_card) VALUES
      (2, 'F1', 'EB001'), (2, 'F2', 'EB002'), (4, 'F1', 'EB003'), (4, 'F2', 'EB004'),
      (6, 'F1', 'EB005'), (6, 'F2', 'EB006'), (8, 'F1', 'EB007'), (8, 'F2', 'EB008'), (10, 'F1', 'EB009'), (10, 'F2', 'EB010');

      -- Residents
      CREATE TABLE residents (
          resident_id SERIAL PRIMARY KEY,
          plot_id INTEGER REFERENCES plots(plot_id),
          flat_id INTEGER REFERENCES flats(flat_id),
          name VARCHAR(100) NOT NULL,
          contact_number VARCHAR(15),
          email VARCHAR(100),
          id_proof VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO residents (plot_id, flat_id, name, contact_number, email, id_proof) VALUES
      (1, NULL, 'Ravi Kumar', '9876543210', 'ravi@example.com', 'ID206'),
      (2, 1, 'Sneha Reddy', '9876543200', 'sneha.r@example.com', 'ID201'),
      (2, 2, 'Amit Verma', '9123456700', 'amit.v@example.com', 'ID202'),
      (4, 3, 'Priya Shah', '9988776600', 'priya.s@example.com', 'ID203');

      -- Users Login
      CREATE TABLE users_login (
          user_id SERIAL PRIMARY KEY,
          user_name VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          org_id INTEGER REFERENCES organisation(org_id),
          plot_id INTEGER REFERENCES plots(plot_id),
          resident_id INTEGER REFERENCES residents(resident_id),
          user_type VARCHAR(10) CHECK (user_type IN ('owner', 'tenant', 'admin')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP
      );

      INSERT INTO users_login (user_name, password, org_id, plot_id, resident_id, user_type) VALUES
      ('admin', 'admin123', 1, NULL, NULL, 'admin'),
      ('ravi_k', 'pass123', 1, 1, 1, 'owner');

      CREATE INDEX idx_users_login_username ON users_login(user_name);
    `;

    // Execute the SQL
    await pool.query(setupSQL);

    console.log('✅ Database setup completed successfully!');
    res.json({
      success: true,
      message: 'Database tables created successfully!',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database setup failed',
      error: error.message
    });
  }
});

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