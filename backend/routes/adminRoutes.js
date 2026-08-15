const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  addUser,
  listUsers,
  getUserDetails,
  addStore,
  listStores,
} = require('../controllers/adminController');

// All admin routes require login + admin role
router.use(requireAuth, requireRole('admin'));

router.get('/dashboard', getDashboardStats);

router.post('/users', addUser);
router.get('/users', listUsers);
router.get('/users/:id', getUserDetails);

router.post('/stores', addStore);
router.get('/stores', listStores);

module.exports = router;