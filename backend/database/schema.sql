-- StoreRate database schema (MySQL)
-- This matches the live database exactly, based on the actual DDL used to create it.

CREATE DATABASE IF NOT EXISTS storerate;
USE storerate;

-- ============================================
-- USERS
-- Covers System Administrator, Normal User, and Store Owner (role column)
-- ============================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  address VARCHAR(400),
  role ENUM('admin', 'user', 'owner') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_name_length CHECK (CHAR_LENGTH(name) >= 20)
);

-- ============================================
-- STORES
-- owner_id optionally links a store to a user account with role='owner'
-- ============================================
CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  address VARCHAR(400),
  owner_id INT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- RATINGS
-- One rating per user per store (UNIQUE constraint) — resubmitting updates it, never duplicates
-- ============================================
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating TINYINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_store (user_id, store_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 5)
);

-- ============================================
-- Indexes to support filtering/sorting per the spec
-- ============================================
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_stores_address ON stores(address);
CREATE INDEX idx_ratings_store_id ON ratings(store_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);

-- ============================================
-- Seed data (optional — for a fresh setup)
-- Passwords below are bcrypt hashes. Generate your own with:
--   node -e "require('bcrypt').hash('YourPassword1!', 10).then(h => console.log(h))"
-- ============================================

-- Admin account
INSERT INTO users (name, email, password_hash, address, role) VALUES
('Admin User Account For StoreRate', 'admin@storerate.com', '<BCRYPT_HASH_HERE>', 'Admin Office, Mumbai', 'admin');

-- Store owner account
INSERT INTO users (name, email, password_hash, address, role) VALUES
('Store Owner Account For Testing', 'owner@storerate.com', '<BCRYPT_HASH_HERE>', 'Owner Residence, Mumbai', 'owner');

-- Sample stores
INSERT INTO stores (name, email, address, owner_id) VALUES
('Zebra Bakery', 'zebra@example.com', 'Andheri, Mumbai', NULL),
('Apple Fresh Mart', 'applefresh@example.com', 'Bandra, Mumbai', NULL),
('Midway Electronics', 'midway@example.com', 'Dadar, Mumbai', NULL);

-- Link a store to the owner account created above (adjust IDs to match your actual rows)
-- UPDATE stores SET owner_id = <owner_user_id> WHERE id = <store_id>;

-- Sample ratings (adjust user_id/store_id to match your actual rows)
-- INSERT INTO ratings (user_id, store_id, rating) VALUES
-- (<user_id>, <store_id>, 5),
-- (<user_id>, <store_id>, 2);