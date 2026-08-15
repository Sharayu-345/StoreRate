const pool = require('../config/db');

async function createUser({ name, email, passwordHash, address, role }) {
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)`,
    [name, email, passwordHash, address, role]
  );
  return result.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT id, name, email, address, role, created_at FROM users WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function updateUserPassword(id, passwordHash) {
  await pool.query(`UPDATE users SET password_hash = ? WHERE id = ?`, [passwordHash, id]);
}

async function countUsers() {
  const [rows] = await pool.query(`SELECT COUNT(*) AS count FROM users`);
  return rows[0].count;
}

// Admin listing with optional filters + sorting
async function getAllUsers({ name, email, address, role, sortBy = 'name', order = 'ASC' }) {
  const allowedSortColumns = ['name', 'email', 'address', 'role', 'created_at'];
  const allowedOrders = ['ASC', 'DESC'];
  const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'name';
  const sortOrder = allowedOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

  let query = `SELECT id, name, email, address, role, created_at FROM users WHERE 1=1`;
  const params = [];

  if (name) {
    query += ` AND name LIKE ?`;
    params.push(`%${name}%`);
  }
  if (email) {
    query += ` AND email LIKE ?`;
    params.push(`%${email}%`);
  }
  if (address) {
    query += ` AND address LIKE ?`;
    params.push(`%${address}%`);
  }
  if (role) {
    query += ` AND role = ?`;
    params.push(role);
  }

  query += ` ORDER BY ${sortColumn} ${sortOrder}`;

  const [rows] = await pool.query(query, params);
  return rows;
}

// For a store owner user, include their store's average rating
async function findUserWithRatingById(id) {
  const [rows] = await pool.query(
    `SELECT
       u.id, u.name, u.email, u.address, u.role, u.created_at,
       ROUND(AVG(r.rating), 1) AS average_rating
     FROM users u
     LEFT JOIN stores s ON s.owner_id = u.id
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE u.id = ?
     GROUP BY u.id`,
    [id]
  );
  return rows[0] || null;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPassword,
  countUsers,
  getAllUsers,
  findUserWithRatingById,
};