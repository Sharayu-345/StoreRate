const pool = require('../config/db');
const { getRatingsForStore, getStoreAverage } = require('../models/ratingModel');

// Finds the store owned by the logged-in owner
async function findStoreByOwnerId(ownerId) {
  const [rows] = await pool.query('SELECT * FROM stores WHERE owner_id = ?', [ownerId]);
  return rows[0] || null;
}

// GET /api/owner/dashboard
// Returns the owner's store info, average rating, and list of users who rated it
async function getOwnerDashboard(req, res) {
  try {
    const ownerId = req.user.id;

    const store = await findStoreByOwnerId(ownerId);
    if (!store) {
      return res.status(404).json({ message: 'No store is linked to this owner account yet' });
    }

    const [ratings, average] = await Promise.all([
      getRatingsForStore(store.id),
      getStoreAverage(store.id),
    ]);

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      average_rating: average.average_rating,
      rating_count: average.rating_count,
      raters: ratings, // [{ user_name, user_email, rating, created_at }, ...]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load owner dashboard', error: err.message });
  }
}

module.exports = { getOwnerDashboard };