const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { updatePassword } = require('../controllers/passwordController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.put('/update-password', requireAuth, updatePassword);

module.exports = router;