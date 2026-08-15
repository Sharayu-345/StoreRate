const pool = require('../config/db');

async function upsertRating({ userId, storeId, rating }) {
  await pool.query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
    [userId, storeId, rating]
  );
  return { userId, storeId, rating };
}

async function getUserRatingForStore(userId, storeId) {
  const [rows] = await pool.query(
    `SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?`,
    [userId, storeId]
  );
  return rows[0]?.rating ?? null;
}

async function getRatingsForStore(storeId) {
  const [rows] = await pool.query(
    `SELECT u.name AS user_name, u.email AS user_email, r.rating, r.created_at
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = ?
     ORDER BY r.created_at DESC`,
    [storeId]
  );
  return rows;
}

async function getStoreAverage(storeId) {
  const [rows] = await pool.query(
    `SELECT ROUND(AVG(rating), 1) AS average_rating, COUNT(*) AS rating_count
     FROM ratings WHERE store_id = ?`,
    [storeId]
  );
  return rows[0];
}

async function countRatings() {
  const [rows] = await pool.query(`SELECT COUNT(*) AS count FROM ratings`);
  return rows[0].count;
}

module.exports = {
  upsertRating,
  getUserRatingForStore,
  getRatingsForStore,
  getStoreAverage,
  countRatings,
};