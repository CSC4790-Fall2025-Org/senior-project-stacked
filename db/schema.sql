-- USERS
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name  VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) CHECK (user_type IN ('student','faculty','staff','admin')),
  phone_number VARCHAR(20),
  university_id VARCHAR(8)
);

-- VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  make  VARCHAR(50),
  model VARCHAR(50),
  color VARCHAR(30),
  permit_type VARCHAR(30) CHECK (permit_type IN ('student','faculty','staff','visitor'))
);

-- PARKING LOTS
CREATE TABLE IF NOT EXISTS parking_lots (
  lot_id SERIAL PRIMARY KEY,
  lot_name VARCHAR(100) UNIQUE NOT NULL,
  location VARCHAR(255),
  total_spaces INT NOT NULL CHECK (total_spaces >= 0),
  available_spaces INT NOT NULL CHECK (available_spaces >= 0),
  permit_type VARCHAR(30) CHECK (permit_type IN ('student','faculty','staff','visitor'))
);

-- PARKING SPACES
CREATE TABLE IF NOT EXISTS parking_spaces (
  space_id SERIAL PRIMARY KEY,
  lot_id INT NOT NULL REFERENCES parking_lots(lot_id) ON DELETE CASCADE,
  space_number VARCHAR(10) NOT NULL,
  is_occupied BOOLEAN DEFAULT FALSE,
  is_reserved BOOLEAN DEFAULT FALSE,
  UNIQUE (lot_id, space_number)
);
