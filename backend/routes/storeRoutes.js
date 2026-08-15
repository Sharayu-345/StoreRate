const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { listStoresForUser, submitRating } = require('../controllers/storeController');

router.get('/', requireAuth, listStoresForUser);
router.post('/:storeId/ratings', requireAuth, submitRating);

module.exports = router;