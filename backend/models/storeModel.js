const pool = require('../config/db');

async function createStore({ name, email, address, ownerId }) {
  const [result] = await pool.query(
    `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
    [name, email, address, ownerId || null]
  );
  return result.insertId;
}

async function getAllStoresWithRatings({ name, email, address, sortBy = 'name', order = 'ASC' } = {}) {
  const allowedSortColumns = { name: 's.name', email: 's.email', address: 's.address', rating: 'average_rating' };
  const allowedOrders = ['ASC', 'DESC'];
  const sortColumn = allowedSortColumns[sortBy] || 's.name';
  const sortOrder = allowedOrders.includes(String(order).toUpperCase()) ? String(order).toUpperCase() : 'ASC';

  let query = `
    SELECT
      s.id, s.name, s.email, s.address, s.owner_id,
      ROUND(AVG(r.rating), 1) AS average_rating,
      COUNT(r.id) AS rating_count
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE 1=1
  `;
  const params = [];

  if (name) {
    query += ` AND s.name LIKE ?`;
    params.push(`%${name}%`);
  }
  if (email) {
    query += ` AND s.email LIKE ?`;
    params.push(`%${email}%`);
  }
  if (address) {
    query += ` AND s.address LIKE ?`;
    params.push(`%${address}%`);
  }

  query += ` GROUP BY s.id ORDER BY ${sortColumn} ${sortOrder}`;

  const [rows] = await pool.query(query, params);
  return rows;
}

async function findStoreById(id) {
  const [rows] = await pool.query(`SELECT * FROM stores WHERE id = ?`, [id]);
  return rows[0] || null;
}

async function countStores() {
  const [rows] = await pool.query(`SELECT COUNT(*) AS count FROM stores`);
  return rows[0].count;
}

module.exports = { createStore, getAllStoresWithRatings, findStoreById, countStores };