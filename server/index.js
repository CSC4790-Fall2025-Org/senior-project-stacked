// server/index.js
import express from "express";
import pkg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Supabase
  },
});

const app = express();
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users LIMIT 5");
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// 🔑 LOGIN route
app.post("/login", async (req, res) => {
  const { universityId } = req.body;

  if (!universityId) {
    return res.status(400).json({ error: "University ID is required" });
  }

  try {
    // Join users + vehicles
    const result = await pool.query(
      `
      SELECT 
        u.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.user_type,
        u.phone_number,
        u.university_id,
        v.vehicle_id,
        v.license_plate,
        v.make,
        v.model,
        v.color,
        v.permit_type
      FROM users u
      LEFT JOIN vehicles v ON v.user_id = u.user_id
      WHERE u.university_id = $1
      `,
      [universityId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid University ID" });
    }

    const row = result.rows[0];

    const user = {
      user_id: row.user_id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      user_type: row.user_type,
      phone_number: row.phone_number,
      university_id: row.university_id,
      vehicle: row.vehicle_id
        ? {
            vehicle_id: row.vehicle_id,
            license_plate: row.license_plate,
            make: row.make,
            model: row.model,
            color: row.color,
            permit_type: row.permit_type,
          }
        : null,
    };

    res.json({ user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
