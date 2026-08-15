const pool = require('../config/db');
const { upsertRating, getUserRatingForStore } = require('../models/ratingModel');

// GET /api/stores?name=&address=&sortBy=&order=
// Returns all stores with average rating, and this user's own rating if logged in
async function listStoresForUser(req, res) {
  try {
    const { name, address } = req.query;
    const userId = req.user?.id || null;

    const allowedSortColumns = { name: 's.name', rating: 'average_rating' };
    const allowedOrders = ['ASC', 'DESC'];
    const sortColumn = allowedSortColumns[req.query.sortBy] || 's.name';
    const sortOrder = allowedOrders.includes(String(req.query.order).toUpperCase())
      ? String(req.query.order).toUpperCase()
      : 'ASC';

    let query = `
      SELECT
        s.id, s.name, s.email, s.address,
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
    if (address) {
      query += ` AND s.address LIKE ?`;
      params.push(`%${address}%`);
    }

    query += ` GROUP BY s.id ORDER BY ${sortColumn} ${sortOrder}`;

    const [stores] = await pool.query(query, params);

    if (userId) {
      for (const store of stores) {
        store.user_rating = await getUserRatingForStore(userId, store.id);
      }
    }

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch stores', error: err.message });
  }
}

// POST /api/stores/:storeId/rating   body: { rating: 1-5 }
async function submitRating(req, res) {
  try {
    const userId = req.user.id;
    const storeId = req.params.storeId;
    const { rating } = req.body;

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    await upsertRating({ userId, storeId, rating: ratingNum });

    res.status(200).json({ message: 'Rating saved', storeId, rating: ratingNum });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save rating', error: err.message });
  }
}

module.exports = { listStoresForUser, submitRating };