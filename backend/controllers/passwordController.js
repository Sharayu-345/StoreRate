const bcrypt = require('bcrypt');
const { updateUserPassword } = require('../models/userModel');
const pool = require('../config/db');

function isValidPassword(password) {
  const lengthOk = password.length >= 8 && password.length <= 16;
  const upperOk = /[A-Z]/.test(password);
  const specialOk = /[^A-Za-z0-9]/.test(password);
  return lengthOk && upperOk && specialOk;
}

// PUT /api/auth/update-password   body: { oldPassword, newPassword }
// (currentPassword is also accepted as an alias, in case other callers use that name)
async function updatePassword(req, res) {
  try {
    const userId = req.user.id;
    const currentPassword = req.body.oldPassword ?? req.body.currentPassword;
    const { newPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required' });
    }
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message: 'New password must be 8-16 characters with at least one uppercase letter and one special character',
      });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(userId, newHash);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update password', error: err.message });
  }
}

module.exports = { updatePassword };