require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // ✅ Add pool import
const app = express();

const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/users');

// Complete Database setup route
app.get('/setup-database', async (req, res) => {
  try {
    console.log('🔧 Setting up complete database schema...');

    // Execute each table creation separately to avoid issues
    const queries = [
      // Drop all tables
      `DROP TABLE IF EXISTS visitor_logs, community_expenses, maintenance_requests, notifications, payments, users_login, residents, flats, plots, streets, organisation CASCADE;`,

      // Organisation
      `CREATE TABLE organisation (
          org_id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          gst_no VARCHAR(20)
      );`,

      `INSERT INTO organisation (name, gst_no) VALUES ('Green Valley Residency', 'GSTIN123456');`,

      // Streets
      `CREATE TABLE streets (
          street_id SERIAL PRIMARY KEY,
          org_id INTEGER REFERENCES organisation(org_id),
          street_name VARCHAR(100) NOT NULL
      );`,

      `INSERT INTO streets (org_id, street_name) VALUES
      (1, 'Rosewood Lane'), (1, 'Sunset Boulevard'), (1, 'Oak Avenue'), (1, 'Maple Drive'), (1, 'Cedar Court'),
      (1, 'Elm Street'), (1, 'Willow Way'), (1, 'Magnolia Circle'), (1, 'Birch Lane'), (1, 'Pine Grove');`,

      // Plots
      `CREATE TABLE plots (
          plot_id SERIAL PRIMARY KEY,
          org_id INTEGER REFERENCES organisation(org_id),
          street_id INTEGER REFERENCES streets(street_id),
          plot_type VARCHAR(20) CHECK (plot_type IN ('Individual', 'Flats')),
          plot_no VARCHAR(50) NOT NULL
      );`,

      `INSERT INTO plots (org_id, street_id, plot_type, plot_no) VALUES
      (1, 1, 'Individual', 'P-101'), (1, 2, 'Flats', 'P-102'), (1, 3, 'Individual', 'P-103'),
      (1, 4, 'Flats', 'P-104'), (1, 5, 'Individual', 'P-105'), (1, 6, 'Flats', 'P-106'),
      (1, 7, 'Individual', 'P-107'), (1, 8, 'Flats', 'P-108'), (1, 9, 'Individual', 'P-109'), (1, 10, 'Flats', 'P-110');`,

      // Flats
      `CREATE TABLE flats (
          flat_id SERIAL PRIMARY KEY,
          plot_id INTEGER REFERENCES plots(plot_id),
          flat_no VARCHAR(50),
          eb_card VARCHAR(50)
      );`,

      `INSERT INTO flats (plot_id, flat_no, eb_card) VALUES
      (2, 'F1', 'EB001'), (2, 'F2', 'EB002'), (4, 'F1', 'EB003'), (4, 'F2', 'EB004'),
      (6, 'F1', 'EB005'), (6, 'F2', 'EB006'), (8, 'F1', 'EB007'), (8, 'F2', 'EB008'), (10, 'F1', 'EB009'), (10, 'F2', 'EB010');`,

      // Residents
      `CREATE TABLE residents (
          resident_id SERIAL PRIMARY KEY,
          plot_id INTEGER REFERENCES plots(plot_id),
          flat_id INTEGER REFERENCES flats(flat_id),
          name VARCHAR(100) NOT NULL,
          contact_number VARCHAR(15),
          email VARCHAR(100),
          id_proof VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      `INSERT INTO residents (plot_id, flat_id, name, contact_number, email, id_proof) VALUES
      (1, NULL, 'Ravi Kumar', '9876543210', 'ravi@example.com', 'ID206'),
      (2, 1, 'Sneha Reddy', '9876543200', 'sneha.r@example.com', 'ID201'),
      (2, 2, 'Amit Verma', '9123456700', 'amit.v@example.com', 'ID202'),
      (4, 3, 'Priya Shah', '9988776600', 'priya.s@example.com', 'ID203'),
      (3, NULL, 'Anita Sharma', '9123456789', 'anita@example.com', 'ID207'),
      (5, NULL, 'Kiran Rao', '9988776655', 'kiran@example.com', 'ID208');`,

      // Users Login
      `CREATE TABLE users_login (
          user_id SERIAL PRIMARY KEY,
          user_name VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          org_id INTEGER REFERENCES organisation(org_id),
          plot_id INTEGER REFERENCES plots(plot_id),
          resident_id INTEGER REFERENCES residents(resident_id),
          user_type VARCHAR(10) CHECK (user_type IN ('owner', 'tenant', 'admin')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP
      );`,

      `INSERT INTO users_login (user_name, password, org_id, plot_id, resident_id, user_type) VALUES
      ('admin', 'admin123', 1, NULL, NULL, 'admin'),
      ('ravi_k', 'pass123', 1, 1, 1, 'owner'),
      ('sneha_r', 'pass456', 1, 2, 2, 'owner');`,

      // Payments
      `CREATE TABLE payments (
          payment_id SERIAL PRIMARY KEY,
          plot_id INTEGER REFERENCES plots(plot_id),
          resident_id INTEGER REFERENCES residents(resident_id),
          amount DECIMAL(10,2) NOT NULL,
          payment_type VARCHAR(50) NOT NULL,
          payment_date DATE DEFAULT CURRENT_DATE,
          due_date DATE,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
          payment_method VARCHAR(30),
          transaction_id VARCHAR(100),
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      `INSERT INTO payments (plot_id, resident_id, amount, payment_type, status, payment_method, transaction_id, notes, due_date)
      VALUES
      (1, 1, 1000, 'maintenance', 'paid', 'online', 'TXN301', 'Paid via UPI', '2024-01-15'),
      (2, 2, 1200, 'water', 'pending', 'cash', NULL, 'Due soon', '2024-01-20');`,

      // Notifications
      `CREATE TABLE notifications (
          notification_id SERIAL PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          message TEXT NOT NULL,
          sender_id INTEGER REFERENCES users_login(user_id),
          recipient_type VARCHAR(20) CHECK (recipient_type IN ('all', 'street', 'plot', 'individual')),
          recipient_id INTEGER,
          status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('read', 'unread')),
          priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          read_at TIMESTAMP
      );`,

      `INSERT INTO notifications (title, message, sender_id, recipient_type, recipient_id, priority)
      VALUES
      ('Water Supply Alert', 'Water will be off from 10AM–12PM today.', 1, 'all', NULL, 'normal'),
      ('Payment Reminder', 'Monthly maintenance bill payment is due.', 1, 'plot', 1, 'normal');`,

      // Maintenance Requests
      `CREATE TABLE maintenance_requests (
          request_id SERIAL PRIMARY KEY,
          plot_id INTEGER REFERENCES plots(plot_id),
          resident_id INTEGER REFERENCES residents(resident_id),
          title VARCHAR(200) NOT NULL,
          description TEXT NOT NULL,
          category VARCHAR(50),
          priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
          status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
          assigned_to VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          resolved_at TIMESTAMP
      );`,

      `INSERT INTO maintenance_requests (plot_id, resident_id, title, description, category, priority, status, assigned_to)
      VALUES
      (1, 1, 'Pipe Leakage', 'Water leak in bathroom pipe.', 'Plumbing', 'high', 'open', 'Ravi (plumber)'),
      (2, 2, 'Power Issue', 'Frequent power cuts in flat.', 'Electrical', 'urgent', 'in_progress', 'Suresh');`,

      // Community Expenses
      `CREATE TABLE community_expenses (
          expense_id SERIAL PRIMARY KEY,
          org_id INTEGER REFERENCES organisation(org_id),
          expense_type VARCHAR(50) NOT NULL,
          description TEXT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          expense_date DATE DEFAULT CURRENT_DATE,
          vendor_name VARCHAR(100),
          receipt_number VARCHAR(50),
          approved_by INTEGER REFERENCES users_login(user_id),
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      `INSERT INTO community_expenses (org_id, expense_type, description, amount, vendor_name, receipt_number, approved_by, status)
      VALUES
      (1, 'Electricity', 'Common area lighting', 3500, 'TNEB', 'RCPT101', 1, 'paid'),
      (1, 'Security', 'Monthly salary for guards', 6000, 'SafeGuard', 'RCPT103', 1, 'pending');`,

      // Visitor Logs
      `CREATE TABLE visitor_logs (
          log_id SERIAL PRIMARY KEY,
          plot_id INTEGER REFERENCES plots(plot_id),
          visitor_name VARCHAR(100) NOT NULL,
          visitor_phone VARCHAR(15),
          purpose VARCHAR(200),
          entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          exit_time TIMESTAMP,
          approved_by INTEGER REFERENCES residents(resident_id),
          security_guard VARCHAR(100)
      );`,

      `INSERT INTO visitor_logs (plot_id, visitor_name, visitor_phone, purpose, exit_time, approved_by, security_guard)
      VALUES
      (1, 'Ramesh Babu', '9998877665', 'Delivery', CURRENT_TIMESTAMP + INTERVAL '2 hours', 1, 'Ravi'),
      (2, 'Meena Rao', '9887766554', 'Guest visit', CURRENT_TIMESTAMP + INTERVAL '3 hours', 2, 'Manoj');`,

      // Create indexes
      `CREATE INDEX idx_users_login_username ON users_login(user_name);`,
      `CREATE INDEX idx_residents_plot ON residents(plot_id);`,
      `CREATE INDEX idx_payments_resident ON payments(resident_id);`,
      `CREATE INDEX idx_maintenance_status ON maintenance_requests(status);`
    ];

    // Execute queries one by one
    for (let i = 0; i < queries.length; i++) {
      await pool.query(queries[i]);
      console.log(`✅ Executed query ${i + 1}/${queries.length}`);
    }

    console.log('✅ Complete database setup completed successfully!');
    res.json({
      success: true,
      message: 'Complete database schema created successfully!',
      tables: ['organisation', 'streets', 'plots', 'flats', 'residents', 'users_login', 'payments', 'notifications', 'maintenance_requests', 'community_expenses', 'visitor_logs'],
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

// ✅ Simplified CORS - allow all origins temporarily
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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