// /database/connection.ts
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Ensure all required environment variables exist
const requiredEnvVars = [
  "MYSQL_HOST",
  "MYSQL_USER",
  "MYSQL_PASSWORD",
  "MYSQL_DATABASE",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1); // Exit the process if a required variable is missing
  }
}

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true, // Wait rather than error if connections are maxed out
  connectionLimit: 10, // Limit concurrent connections
  queueLimit: 0, // No limit on queueing connection requests
});

// Handle connection errors
pool
  .getConnection()
  .then((conn) => {
    console.log("✅ Connected to MySQL database successfully!");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ MySQL connection error:", err);
    process.exit(1); // Exit process if connection fails
  });
