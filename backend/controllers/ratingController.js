const {
  upsertRating,
  getAllStoresForUser,
  getRatersForStore,
  getStoreAverageRating,
  findStoreByOwnerId,
} = require('../models/ratingModel');

// GET /api/stores?name=&address=
async function listStores(req, res) {
  try {
    const { name, address } = req.query;
    const userId = req.user.id;
    const stores = await getAllStoresForUser(userId, { name, address });
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

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    const result = await upsertRating(userId, storeId, rating);
    res.status(200).json({ message: 'Rating submitted successfully', ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit rating', error: err.message });
  }
}

// GET /api/owner/dashboard  (store owner only)
async function getOwnerDashboard(req, res) {
  try {
    const ownerId = req.user.id;
    const store = await findStoreByOwnerId(ownerId);
    if (!store) return res.status(404).json({ message: 'No store found for this owner' });

    const raters = await getRatersForStore(store.id);
    const avg = await getStoreAverageRating(store.id);

    res.json({
      store: { id: store.id, name: store.name, address: store.address },
      average_rating: avg.average_rating,
      rating_count: avg.rating_count,
      raters,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch owner dashboard', error: err.message });
  }
}

module.exports = { listStores, submitRating, getOwnerDashboard };