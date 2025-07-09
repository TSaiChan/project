const { Pool } = require('pg');
require('dotenv').config();

let pool;

// Check if we have a DATABASE_URL (production) or individual config (development)
if (process.env.DATABASE_URL) {
    // Production configuration (Render will provide DATABASE_URL)
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
} else {
    // Development configuration using individual environment variables
    pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'gcms',
        password: process.env.DB_PASSWORD || 'chandan@2710',
        port: process.env.DB_PORT || 5432,
    });
}

pool.connect()
    .then(() => {
        console.log("✅ Connected to PostgreSQL DB");
        console.log(`🔗 Database: ${process.env.DB_NAME || 'gcms'}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    })
    .catch((err) => {
        console.error("❌ DB connection error:", err);
        process.exit(1);
    });

module.exports = pool;