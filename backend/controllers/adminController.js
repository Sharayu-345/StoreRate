const bcrypt = require('bcrypt');
const { createUser, getAllUsers, findUserWithRatingById, countUsers } = require('../models/userModel');
const { createStore, getAllStoresWithRatings, countStores } = require('../models/storeModel');
const { countRatings } = require('../models/ratingModel');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  const lengthOk = password.length >= 8 && password.length <= 16;
  const upperOk = /[A-Z]/.test(password);
  const specialOk = /[^A-Za-z0-9]/.test(password);
  return lengthOk && upperOk && specialOk;
}

// GET /api/admin/dashboard
async function getDashboardStats(req, res) {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      countUsers(),
      countStores(),
      countRatings(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load dashboard stats', error: err.message });
  }
}

// POST /api/admin/users  (admin can create admin, user, or owner accounts)
async function addUser(req, res) {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || name.length < 20 || name.length > 60) {
      return res.status(400).json({ message: 'Name must be 20-60 characters' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (address && address.length > 400) {
      return res.status(400).json({ message: 'Address must be under 400 characters' });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: 'Password must be 8-16 characters with at least one uppercase letter and one special character',
      });
    }
    if (!['admin', 'user', 'owner'].includes(role)) {
      return res.status(400).json({ message: 'Role must be admin, user, or owner' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await createUser({ name, email, passwordHash, address, role });

    res.status(201).json({ id: userId, name, email, address, role });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
}

// GET /api/admin/users?name=&email=&address=&role=&sortBy=&order=
async function listUsers(req, res) {
  try {
    const { name, email, address, role, sortBy, order } = req.query;
    const users = await getAllUsers({ name, email, address, role, sortBy, order });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
}

// GET /api/admin/users/:id
async function getUserDetails(req, res) {
  try {
    const user = await findUserWithRatingById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
}

// POST /api/admin/stores
async function addStore(req, res) {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Store name is required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (address && address.length > 400) {
      return res.status(400).json({ message: 'Address must be under 400 characters' });
    }

    const storeId = await createStore({ name, email, address, ownerId });
    res.status(201).json({ id: storeId, name, email, address, ownerId });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Store email already registered' });
    }
    res.status(500).json({ message: 'Failed to create store', error: err.message });
  }
}

// GET /api/admin/stores?name=&email=&address=&sortBy=&order=
async function listStores(req, res) {
  try {
    const { name, email, address, sortBy, order } = req.query;
    const stores = await getAllStoresWithRatings({ name, email, address, sortBy, order });
    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch stores', error: err.message });
  }
}

module.exports = {
  getDashboardStats,
  addUser,
  listUsers,
  getUserDetails,
  addStore,
  listStores,
};